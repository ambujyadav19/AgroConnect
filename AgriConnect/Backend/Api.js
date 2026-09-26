require('dotenv').config()
const express = require('express')
const cors = require('cors')
const body_parser = require('body-parser')
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { UserAuth } = require('./middleWare/UserAuth')
const { Farmer, Product, User, Blog } = require('./connect/SchemaDb');
const { default: mongoose } = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const { GoogleGenAI } = require('@google/genai');

const app = express()
app.use(express.json())
app.use(body_parser.json())
app.use(cors())

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const FALLBACK_MODELS = [
    'gemini-3.8-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite'
];

const seedMarketplaceBlogs = async () => {
    try {
        const existingCount = await Blog.countDocuments();
        if (existingCount > 0) {
            return;
        }

        let farmers = await Farmer.find().limit(3);
        if (!farmers.length) {
            const fallbackFarmer = new Farmer({
                youAre: 'Farmer',
                email: 'marketplace.seed@example.com',
                password: 'seedpass123',
                firstName: 'AgriConnect',
                lastName: 'Market',
                farmName: 'Marketplace Seed Farm',
                farmLocation: [{ pincode: 110001, district: 'New Delhi', state: 'Delhi' }],
            });
            await fallbackFarmer.save();
            farmers = [fallbackFarmer];
        }

        const marketplaceBlogs = [
            {
                title: 'Fresh Tomatoes and Green Peppers Are in Season',
                description: 'Local farmers are harvesting premium tomatoes and green peppers this week. These vegetables are ideal for kitchens seeking fresh, colorful produce with excellent taste and nutrition. Buyers can compare pricing and choose the best quality from trusted sellers in the marketplace.',
                likes: 18,
            },
            {
                title: 'Organic Mangoes and Bananas Selling Fast',
                description: 'Our marketplace is seeing strong demand for organic mangoes and bananas. These fruits are ripened naturally, packed carefully, and sourced directly from nearby farms to ensure freshness and a better price for consumers.',
                likes: 22,
            },
            {
                title: 'Rice, Wheat, and Millet Supplies for Households',
                description: 'Farmers are listing quality grains such as rice, wheat, and millet in the marketplace. These staples remain popular for households and small businesses looking for reliable, locally sourced food products at fair prices.',
                likes: 16,
            },
            {
                title: 'Best Dairy Products from Trusted Farm Suppliers',
                description: 'Milk, curd, and other dairy essentials are now available through the marketplace. Short supply chains help customers get fresh products quickly while supporting local dairy farmers and better farm income.',
                likes: 20,
            },
        ];

        for (let index = 0; index < marketplaceBlogs.length; index++) {
            const blogData = marketplaceBlogs[index];
            const farmer = farmers[index % farmers.length];
            const blog = new Blog({
                title: blogData.title,
                description: blogData.description,
                author: farmer._id,
                likes: blogData.likes,
                likedBy: [],
                comments: [],
            });

            await blog.save();
            await Farmer.findByIdAndUpdate(farmer._id, { $push: { Blog: blog._id } });
        }

        console.log('Marketplace blog seeds created successfully');
    } catch (error) {
        console.error('Error seeding marketplace blogs:', error.message);
    }
};

const extractGeminiText = (result) => {
    if (!result) return '';
    if (typeof result?.text === 'string' && result.text.trim()) return result.text;
    if (typeof result?.output_text === 'string' && result.output_text.trim()) return result.output_text;

    const candidateText = result?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text || '')
        .join('');

    if (candidateText && candidateText.trim()) return candidateText;

    if (Array.isArray(result?.output)) {
        return result.output
            .map((item) => item?.content || '')
            .join('');
    }

    if (Array.isArray(result?.candidates)) {
        const nestedText = result.candidates
            .map((candidate) => candidate?.content?.parts?.map((part) => part?.text || '').join(''))
            .join('');

        if (nestedText.trim()) return nestedText;
    }

    return '';
};

app.use('/blogs', blogRoutes);

