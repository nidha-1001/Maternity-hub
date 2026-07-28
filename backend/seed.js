const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const User = require("./models/User");
const MaternityCenter = require("./models/MaternityCenter");
const Service = require("./models/Service");
const Review = require("./models/Review");
const Booking = require("./models/Booking");

const seedDatabase = async () => {
  try {
    try {
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
      console.log("Connected to Cloud MongoDB for Seeding...");
    } catch (err) {
      console.log("Cloud MongoDB unavailable, trying local MongoDB...");
      await mongoose.connect("mongodb://127.0.0.1:27017/MaternityHub", { serverSelectionTimeoutMS: 3000 });
      console.log("Connected to Local MongoDB for Seeding...");
    }

    // Clear existing collections
    await User.deleteMany({});
    await MaternityCenter.deleteMany({});
    await Service.deleteMany({});
    await Review.deleteMany({});
    await Booking.deleteMany({});

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin123", salt);
    const userPassword = await bcrypt.hash("user123", salt);

    // Create Admin User
    const adminUser = await User.create({
      name: "Super Admin",
      email: "admin@maternityhub.care",
      password: adminPassword,
      phone: "+1 (800) 555-0100",
      role: "admin",
    });

    // Create Regular Patient User
    const patientUser = await User.create({
      name: "Sarah Jenkins",
      email: "sarah@example.com",
      password: userPassword,
      phone: "+1 (415) 555-0199",
      role: "user",
    });

    console.log("Users Created: Admin & Patient User.");

    // Create Maternity Centers
    const centers = await MaternityCenter.create([
      {
        centerName: "Blossom Birthing Suite & Hospital",
        ownerName: "Dr. Clara Oswald",
        email: "clara@blossombirthing.care",
        password: userPassword,
        phone: "+1 (415) 555-0192",
        address: "450 Healthcare Ave, Suite 200",
        location: "San Francisco, CA",
        description: "Luxury natural birth suites, 24/7 obstetricians, water birth hydrotherapy tubs, and private postpartum confinement care.",
        status: "Approved",
      },
      {
        centerName: "St. Jude Women & Infant Care",
        ownerName: "Dr. Marcus Vance",
        email: "marcus@stjudeinfant.org",
        password: userPassword,
        phone: "+1 (312) 555-0843",
        address: "120 Park Ridge Blvd",
        location: "Chicago, IL",
        description: "Level III NICU, high-risk pregnancy management, 4D fetal cardiology ultrasound, and pain relief epidural delivery.",
        status: "Approved",
      },
      {
        centerName: "Serenity Maternity & Postnatal Retreat",
        ownerName: "Elena Rostova",
        email: "elena@serenitymaternity.com",
        password: userPassword,
        phone: "+1 (512) 555-0311",
        address: "880 Oakridge Lane",
        location: "Austin, TX",
        description: "Postpartum confinement nursing, lactation specialists, pelvic floor rehabilitation, and organic newborn care.",
        status: "Approved",
      },
      {
        centerName: "Grace Family Birthing Center",
        ownerName: "Dr. Arthur Pendelton",
        email: "arthur@gracebirthing.org",
        password: userPassword,
        phone: "+1 (212) 555-9012",
        address: "710 East 64th Street",
        location: "New York, NY",
        description: "Private maternity suites, 24/7 emergency OB/GYN response, prenatal yoga workshops, and doula care.",
        status: "Pending",
      },
    ]);

    console.log(`Created ${centers.length} Maternity Centers.`);

    // Create Services for First Center
    const blossomCenter = centers[0];
    const services = await Service.create([
      {
        center: blossomCenter._id,
        serviceName: "Prenatal Sonography & Fetal Health Package",
        description: "Comprehensive 4D ultrasound scan, fetal heart screening, and maternal blood panel test.",
        price: 3500,
        duration: "45 mins",
        availability: true,
      },
      {
        center: blossomCenter._id,
        serviceName: "Luxury Water Birth Delivery Suite",
        description: "Private birth tub, personal midwife, obstetrician on call, and newborn care bundle.",
        price: 45000,
        duration: "24 Hours Care",
        availability: true,
      },
      {
        center: blossomCenter._id,
        serviceName: "Postnatal Lactation & Newborn Nursing",
        description: "Certified lactation consultant session, latching guidance, and maternal recovery roadmap.",
        price: 2800,
        duration: "60 mins",
        availability: true,
      },
    ]);

    console.log(`Created ${services.length} Services.`);

    // Create Sample Review
    await Review.create({
      user: patientUser._id,
      center: blossomCenter._id,
      rating: 5,
      comment: "Exceptional experience! The birthing tub and nurses made labor so peaceful and comfortable.",
    });

    // Create Sample Booking
    await Booking.create({
      user: patientUser._id,
      center: blossomCenter._id,
      service: services[0]._id,
      bookingDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
      bookingStatus: "Pending",
    });

    console.log("Database Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();
