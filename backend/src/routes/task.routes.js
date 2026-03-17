const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const taskController = require('../controllers/task.controller');

router.post('/', protect, taskController.createTask);
router.patch('/:taskId/assign', protect, taskController.assignTask);
router.patch('/:taskId/status', protect, taskController.updateTaskStatus);
router.get('/project/:projectId', protect, taskController.getProjectTasks);
router.get('/:taskId', protect, taskController.getTaskById);
router.delete('/:taskId', protect, taskController.deleteTask);

module.exports = router;