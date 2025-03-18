import { Schema, model } from 'mongoose';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const UserModel = model<User>('User', userSchema);

export default UserModel;