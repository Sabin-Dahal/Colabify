const taskService = require('../services/task.service');
const createTask = async(req, res) =>{
    try{
        const task = await taskService.createTask(req.body, req.user.id);
        res.status(201).json({message: "Task created", task});
    }catch(error){
        res.status(error.statusCode || 500).json({error: error.message});
    }
};
const assignTask = async(req, res)=>{
    try{
        const{taskId} = req.params;
        const {userId} = req.body;
        const task = await taskService.assignTask(taskId, userId, req.user.id);
        res.json({message: "Task assigned", task});
    }catch(error){
        res.status(error.statusCode || 500).json({error: error.message});
    }
};

const updateTaskStatus = async(req, res)=>{
    try {
        const{taskId} = req.params;
        const {status} = req.body;
        const userId = req.user.id;
        const task = await taskService.updateTaskStatus({taskId, userId, updateData: status});
        res.json({message: "Task status updated", task});
    }catch(error){
        res.status(error.statusCode || 500).json({error: error.message});
    }
};

const getProjectTasks = async(req, res) =>{
    try{
        const {projectId} = req.params;
        const userId = req.user.id;
        const tasks = await taskService.getProjectTasks({projectId, userId});
        res.json({tasks});
    }catch(error){
        res.status(error.statusCode || 500).json({error: error.message});
    }
};

const getTaskById = async(req, res)=>{
    try{
        const {taskId} = req.params;
        const userId = req.user.id;
        const taskInfo = await taskService.getTasksById({taskId, userId});
        res.json({taskInfo});
    }catch(error){
        res.status(error.statuscode||500).json({error:error.message});
    }
}; 
module.exports = {createTask, assignTask, updateTaskStatus, getProjectTasks, getTaskById};