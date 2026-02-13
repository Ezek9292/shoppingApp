import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    }
    ,isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
