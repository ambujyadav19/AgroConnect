const mongoose = require('mongoose');
const { Blog, User,Farmer } = require('../connect/SchemaDb');
 // Adjust the path as necessary

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'firstName lastName').sort({date: -1});
        res.status(200).json(blogs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}; // Adjust the path as necessary

// Get a blog by id
const getBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findById(id).populate('author', 'firstName lastName');
        res.status(200).json(blog);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Create a blog (farmers and users can both write blogs)
const createBlog = async (req, res) => {
    const { title, description, author, authorType } = req.body;

    // Frontend sends 'Farmer' or 'User'; the User model is registered as 'UserS'
    const isUser = authorType === 'User';
    const authorModel = isUser ? 'UserS' : 'Farmer';
    const AuthorCollection = isUser ? User : Farmer;

    if (!title || !description || !author || !mongoose.Types.ObjectId.isValid(author)) {
        return res.status(400).json({ message: 'title, description and a valid author are required' });
    }

    const session = await mongoose.startSession();

    try {
        const authorExists = await AuthorCollection.exists({ _id: author });
        if (!authorExists) {
            session.endSession();
            return res.status(404).json({ message: `${isUser ? 'User' : 'Farmer'} not found` });
        }

        session.startTransaction();

        // Create and save the new blog
        const newBlog = new Blog({ title, description, author, authorModel });
        await newBlog.save({ session });

        // Only farmers keep a list of their blogs on their own document
        if (!isUser) {
            await Farmer.findByIdAndUpdate(
                author,
                { $push: { Blog: newBlog._id } },
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(newBlog);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(409).json({ message: error.message });
    }
};

// Update a blog 
const updateBlog = async (req, res) => {
    const { id } = req.params;
    const blog = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No blog with that id');
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
    res.json(updatedBlog);
};

// Delete a blog
const deleteBlog = async (req, res) => {
    const blogId = req.params.id;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Find and delete the blog
        const blog = await Blog.findByIdAndDelete(blogId, { session });

        if (!blog) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Update the Farmer collection to remove the reference to the deleted blog
        await Farmer.updateMany(
            { Blog: blogId },
            { $pull: { Blog: blogId } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'An error occurred', error });
    }
};

// Add like to blog
const addLike = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        const { userId, userType } = req.body;

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const alreadyLiked = blog.likedBy.some(
            (like) => like.userId.toString() === userId && like.userType === userType
        );

        if (alreadyLiked) {
            return res.status(400).json({ message: 'User has already liked this blog' });
        }

        blog.likes += 1;
        blog.likedBy.push({ userId, userType });
        await blog.save();
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add comment to blog
const addComment = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        const { userId, comment } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        blog.comments.push({ user: userId, comment });
        await blog.save();
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// get the blog by a farmer
const getBlogsByFarmer = async (req, res) => {
    try {
      const { id } = req.params;
      const blogs = await Blog.find({ author: id });
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching blogs by farmer ID', error });
    }
};

module.exports = {
    deleteBlog,
    updateBlog,
    createBlog,
    getBlog,
    getBlogs,
    addLike,
    addComment,
    getBlogsByFarmer,
};