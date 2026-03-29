import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await axiosInstance.get(`/api/resources/${id}`);
        setResource(response.data);
      } catch (error) {
        console.error('Failed to fetch resource:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  const isOwner = () => {
    if (!user || !resource?.createdBy) return false;
    const createdById =
      typeof resource.createdBy === 'object'
        ? resource.createdBy._id || resource.createdBy.id
        : resource.createdBy;
    return String(createdById) === String(user._id || user.id);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await axiosInstance.delete(`/api/resources/${resource._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate('/browse');
    } catch (error) {
      alert('Failed to delete listing.');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!resource) return <p className="text-center mt-10">Listing not found.</p>;

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-6">
      <div className="container mx-auto px-6 max-w-2xl">

        {/* Back button */}
        <button
          onClick={() => navigate('/browse')}
          className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
        >
          ← Back to listings
        </button>

        <div className="bg-white p-6 rounded-xl border border-[#E0E0E0]">
          <span className="text-[#86C5FF] text-xs font-medium">
            {resource.availabilityStatus}
          </span>
          <h1 className="text-2xl font-bold mt-1 mb-1">{resource.title}</h1>
          <p className="text-sm text-gray-500 mb-4">{resource.category}</p>
          <p className="mb-6">{resource.description}</p>

          <div className="text-sm text-gray-500 flex gap-6 mb-6">
            <span>👤 {resource.createdBy?.name || 'Unknown'}</span>
            <span>📍 {resource.location}</span>
            <span>🗓️ {resource.createdAt
                ? new Date(resource.createdAt).toLocaleDateString('en-AU')
                : '—'}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ListingDetail;