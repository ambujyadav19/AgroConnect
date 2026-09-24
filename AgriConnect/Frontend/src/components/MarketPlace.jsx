import { faSeedling } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { API_BASE_URL } from '../config';
import CategorySelect, { detectCategory } from './CategorySelect';

const isValidURL = (urlString) => {
  try {
    new URL(urlString);
    return true;
  } catch (_) {
    return false;
  }
};

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [farmerData, setFarmerData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Category state — null means "show category selection screen"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/market_product`);
        const products = response.data?.data;
        const farms = response.data?.farmerData;

        if (products && products.length > 0) {
          setProducts(products);
        } else {
          console.log('No products found');
        }

        if (farms && farms.length > 0) {
          setFarmerData(farms);
        } else {
          console.log('No farmers found');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error in fetching', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRequestToBuy = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleConfirmPurchase = async () => {
    const UserID = localStorage.getItem('UserId');
    const FarmerID = localStorage.getItem('FarmerId');
    const Token = localStorage.getItem('token');

    if (FarmerID) {
      toast.error('To place an order, please log in as a User. You are currently logged in as a Farmer.');
      setShowModal(false);
      return;
    }

    if (UserID && Token) {
      try {
        if (UserID === selectedProduct.farmerId) {
          toast.error("You can't buy your own product");
          setShowModal(false);
          return;
        }

        const AddOrderInUserOrders = await axios.post(`${API_BASE_URL}/myOrderUpdateUser?BuyerId=${UserID}`, {
          farmerId: selectedProduct.farmerId,
          buyerId: UserID,
          title: selectedProduct.title,
          price: selectedProduct.rate,
          quantity: quantity,
          farmLocation: selectedProduct.farmLocation?.[0] || selectedProduct.farmLocation,
          status: 'Pending',
          buyRequests: 'Requested',
        });

        if (AddOrderInUserOrders.status === 200) {
          toast.success(`Order placed for ${quantity} kg of ${selectedProduct.title}! 🛒`);
          setShowModal(false);
          setQuantity(1);
        } else {
          toast.error('Failed to send buy request');
          setShowModal(false);
        }
      } catch (err) {
        console.error('Error', err);
        toast.error('An error occurred while processing your request');
        setShowModal(false);
      }
    } else {
      toast.error('Please sign up to buy anything');
      setShowModal(false);
    }
  };

  const handleModalClose = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  // ── Filter products by category + search query ──────────────────────────────
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === '' ||
      product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!selectedCategory || selectedCategory.id === 'all') return matchesSearch;

    const productCategory = detectCategory(product);
    return productCategory === selectedCategory.id && matchesSearch;
  });

  // ── Step 1: Show category selection if none chosen ───────────────────────────
  if (!selectedCategory) {
    return <CategorySelect onSelectCategory={setSelectedCategory} />;
  }

  // ── Step 2: Show filtered marketplace ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      {/* ── Top Bar: Category info + controls ── */}
      <div className="sticky top-0 z-20 bg-green-900/95 backdrop-blur-sm border-b border-white/10 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">

          {/* Back to categories */}
          <button
            onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
            className="flex items-center gap-1.5 text-green-300 hover:text-white text-sm font-medium transition-colors duration-200 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full"
          >
            ← Categories
          </button>

          {/* Active category badge */}
          <div className="flex items-center gap-2 bg-white/15 border border-white/20 px-3 py-1.5 rounded-full">
            <span className="text-lg">{selectedCategory.emoji}</span>
            <span className="text-white font-semibold text-sm">{selectedCategory.label}</span>
            <span className="text-green-300 text-xs">({filteredProducts.length} items)</span>
          </div>

          {/* Search bar */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder={`Search in ${selectedCategory.label}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white placeholder-green-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white/20 transition-all"
            />
          </div>

          {/* Quick category switcher pills */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto">
            {['🛒 All', '🥦 Veg', '🍎 Fruits', '🌾 Grains', '🥛 Dairy', '🌶️ Spices'].map((label, i) => {
              const ids = ['all', 'vegetables', 'fruits', 'grains', 'dairy', 'spices'];
              const emojis = ['🛒', '🥦', '🍎', '🌾', '🥛', '🌶️'];
              const labels = ['All', 'Vegetables', 'Fruits', 'Grains & Pulses', 'Dairy & Poultry', 'Spices & Herbs'];
              const colors = ['from-green-500 to-emerald-600', 'from-green-400 to-lime-500', 'from-red-400 to-orange-500', 'from-yellow-500 to-amber-600', 'from-blue-300 to-sky-500', 'from-red-500 to-rose-600'];
              const isActive = selectedCategory.id === ids[i];
              return (
                <button
                  key={ids[i]}
                  onClick={() => setSelectedCategory({ id: ids[i], label: labels[i], emoji: emojis[i], color: colors[i] })}
                  className={`whitespace-nowrap text-xs px-3 py-1 rounded-full font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-green-900 shadow'
                      : 'bg-white/10 text-green-200 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{selectedCategory.emoji}</span>
          <div>
            <h2 className="text-white text-xl font-bold">{selectedCategory.label}</h2>
            <p className="text-green-300 text-sm">{selectedCategory.description}</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white p-4 rounded-2xl shadow-lg">
                <Skeleton height={150} borderRadius={12} />
                <Skeleton count={3} style={{ marginTop: '1rem' }} />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-7xl mb-4">🌱</div>
            <h3 className="text-white text-2xl font-bold mb-2">No products found</h3>
            <p className="text-green-300 mb-6">
              {searchQuery
                ? `No results for "${searchQuery}" in ${selectedCategory.label}`
                : `No ${selectedCategory.label.toLowerCase()} listed yet`}
            </p>
            <button
              onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
              className="bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-2.5 rounded-full transition-colors"
            >
              Browse Other Categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-105 group"
              >
                {/* Product Image */}
                <div className="relative h-40 bg-green-50 overflow-hidden">
                  {isValidURL(product.imageURL) ? (
                    <img
                      src={product.imageURL}
                      alt={product.title || 'Product Image'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200">
                      <FontAwesomeIcon className="text-5xl text-green-500" icon={faSeedling} />
                    </div>
                  )}
                  {/* Category tag */}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-semibold text-green-700 px-2 py-0.5 rounded-full shadow">
                    {selectedCategory.emoji} {selectedCategory.label}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 truncate">{product.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-green-700 font-bold text-lg">₹{product.rate}<span className="text-xs font-normal text-gray-400">/kg</span></span>
                    {product.quantity && (
                      <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                        {product.quantity} kg left
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                    📍 {product.farmLocation?.[0]?.district}, {product.farmLocation?.[0]?.state}
                  </p>

                  <button
                    onClick={() => handleRequestToBuy(product)}
                    className="mt-4 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 shadow hover:shadow-lg"
                  >
                    Request to Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Buy Modal ── */}
      {showModal && selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4"
          onClick={handleModalClose}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <FontAwesomeIcon className="text-green-600" icon={faSeedling} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedProduct.title}</h2>
                <p className="text-sm text-gray-500">Request to Purchase</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-3 mb-4">
              <p className="text-green-800 font-semibold text-lg">₹{selectedProduct.rate}<span className="text-sm font-normal text-green-600"> per kg</span></p>
              <p className="text-green-600 text-sm mt-0.5">
                📍 {selectedProduct.farmLocation?.[0]?.district}, {selectedProduct.farmLocation?.[0]?.state}
              </p>
            </div>

            <label className="block text-gray-700 font-semibold mb-2">Quantity (kg)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="w-full border-2 border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 font-medium"
            />

            {quantity > 0 && (
              <p className="text-green-600 text-sm mt-2 font-medium">
                Total estimate: ₹{(quantity * selectedProduct.rate).toLocaleString()}
              </p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-2.5 rounded-xl transition-all shadow hover:shadow-lg"
              >
                Confirm Purchase
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
