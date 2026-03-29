import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ResourceList = ({ resources, setResources, setEditingResource }) => {
  const { user } = useAuth();

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
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

  if (resources.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-10">
        You have no listings yet. Create one above!
      </p>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">My Listings</h2>
      <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource._id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-bold">{resource.title}</td>
                <td className="px-4 py-3">{resource.category}</td>
                <td className="px-4 py-3">{resource.location}</td>
                <td className="px-4 py-3">
                  <span className="text-[#86C5FF]">
                    {resource.availabilityStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingResource(resource)}
                      className="px-3 py-1 rounded-full hover:bg-[#F4F4F4]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(resource._id)}
                      className="text-[#F54949] px-3 py-1 rounded-full hover:bg-[#F4F4F4]"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceList;