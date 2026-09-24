import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const farmingData = [
    {
        name: "Ministry of Agriculture",
        scheme: "Pradhan Mantri Fasal Bima Yojana",
        link: "https://pmfby.gov.in/",
        description: "A government-backed crop insurance scheme."
    },
    {
        name: "National Horticulture Board",
        scheme: "National Horticulture Mission",
        link: "http://nhb.gov.in/",
        description: "Supporting horticultural development."
    },
    {
        name: "Department of Animal Husbandry",
        scheme: "National Livestock Mission",
        link: "http://dahd.nic.in/",
        description: "Ensuring sustainable growth of the livestock sector."
    },
    {
        name: "Ministry of Fisheries",
        scheme: "Blue Revolution",
        link: "http://nfdb.gov.in/",
        description: "Transforming the fisheries sector."
    }
];


const FarmingCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Function to go to the next slide
    const nextSlide = () => {
        setCurrentIndex((currentIndex + 1) % farmingData.length);
    };

    // Function to go to the previous slide
    const prevSlide = () => {
        setCurrentIndex((currentIndex - 1 + farmingData.length) % farmingData.length);
    };

    // Automatically transition every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
        nextSlide();
        }, 2500);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <div className="mt-3 w-10/12 rounded-xl bg-gray-100 relative flex items-center justify-center h-36 overflow-hidden">
            {/* Left Arrow */}
            <button
                onClick={prevSlide}
                className="absolute left-0 p-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-full focus:outline-none z-10"
            >
                <FaArrowLeft />
            </button>

            {/* Carousel Content */}
            <div className=" w-full h-full flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {farmingData.map((item, idx) => (
                <div key={idx} className="flex-shrink-0 w-full h-full flex items-center justify-center">
                    <div className="text-center p-4">
                        <h2 className="text-2xl font-semibold text-green-700">{item.name}</h2>
                        <p className="text-sm mt-1 text-gray-600">
                            <span className='font-medium '>Scheme: </span> <strong>{item.scheme}</strong>
                        </p>
                        <div className='flex p-3 justify-center content-center w-full h-full space-x-2'>
                            <p className="text-xs mt-3 text-gray-500">
                                {item.description}
                            </p>
                            <a
                                href={item.link}
                                className=" inline-block mt-2 px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700 transition duration-300 text-xs"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Learn More <span className='underline font-medium text-mdw'>Link</span>
                            </a>
                        </div>
                    </div>
                </div>
                ))}
            </div>

            {/* Right Arrow */}
            <button
                onClick={nextSlide}
                className="absolute right-0 p-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-full focus:outline-none z-10"
            >
                <FaArrowRight />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-2 flex justify-center space-x-2">
                {farmingData.map((_, idx) => (
                <div
                    key={idx}
                    className={`w-3 h-3 rounded-full ${idx === currentIndex ? 'bg-green-600' : 'bg-gray-300'}`}
                />
                ))}
            </div>
        </div>
    );
};

export default FarmingCarousel;