app.get('/', async (req, res) => {
    res.json({ msg: "from back of agro" });
})
app.post('/api/chatbot', async (req, res) => {
    try {
        const { message, language = 'English' } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY is missing in the backend environment variables.' });
        }

        const prompt = `You are AgroHelp, a highly knowledgeable and supportive agricultural assistant. You MUST provide your entire response in the "${language}" language. Ensure the response, advice, recommendations, and explanations are naturally and fluently written in ${language}. Provide clear and practical steps on crops, soil preparation, pest management, irrigation, fertilizers, weather protection, or mandi trade. User question: ${message}`;

        let lastError = null;
        for (const modelName of FALLBACK_MODELS) {
            try {
                const response = await Promise.race([
                    ai.models.generateContent({
                        model: modelName,
                        contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    }),
                    new Promise((_, reject) => setTimeout(() => reject(new Error(`Model ${modelName} timed out`)), 18000))
                ]);

                const reply = extractGeminiText(response);
                if (reply && reply.trim()) {
                    return res.json({ reply: reply.trim() });
                }
            } catch (error) {
                lastError = error;
                const errString = error?.message || String(error);
                console.warn(`Gemini model ${modelName} attempt failed:`, errString.substring(0, 120));
                
                // If it's a 503 high demand or 429 quota error, brief pause before trying next fallback model
                if (errString.includes('503') || errString.includes('429') || errString.includes('high demand')) {
                    await new Promise((r) => setTimeout(r, 400));
                }
            }
        }

        // Resilient fallback if Google's servers have a temporary outage across models
        console.error('All Gemini fallback models exhausted, returning field advisory');
        const fallbackAdvisory = `*Note: Live AI service is temporarily experiencing high demand. Here is essential farming guidance for your query:*\n\n` +
            `• **Soil & Nutrients**: Always verify local soil test reports before heavy chemical application. Maintain balanced NPK and organic matter (compost/FYM).\n` +
            `• **Water Management**: Irrigate in early mornings or evenings to minimize evaporation loss. Inspect drainage to prevent waterlogging.\n` +
            `• **Pest & Disease Care**: Scout fields regularly. Use neem oil or integrated pest management (IPM) before applying targeted pesticides.\n` +
            `• **Market & Weather**: Check the AgriConnect Weather section for local spray windows and rainfall forecast.\n\n` +
            `*Please try asking your specific question again in a moment.*`;

        return res.json({ 
            reply: fallbackAdvisory, 
            isFallback: true 
        });
    } catch (error) {
        console.error('Gemini route unexpected error:', error);
        return res.status(500).json({
            error: 'AI service temporarily unavailable. Please try again in a few moments.',
        });
    }
});

app.post('/sign', async (req, resp, next) => {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            farmName,
            expenditure,
            income,
            profit,
            loss,
            farmLocation,
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Farmer.findOne({ email });
        if (user) {
            resp.status(400).json({ error: 'Username already exists' });
            return;
        }
        const newUser = new Farmer({
            youAre: "Farmer",
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            farmName: farmName,
            // orderHistory: ,
            expenditure: expenditure,
            income: income,
            profit: profit,
            loss: loss,
            farmLocation: farmLocation
        });
        await newUser.save();
        const token = jwt.sign({ farmerId: newUser._id }, JWT_SECRET);
        resp.json({
            message: 'User registered successfully',
            token: token,
            farmerId: newUser._id
        });
    } catch (err) {
        resp.status(500).json({ error: 'Failed to register user', err });
        console.log(err);
    }
})
//USER-SIGNUP-----
app.post('/signUpUSER', async (req, resp, next) => {
    try {
        const {
            username,
            password,
            firstName,
            lastName,
            phoneNumber,
            address
        } = req.body;
        // console.log(address)

        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword)
        const user = await User.findOne({ email: username });
        if (user) {
            resp.status(400).json({ error: 'Username already exists' });
            // alert("Email already Exists!")
            console.log("User Already present")
            return;
        }
        // console.log(user)
        const newUser = new User({
            youAre: "Customer",
            email: username,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            address: address
        });
        // console.log(newUser)
        await newUser.save();
        const token = jwt.sign({ UserId: newUser._id }, JWT_SECRET);
        // console.log(newUser._id)
        resp.json({
            message: 'User registered successfully',
            token: token,
            UserId: newUser._id
        });
    } catch (err) {
        resp.status(500).json({ error: 'Failed to register user', err });
        console.log(err);
    }
})

