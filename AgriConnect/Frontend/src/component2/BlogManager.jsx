import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import { API_BASE_URL } from '../config';

const BlogManager = () => {
  const [blogs, setBlogs]               = useState([]);
  const [searchQuery, setSearchQuery]   = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [modalIsOpen, setModalIsOpen]   = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const navigate = useNavigate();

  const farmerId = localStorage.getItem('FarmerId') || localStorage.getItem('UserId');

  useEffect(() => {
    if (farmerId) {
      axios.get(`${API_BASE_URL}/blogs/farmer/${farmerId}`)
        .then(res => { setBlogs(res.data); setFilteredBlogs(res.data); setLoading(false); })
        .catch(err => { console.error('Error fetching blogs:', err); setLoading(false); });
    } else {
      console.error('No FarmerId or UserId found in local storage');
      setLoading(false);
    }
  }, [farmerId]);

  const debouncedSearch = useCallback(
    debounce((query) => {
      const lc = query.toLowerCase();
      setFilteredBlogs(blogs.filter(b => b.title.toLowerCase().includes(lc)));
    }, 300),
    [blogs]
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleUpdate = (id) => navigate(`/update/${id}`);

  const handleDelete = (blog) => { setBlogToDelete(blog); setModalIsOpen(true); };

  const confirmDelete = () => {
    if (blogToDelete) {
      axios.delete(`${API_BASE_URL}/blogs/${blogToDelete._id}`)
        .then(() => {
          setBlogs(blogs.filter(b => b._id !== blogToDelete._id));
          setFilteredBlogs(filteredBlogs.filter(b => b._id !== blogToDelete._id));
          setModalIsOpen(false); setBlogToDelete(null);
        })
        .catch(err => { console.error('Error deleting blog:', err); setModalIsOpen(false); setBlogToDelete(null); });
    }
  };

  const modalStyles = {
    content: { top:'50%', left:'50%', right:'auto', bottom:'auto', marginRight:'-50%', transform:'translate(-50%,-50%)', padding:'0', borderRadius:'20px', width:'420px', border:'none' },
    overlay: { backgroundColor:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', zIndex:1000 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Content Management
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            My{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent">
              Blogs
            </span>
          </h1>
          <p className="text-gray-500 mt-3 text-lg">Manage, edit, or delete your published blog posts.</p>
        </div>

        {/* ── Search + Create ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by blog title..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-emerald-100 rounded-xl shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={() => navigate('/create')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-lime-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:scale-105 hover:shadow-emerald-300 transition-all duration-200 whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faPlus} className="text-sm" />
            New Blog
          </button>
        </div>

        {/* ── Blog List ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
            <p className="text-gray-400 text-sm">Loading your blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[20px] border border-dashed border-emerald-200 shadow-sm">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-500 font-medium">No blogs found.</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchQuery ? 'Try a different search term.' : 'Start writing your first blog post!'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredBlogs.map((blog, i) => (
              <div
                key={blog._id}
                className="group bg-white rounded-[18px] border border-emerald-100 shadow-md hover:shadow-xl transition-all duration-300 p-5 flex items-center justify-between gap-4"
              >
                {/* Blog info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center text-white shadow-md flex-shrink-0">
                    <FontAwesomeIcon icon={faPen} className="text-sm" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate group-hover:text-emerald-700 transition-colors">
                      {blog.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {blog.date ? new Date(blog.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : 'Draft'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleUpdate(blog._id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-xl transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faEdit} className="text-xs" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-sm font-semibold rounded-xl transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-xs" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Delete Confirm Modal ── */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Confirm Delete" style={modalStyles}>
        <div className="p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faTrash} className="text-red-500 text-xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Blog?</h2>
          <p className="text-gray-500 text-sm mb-6">
            "<span className="font-medium text-gray-700">{blogToDelete?.title}</span>" will be permanently deleted.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setModalIsOpen(false)}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold rounded-xl shadow-md transition-all"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BlogManager;