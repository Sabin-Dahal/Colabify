import { useEffect, useState } from 'react';
import api from '../services/api'; 
import ProjectCard from './ProjectCard';
import CreateProjectModal from './CreateProjectModal';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects'); 
                setProjects(res.data.projects||res.data);
            } catch (err) {
                console.error("Fetch failed", err.response?.status);
            } finally{
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);
    const handleCreateProject = async(name) =>{
        
        try{
            const res = await api.post ('/projects', {name})
            const newProject = res.data.project || res.data;
            setProjects((currentProjects) => [newProject, ...currentProjects]);
            setIsModalOpen(false);
        }catch(err){
            console.error("Error creating project", err);
            alert("Failed to create project")
        }
    }
    const handleDeleteSuccess = (projectId) =>{
        setProjects((prev) =>prev.filter((p)=>p.id!==projectId))
    };

return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">My Workspace</h1>
                
                <div className="group relative">
                    <button onClick = {()=>setIsModalOpen(true)} className="flex items-center h-11 bg-indigo-600 text-white rounded-full px-4 shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out group-hover:pr-5">
                        <span className="text-xl font-bold">+</span>
                        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:ml-2 text-sm font-medium">
                            New Project
                        </span>
                    </button>
                </div>
            </div>
            {loading ? (
                <div className="animate-pulse text-gray-400">Loading projects...</div>
            ) : (
                <div className="grid grid-cols-3 gap-6">
                    {projects.map((proj) => (
                        <ProjectCard key={proj.id} project={proj} onDeleteSuccess={handleDeleteSuccess}/>
                    ))}
                    
                    {projects.length === 0 && (
                        <p className="text-gray-500 italic">No projects found. Create one to get started!</p>
                    )}
                </div>
            )}
            <CreateProjectModal isOpen={isModalOpen}
            onClose = {()=> setIsModalOpen(false)}
            onCreate = {handleCreateProject}/>
        </div>
    );
};
export default Dashboard;