import mongoose, { Schema, model, models } from "mongoose";

export interface ITask{
  _id?: mongoose.Types.ObjectId;
  title: string;
  dueDate: Date;
  priority: string;
  completed: boolean;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
  userId: mongoose.Types.ObjectId;
}

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
}, {
  timestamps: true,
});

const Task = models?.Task || model<ITask>("Task", taskSchema);

export default Task;