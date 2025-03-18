import { Schema, model } from 'mongoose';

interface Task {
  title: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  completed: boolean;
}

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: {
    type: [String],
    default: []
  },
  completed: {
    type: Boolean,
    default: false
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

const TaskModel = model<Task>('Task', taskSchema);

export default TaskModel;