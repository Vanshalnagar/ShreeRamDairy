import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Heart, ShoppingBag, Plus, Trash2, Camera, ShieldCheck, AlertCircle, LogOut } from 'lucide-react';
import { fetchAddresses, deleteAddress, addAddress, fetchWishlist, toggleWishlist, updateUserProfile, logoutUser } from '../store/slices/authSlice';
import { fetchMyOrders } from '../store/slices/ordersSlice';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, addresses, wishlist, loading: authLoading } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);

  // States
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile edit states
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Add address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [receiverName, setReceiverName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Gujarat');
  const [postalCode, setPostalCode] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [addressLabel, setAddressLabel] = useState('Home');
  const [addressError, setAddressError] = useState('');

  // Fetch dashboard data
  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(fetchWishlist());
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setProfileSuccess('Profile updated successfully!');
    } catch (err) {
      setProfileError(err || 'Failed to update profile details.');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddressError('');
    if (!receiverName || !street || !city || !postalCode || !deliveryPhone) {
      setAddressError('All address fields are required.');
      return;
    }

    try {
      await dispatch(addAddress({
        receiverName,
        addressLine: street,
        city,
        state: stateName,
        pincode: postalCode,
        receiverPhone: deliveryPhone,
        label: addressLabel
      })).unwrap();
      setReceiverName('');
      setStreet('');
      setCity('');
      setPostalCode('');
      setDeliveryPhone('');
      setAddressLabel('Home');
      setShowAddressForm(false);
    } catch (err) {
      setAddressError(err || 'Failed to add address.');
    }
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm('Are you sure you want to delete this shipping address?')) {
      dispatch(deleteAddress(id));
    }
  };

  const handleRemoveWishlist = (productId) => {
    dispatch(toggleWishlist({ productId, inWishlist: true }));
  };

  return (
    <div className="w-full min-h-screen bg-srd-cream py-12 px-4 md:px-12 font-body">
      <div className="max-w-6xl mx-auto">
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-srd-maroon to-[#5c0b13] p-8 rounded-3xl border border-srd-gold shadow-md text-white mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute top-0 bottom-0 left-0 w-8 border-r border-dashed border-srd-gold/20"></div>
          
          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 rounded-full border-2 border-srd-gold overflow-hidden bg-srd-cream shrink-0">
              <img 
                src={avatarPreview || 'https://placehold.co/100x100?text=Profile'} 
                alt={user?.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <span className="text-xs text-srd-gold font-bold uppercase tracking-wider block">Namaste</span>
              <h2 className="font-title font-bold text-2xl md:text-3xl text-white">{user?.name}</h2>
              <p className="text-xs opacity-75 mt-1">{user?.email} • Member since {new Date(user?.createdAt).getFullYear()}</p>
            </div>
          </div>

          <div className="flex gap-3 z-10">
            {user?.role === 'admin' && (
              <Link to="/admin" className="bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-colors shadow-sm">
                Admin Console
              </Link>
            )}
            <button 
              onClick={handleLogout}
              className="bg-transparent border border-white/40 hover:border-white hover:text-srd-gold px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              Logout <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Sidebar & Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Tabs Navigation */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-srd-gold/15 shadow-sm p-4 space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-srd-gold text-srd-maroon shadow-sm' 
                  : 'text-gray-600 hover:bg-srd-cream/30 hover:text-srd-maroon'
              }`}
            >
              <User size={18} /> My Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'orders' 
                  ? 'bg-srd-gold text-srd-maroon shadow-sm' 
                  : 'text-gray-600 hover:bg-srd-cream/30 hover:text-srd-maroon'
              }`}
            >
              <ShoppingBag size={18} /> Order History ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'addresses' 
                  ? 'bg-srd-gold text-srd-maroon shadow-sm' 
                  : 'text-gray-600 hover:bg-srd-cream/30 hover:text-srd-maroon'
              }`}
            >
              <MapPin size={18} /> Saved Addresses ({addresses.length})
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'wishlist' 
                  ? 'bg-srd-gold text-srd-maroon shadow-sm' 
                  : 'text-gray-600 hover:bg-srd-cream/30 hover:text-srd-maroon'
              }`}
            >
              <Heart size={18} /> Wishlist ({wishlist.length})
            </button>
          </div>

          {/* RIGHT: Tab Contents */}
          <div className="lg:col-span-9 bg-white p-6 md:p-8 rounded-2xl border border-srd-gold/15 shadow-sm min-h-[50vh]">
            
            {/* TAB 1: Profile Details */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <h3 className="font-title font-bold text-xl text-srd-maroon border-b pb-4">Profile Information</h3>

                {profileSuccess && (
                  <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-200 text-sm">
                    {profileSuccess}
                  </div>
                )}
                {profileError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-sm">
                    {profileError}
                  </div>
                )}

                {/* Profile Pic Upload */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full border-2 border-srd-gold overflow-hidden bg-gray-50 relative shrink-0">
                    <img src={avatarPreview || 'https://placehold.co/100x100'} alt="Avatar" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center cursor-pointer text-white transition-all">
                      <Camera size={18} />
                      <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-srd-maroon uppercase">Upload Avatar Image</h5>
                    <p className="text-[10px] text-gray-400 mt-1">Accepts JPG, PNG formats up to 2MB. Stored on Cloudinary.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-srd-gold"
                    />
                  </div>

                  {/* Email (Read-Only) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">Email Address (Read-Only)</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="block w-full px-4 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-400 focus:outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-srd-gold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white px-8 py-3 rounded-full font-bold text-xs uppercase shadow-md transition-colors"
                >
                  {authLoading ? 'Updating...' : 'Save Profile Changes'}
                </button>
              </form>
            )}

            {/* TAB 2: Orders Snapshots */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="font-title font-bold text-xl text-srd-maroon border-b pb-4">Recent Orders</h3>
                
                {orders.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 italic text-sm">
                    No orders have been submitted yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="p-4 rounded-xl border border-gray-150 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold">
                        <div>
                          <Link to={`/track?id=${order.orderId}`} className="text-srd-maroon font-bold text-sm hover:underline">
                            {order.orderId}
                          </Link>
                          <p className="text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items</p>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <span className="text-gray-400 font-bold block text-[10px]">Total</span>
                            <span className="text-sm font-bold text-srd-dark">₹{order.total}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                    {orders.length > 5 && (
                      <Link to="/orders" className="text-sm font-bold text-srd-orange hover:underline block text-center pt-2">
                        View All Orders →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="font-title font-bold text-xl text-srd-maroon">Saved Addresses</h3>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="bg-srd-gold/15 text-srd-maroon px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    <Plus size={14} /> Add New
                  </button>
                </div>

                {/* Add Address Form inside Dashboard */}
                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="bg-srd-cream/20 p-5 border border-srd-gold/15 rounded-xl space-y-4">
                    <h4 className="font-bold text-xs text-srd-maroon uppercase tracking-wider">Add Shipping Address</h4>
                    
                    {addressError && (
                      <div className="text-red-700 text-xs bg-red-50 p-2.5 border border-red-200 rounded-lg">
                        {addressError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">Recipient Name</label>
                        <input
                          type="text"
                          required
                          value={receiverName}
                          onChange={(e) => setReceiverName(e.target.value)}
                          placeholder="e.g. Mahesh Nagar"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="e.g. 9/A Kangana Society"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Ahmedabad"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">State</label>
                        <input
                          type="text"
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-gray-50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">Pincode</label>
                        <input
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="e.g. 382443"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">Recipient Mobile</label>
                        <input
                          type="tel"
                          required
                          value={deliveryPhone}
                          onChange={(e) => setDeliveryPhone(e.target.value)}
                          placeholder="e.g. 7573978055"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold"
                        />
                      </div>
                    </div>


                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-1">Label</label>
                      <div className="flex gap-2">
                        {['Home', 'Office', 'Other'].map((label) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setAddressLabel(label)}
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              addressLabel === label ? 'bg-srd-gold text-srd-maroon border-srd-gold' : 'bg-white border-gray-200'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 bg-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-srd-gold text-srd-maroon rounded-lg text-xs font-bold"
                      >
                        Save Details
                      </button>
                    </div>
                  </form>
                )}

                {/* Display Addresses cards */}
                {addresses.length === 0 ? (
                  <p className="text-center py-6 text-gray-400 italic text-sm">No saved shipping addresses found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr._id} className="p-4 rounded-xl border border-gray-150 bg-white relative">
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete address"
                        >
                          <Trash2 size={15} />
                        </button>
                        <span className="text-[9px] font-bold uppercase bg-srd-orange/10 text-srd-orange px-2 py-0.5 rounded-full inline-block mb-2">
                          {addr.label}
                        </span>
                        <p className="text-xs text-srd-maroon font-bold mb-1">Receiver: {addr.receiverName}</p>
                        <p className="text-xs text-gray-700 leading-relaxed font-semibold pr-6">
                          {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-xs text-gray-400 font-medium mt-2">Mobile: +91 {addr.receiverPhone}</p>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Wishlist items */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h3 className="font-title font-bold text-xl text-srd-maroon border-b pb-4">Wishlist Items</h3>
                
                {wishlist.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 italic text-sm">
                    No items saved in your wishlist yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist.map((item) => (
                      <div key={item._id} className="p-4 rounded-xl border border-gray-150 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded overflow-hidden border bg-gray-50 shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <Link to={`/products/${item._id}`} className="font-bold text-xs text-srd-maroon hover:underline line-clamp-1">
                              {item.name}
                            </Link>
                            <span className="text-xs font-bold text-gray-500">₹{item.price}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveWishlist(item._id)}
                          className="text-gray-400 hover:text-red-500 p-1 shrink-0"
                          title="Remove from wishlist"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
