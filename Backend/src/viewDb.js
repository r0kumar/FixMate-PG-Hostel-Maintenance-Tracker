import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Room from './models/Room.js';
import Complaint from './models/Complaint.js';

dotenv.config();

const viewDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fixmate';
    await mongoose.connect(mongoUri);
    console.log(`\n======================================================`);
    console.log(` Connected to MongoDB: ${mongoUri}`);
    console.log(` Database Name: fixmate`);
    console.log(`======================================================\n`);

    // 1. Users
    const users = await User.find().select('-password').populate('room', 'roomNumber block');
    console.log(`--- [USERS COLLECTION] (Total: ${users.length}) ---`);
    console.table(users.map(u => ({
      ID: u._id.toString().slice(-6),
      Name: u.name,
      Email: u.email,
      Role: u.role,
      Phone: u.phone || 'N/A',
      Room: u.room ? `${u.room.roomNumber} (${u.room.block})` : 'N/A'
    })));

    // 2. Rooms
    const rooms = await Room.find().populate('occupants', 'name email');
    console.log(`\n--- [ROOMS COLLECTION] (Total: ${rooms.length}) ---`);
    console.table(rooms.map(r => ({
      ID: r._id.toString().slice(-6),
      RoomNumber: r.roomNumber,
      Floor: r.floor,
      Block: r.block,
      Capacity: r.capacity,
      Occupants: r.occupants.map(o => o.name).join(', ') || 'None'
    })));

    // 3. Complaints
    const complaints = await Complaint.find()
      .populate('resident', 'name email')
      .populate('assignedStaff', 'name email')
      .populate('room', 'roomNumber');
    console.log(`\n--- [COMPLAINTS COLLECTION] (Total: ${complaints.length}) ---`);
    console.table(complaints.map(c => ({
      ID: c._id.toString().slice(-6),
      Title: c.title.length > 25 ? c.title.substring(0, 22) + '...' : c.title,
      Category: c.category,
      Status: c.status,
      Resident: c.resident?.name || 'N/A',
      Room: c.room?.roomNumber || 'N/A',
      Staff: c.assignedStaff?.name || 'Unassigned'
    })));

    console.log('\n======================================================\n');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error reading database:', error.message);
    process.exit(1);
  }
};

viewDatabase();

