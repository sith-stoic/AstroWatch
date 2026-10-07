// Populates the database with demo data for AstroWatch.
// Run with: npm run seed (from /server)
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Equipment = require('../models/Equipment');
const Maintenance = require('../models/Maintenance');
const Observation = require('../models/Observation');

const daysFromNow = (offset, hours = 0, minutes = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

const destroyData = async () => {
  await Promise.all([
    User.deleteMany(),
    Equipment.deleteMany(),
    Maintenance.deleteMany(),
    Observation.deleteMany(),
  ]);
  console.log('All existing data destroyed.');
};

const seedData = async () => {
  await destroyData();

  // ---------- USERS ----------
  const userDocs = await User.create([
    {
      name: 'Admin User',
      email: 'admin@astrowatch.com',
      password: 'admin123',
      role: 'Admin',
    },
    {
      name: 'Arjun Mehta',
      email: 'technician@astrowatch.com',
      password: 'tech123',
      role: 'Technician',
    },
    {
      name: 'Priya Nair',
      email: 'priya.tech@astrowatch.com',
      password: 'tech123',
      role: 'Technician',
    },
    {
      name: 'Ravi Kumar',
      email: 'ravi.tech@astrowatch.com',
      password: 'tech123',
      role: 'Technician',
    },
    {
      name: 'Divya R',
      email: 'divya.tech@astrowatch.com',
      password: 'tech123',
      role: 'Technician',
    },
    {
      name: 'Dr. Ananya Rao',
      email: 'observer@astrowatch.com',
      password: 'observer123',
      role: 'Observer',
    },
    {
      name: 'Dr. Vikram Iyer',
      email: 'vikram.obs@astrowatch.com',
      password: 'observer123',
      role: 'Observer',
    },
    {
      name: 'Dr. Meera Nair',
      email: 'meera.obs@astrowatch.com',
      password: 'observer123',
      role: 'Observer',
    },
  ]);
  console.log(`${userDocs.length} users seeded.`);

  const usersByEmail = Object.fromEntries(userDocs.map((u) => [u.email, u]));

  // ---------- EQUIPMENT ----------
  const equipmentDocs = await Equipment.insertMany([
    {
      name: 'Telescope-01',
      type: 'Optical Telescope',
      location: 'Main Observatory Dome',
      status: 'Operational',
      condition: 'Good',
      description: 'Primary 0.6m optical reflector used for planetary and lunar observation.',
      lastMaintenance: daysFromNow(-40),
      nextMaintenance: daysFromNow(50),
    },
    {
      name: 'Telescope-02',
      type: 'Optical Telescope',
      location: 'East Wing Dome',
      status: 'Operational',
      condition: 'Excellent',
      description: 'Secondary 0.4m refractor, primarily used for training and public outreach sessions.',
      lastMaintenance: daysFromNow(-15),
      nextMaintenance: daysFromNow(75),
    },
    {
      name: 'Radio Telescope-01',
      type: 'Radio Telescope',
      location: 'Radio Array Field',
      status: 'Operational',
      condition: 'Good',
      description: '5m parabolic dish used for deep-space radio source observation.',
      lastMaintenance: daysFromNow(-20),
      nextMaintenance: daysFromNow(70),
    },
    {
      name: 'CCD Camera-01',
      type: 'CCD Camera',
      location: 'Main Observatory Dome',
      status: 'Operational',
      condition: 'Excellent',
      description: 'High-sensitivity CCD imaging camera mounted on Telescope-01.',
      lastMaintenance: daysFromNow(-10),
      nextMaintenance: daysFromNow(80),
    },
    {
      name: 'CCD Camera-02',
      type: 'CCD Camera',
      location: 'East Wing Dome',
      status: 'Warning',
      condition: 'Fair',
      description: 'Backup imaging camera. Cooling unit showing intermittent temperature warnings.',
      lastMaintenance: daysFromNow(-90),
      nextMaintenance: daysFromNow(5),
    },
    {
      name: 'Spectrograph-01',
      type: 'Spectrograph',
      location: 'Analysis Lab',
      status: 'Operational',
      condition: 'Good',
      description: 'Used for spectral analysis of planetary atmospheres and stellar composition.',
      lastMaintenance: daysFromNow(-30),
      nextMaintenance: daysFromNow(60),
    },
    {
      name: 'Weather Sensor-01',
      type: 'Weather Sensor',
      location: 'Rooftop Station',
      status: 'Operational',
      condition: 'Good',
      description: 'On-site sensor array feeding local humidity, wind and cloud cover readings.',
      lastMaintenance: daysFromNow(-25),
      nextMaintenance: daysFromNow(10),
    },
    {
      name: 'Tracking System-01',
      type: 'Tracking System',
      location: 'Main Observatory Dome',
      status: 'Maintenance',
      condition: 'Fair',
      description: 'Motorized alt-azimuth tracking mount for Telescope-01. Currently being recalibrated.',
      lastMaintenance: daysFromNow(-1),
      nextMaintenance: daysFromNow(90),
    },
  ]);
  console.log(`${equipmentDocs.length} equipment items seeded.`);

  const byName = Object.fromEntries(equipmentDocs.map((e) => [e.name, e]));

  // ---------- MAINTENANCE ----------
  const maintenanceDocs = await Maintenance.insertMany([
    {
      equipment: byName['Tracking System-01']._id,
      title: 'Motor calibration and alignment check',
      description: 'Recalibrate azimuth/altitude motors after drift was reported during last session.',
      scheduledDate: daysFromNow(0, 10, 0),
      assignedTo: usersByEmail['technician@astrowatch.com']._id,
      priority: 'High',
      status: 'In Progress',
      notes: 'Replacement encoder ordered as a precaution.',
    },
    {
      equipment: byName['CCD Camera-02']._id,
      title: 'Sensor cooling unit inspection',
      description: 'Investigate intermittent temperature warnings on the cooling module.',
      scheduledDate: daysFromNow(3, 11, 0),
      assignedTo: usersByEmail['priya.tech@astrowatch.com']._id,
      priority: 'Medium',
      status: 'Scheduled',
      notes: '',
    },
    {
      equipment: byName['Telescope-01']._id,
      title: 'Routine mirror cleaning',
      description: 'Standard quarterly cleaning and dust check of the primary mirror.',
      scheduledDate: daysFromNow(-12, 9, 0),
      assignedTo: usersByEmail['ravi.tech@astrowatch.com']._id,
      priority: 'Low',
      status: 'Completed',
      notes: 'No issues found. Optical alignment verified.',
    },
    {
      equipment: byName['Radio Telescope-01']._id,
      title: 'Receiver dish realignment',
      description: 'Re-align dish after minor signal degradation was observed.',
      scheduledDate: daysFromNow(-8, 14, 0),
      assignedTo: usersByEmail['technician@astrowatch.com']._id,
      priority: 'Medium',
      status: 'Completed',
      notes: 'Signal strength restored to baseline.',
    },
    {
      equipment: byName['Weather Sensor-01']._id,
      title: 'Firmware update',
      description: 'Apply latest firmware update to improve humidity sensor accuracy.',
      scheduledDate: daysFromNow(6, 15, 0),
      assignedTo: usersByEmail['divya.tech@astrowatch.com']._id,
      priority: 'Low',
      status: 'Scheduled',
      notes: '',
    },
  ]);
  console.log(`${maintenanceDocs.length} maintenance tasks seeded.`);

  // ---------- OBSERVATIONS ----------
  const observationDocs = await Observation.insertMany([
    {
      target: 'Jupiter',
      description: 'Observation of the Great Red Spot and Galilean moon positions.',
      date: daysFromNow(2),
      startTime: '20:00',
      endTime: '21:00',
      equipment: byName['Telescope-01']._id,
      observer: usersByEmail['observer@astrowatch.com']._id,
      priority: 'High',
      status: 'Scheduled',
      notes: '',
    },
    {
      target: 'Saturn',
      description: 'Ring system imaging session for the astronomy outreach program.',
      date: daysFromNow(2),
      startTime: '21:30',
      endTime: '22:30',
      equipment: byName['Telescope-02']._id,
      observer: usersByEmail['observer@astrowatch.com']._id,
      priority: 'Medium',
      status: 'Scheduled',
      notes: '',
    },
    {
      target: 'Moon',
      description: 'High-resolution lunar surface imaging near the terminator line.',
      date: daysFromNow(3),
      startTime: '19:00',
      endTime: '20:00',
      equipment: byName['Telescope-01']._id,
      observer: usersByEmail['meera.obs@astrowatch.com']._id,
      priority: 'Low',
      status: 'Scheduled',
      notes: '',
    },
    {
      target: 'Andromeda Galaxy',
      description: 'Radio survey of the galactic core region.',
      date: daysFromNow(-4),
      startTime: '22:00',
      endTime: '23:30',
      equipment: byName['Radio Telescope-01']._id,
      observer: usersByEmail['vikram.obs@astrowatch.com']._id,
      priority: 'High',
      status: 'Completed',
      notes: 'Successful data capture, signal strength nominal.',
    },
    {
      target: 'Orion Nebula',
      description: 'Deep-sky imaging session to capture nebular structure in detail.',
      date: daysFromNow(0),
      startTime: '18:00',
      endTime: '19:00',
      equipment: byName['CCD Camera-01']._id,
      observer: usersByEmail['observer@astrowatch.com']._id,
      priority: 'Medium',
      status: 'In Progress',
      notes: '',
    },
    {
      target: 'Mars',
      description: 'Atmospheric spectral analysis to track seasonal dust activity.',
      date: daysFromNow(-9),
      startTime: '20:00',
      endTime: '21:00',
      equipment: byName['Spectrograph-01']._id,
      observer: usersByEmail['observer@astrowatch.com']._id,
      priority: 'Medium',
      status: 'Completed',
      notes: 'Spectral analysis completed successfully.',
    },
  ]);
  console.log(`${observationDocs.length} observations seeded.`);

  console.log('\nSeed complete!');
  console.log('Admin      -> admin@astrowatch.com / admin123');
  console.log('Technician -> technician@astrowatch.com / tech123');
  console.log('Observer   -> observer@astrowatch.com / observer123');
};

const run = async () => {
  await connectDB();

  if (process.argv.includes('--destroy')) {
    await destroyData();
    await mongoose.connection.close();
    process.exit(0);
  }

  try {
    await seedData();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
