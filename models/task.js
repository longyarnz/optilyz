/**
 * @fileoverview Creates a schema for the database.
 * @exports mongoose.model
 */
import { mongoose } from '../connection/database.js';

const Schema = mongoose.Schema;

const Task = new Schema({
  title: String,
  description: String,
  endTime: Date,
  reminderTime: Date,
  created_by: { type: String, ref: 'User' },
  isCompleted: { type: Boolean, default: false },
  date_created: { type: Date, default: Date.now },
});

export const TaskModel = mongoose.model('Task', Task);