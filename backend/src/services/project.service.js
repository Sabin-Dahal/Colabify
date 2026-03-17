const prisma = require('../config/prisma');
const createProject = async(projectData, ownerId) =>{
    return await prisma.project.create({
        data:{
            ...projectData, 
            ownerId: ownerId
        }
    });
};

const getProjects = async(userId) =>{
    return await prisma.project.findMany({
        where:{
            OR:[
                {ownerId: userId},
                {members: {some: {userId: userId}}}
            ]
        },
        include: {
            owner: {select: {name:true}},
            members: {select: {user: {select: {name:true}}}}
        }
    });
};
    

const addMember = async(projectId, userId, currentUserId) =>{
    const project = await prisma.project.findUnique({where: {id: projectId}});
    if (!project) {
        const error = new Error ("Project not found");
        error.statusCode = 404;
        throw error;
    }
    if (project.ownerId !== currentUserId) {
        const error = new Error ("Only project owner can add members");
        error.statusCode = 403;
        throw error;
    }
    return await prisma.projectMember.create({
        data: {
            userId,
            projectId,
            role: "COLLABORATOR"
        }
    });
};


module.exports = {createProject, getProjects, addMember};