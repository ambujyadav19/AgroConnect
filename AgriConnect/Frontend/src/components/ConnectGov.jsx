import React from 'react';
import { FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa';

const farmingWebsites = [
    {
        category: 'General Agriculture',
        emoji: '🌾',
        color: 'from-emerald-500 to-green-400',
        websites: [
            { name: 'Ministry of Agriculture & Farmers Welfare', link: 'https://agricoop.nic.in', focus: 'Governing body for policies and programs to promote agricultural development in India.' },
            { name: 'National Portal of India - Agriculture', link: 'https://www.india.gov.in/topics/agriculture', focus: 'Comprehensive information portal about Indian agriculture, government schemes, and resources.' },
            { name: 'Agricultural Census', link: 'http://agrarian.censusindia.gov.in', focus: 'Provides statistical data on agricultural practices and land usage in India.' },
        ],
    },
    {
        category: 'Crop Insurance & Farmer Welfare',
        emoji: '🛡️',
        color: 'from-blue-500 to-cyan-400',
        websites: [
            { name: 'Pradhan Mantri Fasal Bima Yojana', link: 'https://pmfby.gov.in', focus: 'Crop insurance scheme providing financial support to farmers in crop loss events.' },
            { name: 'PM-Kisan Scheme', link: 'https://pmkisan.gov.in', focus: 'Financial support scheme offering income assistance to farmers across India.' },
            { name: 'National Agricultural Insurance Scheme', link: 'https://www.ncdc.in/naip.html', focus: 'Insurance coverage against crop losses due to natural calamities, pests, and diseases.' },
        ],
    },
    {
        category: 'Horticulture & Plantation',
        emoji: '🌿',
        color: 'from-lime-500 to-emerald-400',
        websites: [
            { name: 'National Horticulture Board', link: 'http://nhb.gov.in', focus: 'Promotes growth and development of the horticulture sector with subsidies.' },
            { name: 'Tea Board of India', link: 'https://www.teaboard.gov.in', focus: 'Regulates the tea industry and promotes exports of Indian tea worldwide.' },
            { name: 'Coffee Board of India', link: 'https://www.indiacoffee.org', focus: 'Regulates and promotes growth and development of the coffee industry in India.' },
        ],
    },
    {
        category: 'Soil, Irrigation & Water',
        emoji: '💧',
        color: 'from-teal-500 to-cyan-400',
        websites: [
            { name: 'National Water Mission', link: 'https://nwm.gov.in', focus: 'Promotes water conservation and integrated water resource management.' },
            { name: 'Pradhan Mantri Krishi Sinchayee Yojana', link: 'https://pmksy.gov.in', focus: 'Supports irrigation efficiency and water resource development for fields.' },
            { name: 'Central Water Commission', link: 'http://cwc.gov.in', focus: 'Monitors and manages water resources, including irrigation projects across India.' },
        ],
    },
    {
        category: 'Agricultural Research',
        emoji: '🔬',
        color: 'from-violet-500 to-purple-400',
        websites: [
            { name: 'Indian Council of Agricultural Research', link: 'https://icar.org.in', focus: 'Coordinates agricultural research and education at national level.' },
            { name: 'Krishi Vigyan Kendras', link: 'https://kvk.icar.gov.in', focus: 'Provides practical agricultural education and training to farmers.' },
            { name: 'MANAGE', link: 'https://www.manage.gov.in', focus: 'Training and capacity-building for agricultural extension management.' },
        ],
    },
    {
        category: 'Livestock & Fisheries',
        emoji: '🐄',
        color: 'from-amber-500 to-orange-400',
        websites: [
            { name: 'Department of Animal Husbandry', link: 'https://dahd.nic.in', focus: 'Focuses on livestock health, welfare, and production improvement.' },
            { name: 'National Fisheries Development Board', link: 'https://nfdb.gov.in', focus: 'Promotes fish farming and growth of the fisheries industry.' },
            { name: 'ICAR - Animal Science', link: 'https://icar.org.in/animal-science', focus: 'Research and development in livestock science to improve productivity.' },
        ],
    },
    {
        category: 'Rural Development',
        emoji: '🏘️',
        color: 'from-rose-500 to-pink-400',
        websites: [
            { name: 'Ministry of Rural Development', link: 'https://rural.nic.in', focus: 'Develops schemes to promote rural infrastructure and livelihoods.' },
            { name: 'MGNREGA', link: 'https://nrega.nic.in', focus: 'Guaranteed wage employment for rural citizens through public works projects.' },
            { name: 'NREGS Portal', link: 'https://nrega.nic.in/netnrega/home.aspx', focus: 'Employment opportunities and infrastructure development in rural areas.' },
        ],
    },
    {
        category: 'Agricultural Trade & Exports',
        emoji: '📦',
        color: 'from-green-600 to-emerald-400',
        websites: [
            { name: 'APEDA', link: 'https://apeda.gov.in', focus: 'Promotes export of agricultural products including fruits, vegetables, and processed foods.' },
            { name: 'MPEDA', link: 'https://mpeda.gov.in', focus: 'Regulates and promotes export of marine products such as fish and shrimp.' },
            { name: 'Spices Board India', link: 'http://www.indianspices.com', focus: 'Regulates and promotes export of Indian spices and supports spice farmers.' },
        ],
    },
    {
        category: 'Organic Farming',
        emoji: '🌱',
        color: 'from-lime-600 to-lime-400',
        websites: [
            { name: 'National Centre of Organic Farming', link: 'https://ncof.dacnet.nic.in', focus: 'Promotes organic farming practices and standards across India.' },
            { name: 'Paramparagat Krishi Vikas Yojana', link: 'https://pgsindia-ncof.gov.in', focus: 'Financial assistance and technical know-how for organic farmers.' },
            { name: 'Organic India', link: 'https://www.organicindia.com', focus: 'Promotes organic farming and offers organic products in India and globally.' },
        ],
    },
    {
        category: 'Seeds & Fertilizers',
        emoji: '🌻',
        color: 'from-yellow-500 to-amber-400',
        websites: [
            { name: 'National Seeds Corporation', link: 'https://www.indiaseeds.com', focus: 'Supplies high-quality seeds to farmers and supports seed production.' },
            { name: 'Fertilizer Monitoring System', link: 'https://www.urvarak.co.in', focus: 'Monitors and manages distribution of fertilizers across India.' },
            { name: 'Indian Fertilizer Control Act', link: 'http://fert.nic.in', focus: 'Regulates production, distribution, and quality of fertilizers in India.' },
        ],
    },
    {
        category: 'Agricultural Marketing',
        emoji: '🏪',
        color: 'from-indigo-500 to-blue-400',
        websites: [
            { name: 'eNAM - National Agriculture Market', link: 'https://www.enam.gov.in', focus: 'Transparent buying and selling of agricultural products through online trading.' },
            { name: 'Small Farmers Agribusiness Consortium', link: 'https://sfacindia.com', focus: 'Aggregates small farmers into cooperatives for improved market access.' },
            { name: 'Agri Bazaar', link: 'https://www.agribazaar.com', focus: 'Online marketplace for buying and selling agricultural commodities.' },
        ],
    },
    {
        category: 'Farm Mechanization',
        emoji: '🚜',
        color: 'from-slate-500 to-gray-400',
        websites: [
            { name: 'Sub-Mission on Agricultural Mechanization', link: 'https://agrimachinery.nic.in', focus: 'Promotes adoption of agricultural machinery to improve farm productivity.' },
            { name: 'National Agricultural Machinery', link: 'https://www.nationalagriculturalmachinery.org', focus: 'Supports development and promotion of agricultural machinery and technology.' },
        ],
    },
];

const FarmingWebsites = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 py-20 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Section header */}
                <div className="text-center mb-14">
                    <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                        Official Resources
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                        Government{" "}
                        <span className="bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent">
                            AgriLinks
                        </span>
                    </h1>
                    <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
                        All official government portals for Indian farmers — organised by category.
                    </p>
                </div>

                {/* Category cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {farmingWebsites.map((cat, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-[20px] border border-emerald-100 shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col gap-4"
                        >
                            {/* Category header */}
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl shadow-md flex-shrink-0`}>
                                    {cat.emoji}
                                </div>
                                <h2 className="font-bold text-gray-800 text-sm leading-snug">{cat.category}</h2>
                            </div>

                            {/* Website list */}
                            <ul className="flex flex-col gap-3">
                                {cat.websites.map((site, j) => (
                                    <li key={j}>
                                        <a
                                            href={site.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-start gap-2 hover:text-emerald-700 transition-colors"
                                        >
                                            <FaExternalLinkAlt className="text-emerald-400 text-[10px] mt-1.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors leading-tight">
                                                    {site.name}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{site.focus}</p>
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FarmingWebsites;