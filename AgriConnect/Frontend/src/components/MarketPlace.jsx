import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { API_BASE_URL } from '../config';
import { CATEGORIES, detectCategory } from './CategorySelect';
import {
  FaSeedling,
  FaSearch,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaTractor,
  FaFlask,
  FaTree,
  FaTools,
  FaCheckCircle,
  FaShieldAlt,
  FaFilter,
  FaArrowRight,
  FaStar,
  FaPercent,
  FaTimes,
  FaBoxOpen,
  FaUserLock,
  FaCalendarAlt,
  FaTruck,
  FaClipboardCheck,
  FaTrashAlt,
  FaRedo
} from 'react-icons/fa';

const isValidURL = (urlString) => {
  try {
    new URL(urlString);
    return true;
  } catch (_) {
    return false;
  }
};

// ── Curated Agricultural Supplies Catalog for Farmers ──────────────────────────────
const FARMER_SUPPLIES = [
  // 1. Fertilizers & Nutrients
  {
    id: 'fert-1',
    category: 'fertilizers',
    title: 'IFFCO Neem Coated Urea (46% N)',
    brand: 'IFFCO',
    rate: 266,
    unit: '45 kg bag',
    subsidy: 'Govt Subsidized (DBT)',
    rating: 4.9,
    reviews: 1420,
    inStock: true,
    description: 'Slow-release nitrogen fertilizer coated with neem oil to improve nitrogen use efficiency, prevent soil leaching, and boost vegetative crop growth.',
    specs: '46% Nitrogen • Neem Extract 0.035% • Suitable for all cereals & cash crops',
    imageURL: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
    tag: '🧪 Best Seller'
  },
  {
    id: 'fert-2',
    category: 'fertilizers',
    title: 'DAP (Di-Ammonium Phosphate 18:46:0)',
    brand: 'KRIBHCO',
    rate: 1350,
    unit: '50 kg bag',
    subsidy: 'Central Govt Subsidized',
    rating: 4.8,
    reviews: 980,
    inStock: true,
    description: 'High phosphate fertilizer essential for root development, seedling vigour, and early tillering in wheat, paddy, sugarcane, and potato.',
    specs: '18% Nitrogen • 46% Phosphorus • High water solubility',
    imageURL: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
    tag: '🌱 Root Booster'
  },
  {
    id: 'fert-3',
    category: 'fertilizers',
    title: 'NPK 19:19:19 Water Soluble Fertilizer',
    brand: 'Mahadhan',
    rate: 180,
    unit: '1 kg pack',
    subsidy: 'Quality Certified',
    rating: 4.7,
    reviews: 620,
    inStock: true,
    description: '100% water-soluble balanced multi-nutrient fertilizer ideal for drip fertigation and foliar spray during vegetative and flowering stages.',
    specs: '19% N, 19% P2O5, 19% K2O • Complete drip compatibility',
    imageURL: 'https://images.unsplash.com/photo-1592417817098-8f3d69104a47?auto=format&fit=crop&w=600&q=80',
    tag: '💧 Drip Compatible'
  },
  {
    id: 'fert-4',
    category: 'fertilizers',
    title: 'Organic Vermicompost Khad (Premium)',
    brand: 'Jaivik Krishi',
    rate: 450,
    unit: '40 kg bag',
    subsidy: 'Paramparagat Krishi Vikas (PKVY)',
    rating: 4.9,
    reviews: 840,
    inStock: true,
    description: 'Pure earthworm-processed organic manure enriched with beneficial soil microbes, humic acid, and micronutrients for long-term soil rejuvenation.',
    specs: '100% Organic • Moisture 20% • Rich in organic carbon & humic acid',
    imageURL: 'https://images.unsplash.com/photo-1584473457406-624048518851?auto=format&fit=crop&w=600&q=80',
    tag: '🌿 100% Organic'
  },

  // 2. High-Yield Seeds
  {
    id: 'seed-1',
    category: 'seeds',
    title: 'Certified Wheat Seeds (HD-3086 / Pusa Gautami)',
    brand: 'National Seeds Corporation (NSC)',
    rate: 1450,
    unit: '40 kg bag',
    subsidy: 'National Food Security Mission',
    rating: 4.9,
    reviews: 2150,
    inStock: true,
    description: 'High-yielding, climate-resilient wheat variety resistant to yellow and brown rust. Yield potential of 22-26 quintals per acre with excellent chapati quality.',
    specs: 'Maturity: 140-145 days • Rust Resistant • High protein 12.5%',
    imageURL: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    tag: '🌾 Certified Variety'
  },
  {
    id: 'seed-2',
    category: 'seeds',
    title: 'Pusa Basmati 1121 Paddy Seeds (Certified)',
    brand: 'IARI / NSC',
    rate: 850,
    unit: '10 kg pack',
    subsidy: 'Govt Certified Truthful Label',
    rating: 4.8,
    reviews: 1320,
    inStock: true,
    description: 'World-famous extra-long slender basmati rice variety known for exceptional aroma and elongation on cooking. Outstanding domestic & export demand.',
    specs: 'Maturity: 140 days • Grain Length: 8.4mm • High market premium',
    imageURL: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    tag: '🏆 Export Quality'
  },
  {
    id: 'seed-3',
    category: 'seeds',
    title: 'Hybrid Mustard Seeds (Pusa Bold / RH-749)',
    brand: 'Advanta Seeds',
    rate: 580,
    unit: '1.5 kg pack',
    subsidy: 'Oilseed Mission Scheme',
    rating: 4.7,
    reviews: 740,
    inStock: true,
    description: 'High oil-content mustard variety (40-42% oil recovery) with tolerance to frost and aphids. High branching structure maximizing seed yield.',
    specs: '40-42% Oil content • Bold grains • Maturity 135-140 days',
    imageURL: 'https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?auto=format&fit=crop&w=600&q=80',
    tag: '🌻 42% Oil Content'
  },
  {
    id: 'seed-4',
    category: 'seeds',
    title: 'Hybrid Tomato Seeds (Abhinav / US-440)',
    brand: 'Syngenta',
    rate: 890,
    unit: '10 gm pack (approx 3500 seeds)',
    subsidy: 'Commercial Farm Grade',
    rating: 4.9,
    reviews: 510,
    inStock: true,
    description: 'Determinate hybrid with firm, deep red fruits suitable for long-distance transport. High tolerance to TLCV (Tomato Leaf Curl Virus).',
    specs: 'Fruit weight: 90-100g • First harvest 65-70 days • Firm skin',
    imageURL: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    tag: '🍅 High Yield Hybrid'
  },

  // 3. Plants & Nursery Saplings
  {
    id: 'plant-1',
    category: 'plants',
    title: 'Tissue Culture Banana Saplings (Grand Naine G-9)',
    brand: 'Jain Tissue Culture',
    rate: 22,
    unit: 'per plant (Min order 50)',
    subsidy: 'Mission for Integrated Dev of Horticulture (MIDH)',
    rating: 4.9,
    reviews: 890,
    inStock: true,
    description: 'Virus-indexed, true-to-type Grand Naine banana plants yielding heavy uniform bunches (30-35 kg per bunch) within 11-12 months of planting.',
    specs: 'Bunch weight: 30-35 kg • Certified pathogen free • High export quality',
    imageURL: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    tag: '🍌 MIDH Subsidized'
  },
  {
    id: 'plant-2',
    category: 'plants',
    title: 'Grafted Alphonso / Kesar Mango Plants',
    brand: 'Konkan Agro Nursery',
    rate: 160,
    unit: 'per grafted sapling',
    subsidy: 'National Horticulture Board (NHB)',
    rating: 4.8,
    reviews: 640,
    inStock: true,
    description: 'Authentic stone-grafted mango saplings with sturdy rootstock. High-producing commercial clone ready for orchard plantation.',
    specs: 'Height: 2.5 - 3 ft • Graft age 1 yr • High survival rate 95%',
    imageURL: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    tag: '🥭 Verified Graft'
  },
  {
    id: 'plant-3',
    category: 'plants',
    title: 'High-Density Guava Saplings (Taiwan Pink / VNR Bihi)',
    brand: 'VNR Horticulture',
    rate: 95,
    unit: 'per plant',
    subsidy: 'Horticulture Mission Approved',
    rating: 4.7,
    reviews: 430,
    inStock: true,
    description: 'Crisp, sweet, large-fruited guava variety yielding in the very first year. Ideal for meadow orchard / high-density planting (1000 plants/acre).',
    specs: 'Fruit weight: 300-800g • Few seeds • Early bearing',
    imageURL: 'https://images.unsplash.com/photo-1536511135898-751792476566?auto=format&fit=crop&w=600&q=80',
    tag: '🍈 First Year Yield'
  },

  // 4. Equipment & Machinery
  {
    id: 'equip-1',
    category: 'equipment',
    title: '16L Dual-Motor Battery Operated Knapsack Sprayer',
    brand: 'AgriPro Star',
    rate: 2850,
    unit: 'complete kit',
    subsidy: 'Sub-Mission on Agri Mechanization (SMAM)',
    rating: 4.8,
    reviews: 1750,
    inStock: true,
    description: 'High-pressure 12V 12Ah battery sprayer with double motor pump, stainless steel telescopic lance, and 4 multi-angle spray nozzles for weed and pesticide sprays.',
    specs: '16 Litre Tank • 6-8 hrs battery runtime • Dual pressure regulator',
    imageURL: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    tag: '⚡ 40% SMAM Subsidy'
  },
  {
    id: 'equip-2',
    category: 'equipment',
    title: 'Solar Drip Irrigation Starter Kit (1 Acre Complete)',
    brand: 'Jain Irrigation Systems',
    rate: 16500,
    unit: 'complete 1 acre setup',
    subsidy: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    rating: 4.9,
    reviews: 620,
    inStock: true,
    description: 'Complete micro-irrigation system with UV-stabilized 16mm inline drip lateral pipes, screen filter, venturi fertilizer injector, and fittings for 1 acre.',
    specs: 'Covers 1 Acre • 40-70% PMKSY Subsidy Eligible • 5 Year Warranty',
    imageURL: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80',
    tag: '☀️ Up to 70% Subsidy'
  },
  {
    id: 'equip-3',
    category: 'equipment',
    title: '7 HP Petrol Power Weeder / Mini Rotary Tiller',
    brand: 'Kisankraft',
    rate: 34500,
    unit: 'unit with accessories',
    subsidy: 'Govt Mechanization Subsidy up to ₹15,000',
    rating: 4.8,
    reviews: 480,
    inStock: true,
    description: 'Heavy duty 4-stroke 7HP engine power tiller for inter-cultivation, de-weeding, soil aeration, and bed preparation in sugarcane, cotton, and orchards.',
    specs: '7 HP 212cc Engine • 32 Blades Rotavator • Adjustable tilling width',
    imageURL: 'https://images.unsplash.com/photo-1589923188651-268a9765e432?auto=format&fit=crop&w=600&q=80',
    tag: '🚜 Farmer Favorite'
  },
  {
    id: 'equip-4',
    category: 'equipment',
    title: 'Digital Soil NPK & Moisture Testing Meter (4-in-1)',
    brand: 'AgriTech Labs',
    rate: 1450,
    unit: 'portable tester',
    subsidy: 'Soil Health Mission Approved',
    rating: 4.6,
    reviews: 390,
    inStock: true,
    description: 'Instant digital field probe for checking Soil pH, Moisture %, Temperature, and Sunlight intensity to prevent over-fertilization and crop stress.',
    specs: '4-in-1 Probe • LCD Backlit Screen • Battery Operated • Instant readings',
    imageURL: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    tag: '🧪 Soil Health'
  }
];

