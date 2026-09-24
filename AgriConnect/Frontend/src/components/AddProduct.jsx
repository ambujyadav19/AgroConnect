import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling, faTrash, faPlus, faTimes, faTag, faImage, faWeightScale, faIndianRupeeSign, faAlignLeft, faBoxes, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../config';
import { CATEGORIES } from './CategorySelect';

// ── Helpers ─────────────────────────────────────────────────────────────────
const isValidURL = (urlString) => {
    try { new URL(urlString); return true; } catch (_) { return false; }
};

// Category options (excluding "all")
const PRODUCT_CATEGORIES = CATEGORIES.filter(c => c.id !== 'all');

// ── Component ────────────────────────────────────────────────────────────────
const ProductManager = () => {
    // Form state (Add new product)
    const [title, setTitle]           = useState('');
    const [rate, setRate]             = useState('');
    const [description, setDescription] = useState('');
    const [imageURL, setImageURL]     = useState('');
    const [quantity, setQuantity]     = useState('');
    const [category, setCategory]     = useState('');

    // Location (auto-filled from farmer profile)
    const [pincode, setPincode]   = useState('');
    const [State, setState]       = useState('');
    const [District, setDistrict] = useState('');

    // UI state
    const [products, setProducts]   = useState([]);
    const [fetched, setFetched]     = useState(true);
    const [DelFetch, setDelFetch]   = useState(false);
    const [ProFetch, setProFetch]   = useState(false);
    const [showForm, setShowForm]   = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [filterCat, setFilterCat] = useState('all');

    // ── Price & Product Edit States ──────────────────────────────────────────
    // Inline quick-edit state
    const [editingProductId, setEditingProductId] = useState(null);
    const [inlineRate, setInlineRate]             = useState('');
    const [savingInline, setSavingInline]         = useState(false);

    // Full edit modal state
    const [editModalProduct, setEditModalProduct] = useState(null);
    const [editTitle, setEditTitle]               = useState('');
    const [editRate, setEditRate]                 = useState('');
    const [editQuantity, setEditQuantity]         = useState('');
    const [editDescription, setEditDescription]   = useState('');
    const [editCategory, setEditCategory]         = useState('');
    const [savingModal, setSavingModal]           = useState(false);

    // ── Fetch farmer data & products ─────────────────────────────────────────
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const farmerID = localStorage.getItem('FarmerId');
                const response = await axios.get(`${API_BASE_URL}/addProduct?farmerId=${farmerID}`);
                const items = response.data?.farmerData?.productSell;
                if (items && items.length > 0) {
                    setProducts(items);
                    setFetched(false);
                } else {
                    setProducts([]);
                    setFetched(true);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const fetchFarmerLocation = async () => {
            try {
                const farmerID = localStorage.getItem('FarmerId');
                if (!farmerID) return;
                const response = await axios.get(`${API_BASE_URL}/currentFarmerData?FarmerID=${farmerID}`);
                if (response.status === 200) {
                    const loc = response.data.farmerData?.farmLocation?.[0];
                    if (loc) {
                        setState(loc.state || '');
                        setDistrict(loc.district || '');
                        setPincode(loc.pincode || '');
                    }
                }
            } catch (err) {
                console.error('Error fetching farmer:', err);
            }
        };

        fetchFarmerLocation();
        fetchProducts();
    }, [DelFetch, ProFetch]);

    // ── Add product ──────────────────────────────────────────────────────────
    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!title || !rate || !quantity || !description || !category) {
            toast.error('Please fill all required fields including category!');
            return;
        }
        setSubmitting(true);
        try {
            const farmerId = localStorage.getItem('FarmerId');
            const payload = {
                farmerId,
                title,
                description,
                category,
                rate,
                imageURL,
                quantity,
                farmLocation: [{ pincode: parseInt(pincode, 10), state: State, district: District }],
            };
            await axios.post(`${API_BASE_URL}/updateProduct/${farmerId}`, payload);
            toast.success('Product listed successfully! 🌱');
            setProFetch(prev => !prev);
            // Reset form
            setTitle(''); setDescription(''); setRate('');
            setImageURL(''); setQuantity(''); setCategory('');
            setShowForm(false);
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Failed to add product. Try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Delete product ───────────────────────────────────────────────────────
    const handleDelete = async (productID) => {
        try {
            const ID = localStorage.getItem('FarmerId');
            const res = await axios.delete(`${API_BASE_URL}/deleteMyProduct?farmerId=${ID}&productId=${productID}`);
            if (res.status === 200) {
                toast.success('Product removed');
                setDelFetch(prev => !prev);
            }
        } catch (err) {
            console.error('Error:', err);
            toast.error('Failed to delete product');
        }
    };

    // ── Quick Inline Price Edit Handlers ─────────────────────────────────────
    const startInlineEdit = (product, e) => {
        e?.stopPropagation();
        setEditingProductId(product._id);
        setInlineRate(product.rate || '');
    };

    const cancelInlineEdit = (e) => {
        e?.stopPropagation();
        setEditingProductId(null);
        setInlineRate('');
    };

    const handleSaveInlinePrice = async (productId) => {
        if (!inlineRate || isNaN(inlineRate) || Number(inlineRate) < 0) {
            toast.error('Please enter a valid price (₹/kg)');
            return;
        }
        setSavingInline(true);
        try {
            const farmerId = localStorage.getItem('FarmerId');
            await axios.put(`${API_BASE_URL}/editProductPrice`, {
                farmerId,
                productId,
                rate: inlineRate,
            });
            toast.success(`Price updated to ₹${inlineRate}/kg! 🏷️`);
            // Update local state immediately for instant feedback
            setProducts(prev => prev.map(p => p._id === productId ? { ...p, rate: inlineRate } : p));
            setEditingProductId(null);
        } catch (err) {
            console.error('Error updating price:', err);
            toast.error('Failed to update price. Please try again.');
        } finally {
            setSavingInline(false);
        }
    };

    // ── Full Edit Modal Handlers ─────────────────────────────────────────────
    const openEditModal = (product, e) => {
        e?.stopPropagation();
        setEditModalProduct(product);
        setEditTitle(product.title || '');
        setEditRate(product.rate || '');
        setEditQuantity(product.quantity || '');
        setEditDescription(product.description || '');
        setEditCategory(product.category || 'other');
    };

    const closeEditModal = () => {
        setEditModalProduct(null);
    };

    const handleSaveModalEdit = async (e) => {
        e.preventDefault();
        if (!editRate || isNaN(editRate) || Number(editRate) < 0) {
            toast.error('Please enter a valid price (₹/kg)');
            return;
        }
        setSavingModal(true);
        try {
            const farmerId = localStorage.getItem('FarmerId');
            await axios.put(`${API_BASE_URL}/editProductPrice`, {
                farmerId,
                productId: editModalProduct._id,
                rate: editRate,
                quantity: editQuantity,
                title: editTitle,
                description: editDescription,
                category: editCategory
            });
            toast.success('Product updated successfully! 🌱');
            setProducts(prev => prev.map(p => p._id === editModalProduct._id ? {
                ...p,
                rate: editRate,
                quantity: editQuantity ? Number(editQuantity) : p.quantity,
                title: editTitle,
                description: editDescription,
                category: editCategory
            } : p));
            closeEditModal();
        } catch (err) {
            console.error('Error updating product:', err);
            toast.error('Failed to update product details');
        } finally {
            setSavingModal(false);
        }
    };

    // ── Get category info helper ─────────────────────────────────────────────
    const getCatInfo = (catId) => PRODUCT_CATEGORIES.find(c => c.id === catId) || { emoji: '📦', label: 'Other', color: 'from-gray-400 to-gray-500' };

    // ── Filtered products ────────────────────────────────────────────────────
    const displayedProducts = filterCat === 'all'
        ? products
        : products.filter(p => p.category === filterCat);

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 pb-16">

            {/* ── Page Header ── */}
            <div className="bg-green-900/80 backdrop-blur-sm border-b border-white/10 px-6 py-5">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <FontAwesomeIcon icon={faSeedling} className="text-green-400" />
                            My Product Listings
                        </h1>
                        <p className="text-green-300 text-sm mt-0.5">Manage your farm products for sale</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-green-500/30 transition-all duration-200"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Add New Product
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-6">

                {/* ── Category Filter Tabs ── */}
                <div className="flex items-center gap-2 flex-wrap mb-6">
                    <button
                        onClick={() => setFilterCat('all')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${filterCat === 'all' ? 'bg-white text-green-900 shadow' : 'bg-white/10 text-green-200 hover:bg-white/20'}`}
                    >
                        🛒 All ({products.length})
                    </button>
                    {PRODUCT_CATEGORIES.map(cat => {
                        const count = products.filter(p => p.category === cat.id).length;
                        if (count === 0) return null;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setFilterCat(cat.id)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${filterCat === cat.id ? 'bg-white text-green-900 shadow' : 'bg-white/10 text-green-200 hover:bg-white/20'}`}
                            >
                                {cat.emoji} {cat.label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* ── Empty State ── */}
                {fetched || displayedProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="text-7xl mb-4">🌾</div>
                        <h3 className="text-white text-2xl font-bold mb-2">No products listed yet</h3>
                        <p className="text-green-300 mb-6">Start adding your farm products to sell in the marketplace</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-2.5 rounded-full transition-colors"
                        >
                            + Add Your First Product
                        </button>
                    </div>
                ) : (
                    /* ── Product Grid ── */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {displayedProducts.slice().reverse().map((product) => {
                            const catInfo = getCatInfo(product.category);
                            const isInlineEditing = editingProductId === product._id;
                            return (
                                <div key={product._id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
                                    {/* Top section: image, badges, buttons */}
                                    <div>
                                        <div className="relative h-44 overflow-hidden">
                                            {isValidURL(product.imageURL) ? (
                                                <img
                                                    src={product.imageURL}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"
                                                    style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' }}>
                                                    <span className="text-5xl">{catInfo.emoji}</span>
                                                </div>
                                            )}
                                            {/* Category badge */}
                                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full shadow text-xs font-semibold text-green-800">
                                                <span>{catInfo.emoji}</span>
                                                <span>{catInfo.label}</span>
                                            </div>

                                            {/* Action buttons (Edit & Delete) */}
                                            <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                <button
                                                    onClick={(e) => openEditModal(product, e)}
                                                    title="Edit Product & Price"
                                                    className="w-7 h-7 bg-white/95 hover:bg-white text-gray-700 hover:text-green-600 rounded-full flex items-center justify-center shadow transition-all duration-150"
                                                >
                                                    <FontAwesomeIcon icon={faPen} className="text-xs" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    title="Delete Product"
                                                    className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow transition-all duration-150"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-4 pb-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-bold text-gray-800 text-base truncate flex-1">{product.title}</h3>
                                                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                                                    {product.quantity} kg
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                                            {product.farmLocation?.[0] && (
                                                <p className="text-gray-400 text-xs mt-2 truncate">
                                                    📍 {product.farmLocation[0].district}, {product.farmLocation[0].state}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom section: Price & Quick Edit */}
                                    <div className="p-4 pt-3 border-t border-gray-100 bg-gray-50/70">
                                        {isInlineEditing ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs text-green-800 font-semibold">
                                                    <span>Update Price (₹/kg)</span>
                                                    <button
                                                        onClick={cancelInlineEdit}
                                                        className="text-gray-400 hover:text-gray-600 text-xs"
                                                        title="Cancel"
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="relative flex-1">
                                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">₹</span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={inlineRate}
                                                            onChange={(e) => setInlineRate(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleSaveInlinePrice(product._id);
                                                                if (e.key === 'Escape') cancelInlineEdit();
                                                            }}
                                                            autoFocus
                                                            className="w-full pl-6 pr-2 py-1 text-sm font-bold text-gray-800 bg-white border-2 border-green-500 rounded-lg focus:outline-none"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => handleSaveInlinePrice(product._id)}
                                                        disabled={savingInline}
                                                        className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow flex items-center gap-1 transition-colors"
                                                        title="Save new price"
                                                    >
                                                        <FontAwesomeIcon icon={faCheck} />
                                                        {savingInline ? '...' : 'Save'}
                                                    </button>
                                                </div>
                                                {/* Quick increment / decrement chips */}
                                                <div className="flex items-center gap-1 pt-0.5">
                                                    <span className="text-[10px] text-gray-400 font-medium">Quick:</span>
                                                    {[-5, +5, +10, +20].map(diff => (
                                                        <button
                                                            key={diff}
                                                            type="button"
                                                            onClick={() => setInlineRate(prev => Math.max(0, (Number(prev) || 0) + diff).toString())}
                                                            className="text-[10px] px-1.5 py-0.5 bg-white border border-gray-200 hover:border-green-400 rounded text-gray-700 font-semibold hover:bg-green-50 transition-colors"
                                                        >
                                                            {diff > 0 ? `+₹${diff}` : `-₹${Math.abs(diff)}`}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-[11px] text-gray-400 block font-medium">Price</span>
                                                    <span className="text-green-700 font-extrabold text-xl leading-none">
                                                        ₹{product.rate}
                                                        <span className="text-xs font-normal text-gray-400">/kg</span>
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={(e) => startInlineEdit(product, e)}
                                                    title="Quick edit price at any time"
                                                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200/80 border border-emerald-300/60 px-3 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm"
                                                >
                                                    <FontAwesomeIcon icon={faPen} className="text-[10px]" />
                                                    Edit Price
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ══════════════════════════════════════════════════
                Add Product Modal / Slide-in Panel
            ══════════════════════════════════════════════════ */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
                    <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-green-700 to-emerald-700 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-white font-bold text-xl">Add New Product</h2>
                                <p className="text-green-200 text-sm">List your farm produce for sale</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto flex-1 px-6 py-5">
                            <form onSubmit={handleAddProduct} className="space-y-5">

                                {/* ── STEP 1: Choose Category ── */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <FontAwesomeIcon icon={faTag} className="mr-1.5 text-green-600" />
                                        Product Category <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {PRODUCT_CATEGORIES.map(cat => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setCategory(cat.id)}
                                                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer
                                                    ${category === cat.id
                                                        ? 'border-green-500 bg-green-50 shadow-md scale-105'
                                                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50'}`}
                                            >
                                                <span className="text-2xl">{cat.emoji}</span>
                                                <span className="text-xs font-medium text-gray-700 leading-tight">{cat.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {category && (
                                        <p className="text-green-600 text-xs mt-1.5 font-medium">
                                            ✓ Selected: {getCatInfo(category).emoji} {getCatInfo(category).label}
                                        </p>
                                    )}
                                </div>

                                {/* ── Product Name ── */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        <FontAwesomeIcon icon={faSeedling} className="mr-1.5 text-green-600" />
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Fresh Tomatoes, Basmati Rice..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-gray-800"
                                    />
                                </div>

                                {/* ── Description ── */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        <FontAwesomeIcon icon={faAlignLeft} className="mr-1.5 text-green-600" />
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        placeholder="Describe your product quality, variety, harvesting date..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-gray-800 resize-none"
                                    />
                                </div>

                                {/* ── Price & Quantity Row ── */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-1.5 text-green-600" />
                                            Price (₹/kg) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 40"
                                            value={rate}
                                            onChange={(e) => setRate(e.target.value)}
                                            min="0"
                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-gray-800 font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            <FontAwesomeIcon icon={faWeightScale} className="mr-1.5 text-green-600" />
                                            Available (kg) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 200"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            min="0"
                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-gray-800 font-semibold"
                                        />
                                    </div>
                                </div>

                                {/* ── Image URL ── */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        <FontAwesomeIcon icon={faImage} className="mr-1.5 text-green-600" />
                                        Product Image URL <span className="text-gray-400 font-normal">(optional)</span>
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/product-image.jpg"
                                        value={imageURL}
                                        onChange={(e) => setImageURL(e.target.value)}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-gray-800"
                                    />
                                    {/* Image Preview */}
                                    {isValidURL(imageURL) && (
                                        <div className="mt-2 relative rounded-xl overflow-hidden h-28 bg-gray-100">
                                            <img src={imageURL} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">Preview</div>
                                        </div>
                                    )}
                                </div>

                                {/* ── Location (auto-filled) ── */}
                                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                                    <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                                        📍 Farm Location (from your profile)
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="text-xs text-gray-500">State</label>
                                            <input value={State} onChange={e => setState(e.target.value)}
                                                className="w-full mt-0.5 border border-green-300 rounded-lg px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-green-500 bg-white"
                                                placeholder="State" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">District</label>
                                            <input value={District} onChange={e => setDistrict(e.target.value)}
                                                className="w-full mt-0.5 border border-green-300 rounded-lg px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-green-500 bg-white"
                                                placeholder="District" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Pincode</label>
                                            <input value={pincode} onChange={e => setPincode(e.target.value)}
                                                className="w-full mt-0.5 border border-green-300 rounded-lg px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-green-500 bg-white"
                                                placeholder="Pincode" />
                                        </div>
                                    </div>
                                </div>

                                {/* ── Submit ── */}
                                <div className="flex gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow hover:shadow-lg transition-all duration-200"
                                    >
                                        {submitting ? '⏳ Listing...' : '🌱 List Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════
                Edit Product & Price Modal
            ══════════════════════════════════════════════════ */}
            {editModalProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                    onClick={(e) => { if (e.target === e.currentTarget) closeEditModal(); }}>
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-emerald-700 to-green-700 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-white font-bold text-xl flex items-center gap-2">
                                    <FontAwesomeIcon icon={faPen} className="text-emerald-300 text-sm" />
                                    Edit Product Price & Details
                                </h2>
                                <p className="text-emerald-200 text-xs mt-0.5">Update pricing, available quantity, or details anytime</p>
                            </div>
                            <button onClick={closeEditModal} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto flex-1 px-6 py-5">
                            <form onSubmit={handleSaveModalEdit} className="space-y-4">

                                {/* Price Section - Prominent Highlighted Box */}
                                <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 shadow-sm">
                                    <label className="block text-sm font-bold text-emerald-900 mb-1 flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <FontAwesomeIcon icon={faIndianRupeeSign} className="text-emerald-600" />
                                            Selling Price (₹/kg) <span className="text-red-500">*</span>
                                        </span>
                                        <span className="text-[11px] font-normal text-emerald-700">Change anytime to match mandi rates</span>
                                    </label>
                                    <div className="relative mt-2">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-800 font-extrabold text-xl">₹</span>
                                        <input
                                            type="number"
                                            min="0"
                                            required
                                            value={editRate}
                                            onChange={(e) => setEditRate(e.target.value)}
                                            className="w-full pl-9 pr-14 py-2.5 text-xl font-extrabold text-emerald-900 bg-white border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="e.g. 45"
                                        />
                                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-semibold">/ kg</span>
                                    </div>

                                    {/* Quick price adjustment chips */}
                                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                                        <span className="text-xs font-semibold text-emerald-800 mr-1">Quick Adjust:</span>
                                        {[-10, -5, +5, +10, +20].map(diff => (
                                            <button
                                                key={diff}
                                                type="button"
                                                onClick={() => setEditRate(prev => Math.max(0, (Number(prev) || 0) + diff).toString())}
                                                className="text-xs font-bold px-2.5 py-1 bg-white hover:bg-emerald-600 hover:text-white border border-emerald-300 text-emerald-800 rounded-lg transition-colors shadow-sm"
                                            >
                                                {diff > 0 ? `+₹${diff}` : `-₹${Math.abs(diff)}`}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Value summary preview */}
                                    {editRate && editQuantity && !isNaN(editRate) && !isNaN(editQuantity) && (
                                        <div className="mt-3 pt-2.5 border-t border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                                            <span>Estimated Batch Value:</span>
                                            <span className="font-bold text-sm">₹{(Number(editRate) * Number(editQuantity)).toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Available Quantity */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        <FontAwesomeIcon icon={faWeightScale} className="mr-1.5 text-green-600" />
                                        Available Quantity (kg)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editQuantity}
                                        onChange={(e) => setEditQuantity(e.target.value)}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-gray-800 font-semibold focus:outline-none focus:border-green-500"
                                        placeholder="e.g. 200"
                                    />
                                </div>

                                {/* Product Name (Title) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        <FontAwesomeIcon icon={faSeedling} className="mr-1.5 text-green-600" />
                                        Product Title
                                    </label>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-gray-800 focus:outline-none focus:border-green-500"
                                    />
                                </div>

                                {/* Category Selector */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        <FontAwesomeIcon icon={faTag} className="mr-1.5 text-green-600" />
                                        Category
                                    </label>
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {PRODUCT_CATEGORIES.map(cat => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setEditCategory(cat.id)}
                                                className={`flex items-center justify-center gap-1 p-2 rounded-xl border text-xs font-semibold transition-all
                                                    ${editCategory === cat.id
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm'
                                                        : 'border-gray-200 text-gray-600 hover:border-emerald-300'}`}
                                            >
                                                <span>{cat.emoji}</span>
                                                <span className="truncate">{cat.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        <FontAwesomeIcon icon={faAlignLeft} className="mr-1.5 text-green-600" />
                                        Description
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-gray-800 focus:outline-none focus:border-green-500 resize-none text-sm"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeEditModal}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={savingModal}
                                        className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl shadow transition-all"
                                    >
                                        {savingModal ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <Toaster position="top-right" />
        </div>
    );
};

export default ProductManager;