// KISAN SEVA KENDRA / SUPPLIER SIGNUP
app.post('/signSupplier', async (req, resp) => {
    try {
        const {
            email,
            password,
            kendraName,
            ownerName,
            phoneNumber,
            supplierType,
            licenseNumber,
            pincode,
            district,
            state
        } = req.body;

        if (!email || !password || !kendraName) {
            return resp.status(400).json({ error: 'Kendra Name, Email, and Password are required.' });
        }

        const existingFarmer = await Farmer.findOne({ email });
        const existingUser = await User.findOne({ email });
        if (existingFarmer || existingUser) {
            return resp.status(400).json({ error: 'An account with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newSupplier = new Farmer({
            youAre: "Supplier",
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            firstName: ownerName || kendraName,
            farmName: kendraName,
            supplierType: supplierType || 'Kisan Seva Kendra',
            licenseNumber: licenseNumber || '',
            phoneNumber: phoneNumber || '',
            total_expenditure: 0,
            total_income: 0,
            total_profit: 0,
            total_loss: 0,
            farmLocation: [{
                pincode: Number(pincode) || 110001,
                district: district || 'Central',
                state: state || 'Delhi'
            }]
        });

        await newSupplier.save();
        const token = jwt.sign({ email: newSupplier.email, userId: newSupplier._id, role: 'Supplier' }, JWT_SECRET, { expiresIn: '7d' });
        
        return resp.json({
            message: 'Kisan Seva Kendra registered successfully',
            token: token,
            farmerId: newSupplier._id,
            userId: newSupplier._id,
            role: 'Supplier',
            kendraName: newSupplier.farmName,
            firstName: newSupplier.firstName
        });
    } catch (err) {
        console.error("Supplier registration error:", err);
        return resp.status(500).json({ error: 'Failed to register Kisan Seva Kendra', details: err.message });
    }
});

// KISAN SEVA KENDRA / SUPPLIER LOGIN
app.post('/loginSupplier', async (req, resp) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return resp.status(400).json({ error: "Email and password are required" });
        }

        const user = await Farmer.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            return resp.status(400).json({ error: 'No Kendra or Supplier found with this email' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return resp.status(400).json({ error: 'Invalid email or password' });
        }

        const role = user.youAre || 'Supplier';
        const token = jwt.sign({ email: user.email, userId: user._id, role }, JWT_SECRET, { expiresIn: '7d' });
        return resp.json({
            message: 'Login successful',
            token,
            userId: user._id,
            farmerId: user._id,
            role,
            kendraName: user.farmName || user.firstName,
            firstName: user.firstName
        });
    } catch (err) {
        console.error("Error during supplier login", err);
        return resp.status(500).json({
            error: "Error occurred during supplier login",
            details: err.message,
        });
    }
});