function Marketplace() {
  // Navigation & Authentication
  const farmerId = localStorage.getItem('FarmerId');
  const isFarmerLoggedIn = !!farmerId;

  // Main Market Mode: 'produce' (normal crops) OR 'farmerSupplies' (seeds, fertilizers, equipment)
  const [activeTab, setActiveTab] = useState(isFarmerLoggedIn ? 'farmerSupplies' : 'produce');

  // Supplies Sub-view: 'browse' OR 'orders' (Order Tracking)
  const [suppliesView, setSuppliesView] = useState('browse');

  // Produce State
  const [products, setProducts] = useState([]);
  const [farmerData, setFarmerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduceCategory, setSelectedProduceCategory] = useState('all');

  // Farmer Supplies State
  const [suppliesCategory, setSuppliesCategory] = useState('all');
  const [suppliesSearch, setSuppliesSearch] = useState('');
  const [farmerOrders, setFarmerOrders] = useState([]);

  // Modals
  const [showProduceModal, setShowProduceModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [supplyQuantity, setSupplyQuantity] = useState(1);
  const [deliveryNote, setDeliveryNote] = useState('');

  // Fetch produce data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/market_product`);
        const prods = response.data?.data;
        const farms = response.data?.farmerData;

        if (prods && prods.length > 0) {
          setProducts(prods);
        }
        if (farms && farms.length > 0) {
          setFarmerData(farms);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching produce:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch Farmer Supply Orders (from database & localStorage)
  useEffect(() => {
    if (!farmerId) return;

    // 1. Initial load from localStorage for instant response
    try {
      const saved = localStorage.getItem(`farmer_supply_orders_${farmerId}`);
      if (saved) {
        setFarmerOrders(JSON.parse(saved));
      }
    } catch (e) {}

    // 2. Sync from backend MongoDB
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/farmerSupplyOrders/${farmerId}`);
        if (res.data?.supplyOrders && Array.isArray(res.data.supplyOrders)) {
          setFarmerOrders(res.data.supplyOrders);
          localStorage.setItem(`farmer_supply_orders_${farmerId}`, JSON.stringify(res.data.supplyOrders));
        }
      } catch (err) {
        // Fallback to local storage is already active
      }
    };

    fetchOrders();
  }, [farmerId]);

  // ── Purchase Produce (Consumer/Buyer) ──────────────────────────────────────
  const handleRequestToBuyProduce = (product) => {
    setSelectedProduct(product);
    setShowProduceModal(true);
  };

  const handleConfirmProducePurchase = async () => {
    const UserID = localStorage.getItem('UserId');
    const FarmerID = localStorage.getItem('FarmerId');
    const Token = localStorage.getItem('token');

    if (FarmerID) {
      toast.error('Farmers cannot buy produce. Switch to Farmer Supplies store to purchase seeds, fertilizer, and machinery!');
      setShowProduceModal(false);
      return;
    }

    if (!UserID || !Token) {
      toast.error('Please sign in as a Buyer to purchase produce.');
      setShowProduceModal(false);
      return;
    }

    try {
      if (UserID === selectedProduct.farmerId) {
        toast.error("You cannot buy your own listed product.");
        setShowProduceModal(false);
        return;
      }

      const AddOrder = await axios.post(`${API_BASE_URL}/myOrderUpdateUser?BuyerId=${UserID}`, {
        farmerId: selectedProduct.farmerId,
        buyerId: UserID,
        title: selectedProduct.title,
        price: selectedProduct.rate,
        quantity: quantity,
        farmLocation: selectedProduct.farmLocation?.[0] || selectedProduct.farmLocation,
        status: 'Pending',
        buyRequests: 'Requested',
      });

      if (AddOrder.status === 200) {
        toast.success(`Purchase order placed for ${quantity} kg of ${selectedProduct.title}! 🛒`);
        setShowProduceModal(false);
        setQuantity(1);
      } else {
        toast.error('Failed to send purchase request.');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      toast.error('An error occurred while sending order request.');
    }
  };

  // ── Purchase Farmer Input / Supplies (Farmer Only) ───────────────────────────
  const handleOrderSupply = (supply) => {
    setSelectedSupply(supply);
    setSupplyQuantity(1);
    setDeliveryNote('');
    setShowSupplyModal(true);
  };

  const handleConfirmSupplyOrder = async () => {
    if (!farmerId) {
      toast.error('Please log in with your Farmer account to order agricultural supplies.');
      setShowSupplyModal(false);
      return;
    }

    const orderRef = 'KISAN-' + Math.floor(100000 + Math.random() * 900000);
    const estDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
      weekday: 'short', month: 'short', day: 'numeric'
    });

    const newOrder = {
      orderRef,
      itemTitle: selectedSupply.title,
      brand: selectedSupply.brand,
      category: selectedSupply.category,
      rate: selectedSupply.rate,
      unit: selectedSupply.unit,
      quantity: supplyQuantity,
      totalAmount: supplyQuantity * selectedSupply.rate,
      subsidy: selectedSupply.subsidy,
      imageURL: selectedSupply.imageURL,
      deliveryNote: deliveryNote.trim() || 'Direct farm gate delivery',
      status: 'Confirmed',
      orderDate: new Date().toISOString(),
      estimatedDelivery: estDate
    };

    // 1. Update state & localStorage immediately
    const updated = [newOrder, ...farmerOrders];
    setFarmerOrders(updated);
    try {
      localStorage.setItem(`farmer_supply_orders_${farmerId}`, JSON.stringify(updated));
    } catch (e) {}

    // 2. Persist to MongoDB backend
    try {
      await axios.post(`${API_BASE_URL}/api/farmerSupplyOrder`, {
        farmerId,
        orderData: newOrder
      });
    } catch (err) {
      console.warn('Backend order save fallback to local state:', err);
    }

    toast.success(`Booking #${orderRef} confirmed! Data saved to your Farm Orders.`, {
      duration: 5000,
      icon: '🚜'
    });

    setShowSupplyModal(false);
    // Switch to orders view so farmer can immediately track it!
    setSuppliesView('orders');
  };

  // Cancel order handler
  const handleCancelSupplyOrder = async (orderRef) => {
    if (!window.confirm(`Are you sure you want to cancel booking #${orderRef}?`)) return;

    const updated = farmerOrders.filter(o => o.orderRef !== orderRef);
    setFarmerOrders(updated);
    try {
      localStorage.setItem(`farmer_supply_orders_${farmerId}`, JSON.stringify(updated));
      await axios.delete(`${API_BASE_URL}/api/farmerSupplyOrder/${farmerId}/${orderRef}`);
    } catch (e) {}

    toast.success(`Booking #${orderRef} cancelled successfully.`);
  };

  // ── Filtered Produce List ──────────────────────────────────────────────────
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === '' ||
      product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedProduceCategory === 'all') return matchesSearch;
    const cat = detectCategory(product);
    return cat === selectedProduceCategory && matchesSearch;
  });

  // ── Filtered Supplies List ─────────────────────────────────────────────────
  const filteredSupplies = FARMER_SUPPLIES.filter((item) => {
    const matchesCat = suppliesCategory === 'all' || item.category === suppliesCategory;
    const matchesQuery =
      suppliesSearch === '' ||
      item.title.toLowerCase().includes(suppliesSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(suppliesSearch.toLowerCase()) ||
      item.specs.toLowerCase().includes(suppliesSearch.toLowerCase()) ||
      item.brand.toLowerCase().includes(suppliesSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Main Marketplace Header Banner ── */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-emerald-200 mb-2">
                <FaSeedling className="text-emerald-300" /> Direct Agricultural Trade
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                AgriConnect Marketplace
              </h1>
              <p className="text-emerald-100/90 text-sm mt-1 max-w-xl">
                Trade fresh produce with zero middlemen, or access certified seeds, fertilizers, and farm equipment with government subsidy support.
              </p>
            </div>

            {/* Quick Stats Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                <div className="text-xl sm:text-2xl font-black text-white">{products.length}+</div>
                <div className="text-[11px] text-emerald-200">Fresh Produce</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                <div className="text-xl sm:text-2xl font-black text-white">{farmerData.length || 12}+</div>
                <div className="text-[11px] text-emerald-200">Local Farms</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 col-span-2 sm:col-span-1">
                <div className="text-xl sm:text-2xl font-black text-white">{farmerOrders.length}</div>
                <div className="text-[11px] text-emerald-200">My Farm Orders</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mode Switcher Tabs (Fresh Produce vs Farmer Inputs) ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-sm border border-emerald-100">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Produce Market Tab */}
            <button
              onClick={() => setActiveTab('produce')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'produce'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <FaShoppingCart className="text-sm" />
              <span>Fresh Produce Market</span>
            </button>

            {/* Farmer Supplies Tab (Only accessible when logged in as Farmer) */}
            {isFarmerLoggedIn && (
              <button
                onClick={() => setActiveTab('farmerSupplies')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'farmerSupplies'
                    ? 'bg-gradient-to-r from-teal-700 to-emerald-600 text-white shadow-md shadow-teal-700/20'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <FaTractor className="text-sm" />
                <span>🚜 Farmer Supplies Store</span>
                <span className="text-[10px] bg-amber-400 text-amber-950 font-extrabold px-2 py-0.5 rounded-full">
                  Kisan Store
                </span>
              </button>
            )}
          </div>

          {/* If farmer is NOT logged in, show an informational nudge */}
          {!isFarmerLoggedIn && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-xl">
              <FaUserLock className="text-amber-600 text-sm flex-shrink-0" />
              <span>
                Are you a farmer? <Link to="/login" className="text-emerald-700 font-bold hover:underline">Log in as Farmer</Link> to buy subsidized seeds, fertilizer, and machinery.
              </span>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            MODE 1: FRESH PRODUCE MARKETPLACE (FOR CONSUMERS / BUYERS)
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'produce' && (
          <div className="space-y-6">

            {/* Controls Bar: Search & Category Pills */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-xs pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search fresh vegetables, fruits, grains, pulses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedProduceCategory(cat.id)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                      selectedProduceCategory === cat.id
                        ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <span>{cat.emoji} {cat.label}</span>
                  </button>
                ))}
              </div>

            </div>

            {/* Produce Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <Skeleton height={160} borderRadius={16} />
                    <Skeleton count={3} style={{ marginTop: '0.75rem' }} />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white/80 rounded-3xl p-12 text-center border border-emerald-100 shadow-sm space-y-3">
                <div className="text-5xl">🌱</div>
                <h3 className="text-lg font-bold text-slate-800">No Farm Produce Matches Your Search</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Try clearing your search query or selecting a different category from above.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedProduceCategory('all'); }}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition"
                >
                  View All Produce
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Product Image */}
                      <div className="relative h-44 bg-slate-100 overflow-hidden">
                        {isValidURL(product.imageURL) ? (
                          <img
                            src={product.imageURL}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100">
                            <FaSeedling className="text-4xl text-emerald-500" />
                          </div>
                        )}
                        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-700 shadow-sm">
                          Direct from Farm
                        </span>
                      </div>

                      {/* Product Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-bold text-slate-800 truncate" title={product.title}>
                            {product.title}
                          </h3>
                        </div>

                        <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                          {product.description || 'Farm-fresh quality harvested directly from verified local fields.'}
                        </p>

                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                          <div>
                            <span className="text-xs text-slate-400">Price</span>
                            <div className="text-lg font-black text-emerald-700">
                              ₹{product.rate}
                              <span className="text-xs font-normal text-slate-500">/kg</span>
                            </div>
                          </div>

                          {product.quantity && (
                            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              {product.quantity} kg available
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-emerald-500" />
                          <span className="truncate">
                            {product.farmLocation?.[0]?.district || 'Local'}, {product.farmLocation?.[0]?.state || 'Mandi'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-4 pt-0">
                      <button
                        onClick={() => handleRequestToBuyProduce(product)}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <FaShoppingCart className="text-xs" />
                        <span>Request to Buy</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            MODE 2: FARMER SUPPLIES & INPUTS STORE (ONLY FOR LOGGED IN FARMERS)
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'farmerSupplies' && isFarmerLoggedIn && (
          <div className="space-y-6">

            {/* Kisan Store Hero Bar */}
            <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-white/10 text-amber-300">
                    <FaTractor className="text-base" />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black">
                    Kisan Seva Kendra: Farm Inputs & Supplies
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-xl">
                  Order certified hybrid seeds, fertilizers, tissue-culture saplings, and modern subsidized machinery directly to your farm gate.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3 py-1.5 rounded-full font-semibold">
                  <FaShieldAlt className="text-amber-400" /> 100% Certified Quality
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs bg-amber-500/20 text-amber-200 border border-amber-400/30 px-3 py-1.5 rounded-full font-semibold">
                  <FaPercent /> Govt Subsidies Applicable
                </span>
              </div>
            </div>

            {/* Sub-View Switcher: Browse Supplies vs Track My Farm Orders */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSuppliesView('browse')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    suppliesView === 'browse'
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <FaBoxOpen className="text-xs" />
                  <span>Browse Inputs & Machinery</span>
                </button>

                <button
                  onClick={() => setSuppliesView('orders')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    suppliesView === 'orders'
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <FaTruck className="text-xs" />
                  <span>My Farm Orders</span>
                  {farmerOrders.length > 0 && (
                    <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {farmerOrders.length}
                    </span>
                  )}
                </button>
              </div>

              <span className="text-xs text-slate-400 hidden sm:inline">
                {suppliesView === 'browse' ? `${filteredSupplies.length} products available` : `${farmerOrders.length} active orders`}
              </span>
            </div>

            {/* ── Sub-View A: Browse Supplies Catalog ── */}
            {suppliesView === 'browse' && (
              <div className="space-y-6">
                
                {/* Filter & Search Bar */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-xs pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search Urea, DAP, Basmati, Spray pump, Tiller..."
                      value={suppliesSearch}
                      onChange={(e) => setSuppliesSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 transition"
                    />
                  </div>

                  {/* Sub-Category Filter Buttons */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                    {[
                      { id: 'all', label: 'All Supplies', icon: <FaBoxOpen /> },
                      { id: 'fertilizers', label: 'Fertilizers', icon: <FaFlask /> },
                      { id: 'seeds', label: 'Certified Seeds', icon: <FaSeedling /> },
                      { id: 'plants', label: 'Plants & Saplings', icon: <FaTree /> },
                      { id: 'equipment', label: 'Machinery & Tools', icon: <FaTools /> },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSuppliesCategory(cat.id)}
                        className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                          suppliesCategory === cat.id
                            ? 'bg-teal-700 text-white shadow-md font-semibold'
                            : 'bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-800'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>

                </div>

                {/* Supplies Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredSupplies.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Item Image & Badge */}
                        <div className="relative h-44 bg-slate-100 overflow-hidden">
                          <img
                            src={item.imageURL}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-teal-800 shadow-sm flex items-center gap-1">
                            {item.tag}
                          </span>
                          {item.subsidy && (
                            <span className="absolute bottom-2.5 right-2.5 bg-amber-500/90 text-white backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold shadow">
                              {item.subsidy}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-semibold text-teal-700">{item.brand}</span>
                            <span className="flex items-center gap-1 text-amber-500 font-bold">
                              <FaStar className="text-[10px]" /> {item.rating} ({item.reviews})
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-800 leading-snug line-clamp-1" title={item.title}>
                            {item.title}
                          </h3>

                          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] text-slate-600 border border-slate-100 font-medium">
                            {item.specs}
                          </div>

                          {/* Pricing */}
                          <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Farmer Price</span>
                              <span className="text-xl font-black text-slate-900">
                                ₹{item.rate.toLocaleString()}
                              </span>
                              <span className="text-xs text-slate-500 font-normal ml-1">/ {item.unit}</span>
                            </div>

                            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                              <FaCheckCircle className="text-[10px]" /> In Stock
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Button */}
                      <div className="p-4 pt-0">
                        <button
                          onClick={() => handleOrderSupply(item)}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-700/20 hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                        >
                          <FaTractor className="text-xs" />
                          <span>Order for Farm</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ── Sub-View B: Order Tracking Center (My Farm Orders) ── */}
            {suppliesView === 'orders' && (
              <div className="space-y-6">
                
                {farmerOrders.length === 0 ? (
                  <div className="bg-white/90 rounded-3xl p-12 text-center border border-emerald-100 shadow-sm space-y-4">
                    <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto text-3xl">
                      <FaBoxOpen />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">No Farm Supplies Ordered Yet</h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                      Explore our subsidized fertilizers, certified high-yield seeds, nursery saplings, and equipment to place your first booking.
                    </p>
                    <button
                      onClick={() => setSuppliesView('browse')}
                      className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-md transition"
                    >
                      Browse Supplies Catalog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                      <span>Showing all farm input bookings tied to Farmer ID: <strong className="text-slate-700">{farmerId}</strong></span>
                      <span>{farmerOrders.length} bookings total</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {farmerOrders.map((order, idx) => (
                        <div
                          key={order.orderRef || idx}
                          className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4 hover:shadow-md transition"
                        >
                          {/* Order Card Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                              <span className="p-2 rounded-xl bg-teal-50 text-teal-700 text-lg">
                                <FaTractor />
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-base font-black text-slate-800">
                                    {order.orderRef}
                                  </h4>
                                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                    {order.status || 'Confirmed'}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400">
                                  Booked on: {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-xs text-slate-400 block">Total Amount</span>
                              <span className="text-xl font-black text-teal-800">
                                ₹{order.totalAmount?.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Live Delivery Progress Tracker */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="text-xs font-bold text-slate-700 mb-3 flex items-center justify-between">
                              <span>Estimated Farm Delivery: <strong className="text-emerald-700">{order.estimatedDelivery}</strong></span>
                              <span className="text-[11px] text-teal-700 font-semibold">{order.subsidy}</span>
                            </div>

                            <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
                              <div className="space-y-1">
                                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-[10px] font-bold">
                                  ✓
                                </div>
                                <span className="font-semibold text-slate-700 block">Order Placed</span>
                                <span className="text-[10px] text-slate-400">Verified</span>
                              </div>

                              <div className="space-y-1">
                                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-[10px] font-bold">
                                  ✓
                                </div>
                                <span className="font-semibold text-slate-700 block">Depot Processing</span>
                                <span className="text-[10px] text-slate-400">Packed</span>
                              </div>

                              <div className="space-y-1">
                                <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto text-[10px] font-bold animate-pulse">
                                  🚚
                                </div>
                                <span className="font-bold text-teal-700 block">Dispatched</span>
                                <span className="text-[10px] text-teal-600">In Transit</span>
                              </div>

                              <div className="space-y-1 opacity-60">
                                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto text-[10px] font-bold">
                                  4
                                </div>
                                <span className="font-medium text-slate-600 block">Farm Gate</span>
                                <span className="text-[10px] text-slate-400">{order.estimatedDelivery}</span>
                              </div>
                            </div>
                          </div>

                          {/* Item Details Row */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                            <div className="flex items-center gap-3">
                              {order.imageURL && (
                                <img
                                  src={order.imageURL}
                                  alt={order.itemTitle}
                                  className="w-14 h-14 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                                />
                              )}
                              <div>
                                <h5 className="text-sm font-bold text-slate-800">{order.itemTitle}</h5>
                                <p className="text-xs text-slate-500">
                                  Brand: <strong>{order.brand}</strong> • Quantity: <strong>{order.quantity} x {order.unit}</strong>
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  📍 Instructions: {order.deliveryNote || 'Standard farm delivery'}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCancelSupplyOrder(order.orderRef)}
                                className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-xl font-semibold border border-red-200 transition flex items-center gap-1"
                              >
                                <FaTrashAlt className="text-[10px]" />
                                <span>Cancel Booking</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </div>

      {/* ── Modal 1: Buy Fresh Produce (Consumer) ── */}
      {showProduceModal && selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowProduceModal(false); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg">
                  <FaSeedling />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">{selectedProduct.title}</h3>
                  <p className="text-xs text-slate-400">Fresh Produce Purchase Request</p>
                </div>
              </div>
              <button
                onClick={() => setShowProduceModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <FaTimes />
              </button>
            </div>

            <div className="my-4 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-600 font-medium">Rate per kilogram</span>
                <div className="text-xl font-black text-emerald-800">₹{selectedProduct.rate}</div>
              </div>
              <div className="text-right text-xs text-slate-500">
                📍 {selectedProduct.farmLocation?.[0]?.district}, {selectedProduct.farmLocation?.[0]?.state}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Quantity (kg):</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">Total Estimate:</span>
              <span className="text-lg font-black text-emerald-700">
                ₹{(quantity * selectedProduct.rate).toLocaleString()}
              </span>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowProduceModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmProducePurchase}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal 2: Order Farmer Supplies / Inputs (Farmer) ── */}
      {showSupplyModal && selectedSupply && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowSupplyModal(false); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-lg">
                  <FaTractor />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">{selectedSupply.title}</h3>
                  <p className="text-xs text-teal-600 font-medium">{selectedSupply.brand} • {selectedSupply.subsidy}</p>
                </div>
              </div>
              <button
                onClick={() => setShowSupplyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <FaTimes />
              </button>
            </div>

            <div className="my-4 bg-teal-50/70 p-3.5 rounded-2xl border border-teal-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-teal-700 font-medium">Subsidized Price per {selectedSupply.unit}</span>
                <div className="text-2xl font-black text-slate-900">₹{selectedSupply.rate.toLocaleString()}</div>
              </div>
              <span className="text-[11px] bg-teal-200/80 text-teal-900 font-bold px-2.5 py-1 rounded-full">
                Direct Farm Delivery
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity ({selectedSupply.unit}):</label>
                <input
                  type="number"
                  min="1"
                  value={supplyQuantity}
                  onChange={(e) => setSupplyQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Payable:</label>
                <div className="w-full px-3.5 py-2.5 bg-slate-100 rounded-xl text-base font-black text-teal-800">
                  ₹{(supplyQuantity * selectedSupply.rate).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Farm Delivery Address / Instructions (Optional):
              </label>
              <textarea
                rows={2}
                placeholder="Village name, nearby landmark, or specific delivery date..."
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="mt-3 p-3 bg-amber-50 rounded-2xl border border-amber-200/70 text-[11px] text-amber-800 leading-relaxed flex items-start gap-2">
              <FaShieldAlt className="text-amber-600 text-sm mt-0.5 flex-shrink-0" />
              <span>
                Under National Agricultural Schemes, subsidized inputs are verified using your registered Farmer ID upon dispatch. Zero upfront advance needed.
              </span>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowSupplyModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSupplyOrder}
                className="flex-1 py-2.5 bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                Confirm Farm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
}

export default Marketplace;
