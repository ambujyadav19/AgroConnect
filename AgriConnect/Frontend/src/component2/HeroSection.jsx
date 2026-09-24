import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaComments, FaBlog, FaChartBar, FaTasks, FaLandmark, FaBook, FaBookmark, FaAddressBook, FaFlask, FaArrowAltCircleDown, FaArrowDown } from "react-icons/fa";
import heroImage from "../assets/farm2.webp"; // Update with the correct path
import Weather2 from "../components/Weather2";
import GovCarousel from "../components/govCarousel";
import ProfitableFarming from "../components/all";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import AgricultureSchemes from "../components/FetchSchemeAPI";

const HomePage = () => {
    return (
        <div>
        {/* Hero Section */}
        
        <section className=" relative h-[90vh] bg-green-500">
            <div className="absolute inset-0 overflow-hidden">
            <img src={heroImage} alt="Agriculture" 
                className=" w-full h-full object-cover opacity-70" />
            </div>
            <div className=" flex justify-center">
                <GovCarousel/>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-6 space-y-10">
            <motion.h1
                className="text-5xl md:text-7xl font-bold text-gray-100 mb-4"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                Welcome to AgroConnect
            </motion.h1>
            <motion.p
                className="font-medium text-xl md:text-3xl text-gray-200 mb-6 max-w-2xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                Empowering farmers and customers with a modern marketplace, smart chatbot, insightful blogs, and seamless order management.
            </motion.p>
            <motion.div
                className="mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
            >
                <p
                href="#features"
                className="px-10 py-4 bg-green-700 text-white text-xl rounded-full shadow-lg hover:bg-green-600 transition duration-300"
                >
                Explore Features <FontAwesomeIcon icon={faArrowDown} ></FontAwesomeIcon>
                </p>
            </motion.div>
            
            </div>
        </section>
        
        

        {/* Soil Test Lab Section */}
        <div className="flex justify-center content-center">

        <section id="marketplace" className=" pt-16 pb-6 w-10/12 bg-white">
                <p className="hover:shadow-lg hover:rounded-lg hover:border hover:border-gray-500 p-8 container mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
            <a target="_blank" href="https://soilhealth.dac.gov.in/soil-lab"
                className=""
                >
                        <FaFlask className="text-6xl text-green-700 mx-auto mb-6" />
                        <h2 className="hover:underline text-4xl font-bold text-gray-800">Locate soil testing laboratory</h2>
                        <p className="text-xl text-gray-600 mt-4 max-w-xl mx-auto">
                        Soil lab testing analyzes soil composition, nutrients, and pH levels, helping farmers optimize crop growth and improve agricultural productivity.
                        </p>
            </a>
                    </motion.div>
                </p>
        </section>
        </div>

        {/* <AgricultureSchemes/> */}

        <ProfitableFarming/>

        {/* Chatbot Section */}
        <section id="chatbot" className="py-12 bg-green-50">
            <div className="container mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <FaComments className="text-6xl text-green-700 mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-gray-800">Farming Chatbot</h2>
                <p className="text-xl text-gray-600 mt-4 max-w-xl mx-auto">
                Have questions about farming? Get instant answers with our AI-powered chatbot designed to assist farmers and customers.
                </p>
            </motion.div>
            </div>
        </section>

        {/* Blogs & Reactions Section */}
        <section id="blogs" className="py-12 bg-white">
            <div className="container mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <FaBlog className="text-6xl text-green-700 mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-gray-800">Blogs & Reactions</h2>
                <p className="text-xl text-gray-600 mt-4 max-w-xl mx-auto">
                Farmers can share their experiences and insights through blogs while users can react and engage with their posts.
                </p>
            </motion.div>
            </div>
        </section>

        {/* Dashboard Section */}
        <section id="dashboard" className="py-12 bg-green-50">
            <div className="container mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <FaChartBar className="text-6xl text-green-700 mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-gray-800">Farmer & User Dashboard</h2>
                <p className="text-xl text-gray-600 mt-4 max-w-xl mx-auto">
                Manage your activities, view analytics, and monitor your progress in a comprehensive dashboard designed for both farmers and customers.
                </p>
            </motion.div>
            </div>
        </section>

        {/* Order Management Section */}
        <section id="order-management" className="py-20 bg-white">
            <div className="container mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <FaTasks className="text-6xl text-green-700 mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-gray-800">Order Management</h2>
                <p className="text-xl text-gray-600 mt-4 max-w-xl mx-auto">
                Manage your orders easily and efficiently, ensuring a smooth transaction process between farmers and customers.
                </p>
            </motion.div>
            </div>
        </section>

        {/* Call-to-Action Section */}
        
        <section id="cta" className="py-20 bg-green-700">
            <div className="container mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl font-bold text-white">Join AgroConnect Today!</h2>
                <p className="text-xl text-gray-200 mt-4 max-w-xl mx-auto">
                Become part of our community and start benefiting from our advanced agricultural solutions.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/signup"
                        className="inline-block px-10 py-4 bg-white text-green-700 text-xl rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
                    >
                        Sign Up
                    </Link>
                    <Link
                        to="/login"
                        className="inline-block px-10 py-4 border-2 border-white text-white text-xl rounded-full shadow-lg hover:bg-white hover:text-green-700 transition duration-300"
                    >
                        Login
                    </Link>
                </div>
            </motion.div>
            </div>
        </section>
        </div>
    );
};

export default HomePage;
