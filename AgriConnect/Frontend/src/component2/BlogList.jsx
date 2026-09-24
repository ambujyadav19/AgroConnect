import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faArrowLeft, faArrowRight, faHeart, faBlog, faPen } from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { API_BASE_URL } from '../config';

const BlogList = () => {
    // Both farmers and users can write blogs, so check either login
    const isLoggedIn = Boolean(localStorage.getItem('FarmerId') || localStorage.getItem('UserId'));
    const [blogs, setBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const blogsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/blogs`)
            .then(response => {
                setBlogs(response.data);
                setFilteredBlogs(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching blogs:', error);
                setLoading(false);
            });
    }, []);

    const handleBlogClick = (id) => {
        navigate(`/blogs/${id}`);
    };

    const handleCreateBlog = () => {
        navigate('/create');
    };

    const debouncedSearch = useCallback(
        debounce((query) => {
            const lowerCaseQuery = query.toLowerCase();
            const filtered = blogs.filter(blog => 
                blog.title.toLowerCase().includes(lowerCaseQuery) ||
                (blog.author && `${blog.author.firstName} ${blog.author.lastName}`.toLowerCase().includes(lowerCaseQuery))
            );
            setFilteredBlogs(filtered);
            setCurrentPage(1); // Reset to first page on search
        }, 300),
        [blogs]
    );

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
    const startIndex = (currentPage - 1) * blogsPerPage;
    const currentBlogs = filteredBlogs.slice(startIndex, startIndex + blogsPerPage);

    return (
        <div className="bg-green-50 min-h-screen py-16">
            <section className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center mb-10">
                    <FontAwesomeIcon icon={faBlog} className="text-6xl text-green-700 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold text-gray-800">Blogs & Reactions</h1>
                    <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
                        Farmers and users can share their experiences and insights through blogs, and everyone can read and react to them.
                    </p>
                </div>

                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="w-full md:w-2/3">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search by title or author"
                            className="w-full p-4 border border-green-200 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                        />
                    </div>

                    {isLoggedIn && (
                        <button
                            onClick={handleCreateBlog}
                            className="bg-green-700 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-800 transition-colors font-semibold"
                        >
                            <FontAwesomeIcon icon={faPen} className="mr-2" />
                            Create Blog
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {loading ? (
                        Array.from({ length: blogsPerPage }).map((_, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-md border border-green-100">
                                <Skeleton height={40} width={40} circle={true} className="mb-4" />
                                <Skeleton height={20} width={`60%`} className="mb-2" />
                                <Skeleton height={20} width={`80%`} className="mb-2" />
                                <Skeleton height={20} width={`90%`} className="mb-4" />
                                <Skeleton height={20} width={`30%`} />
                            </div>
                        ))
                    ) : (
                        currentBlogs.map(blog => (
                            <article
                                key={blog._id}
                                className="group bg-white p-6 rounded-2xl shadow-md border border-green-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                                onClick={() => handleBlogClick(blog._id)}
                            >
                                <div className="flex items-center mb-5">
                                    {blog.author?.profilePicture ? (
                                        <img
                                            src={blog.author.profilePicture}
                                            alt={`${blog.author.firstName} ${blog.author.lastName}`}
                                            className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-green-100"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full mr-4 bg-green-100 flex items-center justify-center text-green-700">
                                            <FontAwesomeIcon icon={faUser} className="text-lg" />
                                        </div>
                                    )}
                                    <div>
                                        {blog.author ? (
                                            <p className="text-sm font-medium text-gray-500">By {blog.author.firstName} {blog.author.lastName}</p>
                                        ) : (
                                            <p className="text-sm font-medium text-gray-500">By Unknown Author</p>
                                        )}
                                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            {blog.authorModel === 'UserS' ? 'User' : 'Farmer'}
                                        </span>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-semibold text-gray-800 mb-3 group-hover:text-green-700 transition-colors">
                                    {blog.title}
                                </h2>
                                <p className="text-gray-600 mb-5 leading-relaxed">
                                    {blog.description.substring(0, 140)}...
                                </p>

                                <div className="flex items-center justify-between border-t border-green-100 pt-4">
                                    <div className="flex items-center text-gray-600">
                                        <FontAwesomeIcon icon={faHeart} className="text-red-500 mr-2" />
                                        <span className="font-medium">{blog.likes}</span>
                                    </div>
                                    <span className="text-green-700 font-semibold">Read more</span>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                <div className="flex justify-center mt-10">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 mx-1 rounded-full ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-700 text-white hover:bg-green-800'}`}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 mx-1 rounded-full ${currentPage === index + 1 ? 'bg-green-700 text-white' : 'bg-white text-gray-700 hover:bg-green-100 border border-green-200'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 mx-1 rounded-full ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-700 text-white hover:bg-green-800'}`}
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default BlogList;