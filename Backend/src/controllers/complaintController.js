import Complaint, { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } from '../models/Complaint.js';
import User from '../models/User.js';

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (Resident, Admin)
export const createComplaint = async (req, res) => {
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

    const complaint = await Complaint.create({
      title: title.trim(),
      description: description.trim(),
      category: category.toLowerCase().trim(),
      priority: priority || 'medium',
      status: 'pending',
      roomNumber: roomNumber ? roomNumber.trim() : (req.user.room?.roomNumber || ''),
      room: req.user.room || null,
      resident: req.user._id,
      image: image || '',
    });

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('resident', 'name email phone')
      .populate('assignedStaff', 'name email phone')
      .populate('room');

    res.status(201).json(populatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaints with role-based filtering
// @route   GET /api/complaints
// @access  Private
export const getComplaints = async (req, res) => {
  try {
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

    // Role-based scope
    if (req.user.role === 'resident') {
      filter.resident = req.user._id;
    } else if (req.user.role === 'staff') {
      filter.assignedStaff = req.user._id;
    }
    // Admin gets all complaints matching query filters

    const complaints = await Complaint.find(filter)
      .populate('resident', 'name email phone')
      .populate('assignedStaff', 'name email phone')
      .populate('room')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaint by ID with resource-level authorization
// @route   GET /api/complaints/:id
// @access  Private
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('resident', 'name email phone')
      .populate('assignedStaff', 'name email phone')
      .populate('room');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Resource-level authorization
    if (req.user.role === 'resident') {
      if (complaint.resident._id.toString() !== req.user._id.toString()) {
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

// @desc    Assign staff to a complaint
// @route   PATCH /api/complaints/:id/assign
// @access  Private (Admin only)
export const assignStaff = async (req, res) => {
  try {
    const { staffId } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (staffId) {
      // Verify staff member exists and has role 'staff'
      const staffMember = await User.findById(staffId);
      if (!staffMember || staffMember.role !== 'staff') {
        return res.status(400).json({
          message: 'Selected user is not a valid staff member',
        });
      }

      complaint.assignedStaff = staffMember._id;

      // Automatically change status from 'pending' to 'assigned'
      if (complaint.status === 'pending') {
        complaint.status = 'assigned';
      }
    } else {
      // Unassign staff
      complaint.assignedStaff = null;
      if (complaint.status === 'assigned') {
        complaint.status = 'pending';
      }
    }

    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('resident', 'name email phone')
      .populate('assignedStaff', 'name email phone')
      .populate('room');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
// @access  Private (Staff, Admin)
export const updateComplaintStatus = async (req, res) => {
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

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Resource-level authorization: Staff can only update complaints assigned to them
    if (req.user.role === 'staff') {
      const assignedId = complaint.assignedStaff?.toString();
      if (!assignedId || assignedId !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Forbidden: You can only update complaints assigned to you',
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

    const updated = await Complaint.findById(complaint._id)
      .populate('resident', 'name email phone')
      .populate('assignedStaff', 'name email phone')
      .populate('room');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all staff members
// @route   GET /api/complaints/staff
// @access  Private (Admin)
export const getStaffList = async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' })
      .select('_id name email phone role createdAt')
      .sort({ name: 1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin only)
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
