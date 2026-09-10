const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Seed default centers into MongoDB if none exist
async function seedDefaultCenters() {
    try {
        const MaternityCenter = require('./models/MaternityCenter');

        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const defaultPwd = await bcrypt.hash('provider123', salt);

        const seeds = [
            { centerName: 'Blossom Maternity Center', ownerName: 'Dr. Sarah Jenkins', email: 'provider@blossom.com', password: defaultPwd, phone: '+1 (415) 555-0192', address: '450 Healthcare Ave, Suite 200', location: 'San Francisco, CA', description: 'Luxury natural birth suites, 24/7 obstetricians, water birth tubs, and postpartum confinement care.', status: 'Approved' },
            { centerName: 'St. Jude Postnatal Care', ownerName: 'Dr. Robert Vance', email: 'care@stjude-infant.care', password: defaultPwd, phone: '+1 (312) 555-0921', address: '1200 Hope Blvd', location: 'Chicago, IL', description: 'Level III NICU, comprehensive high-risk pregnancy management, fetal cardiology & ultrasound.', status: 'Approved' },
            { centerName: 'Serenity Maternity Center', ownerName: 'Elena Rostova', email: 'hello@serenityhaven.com', password: defaultPwd, phone: '+1 (512) 555-7732', address: '44 Wellness Way', location: 'Austin, TX', description: 'Postpartum nursing retreat, lactation consultants, maternal mental wellness counseling, newborn nutrition.', status: 'Approved' },
            { centerName: 'Grace Postnatal Care', ownerName: 'Dr. Michael Chen', email: 'info@gracefamily.nyc', password: defaultPwd, phone: '+1 (212) 555-8891', address: '888 Madison Ave', location: 'New York, NY', description: 'Comprehensive prenatal diagnostics, painless epidural labor suites, and 24/7 emergency OB/GYN response.', status: 'Approved' },
            { centerName: 'Lumina Maternity Center', ownerName: 'Sophia Martinez', email: 'contact@luminawomens.com', password: defaultPwd, phone: '+1 (310) 555-1200', address: '7700 Sunset Blvd', location: 'Los Angeles, CA', description: 'Premium maternal care focusing on holistic wellness, customized birth plans, and advanced prenatal genetics.', status: 'Approved' },
            { centerName: 'Nurture Postnatal Care', ownerName: 'Rachel Green', email: 'hello@nurturecare.com', password: defaultPwd, phone: '+1 (206) 555-4309', address: '204 Pine St', location: 'Seattle, WA', description: 'Cozy, home-like birthing environment with highly experienced midwives and comprehensive doula support.', status: 'Approved' },
            { centerName: 'Hope Haven Birthing Suites', ownerName: 'Dr. James Wilson', email: 'contact@hopehaven.org', password: defaultPwd, phone: '+1 (404) 555-3321', address: '500 Peachtree St', location: 'Atlanta, GA', description: 'Specialized fetal medicine, water birth delivery, and newborn intensive care unit.', status: 'Pending' }
        ];

        // Determine which default centers are missing by email
        const defaultEmails = seeds.map(s => s.email);
        const existing = await MaternityCenter.find({ email: { $in: defaultEmails } }).select('email');
        const existingEmails = existing.map(doc => doc.email);
        const seedsToInsert = seeds.filter(s => !existingEmails.includes(s.email));
        if (seedsToInsert.length === 0) return; // all defaults already present

        // Insert without triggering pre-save hook (passwords already hashed)
        if (seedsToInsert.length > 0) {
            await MaternityCenter.collection.insertMany(seedsToInsert.map(c => ({
                ...c,
                createdAt: new Date(),
                updatedAt: new Date()
            })));
            console.log('✓ Default maternity centers seeded/updated into MongoDB');
        }

        // Auto-seed services for any center that currently has 0 services
        const Service = require('./models/Service');
        const allCenters = await MaternityCenter.find({});
        for (const center of allCenters) {
            const serviceCount = await Service.countDocuments({ center: center._id });
            if (serviceCount === 0) {
                const defaultServices = [
                    { center: center._id, serviceName: 'Comprehensive Prenatal Consultation', description: 'Full trimester obstetric evaluation, fetal heartbeat check, and personalized birth plan.', price: 3000, duration: '60 mins', availability: true },
                    { center: center._id, serviceName: 'Postnatal Lactation & Newborn Nursing', description: 'Certified lactation nurse consultation, infant attachment guidance, and feeding support.', price: 3500, duration: '60 mins', availability: true },
                    { center: center._id, serviceName: 'Postpartum Recovery & Wellness Care', description: 'Physical recovery assessment, pelvic floor guidance, and maternal mental wellness check.', price: 5000, duration: '90 mins', availability: true },
                    { center: center._id, serviceName: 'Fetal Ultrasound & Anatomy Scan', description: 'High-resolution ultrasound imaging, organ development scan, and obstetric report.', price: 2500, duration: '45 mins', availability: true },
                    { center: center._id, serviceName: 'Luxury Birthing Suite & Delivery', description: 'Private birthing suite, continuous midwife and OB/GYN standby, post-delivery recovery.', price: 45000, duration: '24 Hours Care', availability: true }
                ];
                await Service.insertMany(defaultServices);
                console.log(`✓ Seeded default services for: ${center.centerName}`);
            }
        }
    } catch (err) {
        console.log('Seed error (non-fatal):', err.message);
    }
}

// Connect to MongoDB Atlas (runs in background without blocking app)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/maternityhub';
mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
}).then(async () => {
    console.log('✓ MongoDB Connected Successfully');
    await seedDefaultCenters();
}).catch(err => {
    console.log('Note: MongoDB Atlas is offline or IP not whitelisted. Using active local persistent storage.');
});

// Routes
const authRoutes = require('./routes/auth');
const centerRoutes = require('./routes/centers');
const bookingRoutes = require('./routes/bookings');

app.use('/api/auth', authRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/bookings', bookingRoutes);

// Basic API health route
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Welcome to Maternity Hub API',
        storage: mongoose.connection.readyState === 1 ? 'MongoDB Atlas' : 'Local Persistent Store'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
