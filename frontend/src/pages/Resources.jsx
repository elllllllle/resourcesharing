import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import ResourceForm from '../components/ResourceForm';
import ResourceList from '../components/ResourceList';

const Resources = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    if (!user) {
      setResources([]);
      return;
    }

    const fetchResources = async () => {
      try {
        const response = await axiosInstance.get('/api/resources');
        console.log('GET /api/resources response:', response.data);
        setResources(response.data);
      } catch (error) {
        console.error('GET resources failed:', error);
        alert('GET resources failed.');
      }
    };

    fetchResources();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Please log in to access resources.
        </h2>
        <p className="text-gray-600">
          Join ShareMate to share resources within your community.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-6">
      <div className="container mx-auto p-6">
        <ResourceForm
          resources={resources}
          setResources={setResources}
          editingResource={editingResource}
          setEditingResource={setEditingResource}
        />

        <ResourceList
          resources={resources}
          setResources={setResources}
          setEditingResource={setEditingResource}
        />
      </div>
    </div>
  );
};

export default Resources;
