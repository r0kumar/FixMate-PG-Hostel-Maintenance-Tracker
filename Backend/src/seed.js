import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Room from './models/Room.js';
import Complaint from './models/Complaint.js';

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fixmate';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB Seed] Connected successfully to host: ${conn.connection.host}`);

    // Clear previous records
    await User.deleteMany({});
    await Room.deleteMany({});
    await Complaint.deleteMany({});
    console.log('[MongoDB Seed] Cleaned previous records.');

    // Create Sample Rooms
    const room1 = await Room.create({
      roomNumber: '101',
      floor: 1,
      block: 'Wing A',
      capacity: 2,
    });

    const room2 = await Room.create({
      roomNumber: '204',
      floor: 2,
      block: 'Wing B',
      capacity: 3,
    });

    // Create Users (pre('save') hook hashes password automatically)
    const admin = await User.create({
      name: 'Hostel Admin',
      email: 'admin@fixmate.com',
      password: 'password123',
      role: 'admin',
      phone: '9876543210',
    });

    const staff = await User.create({
      name: 'Ramesh (Technician)',
      email: 'staff@fixmate.com',
      password: 'password123',
      role: 'staff',
      phone: '9876543211',
    });

    const resident = await User.create({
      name: 'Aarav Sharma',
      email: 'resident@fixmate.com',
      password: 'password123',
      role: 'resident',
      phone: '9876543212',
      room: room1._id,
    });

    // Update Room occupants
    room1.occupants.push(resident._id);
    await room1.save();

    // Create Sample Complaints
    await Complaint.create({
      title: 'Bathroom tap leaking continuously',
      description: 'The washbasin tap in room 101 has a persistent drip and does not close fully.',
      category: 'plumbing',
      priority: 'high',
      status: 'in_progress',
      roomNumber: '101',
      room: room1._id,
      resident: resident._id,
      assignedStaff: staff._id,
    });

    await Complaint.create({
      title: 'Ceiling fan making clicking sound',
      description: 'The ceiling fan regulator speed 3 causes intermittent clicking noise.',
      category: 'electrical',
      priority: 'medium',
      status: 'pending',
      roomNumber: '101',
      room: room1._id,
      resident: resident._id,
      assignedStaff: null,
    });

    await Complaint.create({
      title: 'WiFi disconnects frequently on 2nd floor',
      description: 'The router on Wing A 2nd floor drops signal every 10-15 minutes.',
      category: 'wifi',
      priority: 'urgent',
      status: 'assigned',
      roomNumber: '204',
      room: room2._id,
      resident: resident._id,
      assignedStaff: staff._id,
    });

    console.log('\n[MongoDB Seed] Successfully populated sample data:');
    console.log('--------------------------------------------------');
    console.log('Admin:    admin@fixmate.com    / password123');
    console.log('Staff:    staff@fixmate.com    / password123');
    console.log('Resident: resident@fixmate.com / password123');
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[MongoDB Seed] Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
