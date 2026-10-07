const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) { }
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

// Seed default nurses into MongoDB
async function seedDefaultNurses() {
    try {
        const HomeNurse = require('./models/HomeNurse');
        const count = await HomeNurse.countDocuments();
        if (count > 0) return;

        const nurses = [
            {
                name: 'Priya Menon', email: 'priya.menon@nurse.com', phone: '9876543210',
                qualification: 'B.Sc Nursing, Certified IBCLC Lactation Consultant',
                licenseNumber: 'RN-KL-2019-004521', experienceYears: 7,
                specializations: ['Lactation Support', 'Newborn Care', 'Postpartum Recovery'],
                serviceLocations: ['Kochi', 'Thrissur', 'Ernakulam'],
                hourlyRate: 800, dailyRate: 5500,
                shiftTypes: ['Hourly Visit (2-4 hrs)', 'Day Shift (8 hrs)', 'Night Shift (10 PM - 6 AM)'],
                bio: 'Experienced IBCLC certified lactation consultant with 7 years of hands-on postnatal and newborn care in top Kerala hospitals. Specializes in breastfeeding support, latch correction and newborn weight monitoring.',
                verificationStatus: 'Approved', rating: 4.9, totalReviews: 34, isAvailable: true
            },
            {
                name: 'Anjali Sharma', email: 'anjali.sharma@nurse.com', phone: '9812345678',
                qualification: 'M.Sc Nursing, Neonatal Intensive Care Specialist',
                licenseNumber: 'RN-DL-2017-008832', experienceYears: 10,
                specializations: ['Neonatal Care', 'C-Section Dressing', 'Postpartum Recovery', 'Twin Care'],
                serviceLocations: ['Delhi', 'Gurgaon', 'Noida', 'Faridabad'],
                hourlyRate: 1200, dailyRate: 8000,
                shiftTypes: ['Day Shift (8 hrs)', 'Night Shift (10 PM - 6 AM)', '24-hr Live-in'],
                bio: 'Highly trained neonatal nurse with a decade of NICU experience at AIIMS Delhi. Expert in C-section wound dressing, premature baby care, and postpartum recovery protocols.',
                verificationStatus: 'Approved', rating: 5.0, totalReviews: 52, isAvailable: true
            },
            {
                name: 'Kavitha Rajan', email: 'kavitha.rajan@nurse.com', phone: '9765432100',
                qualification: 'GNM, Certified Midwife, Postpartum Doula',
                licenseNumber: 'RN-TN-2020-003119', experienceYears: 5,
                specializations: ['Newborn Care', 'Lactation Support', 'Night Care'],
                serviceLocations: ['Chennai', 'Coimbatore', 'Madurai'],
                hourlyRate: 700, dailyRate: 4800,
                shiftTypes: ['Hourly Visit (2-4 hrs)', 'Night Shift (10 PM - 6 AM)', 'Day Shift (8 hrs)'],
                bio: 'Compassionate certified midwife and postpartum doula based in Chennai. Specializes in gentle newborn care, safe infant bathing, umbilical cord care, and night nursing so parents can recover.',
                verificationStatus: 'Approved', rating: 4.8, totalReviews: 21, isAvailable: true
            },
            {
                name: 'Deepa Nair', email: 'deepa.nair@nurse.com', phone: '9988776655',
                qualification: 'B.Sc Nursing, Wound Care Certification',
                licenseNumber: 'RN-KL-2021-007741', experienceYears: 4,
                specializations: ['C-Section Dressing', 'Postpartum Recovery', 'Newborn Care'],
                serviceLocations: ['Thiruvananthapuram', 'Kollam', 'Pathanamthitta'],
                hourlyRate: 650, dailyRate: 4200,
                shiftTypes: ['Hourly Visit (2-4 hrs)', 'Day Shift (8 hrs)'],
                bio: 'Skilled wound care nurse specializing in C-section recovery, stitches dressing, and pain management at home. Provides gentle, clinical postpartum care tailored to each patient.',
                verificationStatus: 'Approved', rating: 4.7, totalReviews: 18, isAvailable: true
            },
            {
                name: 'Rekha Pillai', email: 'rekha.pillai@nurse.com', phone: '9123456780',
                qualification: 'M.Sc Nursing, Twin & Multiple Birth Specialist',
                licenseNumber: 'RN-KA-2016-001234', experienceYears: 12,
                specializations: ['Twin Care', 'Neonatal Care', 'Newborn Care', 'Night Care'],
                serviceLocations: ['Bengaluru', 'Mysuru', 'Mangaluru'],
                hourlyRate: 1500, dailyRate: 9500,
                shiftTypes: ['Day Shift (8 hrs)', 'Night Shift (10 PM - 6 AM)', '24-hr Live-in'],
                bio: 'One of Karnataka\'s most experienced twin and multiple birth nurses with 12 years of specialized neonatal and postnatal care. Trusted by hundreds of families for overnight and live-in care packages.',
                verificationStatus: 'Approved', rating: 5.0, totalReviews: 67, isAvailable: true
            },
            {
                name: 'Sunitha George', email: 'sunitha.george@nurse.com', phone: '9900112233',
                qualification: 'GNM, Certified Lactation Educator',
                licenseNumber: 'RN-KL-2022-009988', experienceYears: 3,
                specializations: ['Lactation Support', 'Postpartum Recovery'],
                serviceLocations: ['Kozhikode', 'Malappuram', 'Palakkad'],
                hourlyRate: 600, dailyRate: 4000,
                shiftTypes: ['Hourly Visit (2-4 hrs)', 'Day Shift (8 hrs)'],
                bio: 'A dedicated lactation educator helping new mothers overcome breastfeeding challenges with patience and evidence-based techniques. Available for home visits in northern Kerala.',
                verificationStatus: 'Approved', rating: 4.6, totalReviews: 9, isAvailable: true
            },
            {
                name: 'Meera Krishnan', email: 'meera.krishnan@nurse.com', phone: '9555123456',
                qualification: 'B.Sc Nursing, Postpartum Mental Wellness Counselor',
                licenseNumber: 'RN-MH-2018-005567', experienceYears: 8,
                specializations: ['Postpartum Recovery', 'Newborn Care', 'Night Care'],
                serviceLocations: ['Mumbai', 'Pune', 'Thane', 'Navi Mumbai'],
                hourlyRate: 1000, dailyRate: 7000,
                shiftTypes: ['Day Shift (8 hrs)', 'Night Shift (10 PM - 6 AM)', '24-hr Live-in'],
                bio: 'Holistic postnatal care nurse and mental wellness counselor based in Mumbai. Focuses on mother\'s emotional recovery alongside newborn care, with expertise in postpartum depression screening and support.',
                verificationStatus: 'Approved', rating: 4.9, totalReviews: 41, isAvailable: true
            }
        ];

        await HomeNurse.insertMany(nurses);
        console.log('✓ Default home nurses seeded into MongoDB');
    } catch (err) {
        console.log('Nurse seed error (non-fatal):', err.message);
    }
}

// Connect to MongoDB Atlas (runs in background without blocking app)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/maternityhub';
mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
}).then(async () => {
    console.log('✓ MongoDB Connected Successfully');
    await seedDefaultCenters();
    await seedDefaultNurses();
}).catch(err => {
    console.log('Note: MongoDB Atlas is offline or IP not whitelisted. Using active local persistent storage.');
});

// Routes
const authRoutes = require('./routes/auth');
const centerRoutes = require('./routes/centers');
const bookingRoutes = require('./routes/bookings');
const nurseRoutes = require('./routes/nurses');

app.use('/api/auth', authRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/nurses', nurseRoutes);

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
