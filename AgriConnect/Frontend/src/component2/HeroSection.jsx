import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaShoppingCart,
  FaComments,
  FaBlog,
  FaChartBar,
  FaTasks,
  FaFlask,
  FaLeaf,
  FaSeedling,
  FaStar,
  FaArrowRight,
  FaExternalLinkAlt,
} from "react-icons/fa";
import heroImage from "../assets/farm2.webp";
import ProfitableFarming from "../components/all";

/* ─── animation variants ─────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.7, delay: i * 0.1 },
  }),
};

/* ─── feature cards data ─────────────────────────── */
const features = [
  {
    icon: <FaShoppingCart className="text-3xl" />,
    title: "Smart Marketplace",
    desc: "Buy and sell fresh produce directly — no middlemen, better prices for farmers and customers alike.",
    color: "from-emerald-500 to-green-400",
    link: "/marketplace",
    badge: "Live",
  },
  {
    icon: <FaComments className="text-3xl" />,
    title: "AI Farming Chatbot",
    desc: "Get instant AI-powered answers about crops, soil health, irrigation, pests, and more — 24/7.",
    color: "from-lime-500 to-emerald-400",
    link: "/chatbot",
    badge: "AI",
  },
  {
    icon: <FaChartBar className="text-3xl" />,
    title: "Farmer Dashboard",
    desc: "Track income, expenses, orders and product listings all in one powerful, intuitive dashboard.",
    color: "from-teal-500 to-cyan-400",
    link: "/dashboard",
    badge: "Pro",
  },
  {
    icon: <FaBlog className="text-3xl" />,
    title: "Community Blogs",
    desc: "Read and share insights, success stories, and modern farming techniques with the community.",
    color: "from-green-500 to-teal-400",
    link: "/blogsList",
    badge: "New",
  },
  {
    icon: <FaTasks className="text-3xl" />,
    title: "Order Management",
    desc: "Seamlessly manage buy/sell orders, track delivery status, and stay on top of every transaction.",
    color: "from-emerald-600 to-green-500",
    link: "/userOrders",
    badge: null,
  },
  {
    icon: <FaFlask className="text-3xl" />,
    title: "Soil Test Labs",
    desc: "Find certified soil testing laboratories near you and get recommendations to improve yield.",
    color: "from-lime-600 to-lime-400",
    link: "https://soilhealth.dac.gov.in/soil-lab",
    external: true,
    badge: null,
  },
];

/* ─── govt resources (merged with soil section) ─────*/
const govResources = [
  {
    name: "Ministry of Agriculture",
    scheme: "Pradhan Mantri Fasal Bima Yojana",
    link: "https://pmfby.gov.in/",
    description: "Government-backed crop insurance scheme protecting farmers from crop loss.",
    emoji: "🌾",
  },
  {
    name: "National Horticulture Board",
    scheme: "National Horticulture Mission",
    link: "http://nhb.gov.in/",
    description: "Supporting horticultural development across India.",
    emoji: "🌿",
  },
  {
    name: "Dept. of Animal Husbandry",
    scheme: "National Livestock Mission",
    link: "http://dahd.nic.in/",
    description: "Ensuring sustainable growth of the livestock sector.",
    emoji: "🐄",
  },
  {
    name: "Ministry of Fisheries",
    scheme: "Blue Revolution",
    link: "http://nfdb.gov.in/",
    description: "Transforming the fisheries sector with modern aquaculture techniques.",
    emoji: "🐟",
  },
  {
    name: "Soil Health Portal",
    scheme: "Soil Testing Laboratories",
    link: "https://soilhealth.dac.gov.in/soil-lab",
    description: "Find certified labs near you for soil analysis, pH & nutrient testing.",
    emoji: "🧪",
  },
  {
    name: "eNAM",
    scheme: "National Agriculture Market",
    link: "https://enam.gov.in/",
    description: "Pan-India electronic trading portal for agricultural commodities.",
    emoji: "🏪",
  },
];

/* ─── testimonials ───────────────────────────────── */
const testimonials = [
  {
    name: "Ramesh Patel",
    role: "Wheat Farmer, MP",
    quote: "AgroConnect doubled my reach. I now sell directly to customers and earn 30% more per harvest.",
    stars: 5,
  },
  {
    name: "Sunita Sharma",
    role: "Vegetable Grower, UP",
    quote: "The AI chatbot helped me identify a fungal disease in my tomatoes before it spread. Incredible tool!",
    stars: 5,
  },
  {
    name: "Arjun Mehta",
    role: "Customer, Delhi",
    quote: "Fresh produce at farm prices. I'll never shop at a supermarket for vegetables again.",
    stars: 5,
  },
];

/* ─── stats ──────────────────────────────────────── */
const stats = [
  { value: "10K+", label: "Farmers" },
  { value: "50K+", label: "Products" },
  { value: "1L+",  label: "Orders" },
  { value: "28",   label: "States" },
];