app.post('/login', async (req, resp) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return resp.status(400).json({ msg: "Email and password are required" });
        }

        const user = await Farmer.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            return resp.status(400).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            const role = user.youAre || 'Farmer';
            const token = jwt.sign({ email: user.email, userId: user._id, role }, JWT_SECRET, { expiresIn: '7d' });
            return resp.json({ 
                message: 'Login successful', 
                token, 
                role, 
                userId: user._id, 
                farmerId: user._id, 
                farmName: user.farmName,
                firstName: user.firstName 
            });
        } else {
            return resp.status(400).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error("Error during login", err);
        return resp.status(500).json({
            msg: "Error occurred",
            error: err.message,
        });
    }
});
//USER-LOGIN
app.post('/loginUSER', async (req, resp) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return resp.status(400).json({ msg: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return resp.status(400).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            const token = jwt.sign({ email, userId: user._id }, JWT_SECRET, { expiresIn: '1h' }); // Token with 1-hour expiration
            return resp.json({ message: 'Login successful', token });
        } else {
            return resp.status(400).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error("Error during login", err);
        return resp.status(500).json({
            msg: "Error occurred",
            error: err.message,
        });
    }
});
// market_place ALL_PRODUCTS ARRAY AND ALL_FARMER 
app.get('/market_product', async (req, resp) => {
    try {
        const farm = await Farmer.find()
        const product = await Farmer.find({}, 'productSell')
        // console.log("ProducT: ",product)
        const products = product.flatMap(farmer => farmer.productSell);

        if (!products) {
            resp.status(404).json({
                msg: "No products found"
            })
        }
        if (!farm) {
            resp.status(404).json({
                msg: "No Farmer found"
            })
        }
        // console.log("Products: ",products)
        // console.log("Farmer detail: ",farm)
        if (product && farm) {
            resp.status(200).json({
                farmerData: farm,
                data: products,
                msg: "Successfully Fetched"
            })
        }
    } catch (err) {
        console.log("Error")
        resp.status(500).json({
            msg: err.message
        })
    }
})
// FARMER-CURRENT-DATA
app.get('/currentFarmerData', async (req, resp) => {
    try {
        const farmerID = req.query.FarmerID
        // console.log("f: ",farmerID)
        if (!farmerID) {
            resp.status(300).json({
                msg: "farmerID not present"
            })
        } else {
            const farm = await Farmer.findById(farmerID)
            // console.log(farm)
            if (!farm) {
                resp.status(404).json({
                    msg: "No Farmer found"
                })
            }
            if (farm) {
                resp.status(200).json({
                    farmerData: farm,
                    msg: "Successfully Fetched"
                })
            }
        }
    } catch (err) {
        console.log("Error")
        resp.status(500).json({
            msg: err.message
        })
    }
})
// FARMER-CURRENT-DATA
app.get('/currentFarmerDataPosts', async (req, resp) => {
    try {
        const farmerID = req.query.FarmerID
        // console.log("f: ",farmerID)
        if (!farmerID) {
            resp.status(300).json({
                msg: "farmerID not present"
            })
        } else {
            const farm = await Farmer.findById(farmerID).populate('Blog')
            // console.log(farm)
            if (!farm) {
                resp.status(404).json({
                    msg: "No Farmer found"
                })
            }
            if (farm) {
                resp.status(200).json({
                    farmerData: farm,
                    Blog: farm.Blog,
                    msg: "Successfully Fetched"
                })
            }
        }
    } catch (err) {
        console.log("Error")
        resp.status(500).json({
            msg: err.message
        })
    }
})
// USER-CURRENT-DATA
app.get('/currentUserData', async (req, resp) => {
    try {
        const userID = req.query.userId
        if (!userID) {
            resp.status(300).json({
                msg: "UserID not present"
            })
        } else {
            const user = await User.findById(userID)
            if (!user) {
                resp.status(404).json({
                    msg: "No Farmer found"
                })
            }
            // console.log("USER: ", user)
            if (user) {
                resp.status(200).json({
                    userData: user,
                    msg: "Successfully Fetched"
                })
            }
        }
    } catch (err) {
        console.log("Error")
        resp.status(500).json({
            msg: err.message
        })
    }
})
// orderDataFarmer
app.get('/currentUserDataOrder', async (req, res) => {
    try {
        const userID = req.query.farmerId;
        const orderID = req.query.orderId;

        if (!userID) {
            return res.status(400).json({ msg: "UserID not present" });
        }

        const user = await Farmer.findById(userID);
        if (!user) {
            return res.status(404).json({ msg: "No user found" });
        }
        // console.log("Farmer: ",user)

        // Convert orderID to an ObjectId to compare with user.myOrder._id
        const orderObjectId = new mongoose.Types.ObjectId(orderID);

        // Find the order within the user's myOrder array
        const order = user.order.find(order => order._id.equals(orderObjectId));
        if (!order) {
            console.log("Not FOund Order")
            return res.status(404).json({ msg: "Order not found" });
        }

        // Return the found order as the response
        res.status(200).json({
            ProductData: order,
            msg: "Successfully Fetched"
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ msg: err.message });
    }
});
// MyOrderDataUSER
app.get('/currentUserUserDataOrder', async (req, res) => {
    try {
        const userID = req.query.farmerId;
        const orderID = req.query.orderId;

        if (!userID) {
            return res.status(400).json({ msg: "UserID not present" });
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ msg: "No user found" });
        }
        // console.log("Farmer: ",user)

        // Convert orderID to an ObjectId to compare with user.myOrder._id
        const orderObjectId = new mongoose.Types.ObjectId(orderID);

        // Find the order within the user's myOrder array
        const order = user.myOrder.find(order => order._id.equals(orderObjectId));
        if (!order) {
            console.log("Not FOund Order")
            return res.status(404).json({ msg: "Order not found" });
        }

        // Return the found order as the response
        res.status(200).json({
            ProductData: order,
            msg: "Successfully Fetched"
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ msg: err.message });
    }
});

