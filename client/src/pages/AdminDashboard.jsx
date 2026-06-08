import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  TrendingUp, ShoppingBag, FolderOpen, Tag, Users, 
  Trash2, Edit, Plus, Check, Loader, ArrowUpRight, BarChart3, Clock, AlertCircle
} from 'lucide-react';
import { 
  fetchProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, 
  adminCreateCategory, adminUpdateCategory, adminDeleteCategory 
} from '../store/slices/productsSlice';
import { adminFetchOrders, adminUpdateOrderStatus, adminFetchAnalytics } from '../store/slices/ordersSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, categories, loading: productsLoading } = useSelector((state) => state.products);
  const { adminOrders, analytics, loading: ordersLoading } = useSelector((state) => state.orders);

  // States
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Local CRUD Coupon States
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('');
  const [couponExpiry, setCouponExpiry] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  // Modals / Forms States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productName, setProductName] = useState('');
  const [productGujarati, setProductGujarati] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productWeightOptions, setProductWeightOptions] = useState(['250g', '500g', '1kg']);
  const [productImageFile, setProductImageFile] = useState(null);
  
  // Category form states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [categoryImageFile, setCategoryImageFile] = useState(null);

  // Fetch all admin data on mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(adminFetchOrders());
    dispatch(adminFetchAnalytics());
    fetchCouponsList();
  }, [dispatch]);

  const fetchCouponsList = async () => {
    try {
      setCouponLoading(true);
      const res = await axios.get('/api/coupons');
      setCoupons(res.data);
    } catch (err) {
      console.error('Failed to load coupons:', err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCreateCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponCode || !couponDiscount || !couponExpiry) return;
    try {
      const res = await axios.post('/api/coupons', {
        code: couponCode.toUpperCase(),
        discountPercent: Number(couponDiscount),
        expiryDate: couponExpiry
      });
      setCoupons(prev => [...prev, res.data]);
      setCouponCode('');
      setCouponDiscount('');
      setCouponExpiry('');
      alert('Coupon created successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create coupon.');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Delete this promo coupon code?')) {
      try {
        await axios.delete(`/api/coupons/${id}`);
        setCoupons(prev => prev.filter(c => c._id !== id));
      } catch (err) {
        alert('Failed to delete coupon.');
      }
    }
  };

  // Status changer for Orders Queue
  const handleStatusChange = (orderId, newStatus) => {
    dispatch(adminUpdateOrderStatus({ id: orderId, status: newStatus }));
    alert(`Order Status changed to ${newStatus}`);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductName('');
    setProductGujarati('');
    setProductPrice('');
    setProductStock('');
    setProductCategory(categories[0]?._id || '');
    setProductDesc('');
    setProductWeightOptions(['250g', '500g', '1kg']);
    setProductImageFile(null);
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductName(prod.name);
    setProductGujarati(prod.gujaratiName || '');
    setProductPrice(prod.price);
    setProductStock(prod.stock);
    setProductCategory(prod.category?._id || prod.category || '');
    setProductDesc(prod.description || '');
    setProductWeightOptions(prod.weightOptions || ['250g', '500g', '1kg']);
    setProductImageFile(null);
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('gujaratiName', productGujarati);
    formData.append('price', Number(productPrice));
    formData.append('stock', Number(productStock));
    formData.append('category', productCategory);
    formData.append('description', productDesc);
    productWeightOptions.forEach(opt => formData.append('weightOptions[]', opt));
    
    if (productImageFile) {
      formData.append('imageFile', productImageFile); // Backend Multer parses 'imageFile'
    }

    try {
      if (editingProduct) {
        await dispatch(adminUpdateProduct({ id: editingProduct._id, formData })).unwrap();
        alert('Product updated successfully!');
      } else {
        await dispatch(adminCreateProduct(formData)).unwrap();
        alert('Product created successfully!');
      }
      setShowProductModal(false);
      dispatch(fetchProducts()); // refresh grid
    } catch (err) {
      alert(err || 'Operation failed.');
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Delete this product permanently?')) {
      dispatch(adminDeleteProduct(id));
    }
  };

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDesc('');
    setCategoryImageFile(null);
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryDesc(cat.description || '');
    setCategoryImageFile(null);
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryName) return;

    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('description', categoryDesc);
    if (categoryImageFile) {
      formData.append('imageFile', categoryImageFile); // Backend Multer parses 'imageFile'
    }

    try {
      if (editingCategory) {
        await dispatch(adminUpdateCategory({ id: editingCategory._id, formData })).unwrap();
        alert('Category updated successfully!');
      } else {
        await dispatch(adminCreateCategory(formData)).unwrap();
        alert('Category created successfully!');
      }
      setShowCategoryModal(false);
      dispatch(fetchProducts()); // Reload categories/products
    } catch (err) {
      alert(err || 'Failed to submit category.');
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Delete this category? ALL products under this category will become uncategorized!')) {
      dispatch(adminDeleteCategory(id))
        .unwrap()
        .then(() => alert('Category deleted successfully!'))
        .catch(err => alert(err || 'Failed to delete category.'));
    }
  };

  return (
    <div className="w-full min-h-screen bg-srd-cream py-12 px-4 md:px-12 font-body">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title */}
        <div className="flex justify-between items-center border-b pb-6 mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-title font-bold text-3xl text-srd-maroon flex items-center gap-2">
              <TrendingUp className="text-srd-orange" /> Shree Ram Dairy - Admin Console
            </h1>
            <p className="text-xs text-gray-500 mt-1">Manage sweet catalogs, order states, discounts and check analytics</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-srd-maroon text-white hover:bg-[#5c0b13] px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-colors"
          >
            My User Account
          </button>
        </div>

        {/* Console layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Admin Sidebar Navigation */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-srd-gold/15 shadow-sm p-4 space-y-1">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'analytics' 
                  ? 'bg-srd-gold text-srd-maroon shadow-sm' 
                  : 'text-gray-600 hover:bg-srd-cream/30 hover:text-srd-maroon'
              }`}
            >
              <BarChart3 size={18} /> Analytics & Stats
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'orders' 
                  ? 'bg-srd-gold text-srd-maroon shadow-sm' 
                  : 'text-gray-600 hover:bg-srd-cream/30 hover:text-srd-maroon'
              }`}
            >
              <ShoppingBag size={18} /> Orders Queue ({adminOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'products' 
                  ? 'bg-srd-gold text-srd-maroon shadow-sm' 
                  : 'text-gray-600 hover:bg-srd-cream/30 hover:text-srd-maroon'
              }`}
            >
              <FolderOpen size={18} /> Products Catalog
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'categories' 
                  ? 'bg-srd-gold text-srd-maroon shadow-sm' 
                  : 'text-gray-600 hover:bg-srd-cream/30 hover:text-srd-maroon'
              }`}
            >
              <FolderOpen size={18} /> Categories plate
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'coupons' 
                  ? 'bg-srd-gold text-srd-maroon shadow-sm' 
                  : 'text-gray-600 hover:bg-srd-cream/30 hover:text-srd-maroon'
              }`}
            >
              <Tag size={18} /> Promo Coupons ({coupons.length})
            </button>
          </div>

          {/* Admin Panels content area */}
          <div className="lg:col-span-9 bg-white p-6 md:p-8 rounded-2xl border border-srd-gold/15 shadow-sm min-h-[60vh]">
            
            {/* PANEL 1: Analytics summary */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <h3 className="font-title font-bold text-xl text-srd-maroon border-b pb-4">Business Performance</h3>
                
                {ordersLoading && !analytics ? (
                  <div className="text-center py-12 text-gray-500 font-medium">Crunching sales numbers...</div>
                ) : (
                  <div className="space-y-6">
                    {/* Analytics Summary Cards grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-[#fffdf6] p-5 rounded-2xl border border-srd-gold/15 shadow-sm">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Sales</span>
                        <h4 className="text-2xl font-bold text-srd-maroon mt-1">₹{analytics?.stats?.totalRevenue || 0}</h4>
                        <span className="text-[9px] text-green-600 font-bold mt-2 inline-flex items-center gap-0.5">
                          <ArrowUpRight size={10} /> Paid Orders
                        </span>
                      </div>

                      <div className="bg-[#fffdf6] p-5 rounded-2xl border border-srd-gold/15 shadow-sm">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Orders</span>
                        <h4 className="text-2xl font-bold text-srd-maroon mt-1">{analytics?.stats?.totalOrders || 0}</h4>
                        <span className="text-[9px] text-gray-400 font-medium mt-2 block">System volume</span>
                      </div>

                      <div className="bg-[#fffdf6] p-5 rounded-2xl border border-srd-gold/15 shadow-sm">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Pending Approval</span>
                        <h4 className="text-2xl font-bold text-yellow-600 mt-1">{analytics?.stats?.pendingOrders || 0}</h4>
                        <span className="text-[9px] text-yellow-600 font-bold mt-2 inline-flex items-center gap-0.5">
                          <Clock size={10} /> Needs Action
                        </span>
                      </div>

                      <div className="bg-[#fffdf6] p-5 rounded-2xl border border-srd-gold/15 shadow-sm">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Kitchen preparing</span>
                        <h4 className="text-2xl font-bold text-blue-600 mt-1">{analytics?.stats?.processingOrders || 0}</h4>
                        <span className="text-[9px] text-blue-600 font-bold mt-2 block">Currently preparing</span>
                      </div>
                    </div>

                    {/* Sales trend list */}
                    <div className="border border-gray-100 rounded-2xl p-5 space-y-4">
                      <h4 className="font-bold text-sm text-srd-maroon flex items-center gap-1.5">
                        <BarChart3 size={16} /> Daily Sales Trend (Last 7 Days)
                      </h4>
                      {analytics?.weeklyTrend?.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No sales logs found in last 7 days.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead>
                              <tr className="border-b text-gray-400 uppercase">
                                <th className="pb-2">Date</th>
                                <th className="pb-2 text-center">Orders Count</th>
                                <th className="pb-2 text-right">Revenue (₹)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analytics?.weeklyTrend?.map((day) => (
                                <tr key={day._id} className="border-b last:border-b-0 hover:bg-srd-cream/10">
                                  <td className="py-2.5 font-bold text-gray-700">{day._id}</td>
                                  <td className="py-2.5 text-center text-gray-600 font-medium">{day.count}</td>
                                  <td className="py-2.5 text-right font-bold text-srd-maroon">₹{day.revenue}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PANEL 2: Orders Queue management */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="font-title font-bold text-xl text-srd-maroon border-b pb-4">Manage Orders Queue</h3>
                
                {ordersLoading ? (
                  <div className="text-center py-12 text-gray-500 font-medium">Fetching orders queue...</div>
                ) : adminOrders.length === 0 ? (
                  <p className="text-center py-12 text-gray-400 italic text-sm">No orders found in queue.</p>
                ) : (
                  <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                    <table className="w-full text-left text-xs font-semibold text-gray-600">
                      <thead>
                        <tr className="bg-srd-cream/20 text-srd-maroon border-b uppercase">
                          <th className="p-4">Order ID</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Total Items</th>
                          <th className="p-4">Total Bill</th>
                          <th className="p-4">Payment</th>
                          <th className="p-4 text-center">Status Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminOrders.map((ord) => (
                          <tr key={ord._id} className="border-b last:border-b-0 hover:bg-srd-cream/10">
                            <td className="p-4 font-bold text-srd-maroon">{ord.orderId}</td>
                            <td className="p-4">{ord.user?.name || 'Customer'}</td>
                            <td className="p-4 max-w-xs truncate">
                              {ord.items.map(i => `${i.name} (${i.weight} x${i.quantity})`).join(', ')}
                            </td>
                            <td className="p-4 font-bold text-srd-dark">₹{ord.total}</td>
                            <td className="p-4 uppercase">
                              {ord.paymentMethod}
                              <span className={`block text-[9px] font-bold ${
                                ord.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'
                              }`}>({ord.paymentStatus})</span>
                            </td>
                            <td className="p-4 text-center">
                              <select
                                value={ord.orderStatus}
                                onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                                className={`border rounded px-2.5 py-1 focus:outline-none text-xs font-bold ${
                                  ord.orderStatus === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                  ord.orderStatus === 'Preparing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  ord.orderStatus === 'Shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                  'bg-green-50 text-green-700 border-green-200'
                                }`}
                              >
                                <option value="Pending">Pending Approval</option>
                                <option value="Preparing">Kitchen preparing</option>
                                <option value="Shipped">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* PANEL 3: Products CRUD table */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="font-title font-bold text-xl text-srd-maroon">Sweet Menu Catalog</h3>
                  <button
                    onClick={handleOpenAddProduct}
                    className="bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    <Plus size={14} /> Add Product
                  </button>
                </div>

                {productsLoading ? (
                  <div className="text-center py-12 text-gray-500 font-medium">Loading sweet catalog...</div>
                ) : (
                  <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                    <table className="w-full text-left text-xs font-semibold text-gray-600">
                      <thead>
                        <tr className="bg-srd-cream/20 text-srd-maroon border-b uppercase">
                          <th className="p-4">Image</th>
                          <th className="p-4">Name</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Base Price</th>
                          <th className="p-4">Stock</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((prod) => (
                          <tr key={prod._id} className="border-b last:border-b-0 hover:bg-srd-cream/10">
                            <td className="p-4">
                              <div className="w-10 h-10 rounded border overflow-hidden bg-gray-50">
                                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-srd-maroon">{prod.name}</span>
                              {prod.gujaratiName && (
                                <span className="block text-[10px] text-srd-gold font-bold">{prod.gujaratiName}</span>
                              )}
                            </td>
                            <td className="p-4">{prod.category?.name || 'Uncategorized'}</td>
                            <td className="p-4 font-bold text-srd-dark">₹{prod.price}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                prod.stock > 10 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                              }`}>{prod.stock} left</span>
                            </td>
                            <td className="p-4 text-center space-x-2">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="text-gray-400 hover:text-srd-orange inline-block p-1"
                                title="Edit Product"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod._id)}
                                className="text-gray-400 hover:text-red-500 inline-block p-1"
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* PANEL 4: Categories Plate */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="font-title font-bold text-xl text-srd-maroon">Traditional Categories</h3>
                  <button
                    onClick={handleOpenAddCategory}
                    className="bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    <Plus size={14} /> Add Category
                  </button>
                </div>

                {/* List categories */}
                <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                  <table className="w-full text-left text-xs font-semibold text-gray-600">
                    <thead>
                      <tr className="bg-srd-cream/20 text-srd-maroon border-b uppercase">
                        <th className="p-4">Image</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Slug</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat) => (
                        <tr key={cat._id} className="border-b last:border-b-0 hover:bg-srd-cream/10">
                          <td className="p-4">
                            <div className="w-10 h-10 rounded border overflow-hidden bg-gray-50">
                              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-srd-maroon">{cat.name}</span>
                          </td>
                          <td className="p-4">{cat.slug}</td>
                          <td className="p-4 max-w-xs truncate">{cat.description || 'N/A'}</td>
                          <td className="p-4 text-center space-x-2">
                            <button
                              onClick={() => handleOpenEditCategory(cat)}
                              className="text-gray-400 hover:text-srd-orange inline-block p-1"
                              title="Edit Category"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat._id)}
                              className="text-gray-400 hover:text-red-500 inline-block p-1"
                              title="Delete Category"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PANEL 5: Promo Coupons Manager */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <h3 className="font-title font-bold text-xl text-srd-maroon border-b pb-4">Promo Coupons Manager</h3>

                {/* Create Coupon Form */}
                <form onSubmit={handleCreateCouponSubmit} className="bg-srd-cream/20 p-5 rounded-2xl border border-srd-gold/15 space-y-4 max-w-lg">
                  <h4 className="font-bold text-xs text-srd-maroon uppercase tracking-wider">Create Active Coupon Code</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">Code</label>
                      <input
                        type="text"
                        required
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="WELCOME10"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold uppercase bg-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">Discount (%)</label>
                      <input
                        type="number"
                        required
                        value={couponDiscount}
                        onChange={(e) => setCouponDiscount(e.target.value)}
                        placeholder="10"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="date"
                        required
                        value={couponExpiry}
                        onChange={(e) => setCouponExpiry(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold bg-white"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-srd-gold text-srd-maroon hover:bg-srd-orange hover:text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase shadow-sm"
                  >
                    Save Coupon Code
                  </button>
                </form>

                {/* Coupons List display */}
                {couponLoading ? (
                  <div className="text-center py-6 text-gray-500 font-medium">Fetching active coupons...</div>
                ) : coupons.length === 0 ? (
                  <p className="text-center py-6 text-gray-400 italic text-xs">No active coupons created.</p>
                ) : (
                  <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                    <table className="w-full text-left text-xs font-semibold text-gray-600">
                      <thead>
                        <tr className="bg-srd-cream/20 text-srd-maroon border-b uppercase">
                          <th className="p-4">Coupon Code</th>
                          <th className="p-4">Discount (%)</th>
                          <th className="p-4">Expiry Date</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons.map((c) => (
                          <tr key={c._id} className="border-b last:border-b-0 hover:bg-srd-cream/10">
                            <td className="p-4 font-bold text-srd-maroon">{c.code}</td>
                            <td className="p-4">{c.discountPercent}% OFF</td>
                            <td className="p-4">{new Date(c.expiryDate).toLocaleDateString()}</td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleDeleteCoupon(c._id)}
                                className="text-gray-400 hover:text-red-500 inline-block p-1"
                                title="Delete coupon"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ADD/EDIT PRODUCT MODAL POPUP */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-srd-gold shadow-2xl p-6 md:p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
            <h3 className="font-title font-bold text-2xl text-srd-maroon border-b pb-4 mb-6">
              {editingProduct ? `Edit Sweet: ${editingProduct.name}` : 'Add New Traditional Sweet'}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* English Name */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1">Product Name (English)</label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Kaju Katli"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold"
                  />
                </div>
                {/* Gujarati Name */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1">Gujarati Name</label>
                  <input
                    type="text"
                    value={productGujarati}
                    onChange={(e) => setProductGujarati(e.target.value)}
                    placeholder="e.g. કાજુ કતરી"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1">Base Price (₹ per kg/L)</label>
                  <input
                    type="number"
                    required
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold"
                  />
                </div>
                {/* Stock */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold"
                  />
                </div>
                {/* Category selection */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1">Category Range</label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-srd-gold"
                  >
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Weight Options checks */}
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-2">Weight/Volume Options Available</label>
                <div className="flex gap-4 text-xs font-semibold text-gray-600">
                  {['250g', '500g', '1kg', '1L', '2L'].map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productWeightOptions.includes(opt)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setProductWeightOptions(prev => [...prev, opt]);
                          } else {
                            setProductWeightOptions(prev => prev.filter(item => item !== opt));
                          }
                        }}
                        className="rounded border-gray-300 text-srd-orange focus:ring-srd-gold"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  required
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder="Provide ingredients, tastes, allergens, shelf life..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold"
                ></textarea>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1">
                  Product Image File {editingProduct && '(Leave blank to retain current)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProductImageFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 border rounded-lg p-2 bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-srd-gold text-srd-maroon rounded-lg text-xs font-bold shadow-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ADD/EDIT CATEGORY MODAL POPUP */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-srd-gold shadow-2xl p-6 md:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <h3 className="font-title font-bold text-2xl text-srd-maroon border-b pb-4 mb-6">
              {editingCategory ? `Edit Category Range: ${editingCategory.name}` : 'Add New Category Range'}
            </h3>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              
              {/* Category Name */}
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Traditional Sweets"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={categoryDesc}
                  onChange={(e) => setCategoryDesc(e.target.value)}
                  placeholder="Describe this category range..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold"
                ></textarea>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1">
                  Category Image File {editingCategory && '(Leave blank to retain current)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required={!editingCategory}
                  onChange={(e) => setCategoryImageFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 border rounded-lg p-2 bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-srd-gold text-srd-maroon rounded-lg text-xs font-bold shadow-sm"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