/* ═══════════════════════════════════════════════════ */
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 font-sans">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Agriculture" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-green-900/70 to-black/60" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            variants={fadeIn} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-6"
          >
            <FaLeaf className="text-lime-400" />
            India's #1 AgriTech Platform
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6"
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-lime-300 to-emerald-300 bg-clip-text text-transparent">
              AgroConnect
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Empowering farmers and customers with a modern marketplace, AI chatbot,
            insightful blogs, and seamless order management.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/signup"
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-lime-500 text-white text-lg font-semibold rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
            >
              Get Started Free
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/marketplace"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white text-lg font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
            >
              <FaShoppingCart /> Explore Market
            </Link>
          </motion.div>
        </div>

        {/* scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white/60 text-xs gap-1"
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
          <span>Scroll</span>
        </motion.div>
      </section>

      {/* ── STATS STRIP ──────────────────────────── */}
      <section className="bg-gradient-to-r from-emerald-700 via-green-600 to-lime-600 py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {stats.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
              <p className="text-4xl font-extrabold tracking-tight">{s.value}</p>
              <p className="text-emerald-100 text-sm mt-1 uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Everything You Need
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Built for{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent">
                Modern Farming
              </span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
              A complete agri-ecosystem — from buying seeds to selling produce, all in one platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="group">
                {f.external ? (
                  <a href={f.link} target="_blank" rel="noreferrer" className="block h-full"><FeatureCard f={f} /></a>
                ) : (
                  <Link to={f.link} className="block h-full"><FeatureCard f={f} /></Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROFITABLE FARMING ───────────────────── */}
      <section className="bg-white/60 backdrop-blur-sm border-y border-emerald-100">
        <ProfitableFarming />
      </section>

      {/* ── GOVT RESOURCES + SOIL LAB ────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 to-lime-50">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Government Resources
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Agri{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent">
                Govt. Portals
              </span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
              Access official government schemes, soil labs, and agricultural portals — all in one place.
            </p>
          </motion.div>

          {/* Soil Lab hero card */}
          <motion.a
            href="https://soilhealth.dac.gov.in/soil-lab"
            target="_blank"
            rel="noreferrer"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="group flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-emerald-700 via-green-600 to-lime-500 rounded-[24px] p-8 mb-10 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300"
          >
            <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl shadow-inner">
              🧪
            </div>
            <div className="text-center md:text-left flex-1">
              <span className="text-xs uppercase tracking-widest text-emerald-200 font-semibold">Govt. of India · Featured</span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Find a Soil Testing Laboratory Near You
              </h3>
              <p className="text-emerald-100 mt-2 text-sm max-w-xl">
                Analyze soil composition, nutrients &amp; pH levels. Make data-backed farming decisions to maximize your yield.
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3 rounded-full group-hover:bg-emerald-50 transition-all">
              Visit Portal <FaExternalLinkAlt className="text-sm" />
            </div>
          </motion.a>

          {/* Govt resource cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {govResources.map((g, i) => (
              <motion.a
                key={g.scheme}
                href={g.link}
                target="_blank"
                rel="noreferrer"
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="group bg-white rounded-[18px] border border-emerald-100 shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{g.emoji}</span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    Govt. <FaExternalLinkAlt className="text-[8px]" />
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{g.name}</p>
                  <h3 className="font-bold text-gray-800 text-base group-hover:text-emerald-700 transition-colors">{g.scheme}</h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{g.description}</p>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold mt-auto group-hover:gap-2.5 transition-all">
                  Learn More <FaArrowRight className="text-xs" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl font-bold text-gray-800">
              Trusted by{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent">
                Real Farmers
              </span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-white rounded-[20px] border border-emerald-100 shadow-lg p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => <FaStar key={j} className="text-amber-400 text-sm" />)}
                </div>
                <p className="text-gray-600 italic leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-lime-400 flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 to-lime-50">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-4xl mx-auto relative overflow-hidden rounded-[28px] bg-gradient-to-r from-emerald-700 via-green-600 to-lime-500 p-10 md:p-16 text-center shadow-2xl shadow-emerald-400/30"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <FaSeedling className="text-white/20 text-9xl absolute top-4 right-6" />

          <span className="relative inline-block bg-white/15 text-white text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/20 mb-6">
            Join the Community
          </span>
          <h2 className="relative text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Start Growing Smarter Today
          </h2>
          <p className="relative text-emerald-100 text-lg max-w-xl mx-auto mb-8">
            Join thousands of farmers and buyers already transforming Indian agriculture with AgroConnect.
          </p>
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="flex items-center gap-2 px-10 py-4 bg-white text-emerald-700 font-bold text-lg rounded-full shadow-lg hover:bg-emerald-50 hover:scale-105 transition-all duration-300">
              Sign Up Free <FaArrowRight />
            </Link>
            <Link to="/login" className="flex items-center gap-2 px-10 py-4 border-2 border-white/60 text-white font-semibold text-lg rounded-full hover:bg-white/10 transition-all duration-300">
              Login
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="bg-gradient-to-r from-emerald-800 to-green-800 text-white py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FaLeaf className="text-lime-400" />
          <span className="font-bold text-lg tracking-wide">AgroConnect</span>
        </div>
        <p className="text-emerald-300 text-sm">© 2024 AgroConnect. Empowering Indian Agriculture.</p>
      </footer>
    </div>
  );
};

/* ─── Feature Card sub-component ────────────────── */
const FeatureCard = ({ f }) => (
  <div className="h-full bg-white rounded-[20px] border border-emerald-100 shadow-md shadow-emerald-50 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
    <div className="flex items-start justify-between">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-lg`}>
        {f.icon}
      </div>
      {f.badge && (
        <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
          {f.badge}
        </span>
      )}
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
    </div>
    <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold group-hover:gap-2.5 transition-all mt-auto">
      Explore <FaArrowRight className="text-xs" />
    </div>
  </div>
);

export default HomePage;
