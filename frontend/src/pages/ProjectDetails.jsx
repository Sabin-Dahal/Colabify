import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2, UserPlus, CheckCircle, Circle, ArrowLeft, User, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [project, setProject] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [taskError, setTaskError] = useState('');
  const [memberError, setMemberError] = useState('');
  const [statusError, setStatusError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        setCurrentUserId(res.data.profile.id);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (token) fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      // FIX 1: backend returns { project }, so unwrap it
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.project);
    } catch (err) {
      console.error("Fetch error", err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else if (err.response?.status === 403 || err.response?.status === 404) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const isOwner = project?.owner?.id === currentUserId;

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTaskError('');
    try {
      await api.post(`/tasks`, { title: newTaskTitle.trim(), projectId: id });
      setNewTaskTitle('');
      fetchProject();
    } catch (err) {
      setTaskError(err.response?.data?.error || "Failed to create task");
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    setStatusError('');
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchProject();
    } catch (err) {
      setStatusError(err.response?.data?.error || "Could not update task status. You may not have permission.");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete task");
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;
    setMemberError('');
    try {
      await api.post(`/projects/add-member`, {
        projectId: id,
        email: newMemberEmail.trim()
      });
      setNewMemberEmail('');
      fetchProject();
    } catch (err) {
      setMemberError(err.response?.data?.error || "Could not add member");
    }
  };

  const removeMember = async (userId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to remove member");
    }
  };

  if (loading) return (
    <div className="p-10 text-center text-gray-500">Loading your workspace...</div>
  );

  if (!project) return (
    <div className="p-10 text-center text-gray-500">Project not found.</div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen bg-gray-50">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-gray-500 mb-8 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" /> Dashboard
      </button>

      <header className="flex justify-between items-start mb-10 gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{project.name}</h1>
          <p className="text-gray-500 mt-2">Team Collaboration & Task Tracking</p>
        </div>

        {isOwner && (
          <form onSubmit={addMember} className="flex flex-col gap-1">
            <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm border">
              <input
                className="px-3 py-1 text-sm outline-none w-48"
                placeholder="Invite by email..."
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <UserPlus size={18} />
              </button>
            </div>
            {memberError && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {memberError}
              </p>
            )}
          </form>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              Project Tasks{' '}
              <span className="text-sm font-normal text-gray-400">
                ({project.tasks?.length || 0})
              </span>
            </h2>

            <form onSubmit={addTask} className="mb-2 flex gap-2">
              <input
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                placeholder="What needs to be done?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
              >
                Add
              </button>
            </form>
            {taskError && (
              <p className="text-xs text-red-500 mb-4 flex items-center gap-1">
                <AlertCircle size={12} /> {taskError}
              </p>
            )}
            {statusError && (
              <p className="text-xs text-amber-600 mb-4 flex items-center gap-1">
                <AlertCircle size={12} /> {statusError}
              </p>
            )}

            <div className="space-y-3 mt-4">
              {project.tasks?.length > 0 ? (
                project.tasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleTaskStatus(task.id, task.status)}
                        className="transition-transform active:scale-90"
                      >
                        {task.status === 'COMPLETED' ?
                          <CheckCircle className="text-green-500 w-6 h-6" /> :
                          <Circle className="text-gray-300 w-6 h-6" />}
                      </button>
                      <div>
                        <span className={`font-medium ${task.status === 'COMPLETED' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {task.title}
                        </span>
                        {task.assignedTo && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            Assigned to {task.assignedTo.name}
                          </p>
                        )}
                      </div>
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center py-10 text-gray-400 italic">No tasks created yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Team Members</h2>
            <div className="space-y-4">
              {project.members?.map(m => (
                <div key={m.userId} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm">
                      {m.user?.name?.charAt(0).toUpperCase() || <User size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{m.user?.name || "Member"}</p>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{m.role}</p>
                    </div>
                  </div>
                  {isOwner && m.role !== 'OWNER' && (
                    <button
                      onClick={() => removeMember(m.userId)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-600 font-medium transition-all"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;