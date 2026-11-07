import mongoose from 'mongoose';

const demoRoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please provide room number'],
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
        ref: 'DemoUser',
      },
    ],
    isDemo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Explicitly bind to 'demorooms' collection in MongoDB Atlas
const DemoRoom = mongoose.model('DemoRoom', demoRoomSchema, 'demorooms');
export default DemoRoom;

