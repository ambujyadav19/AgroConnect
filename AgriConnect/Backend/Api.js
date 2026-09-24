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
const FALLBACK_MODELS = ['gemini-3.6-flash'];

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

app.post('/api/chatbot', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY is missing in the backend environment variables.' });
        }

        const prompt = `You are a farming chatbot. Answer only farming-related questions. Use the same language as the user and provide practical, detailed guidance. User question: ${message}`;

        let lastError = null;
        for (const modelName of FALLBACK_MODELS) {
            try {
                const response = await Promise.race([
                    ai.models.generateContent({
                        model: modelName,
                        contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    }),
                    new Promise((_, reject) => setTimeout(() => reject(new Error(`Model ${modelName} timed out`)), 20000))
                ]);

                const reply = extractGeminiText(response) || 'I am not able to provide a response right now.';
                return res.json({ reply });
            } catch (error) {
                lastError = error;
                console.error(`Gemini model failed: ${modelName}`, error?.message || error);
            }
        }

        return res.status(500).json({
            error: lastError?.message || 'Failed to generate AI response with the configured Gemini key.',
        });
    } catch (error) {
        console.error('Gemini route error:', error);
        return res.status(500).json({
            error: error.message || 'Failed to generate AI response',
        });
    }
});

app.post('/sign',async(req,resp,next)=>{
    try{
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
    }catch(err){
        resp.status(500).json({ error: 'Failed to register user',err });
        console.log(err);
    }
})
//USER-SIGNUP-----
app.post('/signUpUSER',async(req,resp,next)=>{
    try{
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
    }catch(err){
        resp.status(500).json({ error: 'Failed to register user',err });
        console.log(err);
    }
})
// app.get('/getUSERS', async (req,resp)=>{
//     try{
//         const user = await User.findOne({})
//     }
// })
app.post('/login', async (req, resp) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return resp.status(400).json({ msg: "Email and password are required" });
        }

        const user = await Farmer.findOne({ email });
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
app.get('/market_product', async(req,resp)=>{
    try{
        const farm = await Farmer.find()
        const product = await Farmer.find({},'productSell')
        // console.log("ProducT: ",product)
        const products = product.flatMap(farmer => farmer.productSell);

        if(!products){
            resp.status(404).json({
                msg: "No products found"
            })
        }
        if(!farm){
            resp.status(404).json({
                msg: "No Farmer found"
            })
        }
        // console.log("Products: ",products)
        // console.log("Farmer detail: ",farm)
        if(product && farm){
            resp.status(200).json({
                farmerData: farm,
                data: products,
                msg: "Successfully Fetched"
            })
        }
    }catch(err){
        console.log("Error")
        resp.status(500).json({
            msg: err.message
        })
    }
})
// FARMER-CURRENT-DATA
app.get('/currentFarmerData', async(req,resp)=>{
    try{
        const farmerID = req.query.FarmerID
        // console.log("f: ",farmerID)
        if(!farmerID){
            resp.status(300).json({
                msg: "farmerID not present"
            })
        }else{
            const farm = await Farmer.findById(farmerID)
            // console.log(farm)
            if(!farm){
                resp.status(404).json({
                    msg: "No Farmer found"
                })
            }
            if( farm){
                resp.status(200).json({
                    farmerData: farm,
                    msg: "Successfully Fetched"
                })
            }
        }
    }catch(err){
        console.log("Error")
        resp.status(500).json({
            msg: err.message
        })
    }
})
// FARMER-CURRENT-DATA
app.get('/currentFarmerDataPosts', async(req,resp)=>{
    try{
        const farmerID = req.query.FarmerID
        // console.log("f: ",farmerID)
        if(!farmerID){
            resp.status(300).json({
                msg: "farmerID not present"
            })
        }else{
            const farm = await Farmer.findById(farmerID).populate('Blog')
            // console.log(farm)
            if(!farm){
                resp.status(404).json({
                    msg: "No Farmer found"
                })
            }
            if( farm){
                resp.status(200).json({
                    farmerData: farm,
                    Blog: farm.Blog,
                    msg: "Successfully Fetched"
                })
            }
        }
    }catch(err){
        console.log("Error")
        resp.status(500).json({
            msg: err.message
        })
    }
})
// USER-CURRENT-DATA
app.get('/currentUserData', async(req,resp)=>{
    try{
        const userID = req.query.userId
        if(!userID){
            resp.status(300).json({
                msg: "UserID not present"
            })
        }else{
            const user = await User.findById(userID)
            if(!user){
                resp.status(404).json({
                    msg: "No Farmer found"
                })
            }
            // console.log("USER: ", user)
            if(user){
                resp.status(200).json({
                    userData: user,
                    msg: "Successfully Fetched"
                })
            }
        }
    }catch(err){
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
app.post('/updateProduct/:farmerId', async(req,resp)=>{
    try{
        const {farmerId} = req.params
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
    }catch(err){
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
        console.log("ErroR: ",err)
        resp.status(500).json({
            msg: "Error Message",
            error: err.message
        });
    }
});



// see my products added
app.get('/addProduct',async(req,resp)=>{
    try{
        const farmerID = req.query.farmerId
        // console.log(farmerID)
        const products = await Farmer.findOne(
            {_id: farmerID}
        )
        // console.log(products)
        resp.status(200).json({
            msg: "Fetched",
            farmerData: products
        })
    }catch(err){
        resp.status(500).json({
            msg: "Error in fetching product data",
            error: err.message
        })
    }
})
// BUY REQUEST----
app.post('/buyRequest', async(req,resp)=>{
    try{
        const sellerID = req.query.SellerId
        const buyerData = req.body
        
        // console.log("seller",sellerID)
        // console.log("DATA",buyerData)
        const buy = await Farmer.findByIdAndUpdate(
            sellerID,
            {$push: {order: buyerData}},
            {new: true}
        )
        // console.log("buy")
        // console.log("BUY",buy)
        if(!buy){
            return resp.status(404).send({
                msg: "Farmer Not Found"
            })
        }
        // console.log("!buy")
        resp.status(200).json({
            msg: "Successfully Ordered!"
        })
    }catch(err){
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
app.post('/myOrderUpdateUserAccept', async(req,resp)=>{
    try{
        const buyerID = req.query.buyerId
        const buyerData = req.body
        
        // console.log("seller",sellerID)
        // console.log("DATA",buyerData)
        const buy = await User.findByIdAndUpdate(
            buyerID,
            {$push: {myOrder: {}}},
            {new: true}
        )
        // console.log("buy")
        // console.log("BUY",buy)
        if(!buy){
            return resp.status(404).send({
                msg: "Farmer Not Found"
            })
        }
        // console.log("!buy")
        resp.status(200).json({
            msg: "Successfully Ordered!"
        })
    }catch(err){
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



const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`server is running on port ${PORT}`)
    await seedMarketplaceBlogs();
})