import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ResourceList = ({ resources, setResources, setEditingResource }) => {
  const { user } = useAuth();

  const handleDelete = async (resourceId) => {
    try {
      await axiosInstance.delete(`/api/resources/${resourceId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setResources(resources.filter((resource) => resource._id !== resourceId));
    } catch (error) {
      console.error('Failed to delete resource:', error.response?.data || error.message);
      alert('Failed to delete resource.');
    }
  };

  const isOwner = (resource) => {
    if (!user || !resource.createdBy) return false;

    const createdById =
      typeof resource.createdBy === 'object'
        ? resource.createdBy._id || resource.createdBy.id
        : resource.createdBy;

    const userId = user._id || user.id;

    return String(createdById) === String(userId);
  };

  const getCreatorName = (resource) => {
  if (!resource.createdBy) return 'Unknown user';

  if (typeof resource.createdBy === 'object') {
    return resource.createdBy.name || 'Unknown user';
  }

  return 'Unknown user';
  };

  return (
    <div>
      {resources.length === 0 ? (
        <p className="text-gray-500">No resources available.</p>
      ) : (
        resources.map((resource) => (
          <div key={resource._id} className="bg-white p-5 mb-4 rounded-xl border border-[#E0E0E0] hover:shadow-lg transition">
            <div className="flex justify-between items-start">

              <div>
                <p>
                  <span className="text-[#86C5FF] text-xs rounded-full font-medium">
                    {resource.availabilityStatus}
                  </span>
                </p>
                <h2 className="text-xl font-semibold text-grey-800">{resource.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{resource.category}</p>
                <p className="text-gray-700 mb-2">{resource.description}</p>
                <div className="text-sm text-gray-500 flex gap-4">
                  <span>👤 {resource.createdBy?.name || 'Unknown user'}</span>
                  <span>📍 {resource.location}</span>
                </div>
              </div>

              {isOwner(resource) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingResource(resource)}
                    className="mr-2 bg-[#89D440] text-white px-4 py-2 rounded-full hover:bg-[#66BF0F]"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(resource._id)}
                    className="bg-[#F54949] text-white px-4 py-2 rounded-full hover:bg-[#D84040]"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ResourceList;
