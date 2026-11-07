import jwt from 'jsonwebtoken';
import DemoUser from '../models/DemoUser.js';
import DemoRoom from '../models/DemoRoom.js';
import DemoComplaint from '../models/DemoComplaint.js';
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } from '../models/Complaint.js';
import { getDemoJwtSecret } from '../middleware/demoAuth.js';

// Seed initial isolated demo data in Atlas if empty or upon reset
export const seedDefaultDemoData = async (force = false) => {
  const complaintCount = await DemoComplaint.countDocuments();
  const userCount = await DemoUser.countDocuments();

  if (!force && complaintCount > 0 && userCount > 0) {
    return;
  }

  // Clear demo collections only
  await DemoComplaint.deleteMany({});
  await DemoRoom.deleteMany({});
  await DemoUser.deleteMany({});

  // 1. Create Default Demo Rooms
  const room101 = await DemoRoom.create({
    roomNumber: '101',
    floor: 1,
    block: 'Wing A',
    capacity: 2,
  });

  const room204 = await DemoRoom.create({
    roomNumber: '204',
    floor: 2,
    block: 'Wing B',
    capacity: 3,
  });

  const room305 = await DemoRoom.create({
    roomNumber: '305',
    floor: 3,
    block: 'Wing A',
    capacity: 2,
  });

  // 2. Create Default Demo Users
  const adminUser = await DemoUser.create({
    name: 'Demo Administrator',
    email: 'admin.demo@fixmate.preview',
    role: 'admin',
    phone: '9876543200',
  });

  const staffUser1 = await DemoUser.create({
    name: 'Ramesh (Technician)',
    email: 'ramesh.tech@fixmate.preview',
    role: 'staff',
    phone: '9876543201',
  });

  const staffUser2 = await DemoUser.create({
    name: 'Suresh (Electrician)',
    email: 'suresh.electric@fixmate.preview',
    role: 'staff',
    phone: '9876543202',
  });

  const resident1 = await DemoUser.create({
    name: 'Aarav Sharma',
    email: 'aarav.sharma@fixmate.preview',
    role: 'resident',
    phone: '9876543203',
    room: room101._id,
  });

  const resident2 = await DemoUser.create({
    name: 'Priya Patel',
    email: 'priya.patel@fixmate.preview',
    role: 'resident',
    phone: '9876543204',
    room: room204._id,
  });

  // Assign occupants to rooms
  room101.occupants = [resident1._id];
  await room101.save();

  room204.occupants = [resident2._id];
  await room204.save();

  // 3. Create Default Demo Complaints
  await DemoComplaint.create({
    title: 'Bathroom tap leaking continuously',
    description: 'The washbasin tap in room 101 has a persistent drip and does not close fully.',
    category: 'plumbing',
    priority: 'high',
    status: 'in_progress',
    roomNumber: '101',
    room: room101._id,
    resident: resident1._id,
    assignedStaff: staffUser1._id,
    remarks: 'Inspected washer valve, replacement gasket scheduled.',
  });

  await DemoComplaint.create({
    title: 'Ceiling fan making clicking sound',
    description: 'The ceiling fan regulator speed 3 causes intermittent clicking noise.',
    category: 'electrical',
    priority: 'medium',
    status: 'pending',
    roomNumber: '101',
    room: room101._id,
    resident: resident1._id,
    assignedStaff: null,
  });

  await DemoComplaint.create({
    title: 'WiFi disconnects frequently on 2nd floor',
    description: 'The router on Wing B 2nd floor drops signal every 10-15 minutes.',
    category: 'wifi',
    priority: 'urgent',
    status: 'assigned',
    roomNumber: '204',
    room: room204._id,
    resident: resident2._id,
    assignedStaff: staffUser1._id,
  });

  await DemoComplaint.create({
    title: 'Room deep cleaning request',
    description: 'Periodic monthly deep cleaning of window sills and washroom tiling.',
    category: 'cleaning',
    priority: 'low',
    status: 'resolved',
    roomNumber: '305',
    room: room305._id,
    resident: resident2._id,
    assignedStaff: staffUser2._id,
    remarks: 'Completed sanitization and window glass cleaning.',
    resolvedAt: new Date(),
  });
};

