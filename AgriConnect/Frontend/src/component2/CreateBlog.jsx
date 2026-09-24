import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const CreateBlog = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Farmers and users can both write blogs
        const farmerId = localStorage.getItem('FarmerId');
        const userId = localStorage.getItem('UserId');
        const authorId = farmerId || userId;
        const authorType = farmerId ? 'Farmer' : 'User';
        if (!authorId) {
            alert('Please log in to create a blog');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/blogs`, {
                title,
                description,
                author: authorId,
                authorType
            });
            console.log('Blog created:', response.data);
            setTitle('');
            setDescription('');
            navigate('/blogsList');
        } catch (error) {
            console.error('Error creating blog:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
                <div className="mb-4">
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    ></textarea>
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Blog</button>
            </form>
        </div>
    );
};

export default CreateBlog;