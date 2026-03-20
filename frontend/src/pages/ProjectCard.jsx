import api from '../services/api'; 
import {Trash2} from 'lucide-react';
import {Link} from 'react-router-dom';
const ProjectCard = ({ project, onDeleteSuccess }) => {
  const myRole = project.members[0]?.role;

  const isOwner = myRole === 'OWNER';
  const canEdit = myRole === 'OWNER' || myRole === 'COLLABORATOR';
  const handleDelete = async(e) =>{
    e.stopPropagation();
    if(!window.confirm(`Are you sure you want to delete "${project.name}"?`)) return;
    try{
      await api.delete(`/projects/${project.id}`);
      onDeleteSuccess(project.id);
    }catch(err){
      console.error("Delete failed", err);
    }
  };
const handleAddTask = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const taskName = window.prompt("Enter new task name:");
    if (!taskName) return;

    try {
      // Matches your task router: router.post('/', taskController.createTask)
      await api.post('/tasks', { name: taskName, projectId: project.id });
      window.location.reload(); // Quickest way to refresh the task count
    } catch (err) {
      alert(err.response?.data?.error||"Failed to add task");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const email = window.prompt("Enter collaborator's email:");
    if (!email) return;

    try {
      // Matches your project router: router.post('/add-member', projectController.addMember)
      await api.post('/projects/add-member', { projectId: project.id, email });
      alert("Member added!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add member");
    }
  };

  return (
    <Link to={`/project/${project.id}`} className="block group">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Tasks: {project._count?.tasks || 0}
            </p>
          </div>
          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase font-bold">
            {myRole}
          </span>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-2">
            {isOwner && (
              <button 
                onClick={handleAddMember}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <span className="text-xs font-bold">Add +</span>
              </button>
            )}

            {canEdit && (
              <button 
                onClick={handleAddTask}
                className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <span className="text-xs font-bold">Task +</span>
              </button>
            )}
          </div>

          {isOwner && (
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 transition-all"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;