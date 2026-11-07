import mongoose from 'mongoose';

const demoUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: ['resident', 'staff', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'resident',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DemoRoom',
      default: null,
    },
    isDemo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Explicitly bind to 'demousers' collection in MongoDB Atlas
const DemoUser = mongoose.model('DemoUser', demoUserSchema, 'demousers');
export default DemoUser;

