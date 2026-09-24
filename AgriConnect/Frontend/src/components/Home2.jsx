import React from 'react';

const FarmingHomePage2 = () => {
  return (
    <div className="bg-green-300 min-h-screen flex flex-col items-center justify-center">
      {/* Header Section */}
      <header className="w-full p-6 flex justify-between items-center bg-white shadow-md">
        <h1 className="text-4xl font-bold text-green-800">FARM</h1>
        <nav className="space-x-4">
          <a href="/" className="text-green-800 hover:text-green-600">Home</a>
          <a href="/shop" className="text-green-800 hover:text-green-600">Shop</a>
          <a href="/contact" className="text-green-800 hover:text-green-600">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center p-10">
        <img
          src="path-to-your-logo" 
          alt="Farm Logo"
          className="mx-auto h-24 w-24"
        />
        <h2 className="text-3xl font-bold text-white mt-4">Organic Store</h2>
        <p className="text-white mt-2">Multipurpose HTML Website Template</p>
        <button className="mt-6 px-8 py-2 bg-green-700 text-white rounded-full hover:bg-green-800">
          Get Started
        </button>
      </section>

      {/* Grid of Images */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 px-4">
        {/* First Image */}
        <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src="path-to-image-1"
            alt="Farming Image 1"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-bold">New Drink, New Day</h3>
          </div>
        </div>

        {/* Second Image */}
        <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src="path-to-image-2"
            alt="Farming Image 2"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-bold">Organic Variety</h3>
          </div>
        </div>

        {/* Third Image */}
        <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src="path-to-image-3"
            alt="Farming Image 3"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-bold">Vegetables</h3>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-green-800 text-white text-center p-4 mt-12">
        <p>© 2024 Farm Organic Store. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FarmingHomePage2;
