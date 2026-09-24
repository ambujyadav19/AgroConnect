import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import { API_BASE_URL } from '../config';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const navigate = useNavigate();

  // Farmers and users can both manage their own blogs
  const farmerId = localStorage.getItem('FarmerId') || localStorage.getItem('UserId');

  useEffect(() => {
    if (farmerId) {
      axios.get(`${API_BASE_URL}/blogs/farmer/${farmerId}`)
        .then(response => {
          setBlogs(response.data);
          setFilteredBlogs(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching blogs:', error);
          setLoading(false);
        });
    } else {
      console.error('No FarmerId or UserId found in local storage');
      setLoading(false);
    }
  }, [farmerId]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = blogs.filter(blog => 
        blog.title.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredBlogs(filtered);
    }, 300),
    [blogs]
  );

  const handleUpdate = (id) => {
    navigate(`/update/${id}`);
  };

  const handleDelete = (blog) => {
    setBlogToDelete(blog);
    setModalIsOpen(true);
  };

  const confirmDelete = () => {
    if (blogToDelete) {
      axios.delete(`${API_BASE_URL}/blogs/${blogToDelete._id}`)
        .then(() => {
          setBlogs(blogs.filter(blog => blog._id !== blogToDelete._id));
          setFilteredBlogs(filteredBlogs.filter(blog => blog._id !== blogToDelete._id));
          setModalIsOpen(false);
          setBlogToDelete(null);
        })
        .catch(error => {
          console.error('Error deleting blog:', error);
          setModalIsOpen(false);
          setBlogToDelete(null);
        });
    }
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      borderRadius: '10px',
      width: '400px',
      textAlign: 'center'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Blog Manager</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by title"
        className="w-full p-3 mb-8 border rounded-lg"
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBlogs.map(blog => (
            <div key={blog._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <span>{blog.title}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdate(blog._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDelete(blog)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Confirm Delete"
        style={customStyles}
      >
        <h2 className="text-2xl mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this blog?</p>
        <div className="flex justify-end space-x-4 mt-4">
          <button onClick={() => setModalIsOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
            Cancel
          </button>
          <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BlogManager;