import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('listings');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/browse');
      return;
    }
    fetchListings();
    fetchUsers();
  }, [user]);

  const fetchListings = async () => {
    try {
      const response = await axiosInstance.get('/api/resources');
      setListings(response.data);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/users', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await axiosInstance.delete(`/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setListings(listings.filter((l) => l._id !== id));
    } catch (error) {
      alert('Failed to delete listing.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-6">
      <div className="container mx-auto px-6">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-6 py-2 rounded-full font-medium ${
              activeTab === 'listings'
                ? 'bg-[#89D440] text-white'
                : 'bg-white border border-gray-300 text-gray-600'
            }`}
          >
            Manage Listings
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-full font-medium ${
              activeTab === 'users'
                ? 'bg-[#89D440] text-white'
                : 'bg-white border border-gray-300 text-gray-600'
            }`}
          >
            Manage Users
          </button>
        </div>

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Owner</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{listing.title}</td>
                    <td className="px-4 py-3">{listing.category}</td>
                    <td className="px-4 py-3">{listing.createdBy?.name || 'Unknown'}</td>
                    <td className="px-4 py-3">{listing.availabilityStatus}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteListing(listing._id)}
                        className="bg-[#F54949] text-white px-3 py-1 rounded-full text-xs hover:bg-[#D84040]"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;