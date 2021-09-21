/**
 * @fileoverview Methods for querying data from the tasks collection.
 * @exports { getUserTasks, createTask, getTaskById, updateTaskById, deleteTaskById }
 */
import { TaskModel } from '../models/task.js';
import { logger } from '../middleware/logger.js';

/**
 * @description Gets all tasks that belongs to the user.
 * @param {string} userId - The ID of the logged-in user.
 * @return {array} tasks - An array of tasks.
 */
const getUserTasks = async (userId) => {
  try {
    const tasks = await TaskModel.find({ created_by: userId });
    return tasks;
  }
  catch (err) {
    logger.error(err.message);
  }
};

/**
 * @description Creates a task for the user.
 * @param {{name: string, string}} task - An object containing ID of logged-in user and the name of the new task.
 * @return {array} An array of tasks.
 */
const createTask = async (newTask) => {
  try {
    const task = await TaskModel.create(newTask);
    return task;
  }
  catch (err) {
    logger.error(err.message);
  }
};

/**
 * @description Updates a task for the user.
 * @param {string} taskId - A unique task ID.
 * @param {object} update - An object to update the task.
 * @return {object} A task object.
 */
const updateTaskById = async (taskId, update) => {
  try {
    update = { $set: update };
    const task = await TaskModel.findOneAndUpdate({ _id: taskId }, update, { new: true });
    return task;
  }
  catch (err) {
    logger.error(err.message);
  }
};

/**
 * @description Deletes a task for the user.
 * @param {string} taskId - A unique task ID.
 * @return {boolean} A boolean value.
 */
const deleteTaskById = async (taskId) => {
  try {
    const remove = await TaskModel.deleteOne({ _id: taskId });
    return remove.deletedCount === 1;
  }
  catch (err) {
    logger.error(err.message);
  }
};

/**
 * @description Gets a task for the user by the ID.
 * @param {string} taskId - A unique task ID.
 * @param {string} update - A unique user ID.
 * @return {object} A tasks object.
 */
const getTaskById = async (taskId, userId) => {
  try {
    const task = await TaskModel.findOne({ _id: taskId, created_by: userId });
    return task;
  }
  catch (err) {
    logger.error(err.message);
  }
};

export { getUserTasks, createTask, getTaskById, updateTaskById, deleteTaskById };