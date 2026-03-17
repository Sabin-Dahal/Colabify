const projectService = require('../services/project.service');

const createProject = async (req, res) => {
    try {
        const project = await projectService.createProject(req.body, req.user.id);
        res.status(201).json({ message: "Project created", project });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await projectService.getProjects(req.user.id);
        res.json(projects);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const addMember = async (req, res) => {
    try {
        const { projectId, userId } = req.body;
        const member = await projectService.addMember(projectId, userId, req.user.id);
        res.json({ message: "Member added", member });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

module.exports = { createProject, getProjects, addMember };