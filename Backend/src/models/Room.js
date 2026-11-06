import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please provide room number'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    floor: {
      type: Number,
      required: [true, 'Please specify floor number'],
      min: [0, 'Floor number cannot be negative'],
    },
    block: {
      type: String,
      default: 'Main',
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify room capacity'],
      min: [1, 'Room capacity must be at least 1'],
      default: 2,
    },
    occupants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);
export default Room;
