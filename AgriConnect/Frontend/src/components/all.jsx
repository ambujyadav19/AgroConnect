import React from "react";
import { FaExternalLinkAlt, FaArrowRight } from "react-icons/fa";

const farmingData = [
  {
    title: "Organic Farming",
    emoji: "🌱",
    description:
      "Grow crops without synthetic pesticides or fertilizers. Organic farming commands premium prices and is one of India's fastest-growing agri sectors.",
    link: "https://www.ceew.in/publications/sustainable-agriculture-india/organic-farming",
    color: "from-emerald-500 to-green-400",
  },
  {
    title: "Fish Farming",
    emoji: "🐟",
    description:
      "Highly lucrative due to India's strong seafood demand. Breed and raise fish in commercial tanks or enclosures with low land requirements.",
    link: "https://nfdb.gov.in/welcome/about_indian_fisheries",
    color: "from-cyan-500 to-teal-400",
  },
  {
    title: "Dairy Farming",
    emoji: "🐄",
    description:
      "Milk production from cows and buffaloes with proper care and management. Profitable in both rural and urban areas with steady year-round demand.",
    link: "https://updairydevelopment.gov.in/index.aspx",
    color: "from-lime-500 to-emerald-400",
  },
];

const ProfitableFarming = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            High-Return Agriculture
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Most Profitable{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent">
              Farming in India
            </span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
            Discover the farming sectors with the highest income potential for Indian farmers today.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmingData.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="group bg-white rounded-[20px] border border-emerald-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col gap-4"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl shadow-lg`}>
                {item.emoji}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold group-hover:gap-2.5 transition-all mt-auto">
                Learn More <FaArrowRight className="text-xs" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfitableFarming;