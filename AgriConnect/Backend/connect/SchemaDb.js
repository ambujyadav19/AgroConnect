const mongoose = require('mongoose');
const { string } = require('zod');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err.message));

// // Farmer Schema
const Farmers = new mongoose.Schema({
    youAre: {
        type: String,
        required: true
    },
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
    total_expenditure: Number,
    total_income: Number,
    total_profit: Number,
    total_loss: Number,
    farmName: { type: String },
    Blog: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
    }],
    farmLocation: [{
        pincode: {
            type: Number,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    }],
    productSell: [{
        farmerId: String,
        title: String,
        description: String,
        category: {
            type: String,
            enum: ['vegetables', 'fruits', 'grains', 'dairy', 'spices', 'oilseeds', 'organic', 'other'],
            default: 'other'
        },
        rate: String,
        imageURL: String,  //store image URL
        quantity: {
            type: Number
        },
        buyRequests: [{
            type: String
        }],
        farmLocation: [{
            pincode: {
                type: Number,
                required: true
            },
            district: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            }
        }],
        productAddDate: {
            type: Date,
            default: Date.now,
        }
        // rating: String
    }],
    order: [{
            farmerId: {
                type: String,
                required: true
            },
            buyerId: {
                type: String,
                required: true
            },
            userOrder:{
                type: String
            },
            title: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            orderDate: {
                type: Date,
                default: Date.now,
            },
            status: {
                type: String,
                default: 'Pending',
            },
            buyRequests: [{
                type: String
            }]
    }],
});

// Blog Schema
// Blog Schema
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // A blog can be written by a Farmer or a User. `authorModel` tells Mongoose
    // which collection `author` points to (model names: 'Farmer' / 'UserS').
    // Older blogs have no authorModel and fall back to 'Farmer'.
    author: {  
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'authorModel',
        required: true,
    },
    authorModel: {
        type: String,
        enum: ['Farmer', 'UserS'],
        default: 'Farmer',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: Number,
        default: 0,
    },
    likedBy: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                refPath: 'likedBy.userType'
            },
            userType: {
                type: String,
                required: true,
                enum: ['User', 'Farmer']
            }
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            comment: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});


const user = new mongoose.Schema({
    youAre: {
        type: String,
        required: true
    },
    farmerOrder:{
        type: String,
        // required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    phoneNumber: {
        type: String,
        required: true
    },
    address: [{
        pincode: {
            type: Number,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    }],
    myOrder: [{
            farmerId: {
                type: String,
                required: true
            },
            buyerId: {
                type: String,
                required: true
            },
            userOrder: {
                type: String,
                // required: true
            },
            title: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            orderDate: {
                type: Date,
                default: Date.now,
            },
            farmLocation: [{
                pincode: {
                    type: Number,
                    required: true
                },
                district: {
                    type: String,
                    required: true
                },
                state: {
                    type: String,
                    required: true
                }
            }],
            status: {
                type: String,
                default: 'Pending',
            },
            requestSends: [{
                type: String
            }],
    }],
})
// Admin Schema---
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
// Model Definitions
const Farmer = mongoose.model('Farmer', Farmers);
const User = mongoose.model('UserS',user)
const Admin = mongoose.model('Admin', AdminSchema);
const Blog = mongoose.model('Blog',blogSchema);

module.exports = {
    Farmer,
    User,
    Admin,
    Blog
};
