import Room from '../models/Room.js';

// @desc    Get all rooms
// @route   GET /api/rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('occupants', 'name email phone');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new room
// @route   POST /api/rooms
export const createRoom = async (req, res) => {
  try {
    const { roomNumber, floor, block, capacity } = req.body;

    if (!roomNumber || floor === undefined) {
      return res.status(400).json({ message: 'Room number and floor are required' });
    }

    const exists = await Room.findOne({ roomNumber });
    if (exists) {
      return res.status(400).json({ message: 'Room already exists' });
    }

    const room = await Room.create({
      roomNumber,
      floor,
      block: block || 'Main',
      capacity: capacity || 2,
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update room
// @route   PATCH /api/rooms/:id
export const updateRoom = async (req, res) => {
  try {
    const { roomNumber, floor, block, capacity, occupants } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (roomNumber) room.roomNumber = roomNumber;
    if (floor !== undefined) room.floor = floor;
    if (block) room.block = block;
    if (capacity !== undefined) room.capacity = capacity;
    if (occupants) room.occupants = occupants;

    await room.save();
    const updated = await Room.findById(room._id).populate('occupants', 'name email phone');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    await room.deleteOne();
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

