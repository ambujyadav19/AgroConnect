import React from 'react';
import { FaLeaf, FaTractor, FaSeedling } from 'react-icons/fa';

const FarmingHomePage = () => {
    
    return (
        <div className="bg-green-50 min-h-screen min-w-full flex flex-col">
        {/* Hero Section */}
        <section className="flex items-center justify-center bg-cover bg-center h-96" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1577982624561-1c569677b663?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTU4NjB8MHwxfGFsbHwxfHx8fHx8fHwxNjE2Njg4MTM5&ixlib=rb-1.2.1&q=80&w=1080)' }}>
            <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg text-center max-w-lg">
            <h1 className="text-4xl font-bold text-green-700 mb-4">Welcome to GreenFields</h1>
            <p className="text-gray-700">Where farming meets innovation. Discover sustainable solutions for a better future.</p>
            <button className="mt-6 bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800">
                Learn More
            </button>
            </div>
        </section>

        {/* Introduction Section */}
        <section className="py-12 px-4 text-center bg-white">
            <h2 className="text-3xl font-bold text-green-700 mb-6">About Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
            At GreenFields, we are dedicated to providing innovative and sustainable farming solutions.
            Our goal is to support farmers by offering modern techniques, high-quality products, and expert advice to enhance productivity and sustainability.
            </p>
        </section>

        {/* Featured Products Section */}
        <section className="py-12 bg-green-100 text-center">
            <h2 className="text-3xl font-bold text-green-700 mb-6">Our Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
                <FaSeedling className="text-green-700 text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Organic Seeds</h3>
                <p className="text-gray-600">High-quality organic seeds to ensure the best yield and sustainability.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
                <FaTractor className="text-green-700 text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Modern Equipment</h3>
                <p className="text-gray-600">Advanced farming machinery to improve efficiency and productivity.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
                <FaLeaf className="text-green-700 text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Sustainable Solutions</h3>
                <p className="text-gray-600">Eco-friendly products to support sustainable farming practices.</p>
            </div>
            </div>
        </section>

        {/* Latest News Section */}
        <section className="py-12 px-4 text-center bg-white">
            <h2 className="text-3xl font-bold text-green-700 mb-6">Latest News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg">
                <h3 className="text-xl font-bold mb-2">New Sustainable Techniques</h3>
                <p className="text-gray-600">Discover the latest sustainable farming techniques that are transforming agriculture.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg">
                <h3 className="text-xl font-bold mb-2">Farmers' Success Stories</h3>
                <p className="text-gray-600">Read inspiring stories from farmers who have successfully implemented our solutions.</p>
            </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 bg-green-100 text-center">
            <h2 className="text-3xl font-bold text-green-700 mb-6">What Our Farmers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
                <p className="text-gray-600 italic">"GreenFields has transformed our farming practices and increased our yield significantly!"</p>
                <p className="text-gray-700 mt-4 font-bold">- John Doe</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
                <p className="text-gray-600 italic">"The equipment and support provided by GreenFields are top-notch."</p>
                <p className="text-gray-700 mt-4 font-bold">- Jane Smith</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
                <p className="text-gray-600 italic">"Thanks to GreenFields, we have adopted sustainable practices that benefit our crops and the environment."</p>
                <p className="text-gray-700 mt-4 font-bold">- Ahmed Ali</p>
            </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-green-700 text-white text-center py-4">
            <p>&copy; 2024 GreenFields. All Rights Reserved.</p>
        </footer>
        </div>
    );
};

export default FarmingHomePage;
