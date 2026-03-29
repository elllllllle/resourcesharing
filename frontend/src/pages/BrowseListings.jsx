import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const categoryOptions = [
    'All Categories',
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

const BrowseListings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');

    useEffect(() => {
        const fetchResources = async () => {
        try {
            const response = await axiosInstance.get('/api/resources');
            setResources(response.data);
        } catch (error) {
            console.error('Failed to fetch resources:', error);
        }
        };
        fetchResources();
    }, []);

    const filtered = resources.filter((r) => {
        const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
        const matchCategory =
            selectedCategory === 'All Categories' || r.category === selectedCategory;
        return matchSearch && matchCategory;
    });

    return (
        <div className="min-h-screen bg-[#F4F4F4] py-6">
        <div className="container mx-auto px-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Find Resources</h1>
                {user && (
                    <button
                    onClick={() => navigate('/resources')}
                    className="bg-[#89D440] text-white px-6 py-2 rounded-full hover:bg-[#66BF0F]"
                    >
                    + Create Listing
                    </button>
                )}
            </div>

            {/* Search and Filter */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="What are you looking for?"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg bg-white"
                    >
                    {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Listings Grid */}
            {filtered.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">No listings found.</p>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((resource) => (
                    <div
                        key={resource._id}
                        onClick={() => navigate(`/resources/${resource._id}`)}
                        className="bg-white p-6 rounded-xl border border-[#E0E0E0] hover:shadow-lg transition cursor-pointer"
                    >
                        <span className="text-[#86C5FF] text-xs font-medium">
                        {resource.availabilityStatus}
                        </span>
                        <h2 className="text-lg font-semibold mt-1">{resource.title}</h2>
                        <p className="text-sm text-gray-500">{resource.category}</p>
                        <p className="mt-2 line-clamp-2">
                        {resource.description}
                        </p>
                        <div className="text-sm text-gray-500 flex gap-4 mt-3">
                        <span>👤 {resource.createdBy?.name || 'Unknown'}</span>
                        <span>📍 {resource.location}</span>
                        <span>🗓️ {resource.createdAt
                            ? new Date(resource.createdAt).toLocaleDateString('en-AU')
                            : '—'}
                        </span>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
        </div>
    );
};

export default BrowseListings;