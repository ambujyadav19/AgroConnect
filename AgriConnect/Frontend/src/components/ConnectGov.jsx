import React from 'react';

const farmingWebsites = [
    {
        category: 'General Agriculture',
        websites: [
        {
            name: 'Ministry of Agriculture & Farmers Welfare',
            link: 'https://agricoop.nic.in',
            focus: 'Governing body for policies and programs to promote agricultural development in India.'
        },
        {
            name: 'National Portal of India - Agriculture',
            link: 'https://www.india.gov.in/topics/agriculture',
            focus: 'Comprehensive information portal about Indian agriculture, government schemes, and resources.'
        },
        {
            name: 'Agricultural Census',
            link: 'http://agrarian.censusindia.gov.in',
            focus: 'Provides statistical data on agricultural practices and land usage in India.'
        },
        ],
    },
    {
        category: 'Crop Insurance & Farmer Welfare',
        websites: [
        {
            name: 'Pradhan Mantri Fasal Bima Yojana',
            link: 'https://pmfby.gov.in',
            focus: 'Crop insurance scheme providing financial support to farmers in the event of crop loss due to natural calamities.'
        },
        {
            name: 'PM-Kisan Scheme',
            link: 'https://pmkisan.gov.in',
            focus: 'A financial support scheme offering income assistance to farmers across India.'
        },
        {
            name: 'National Agricultural Insurance Scheme',
            link: 'https://www.ncdc.in/naip.html',
            focus: 'Provides insurance coverage against crop losses due to natural calamities, pests, and diseases.'
        },
        ],
    },
    {
        category: 'Horticulture & Plantation',
        websites: [
        {
            name: 'National Horticulture Board',
            link: 'http://nhb.gov.in',
            focus: 'Promotes the growth and development of the horticulture sector with subsidies and programs.'
        },
        {
            name: 'Tea Board of India',
            link: 'https://www.teaboard.gov.in',
            focus: 'Regulates the tea industry and promotes exports of Indian tea worldwide.'
        },
        {
            name: 'Coffee Board of India',
            link: 'https://www.indiacoffee.org',
            focus: 'Regulates and promotes the growth and development of the coffee industry in India.'
        },
        ],
    },
    {
        category: 'Soil, Irrigation & Water Resources',
        websites: [
        {
            name: 'National Water Mission',
            link: 'https://nwm.gov.in',
            focus: 'Promotes water conservation, equitable distribution, and integrated water resource management.'
        },
        {
            name: 'Pradhan Mantri Krishi Sinchayee Yojana',
            link: 'https://pmksy.gov.in',
            focus: 'Supports irrigation efficiency and water resource development for agricultural fields.'
        },
        {
            name: 'Central Water Commission',
            link: 'http://cwc.gov.in',
            focus: 'Monitors and manages water resources, including irrigation projects across India.'
        },
        ],
    },
    {
        category: 'Agricultural Research & Innovation',
        websites: [
        {
            name: 'Indian Council of Agricultural Research',
            link: 'https://icar.org.in',
            focus: 'Coordinates agricultural research and education at the national level to improve farm productivity.'
        },
        {
            name: 'Krishi Vigyan Kendras',
            link: 'https://kvk.icar.gov.in',
            focus: 'Provides practical agricultural education and training to farmers and rural youth.'
        },
        {
            name: 'National Institute of Agricultural Extension Management',
            link: 'https://www.manage.gov.in',
            focus: 'Offers training and capacity-building programs for agricultural extension management.'
        },
        ],
    },
    {
        category: 'Livestock & Fisheries',
        websites: [
        {
            name: 'Department of Animal Husbandry',
            link: 'https://dahd.nic.in',
            focus: 'Focuses on livestock health, welfare, and production improvement strategies in India.'
        },
        {
            name: 'National Fisheries Development Board',
            link: 'https://nfdb.gov.in',
            focus: 'Promotes fish farming and the growth of the fisheries industry in India.'
        },
        {
            name: 'Indian Council of Agricultural Research - Animal Science',
            link: 'https://icar.org.in/animal-science',
            focus: 'Research and development in livestock and animal science to improve productivity and health.'
        },
        ],
    },
    {
        category: 'Rural Development & Employment',
        websites: [
        {
            name: 'Ministry of Rural Development',
            link: 'https://rural.nic.in',
            focus: 'Develops and implements schemes to promote rural infrastructure, employment, and livelihoods.'
        },
        {
            name: 'Mahatma Gandhi National Rural Employment Guarantee Act',
            link: 'https://nrega.nic.in',
            focus: 'Offers guaranteed wage employment for rural citizens through public works projects.'
        },
        {
            name: 'National Rural Employment Guarantee Scheme',
            link: 'https://nrega.nic.in/netnrega/home.aspx',
            focus: 'Provides employment opportunities and infrastructure development in rural areas.'
        },
        ],
    },
    {
        category: 'Agricultural Trade & Exports',
        websites: [
        {
            name: 'APEDA',
            link: 'https://apeda.gov.in',
            focus: 'Promotes the export of agricultural products from India, including fruits, vegetables, and processed foods.'
        },
        {
            name: 'MPEDA',
            link: 'https://mpeda.gov.in',
            focus: 'Regulates and promotes the export of marine products, such as fish and shrimp.'
        },
        {
            name: 'Spices Board India',
            link: 'http://www.indianspices.com',
            focus: 'Regulates and promotes the export of Indian spices and supports spice farmers.'
        },
        ],
    },
    {
        category: 'Farm Mechanization',
        websites: [
        {
            name: 'Sub-Mission on Agricultural Mechanization',
            link: 'https://agrimachinery.nic.in',
            focus: 'Promotes the adoption of agricultural machinery and tools to improve farm productivity.'
        },
        {
            name: 'National Agricultural Machinery',
            link: 'https://www.nationalagriculturalmachinery.org',
            focus: 'Supports the development and promotion of agricultural machinery and technology.'
        },
        ],
    },
    {
        category: 'Organic Farming',
        websites: [
        {
            name: 'National Centre of Organic Farming',
            link: 'https://ncof.dacnet.nic.in',
            focus: 'Promotes organic farming practices and standards across India.'
        },
        {
            name: 'Paramparagat Krishi Vikas Yojana',
            link: 'https://pgsindia-ncof.gov.in',
            focus: 'Supports organic farming by providing financial assistance and technical know-how to farmers.'
        },
        {
            name: 'Organic India',
            link: 'https://www.organicindia.com',
            focus: 'Promotes organic farming and offers organic products in India and globally.'
        },
        ],
    },
    {
        category: 'Seeds & Fertilizers',
        websites: [
        {
            name: 'National Seeds Corporation',
            link: 'https://www.indiaseeds.com',
            focus: 'Supplies high-quality seeds to farmers and supports seed production programs.'
        },
        {
            name: 'Fertilizer Monitoring System',
            link: 'https://www.urvarak.co.in',
            focus: 'Monitors and manages the distribution and availability of fertilizers across India.'
        },
        {
            name: 'Indian Fertilizer Control Act',
            link: 'http://fert.nic.in',
            focus: 'Regulates the production, distribution, and quality of fertilizers in India.'
        },
        ],
    },
    {
        category: 'Agricultural Marketing',
        websites: [
        {
            name: 'eNAM - National Agriculture Market',
            link: 'https://www.enam.gov.in',
            focus: 'Facilitates transparent buying and selling of agricultural products through an online trading platform.'
        },
        {
            name: 'Small Farmers Agribusiness Consortium',
            link: 'https://sfacindia.com',
            focus: 'Supports the aggregation of small farmers into cooperatives for improved market access.'
        },
        {
            name: 'Agri Bazaar',
            link: 'https://www.agribazaar.com',
            focus: 'Provides an online marketplace for buying and selling agricultural commodities.'
        },
        ],
    },
];

const FarmingWebsites = () => {
    return (
        <div className="bg-gray-100 min-h-screen py-10 px-4">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-10">Government Websites for Farmers</h1>
        <div className="container mx-auto grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {farmingWebsites.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">{category.category}</h2>
                <ul className="list-disc pl-5 space-y-4">
                {category.websites.map((website, idx) => (
                    <li key={idx}>
                    <a
                        href={website.link}
                        className="text-lg text-gray-700 hover:text-green-600 hover:underline transition duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {website.name}
                    </a>
                    <p className="text-sm text-gray-500 mt-1">{website.focus}</p>
                    </li>
                ))}
                </ul>
            </div>
            ))}
        </div>
        </div>
    );
};

export default FarmingWebsites;