// PRODUCT-ADD & SEE MY PREVIOUS PRODUCT POSTS---
// PRODUCT-ADD & SEE MY PREVIOUS PRODUCT POSTS---
app.post('/updateProduct/:farmerId', async (req, resp) => {
    try {
        const { farmerId } = req.params
        const {
            title,
            description,
            category,
            rate,
            imageURL,
            quantity,
            farmLocation
        } = req.body

        const newProduct = {
            farmerId,
            title,
            description,
            category: category || 'other',
            rate,
            imageURL,
            quantity,
            farmLocation
        };
        const updatedFarmer = await Farmer.findByIdAndUpdate(
            farmerId,
            { $push: { productSell: newProduct } },
            { new: true }
        );
        if (!updatedFarmer) {
            return resp.status(404).json({ msg: "Farmer not found" });
        }
        resp.status(201).json({ msg: "Product added successfully", updatedFarmer });
    } catch (err) {
        resp.status(400).json({
            msg: "Error Message",
            error: err.message
        })
    }
});

// EDIT PRODUCT PRICE & DETAILS
app.put('/editProductPrice', async (req, resp) => {
    try {
        const { farmerId, productId, rate, quantity, title, description, category } = req.body;

        if (!farmerId || !productId) {
            return resp.status(400).json({ error: 'farmerId and productId are required' });
        }

        if (!mongoose.Types.ObjectId.isValid(farmerId) || !mongoose.Types.ObjectId.isValid(productId)) {
            return resp.status(400).json({ error: 'Invalid Farmer or Product ID' });
        }

        const productObjectId = new mongoose.Types.ObjectId(productId);
        const farmerObjectId = new mongoose.Types.ObjectId(farmerId);

        const updateFields = {};
        if (rate !== undefined && rate !== null && rate !== '') {
            updateFields['productSell.$.rate'] = rate.toString();
        }
        if (quantity !== undefined && quantity !== null && quantity !== '' && !isNaN(quantity)) {
            updateFields['productSell.$.quantity'] = Number(quantity);
        }
        if (title !== undefined && title.trim() !== '') {
            updateFields['productSell.$.title'] = title.trim();
        }
        if (description !== undefined && description.trim() !== '') {
            updateFields['productSell.$.description'] = description.trim();
        }
        if (category !== undefined && category.trim() !== '') {
            updateFields['productSell.$.category'] = category.trim();
        }

        if (Object.keys(updateFields).length === 0) {
            return resp.status(400).json({ error: 'No fields to update provided' });
        }

        const result = await Farmer.updateOne(
            { _id: farmerObjectId, 'productSell._id': productObjectId },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return resp.status(404).json({ error: 'Farmer or Product not found' });
        }

        resp.status(200).json({
            msg: 'Product updated successfully',
            updatedFields: updateFields,
            result
        });
    } catch (err) {
        console.error('Error updating product price:', err);
        resp.status(500).json({
            msg: 'Error updating product price',
            error: err.message
        });
    }
});

// DELETE MY PRODUCT
app.delete('/deleteMyProduct', async (req, resp) => {
    const FarmerId = req.query.farmerId;
    const ProductId = req.query.productId;

    console.log("F:", FarmerId);
    console.log("P:", ProductId);

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(FarmerId) || !mongoose.Types.ObjectId.isValid(ProductId)) {
        console.log('Invalid Farmer or Product ID');
        return resp.status(400).json({ message: 'Invalid Farmer or Product ID' });
    }

    try {
        if (!FarmerId || !ProductId) {
            return resp.status(400).json({ error: 'farmerId and productId are required' });
        }

        // Convert ProductId to ObjectId
        const productObjectId = new mongoose.Types.ObjectId(ProductId);

        // Find the farmer
        const Farm = await Farmer.findById(FarmerId);
        if (!Farm) {
            return resp.status(404).json({ message: 'Farmer not found' });
        }

        // Check if the product exists in the farmer's productSell array
        const productExists = Farm.productSell.some(product => product._id.toString() === productObjectId.toString());
        if (!productExists) {
            console.log('Product not found in farmer\'s productSell list');
            return resp.status(404).json({ message: 'Product not found in farmer\'s productSell list' });
        }

        // Pull the product from the productSell array
        const result = await Farmer.updateOne(
            { _id: FarmerId, 'productSell._id': productObjectId },
            { $pull: { productSell: { _id: productObjectId } } }
        );

        // console.log("RESULT", result);
        if (result.modifiedCount > 0) {
            console.log("Product ID from user deleted successfully");
            resp.status(200).json({ message: 'Product deleted successfully from user and collaborators' });
        } else {
            console.log("Not Deleted");
            resp.status(404).json({ message: 'Failed To Delete Product' });
        }
    } catch (err) {
        console.log("ErroR: ", err)
        resp.status(500).json({
            msg: "Error Message",
            error: err.message
        });
    }
});



