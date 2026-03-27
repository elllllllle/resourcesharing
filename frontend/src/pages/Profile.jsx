import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Profile = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    mobile: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsFetching(true);
      try {
        const response = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setFormData({
          name: response.data.name,
          email: response.data.email,
          location: response.data.location || '',
          mobile: response.data.mobile || '',
          bio: response.data.bio || '',
        });
      } catch (error) {
        alert('Failed to fetch profile.');
      } finally {
        setIsFetching(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-10">
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-[#E0E0E0] mb-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>

          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />

          <input
            type="email"
            value={formData.email}
            readOnly
            className="w-full mb-4 p-2 border rounded bg-gray-100 cursor-not-allowed"
          />

          <input
            type="text"
            placeholder="Location (optional)"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Mobile Number (optional)"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />

          <textarea
            placeholder="Bio (optional)"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            rows="4"
          />

          <button
            type="submit"
            className="w-full bg-[#89D440] text-white px-4 py-2 rounded-full hover:bg-[#66BF0F]"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;