// @desc    Issue temporary signed Demo JWT for Admin, Staff, or Resident
// @route   POST /api/demo/auth/login
export const loginDemo = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['admin', 'staff', 'resident'].includes(role)) {
      return res.status(400).json({
        message: "Please specify a valid demo role ('admin', 'staff', or 'resident')",
      });
    }

    // Ensure demo collections are seeded
    await seedDefaultDemoData(false);

    // Fetch the representative demo user
    let demoUser = await DemoUser.findOne({ role }).populate('room');
    if (!demoUser) {
      await seedDefaultDemoData(true);
      demoUser = await DemoUser.findOne({ role }).populate('room');
    }

    // Generate signed Demo JWT using dedicated DEMO_JWT_SECRET
    // Expiration set to 2 hours for security
    const token = jwt.sign(
      {
        id: demoUser._id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        isDemo: true,
      },
      getDemoJwtSecret(),
      { expiresIn: '2h' }
    );

    res.json({
      _id: demoUser._id,
      name: demoUser.name,
      email: demoUser.email,
      role: demoUser.role,
      phone: demoUser.phone,
      room: demoUser.room,
      isDemo: true,
      token,
      message: `Authenticated into ${demoUser.role} demo session`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged in demo user profile
// @route   GET /api/demo/auth/me
export const getDemoMe = async (req, res) => {
  try {
    const user = await DemoUser.findById(req.user._id).populate('room');
    if (!user) {
      // Fallback to token payload representation if user was synthetic
      return res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isDemo: true,
      });
    }
    res.json({
      ...user.toObject(),
      isDemo: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset all demo data back to default clean fixtures
// @route   POST /api/demo/reset
export const resetDemoData = async (req, res) => {
  try {
    await seedDefaultDemoData(true);
    res.json({
      success: true,
      message: 'Demo environment successfully reset to fresh default state.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- DEMO COMPLAINTS ---

// @desc    Create new demo complaint
// @route   POST /api/demo/complaints
// @access  Demo Private (Resident, Admin)
export const createDemoComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, roomNumber, image } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Please provide title, description, and category' });
    }

    if (!COMPLAINT_CATEGORIES.includes(category.toLowerCase())) {
      return res.status(400).json({
        message: `Invalid category. Allowed: ${COMPLAINT_CATEGORIES.join(', ')}`,
      });
    }

    const user = await DemoUser.findById(req.user._id).populate('room');
    const resolvedRoom = user?.room || null;
    const resolvedRoomNumber = roomNumber ? roomNumber.trim() : (resolvedRoom?.roomNumber || '');

    const complaint = await DemoComplaint.create({
      title: title.trim(),
      description: description.trim(),
      category: category.toLowerCase().trim(),
      priority: priority || 'medium',
      status: 'pending',
      roomNumber: resolvedRoomNumber,
      room: resolvedRoom?._id || null,
      resident: req.user._id,
      image: image || '',
    });

    const populated = await DemoComplaint.findById(complaint._id)
      .populate('resident', 'name email phone')
      .populate('assignedStaff', 'name email phone')
      .populate('room');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get demo complaints
// @route   GET /api/demo/complaints
export const getDemoComplaints = async (req, res) => {
  try {
    await seedDefaultDemoData(false);

    let filter = {};
    const { status, category, search } = req.query;

    if (status && status !== 'all') filter.status = status;
    if (category && category !== 'all') filter.category = category;

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { roomNumber: searchRegex },
        { category: searchRegex },
      ];
    }

    // Role-based scoping: Resident sees only their complaints, Staff sees assigned
    if (req.user.role === 'resident') {
      filter.resident = req.user._id;
    } else if (req.user.role === 'staff') {
      filter.assignedStaff = req.user._id;
    }

    const complaints = await DemoComplaint.find(filter)
      .populate('resident', 'name email phone')
      .populate('assignedStaff', 'name email phone')
      .populate('room')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get demo complaint by ID
// @route   GET /api/demo/complaints/:id
export const getDemoComplaintById = async (req, res) => {
  try {
    const complaint = await DemoComplaint.findById(req.params.id)
      .populate('resident', 'name email phone')
      .populate('assignedStaff', 'name email phone')
      .populate('room');

    if (!complaint) {
      return res.status(404).json({ message: 'Demo complaint not found' });
    }

    // Resource-level authorization
    if (req.user.role === 'resident') {
      const residentId = complaint.resident?._id?.toString() || complaint.resident?.toString();
      if (residentId !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Access denied: You can only view your own complaints',
        });
      }
    } else if (req.user.role === 'staff') {
      const assignedId = complaint.assignedStaff?._id?.toString() || complaint.assignedStaff?.toString();
      if (assignedId !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Access denied: You can only view complaints assigned to you',
        });
      }
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign demo staff to demo complaint
// @route   PATCH /api/demo/complaints/:id/assign
export const assignDemoStaff = async (req, res) => {
  try {
    const { staffId } = req.body;
    const complaint = await DemoComplaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Demo complaint not found' });
    }

    if (staffId) {
      const staffMember = await DemoUser.findById(staffId);
      if (!staffMember || staffMember.role !== 'staff') {
        return res.status(400).json({ message: 'Selected user is not a valid demo staff member' });
      }

      complaint.assignedStaff = staffMember._id;
      if (complaint.status === 'pending') {
        complaint.status = 'assigned';
      }
    } else {
      complaint.assignedStaff = null;
      if (complaint.status === 'assigned') {
        complaint.status = 'pending';
      }
    }

    await complaint.save();

    const updated = await DemoComplaint.findById(complaint._id)
      .populate('resident', 'name email phone')
      .populate('assignedStaff', 'name email phone')
      .populate('room');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update demo complaint status
// @route   PATCH /api/demo/complaints/:id/status
export const updateDemoComplaintStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    if (!COMPLAINT_STATUSES.includes(status.toLowerCase())) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${COMPLAINT_STATUSES.join(', ')}`,
      });
    }

    const complaint = await DemoComplaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Demo complaint not found' });
    }

    // Role check: Staff can only update complaints assigned to them
    if (req.user.role === 'staff') {
      const assignedId = complaint.assignedStaff?.toString();
      if (!assignedId || assignedId !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Forbidden: You can only update demo tasks assigned to you',
        });
      }
    }

    complaint.status = status.toLowerCase();

    if (remarks !== undefined) {
      complaint.remarks = remarks.trim();
    }

    if (complaint.status === 'resolved') {
      complaint.resolvedAt = new Date();
    } else {
      complaint.resolvedAt = null;
    }

    await complaint.save();

    const updated = await DemoComplaint.findById(complaint._id)
      .populate('resident', 'name email phone')
      .populate('assignedStaff', 'name email phone')
      .populate('room');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete demo complaint
// @route   DELETE /api/demo/complaints/:id
export const deleteDemoComplaint = async (req, res) => {
  try {
    const complaint = await DemoComplaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Demo complaint not found' });
    }

    await complaint.deleteOne();
    res.json({ message: 'Demo complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- DEMO ROOMS ---

// @desc    Get all demo rooms
// @route   GET /api/demo/rooms
export const getDemoRooms = async (req, res) => {
  try {
    await seedDefaultDemoData(false);
    const rooms = await DemoRoom.find().populate('occupants', 'name email phone');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create demo room
// @route   POST /api/demo/rooms
export const createDemoRoom = async (req, res) => {
  try {
    const { roomNumber, floor, block, capacity } = req.body;

    if (!roomNumber || floor === undefined) {
      return res.status(400).json({ message: 'Room number and floor are required' });
    }

    const exists = await DemoRoom.findOne({ roomNumber: roomNumber.trim().toUpperCase() });
    if (exists) {
      return res.status(400).json({ message: 'Demo room already exists' });
    }

    const room = await DemoRoom.create({
      roomNumber: roomNumber.trim().toUpperCase(),
      floor,
      block: block || 'Main',
      capacity: capacity || 2,
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete demo room
// @route   DELETE /api/demo/rooms/:id
export const deleteDemoRoom = async (req, res) => {
  try {
    const room = await DemoRoom.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Demo room not found' });
    }

    await room.deleteOne();
    res.json({ message: 'Demo room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- DEMO STAFF ---

// @desc    Get all demo staff members
// @route   GET /api/demo/staff
export const getDemoStaff = async (req, res) => {
  try {
    await seedDefaultDemoData(false);
    const staff = await DemoUser.find({ role: 'staff' })
      .select('_id name email phone role createdAt')
      .sort({ name: 1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a demo staff account
// @route   POST /api/demo/staff
export const createDemoStaff = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Please provide name and email for staff member' });
    }

    const exists = await DemoUser.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ message: 'A demo staff with this email already exists' });
    }

    const staff = await DemoUser.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: 'staff',
      phone: phone ? phone.trim() : '',
    });

    res.status(201).json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      phone: staff.phone,
      message: 'Demo staff member account successfully created',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete demo staff member
// @route   DELETE /api/demo/staff/:id
export const deleteDemoStaff = async (req, res) => {
  try {
    const user = await DemoUser.findById(req.params.id);
    if (!user || user.role !== 'staff') {
      return res.status(404).json({ message: 'Demo staff member not found' });
    }

    await user.deleteOne();
    res.json({ message: 'Demo staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

