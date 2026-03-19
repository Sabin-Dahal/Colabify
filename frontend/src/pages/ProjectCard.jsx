const ProjectCard = ({ project }) => {
  const myRole = project.members[0]?.role;

  const isOwner = myRole === 'OWNER';
  const canEdit = myRole === 'OWNER' || myRole === 'COLLABORATOR';

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase font-bold">
          {myRole}
        </span>
      </div>
      
      <p className="text-sm text-gray-400 mt-1">
        Tasks: {project._count?.tasks || 0}
      </p>

      <div className="flex gap-3 mt-6">
        {isOwner && (
          <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Add Member">
            <span className="text-xs font-bold">Add +</span>
          </button>
        )}

        {canEdit && (
          <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="New Task">
            <span className="text-xs font-bold">Task +</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;