// see my products added
app.get('/addProduct', async (req, resp) => {
    try {
        const farmerID = req.query.farmerId
        // console.log(farmerID)
        const products = await Farmer.findOne(
            { _id: farmerID }
        )
        // console.log(products)
        resp.status(200).json({
            msg: "Fetched",
            farmerData: products
        })
    } catch (err) {
        resp.status(500).json({
            msg: "Error in fetching product data",
            error: err.message
        })
    }
})
// BUY REQUEST----
app.post('/buyRequest', async (req, resp) => {
    try {
        const sellerID = req.query.SellerId
        const buyerData = req.body

        // console.log("seller",sellerID)
        // console.log("DATA",buyerData)
        const buy = await Farmer.findByIdAndUpdate(
            sellerID,
            { $push: { order: buyerData } },
            { new: true }
        )
        // console.log("buy")
        // console.log("BUY",buy)
        if (!buy) {
            return resp.status(404).send({
                msg: "Farmer Not Found"
            })
        }
        // console.log("!buy")
        resp.status(200).json({
            msg: "Successfully Ordered!"
        })
    } catch (err) {
        console.log("R")
        resp.status(500).json({
            msg: "Not Ordered",
            error: err
        })
    }
})

app.post('/myOrderUpdateUser', async (req, resp) => {
    try {
        const buyerID = req.query.BuyerId;
        const buyerData = req.body;

        // console.log('Received buyerData:', buyerData);

        // Push the new order into the myOrder array in User schema
        const buy = await User.findByIdAndUpdate(
            buyerID,
            { $push: { myOrder: buyerData } },
            { new: true, runValidators: true }
        );

        if (!buy) {
            return resp.status(404).send({
                msg: "User Not Found"
            });
        }

        // Get the newly added order (assuming it's the last element in the array)
        const newOrder = buy.myOrder[buy.myOrder.length - 1]; // Last element in the array
        const newOrderId = newOrder._id.toString();
        // console.log("New Order ID: ", newOrderId);

        // Now, update the Farmer's order array with the new order ID
        const farmerUpdate = await Farmer.findByIdAndUpdate(
            buyerData.farmerId,
            {
                $push: {
                    order: {
                        ...buyerData,
                        userOrder: newOrderId // Add the order ID to the farmer's order array
                    }
                }
            },
            { new: true, runValidators: true }
        );

        if (!farmerUpdate) {
            return resp.status(404).send({
                msg: "Farmer Not Found"
            });
        }

        // Return the new order ID and confirmation of updates
        resp.status(200).json({
            msg: "Successfully Ordered!",
            newOrderID: newOrderId,
            newOrder: newOrder
        });

    } catch (err) {
        console.log("ERROR: ", err);
        resp.status(500).json({
            msg: "Not Ordered",
            error: err
        });
    }
});


