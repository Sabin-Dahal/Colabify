import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2, UserPlus, ArrowLeft, User, AlertCircle, ChevronUp } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

const STATUS_STYLES = {
  TODO:        { label: 'TODO',        classes: 'bg-gray-100 text-gray-600' },
  IN_PROGRESS: { label: 'In Progress', classes: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
  DONE:        { label: 'Done',        classes: 'bg-green-50 text-green-700 border border-green-200' },
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [project, setProject]           = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading]           = useState(true);

  const [showTaskForm, setShowTaskForm]       = useState(false);
  const [taskTitle, setTaskTitle]             = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline]       = useState('');
  const [taskAssignee, setTaskAssignee]       = useState('');
  const [taskError, setTaskError]             = useState('');

  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [memberError, setMemberError]       = useState('');

  const [assigningTaskId, setAssigningTaskId] = useState(null);
  const [assignError, setAssignError]         = useState('');

  const [statusError, setStatusError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        setCurrentUserId(res.data.profile.id);
      } catch (err) {
        if (err.response?.status === 401) { logout(); navigate('/login'); }
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => { if (token) fetchProject(); }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.project);
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/login'); }
      else if (err.response?.status === 403 || err.response?.status === 404) navigate('/dashboard');
    } finally { setLoading(false); }
  };

  const isOwner = project?.owner?.id === currentUserId;


  const addTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    setTaskError('');
    try {
      const res = await api.post(`/tasks`, {
        title: taskTitle.trim(),
        description: taskDescription.trim() || undefined,
        deadline: taskDeadline || undefined,
        projectId: id,
      });
      if (taskAssignee && res.data.task?.id) {
        await api.patch(`/tasks/${res.data.task.id}/assign`, { userId: taskAssignee });
      }
      setTaskTitle(''); setTaskDescription(''); setTaskDeadline(''); setTaskAssignee('');
      setShowTaskForm(false);
      fetchProject();
    } catch (err) {
      setTaskError(err.response?.data?.error || "Failed to create task");
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    setStatusError('');
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchProject();
    } catch (err) {
      setStatusError(err.response?.data?.error || "Could not update status.");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchProject();
    } catch (err) { alert(err.response?.data?.error || "Failed to delete task"); }
  };

  const assignTask = async (taskId, userId) => {
    setAssignError('');
    try {
      await api.patch(`/tasks/${taskId}/assign`, { userId });
      setAssigningTaskId(null);
      fetchProject();
    } catch (err) { setAssignError(err.response?.data?.error || "Failed to assign"); }
  };

  const unassignTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/unassign`);
      setAssigningTaskId(null);
      fetchProject();
    } catch (err) { alert(err.response?.data?.error || "Failed to unassign"); }
  };


  const addMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;
    setMemberError('');
    try {
      await api.post(`/projects/add-member`, { projectId: id, email: newMemberEmail.trim() });
      setNewMemberEmail('');
      fetchProject();
    } catch (err) { setMemberError(err.response?.data?.error || "Could not add member"); }
  };

  const removeMember = async (userId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      fetchProject();
    } catch (err) { alert(err.response?.data?.error || "Failed to remove member"); }
  };


  if (loading) return <div className="p-10 text-center text-gray-500">Loading your workspace...</div>;
  if (!project) return <div className="p-10 text-center text-gray-500">Project not found.</div>;

  const assignableMembers = project.members || [];

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen bg-gray-50">
      <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-500 mb-8 hover:text-indigo-600 transition-colors">
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
              <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors">
                <UserPlus size={18} />
              </button>
            </div>
            {memberError && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{memberError}</p>}
          </form>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── TASKS ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Project Tasks <span className="text-sm font-normal text-gray-400">({project.tasks?.length || 0})</span>
              </h2>
              <button
                onClick={() => setShowTaskForm(v => !v)}
                className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                {showTaskForm ? <><ChevronUp size={16} />Cancel</> : <>+ New Task</>}
              </button>
            </div>

            {showTaskForm && (
              <form onSubmit={addTask} className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <input
                  required autoFocus
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Task title *"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
                <textarea
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Description (optional)"
                  rows={2}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
                <div className="flex gap-3 flex-wrap">
                  <div className="flex-1 min-w-32">
                    <label className="text-xs text-gray-500 mb-1 block">Deadline (optional)</label>
                    <input
                      type="date"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                    />
                  </div>
                  {isOwner && assignableMembers.length > 0 && (
                    <div className="flex-1 min-w-32">
                      <label className="text-xs text-gray-500 mb-1 block">Assign to (optional)</label>
                      <select
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={taskAssignee}
                        onChange={(e) => setTaskAssignee(e.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {assignableMembers.map(m => (
                          <option key={m.userId} value={m.userId}>
                            {m.user?.name} ({m.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                {taskError && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{taskError}</p>}
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Create Task
                </button>
              </form>
            )}

            {statusError && <p className="text-xs text-amber-600 mb-4 flex items-center gap-1"><AlertCircle size={12} />{statusError}</p>}

            <div className="space-y-3">
              {project.tasks?.length > 0 ? project.tasks.map(task => {
                const s = STATUS_STYLES[task.status] || STATUS_STYLES.TODO;
                return (
                  <div key={task.id} className="p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all group">
                    <div className="flex items-start justify-between gap-3">

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-medium text-sm ${task.status === 'DONE' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {task.title}
                          </span>
                          <select
                            value={task.status}
                            onChange={(e) => updateStatus(task.id, e.target.value)}
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border-0 outline-none cursor-pointer ${s.classes}`}
                          >
                            <option value="TODO">TODO</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                          </select>
                        </div>

                        {task.description && (
                          <p className="text-xs text-gray-400 mt-1 truncate">{task.description}</p>
                        )}

                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          {task.assignedTo
                            ? <p className="text-xs text-indigo-500 font-medium">→ {task.assignedTo.name}</p>
                            : <p className="text-xs text-gray-400">Unassigned</p>
                          }
                          {task.deadline && (
                            <p className="text-xs text-gray-400">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                        {isOwner && (
                          <button
                            onClick={() => setAssigningTaskId(assigningTaskId === task.id ? null : task.id)}
                            className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                          >
                            {task.assignedTo ? 'Reassign' : 'Assign'}
                          </button>
                        )}
                        {isOwner && (
                          <button onClick={() => deleteTask(task.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {assigningTaskId === task.id && isOwner && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Assign to:</p>
                        <div className="flex flex-wrap gap-2">
                          {assignableMembers.map(m => (
                            <button
                              key={m.userId}
                              onClick={() => assignTask(task.id, m.userId)}
                              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                                task.assignedTo?.id === m.userId
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600'
                              }`}
                            >
                              {m.user?.name} <span className="opacity-60">({m.role})</span>
                            </button>
                          ))}
                          {task.assignedTo && (
                            <button
                              onClick={() => unassignTask(task.id)}
                              className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors font-medium"
                            >
                              Unassign
                            </button>
                          )}
                        </div>
                        {assignError && <p className="text-xs text-red-500 mt-2">{assignError}</p>}
                      </div>
                    )}
                  </div>
                );
              }) : (
                <p className="text-center py-10 text-gray-400 italic">No tasks yet. Click "+ New Task" to get started!</p>
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
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm text-sm">
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