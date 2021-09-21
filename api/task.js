/**
 * @fileoverview Tasks Routes and API endpoints.
 * @exports router
 */
import express from 'express';
import { tokenParser, logger, validateTask, validateTaskUpdateInput } from '../middleware/index.js';
import {
  getUserTasks, createTask, getTaskById,
  updateTaskById, deleteTaskById
} from '../service/taskService.js';

export const TaskRoute = express.Router();

/**
 * @description Gets all user tasks
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {Response} JSON
 */
TaskRoute.get('/', tokenParser, async (req, res) => {
  try {
    const { userId } = req;
    const tasks = await getUserTasks(userId);
    res.status(200).json(tasks);
  }
  catch (err) {
    logger.error(err.message);
  }
});

/**
 * @description Creates a single task
 * @param {middleware} tokenParser - Extracts userId from token
 * @param {middleware} validateTask - Validates input data
 * @returns {object} A newly created task object
 */
TaskRoute.post('/', tokenParser, validateTask, async (req, res) => {
  try {
    const { userId, body: { title, description, endTime, reminderTime } } = req;
    const newTask = { title, description, endTime, reminderTime, created_by: userId };
    const task = await createTask(newTask);
    res.status(200).json(task);
  }
  catch (err) {
    logger.error(err.message);
  }
});

/**
 * @description Gets a single user task
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {object} A task object
 */
TaskRoute.get('/:taskId', tokenParser, async (req, res) => {
  try {
    const { userId, params: { taskId } } = req;
    const task = await getTaskById(taskId, userId);
    res.status(200).json(task);
  }
  catch (err) {
    logger.error(err.message);
  }
});

/**
 * @description Updates a single user task
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {object} A task object
 */
TaskRoute.put('/:taskId', tokenParser, validateTaskUpdateInput, async (req, res) => {
  try {
    const { body, params: { taskId } } = req;
    const task = await updateTaskById(taskId, body);
    res.status(200).json(task);
  }
  catch (err) {
    logger.error(err.message);
  }
});

/**
 * @description Deletes a single user task
 * @param {middleware} tokenParser - Extracts userId from token
 * @returns {object} A task object
 */
TaskRoute.delete('/:taskId', tokenParser, async (req, res) => {
  try {
    const { params: { taskId } } = req;
    const removed = await deleteTaskById(taskId);
    res.status(200).json(removed);
  }
  catch (err) {
    logger.error(err.message);
  }
});