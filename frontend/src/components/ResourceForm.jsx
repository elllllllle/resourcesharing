import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

// categories
const categoryOptions = [
  'Tools & Equipment',
  'Home & Furniture',
  'Electronics',
  'Sports & Outdoor',
  'Kitchen & Cooking',
  'Event & Party Supplies',
  'Books & Learning',
  'Baby & Kids Items',
  'Miscellaneous',
];

const initialFormData = {
    title: '',
    category: '',
    description: '',
    location: '',
};

const ResourceForm = ({ resources, setResources, editingResource, setEditingResource }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingResource) {
      setFormData({
        title: editingResource.title || '',
        category: editingResource.category || '',
        description: editingResource.description || '',
        location: editingResource.location || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [editingResource]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const cleanedFormData = {
      title: formData.title.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
    };

    try {
      if (editingResource) {
        const response = await axiosInstance.put(
          `/api/resources/${editingResource._id}`,
          cleanedFormData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        setResources(
          resources.map((resource) =>
            resource._id === response.data._id ? response.data : resource
          )
        );
      } else {
        const response = await axiosInstance.post('/api/resources', cleanedFormData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setResources([...resources, response.data]);
      }

      setEditingResource(null);
      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
        console.error('Failed to save resource:', error.response?.data || error.message);

        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          alert('Failed to save resource.');
        }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-[#E0E0E0] mb-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingResource ? 'Edit Resource Listing' : 'Create Resource Listing'}
      </h1>

      <div className="mb-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div className="mb-4">
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full p-2 border rounded bg-white ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          } ${formData.category === '' ? '!text-gray-400' : '!text-black'}`}
        >
          <option value="" disabled hidden>
            Select a category
          </option>
          {categoryOptions.map((option) => (
            <option key={option} value={option} className="text-black">
              {option}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
        )}
      </div>

      <div className="mb-4">
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className={`w-full p-2 border rounded ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="mb-4">
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${
            errors.location ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-[#89D440] text-white p-2 rounded-full hover:bg-[#66BF0F]"
      >
        {editingResource ? 'Update Resource' : 'Create Resource'}
      </button>
    </form>
  );
};

export default ResourceForm;