const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://irshadhussain7881:h%40sh@cluster017.pih9e1e.mongodb.net/AgriConnect');

// Farmer Schema

const Farmers = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: String,
    lastName: String,
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FarmerOrder'
    }],
    expenditure: Number,
    income: Number,
    profit: Number,
    loss: Number,
    farmName: { type: String },
    farmLocation: { type: String },
});

// Broker Schema
const BrokerSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: String,
    lastName: String,
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BrokerOrder'
    }],
    companyName: { type: String },
    companyLocation: { type: String },
    phoneNumber: Number,
});

// Admin Schema
const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: String,
    lastName: String,
});

// Blog Schema
const blogSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin', 
        required: true 
    },
    Likes: Number,
    Dislikes: Number,
});

// Product Schema
const ProductSchema = new mongoose.Schema({
    title: String,
    Rate: String,
    Broker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Broker'
    }
});

// FarmerOrder Schema
const FarmerOrderSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending',
    }
});

// BrokerOrder Schema
const BrokerOrderSchema = new mongoose.Schema({
    broker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Broker',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending',
    }
});

// Model Definitions
const Farmer = mongoose.model('Farmer', Farmers);
const Broker = mongoose.model('Broker', BrokerSchema);
const Admin = mongoose.model('Admin', AdminSchema);
const Blog = mongoose.model('Blog', blogSchema);
const Product = mongoose.model('Product', ProductSchema);
const FarmerOrder = mongoose.model('FarmerOrder', FarmerOrderSchema);
const BrokerOrder = mongoose.model('BrokerOrder', BrokerOrderSchema);

module.exports = {
    Farmer,
    Broker,
    Blog,
    Product,
    Admin,
    FarmerOrder,
    BrokerOrder
};