//farmer-accept-request-post occurs in user from pending-to--accepted
app.post('/myOrderUpdateUserAccept', async (req, resp) => {
    try {
        const buyerID = req.query.buyerId
        const buyerData = req.body

        // console.log("seller",sellerID)
        // console.log("DATA",buyerData)
        const buy = await User.findByIdAndUpdate(
            buyerID,
            { $push: { myOrder: {} } },
            { new: true }
        )
        // console.log("buy")
        // console.log("BUY",buy)
        if (!buy) {
            return resp.status(404).send({
                msg: "Farmer Not Found"
            })
        }
        // console.log("!buy")
        resp.status(200).json({
            msg: "Successfully Ordered!"
        })
    } catch (err) {
        console.log("R")
        resp.status(500).json({
            msg: "Not Ordered",
            error: err
        })
    }
})
// updating Acceptance in Farmer Orders----
app.post('/orderUpdateFarmerAccept', async (req, res) => {
    try {
        const userID = req.query.farmerId;
        const orderID = req.query.orderId;

        if (!userID || !orderID) {
            return res.status(400).json({ msg: "farmerId and orderId are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userID) || !mongoose.Types.ObjectId.isValid(orderID)) {
            return res.status(400).json({ msg: "Invalid farmerId or orderId format" });
        }

        const user = await Farmer.findById(userID);
        if (!user) {
            return res.status(404).json({ msg: "Farmer not found" });
        }

        const orderObjectId = new mongoose.Types.ObjectId(orderID);

        const order = await Farmer.updateOne(
            { _id: new mongoose.Types.ObjectId(userID), "order._id": orderObjectId },
            { $set: { "order.$.status": "Accepted!" } }
        );

        if (order.matchedCount === 0) {
            return res.status(404).json({ msg: "Order not found in farmer records" });
        }

        res.status(200).json({
            ProductData: order,
            msg: order.modifiedCount > 0 ? "Order accepted successfully" : "Order was already accepted"
        });

    } catch (err) {
        console.error("Error in orderUpdateFarmerAccept:", err);
        res.status(500).json({ msg: err.message });
    }
});

// updating Acceptance in USER MYOrders----
app.post('/orderUpdateUserAccept', async (req, res) => {
    try {
        const userID = req.query.userId;
        const orderID = req.query.orderId;

        if (!userID || !orderID) {
            return res.status(400).json({ msg: "userId and orderId are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userID) || !mongoose.Types.ObjectId.isValid(orderID)) {
            return res.status(400).json({ msg: "Invalid userId or orderId format" });
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const orderObjectId = new mongoose.Types.ObjectId(orderID);

        const order = await User.updateOne(
            { _id: new mongoose.Types.ObjectId(userID), "myOrder._id": orderObjectId },
            { $set: { "myOrder.$.status": "Accepted!" } }
        );

        if (order.matchedCount === 0) {
            return res.status(404).json({ msg: "Order not found in user records" });
        }

        res.status(200).json({
            ProductData: order,
            msg: order.modifiedCount > 0 ? "Order status updated successfully" : "Order was already accepted"
        });
    } catch (err) {
        console.error("Error in orderUpdateUserAccept:", err);
        res.status(500).json({ msg: err.message });
    }
});

// ── FARMER SUPPLY ORDERS (Inputs, Fertilizers, Seeds, Equipment) ──────────────
app.post('/api/farmerSupplyOrder', async (req, res) => {
    try {
        const { farmerId, orderData } = req.body;
        if (!farmerId || !orderData) {
            return res.status(400).json({ error: "farmerId and orderData are required" });
        }
        if (!mongoose.Types.ObjectId.isValid(farmerId)) {
            return res.status(400).json({ error: "Invalid farmerId format" });
        }

        const farmer = await Farmer.findByIdAndUpdate(
            farmerId,
            { $push: { supplyOrders: { ...orderData, orderDate: new Date() } } },
            { new: true }
        );

        if (!farmer) {
            return res.status(404).json({ error: "Farmer not found" });
        }

        res.status(201).json({
            message: "Supply order placed successfully",
            order: orderData,
            supplyOrders: farmer.supplyOrders
        });
    } catch (err) {
        console.error("Error in farmerSupplyOrder:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/farmerSupplyOrders/:farmerId', async (req, res) => {
    try {
        const { farmerId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(farmerId)) {
            return res.status(400).json({ error: "Invalid farmerId format" });
        }

        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ error: "Farmer not found" });
        }

        res.status(200).json({
            supplyOrders: farmer.supplyOrders || []
        });
    } catch (err) {
        console.error("Error in getFarmerSupplyOrders:", err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/farmerSupplyOrder/:farmerId/:orderRef', async (req, res) => {
    try {
        const { farmerId, orderRef } = req.params;
        if (!mongoose.Types.ObjectId.isValid(farmerId)) {
            return res.status(400).json({ error: "Invalid farmerId format" });
        }

        const farmer = await Farmer.findByIdAndUpdate(
            farmerId,
            { $pull: { supplyOrders: { orderRef: orderRef } } },
            { new: true }
        );

        res.status(200).json({
            message: "Order cancelled successfully",
            supplyOrders: farmer?.supplyOrders || []
        });
    } catch (err) {
        console.error("Error in deleteFarmerSupplyOrder:", err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`server is running on port ${PORT}`)
    await seedMarketplaceBlogs();
})