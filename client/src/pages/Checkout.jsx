import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Plus, Check, ShieldCheck, CreditCard, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import { fetchAddresses, addAddress } from '../store/slices/authSlice';
import { placeOrder } from '../store/slices/ordersSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, appliedCoupon } = useSelector((state) => state.cart);
  const { addresses, user } = useSelector((state) => state.auth);
  const { loading: orderLoading, error: orderError } = useSelector((state) => state.orders);

  // States
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  // Add address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [receiverName, setReceiverName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Gujarat');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLabel, setAddressLabel] = useState('Home');
  const [addressError, setAddressError] = useState('');

  // Fetch addresses on load
  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Set default address when addresses load
  useEffect(() => {
    if (addresses.length > 0) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses]);

  // Redirect back if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const discountAmount = appliedCoupon 
    ? Math.round(subtotal * (appliedCoupon.discountPercent / 100)) 
    : 0;

  const priceAfterDiscount = subtotal - discountAmount;
  const gst = Math.round(priceAfterDiscount * 0.05);
  const deliveryCharge = priceAfterDiscount >= 500 ? 0 : 40;
  const grandTotal = priceAfterDiscount + gst + deliveryCharge;

  // Add address handler
  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressError('');
    if (!receiverName || !street || !city || !postalCode || !phone) {
      setAddressError('Please fill in all address fields.');
      return;
    }

    try {
      const result = await dispatch(addAddress({
        receiverName,
        addressLine: street,
        city,
        state: stateName,
        pincode: postalCode,
        receiverPhone: phone,
        label: addressLabel
      })).unwrap();
      
      // Reset form
      setReceiverName('');
      setStreet('');
      setCity('');
      setPostalCode('');
      setPhone('');
      setAddressLabel('Home');
      setShowAddressForm(false);
      
      // Select newly added address
      if (result && result.length > 0) {
        setSelectedAddress(result[result.length - 1]);
      }
    } catch (err) {
      setAddressError(err || 'Failed to add address.');
    }
  };

  // Dynamically load Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Place Order handler
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select or add a shipping address!');
      return;
    }

    const orderPayload = {
      items: cartItems.map(item => ({
        product: item.product,
        name: item.name,
        quantity: item.quantity,
        weight: item.weight,
        price: item.price
      })),
      shippingAddress: selectedAddress,
      paymentMethod,
      couponCode: appliedCoupon?.code || null
    };

    if (paymentMethod === 'COD') {
      try {
        const order = await dispatch(placeOrder(orderPayload)).unwrap();
        alert(`Order Placed Successfully! Your Order ID is ${order.orderId}`);
        navigate('/orders');
      } catch (err) {
        alert(err || 'Failed to place order.');
      }
    } else {
      // Razorpay Payment Flow
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Razorpay SDK failed to load. Are you connected to the internet?');
        return;
      }

      try {
        // 1. Create order on server to get Razorpay Options
        const rpOrderRes = await axios.post('/api/orders/razorpay', { amount: grandTotal });
        const rpOrder = rpOrderRes.data;

        // 2. Open Razorpay Widget
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: rpOrder.amount,
          currency: rpOrder.currency,
          name: 'Shree Ram Dairy',
          description: 'Payment for traditional sweets',
          order_id: rpOrder.id,
          handler: async function (response) {
            // Verify payment signature
            try {
              const verifyRes = await axios.post('/api/orders/razorpay/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.data.success) {
                // Signature match: complete checkout on server
                const finalOrderPayload = {
                  ...orderPayload,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id
                };

                const order = await dispatch(placeOrder(finalOrderPayload)).unwrap();
                alert(`Razorpay Payment Successful! Your Order ID is ${order.orderId}`);
                navigate('/orders');
              } else {
                alert('Payment verification failed.');
              }
            } catch (err) {
              alert('Payment verification failed during request validation.');
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: selectedAddress.phone || user?.phone
          },
          theme: {
            color: '#f6b100' // Primary gold color
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

      } catch (err) {
        alert(err.response?.data?.error || 'Failed to initialize Razorpay checkout.');
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-srd-cream py-12 px-4 md:px-12 font-body">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Title */}
        <div className="text-center mb-10">
          <h2 className="font-title font-bold text-3xl md:text-4xl text-srd-maroon">Checkout Order</h2>
          <div className="w-16 h-0.5 bg-srd-gold mx-auto mt-3"></div>
        </div>

        {orderError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-6 flex items-start gap-2.5 max-w-4xl mx-auto text-sm">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <span>{orderError}</span>
          </div>
        )}

        {/* Checkout Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
          
          {/* LEFT COLUMN: Address Selection & Payment Method */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. SHIPPING ADDRESS */}
            <div className="bg-white p-6 rounded-2xl border border-srd-gold/15 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="font-title font-bold text-lg text-srd-maroon flex items-center gap-2">
                  <MapPin size={18} className="text-srd-gold" /> 1. Shipping Address
                </h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="bg-srd-gold/10 hover:bg-srd-gold text-srd-maroon px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1 transition-all"
                >
                  <Plus size={14} /> Add Address
                </button>
              </div>

              {/* Add Address Form Modal/Section */}
              {showAddressForm && (
                <form onSubmit={handleAddAddressSubmit} className="bg-srd-cream/20 p-5 rounded-xl border border-srd-gold/10 space-y-4">
                  <h4 className="font-bold text-xs text-srd-maroon uppercase tracking-wider">New Shipping Details</h4>
                  
                  {addressError && (
                    <div className="text-red-600 text-xs bg-red-50 p-2 border border-red-200 rounded-lg">
                      {addressError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">Recipient Full Name</label>
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
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="e.g. 9/A Kangana Society, Vishal Nagar"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">City</label>
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
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-gray-50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">Pincode</label>
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
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">Delivery Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 7573978055"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-srd-gold"
                      />
                    </div>
                  </div>


                  {/* Label pills */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1.5">Address Type Label</label>
                    <div className="flex gap-2">
                      {['Home', 'Office', 'Other'].map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setAddressLabel(label)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                            addressLabel === label 
                              ? 'bg-srd-gold border-srd-gold text-srd-maroon' 
                              : 'bg-white border-gray-200 text-gray-600'
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
                      className="px-4 py-2 bg-srd-gold text-srd-maroon rounded-lg text-xs font-bold shadow-sm"
                    >
                      Save Details
                    </button>
                  </div>
                </form>
              )}

              {/* Addresses List display */}
              {addresses.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm italic">
                  No shipping addresses saved. Click "Add Address" to create one.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                        selectedAddress?._id === addr._id
                          ? 'border-srd-gold bg-srd-cream/10 shadow-sm'
                          : 'border-gray-100 hover:border-srd-gold/30 bg-white'
                      }`}
                    >
                      {selectedAddress?._id === addr._id && (
                        <span className="absolute top-3 right-3 text-srd-orange bg-srd-gold/15 p-1 rounded-full">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                      <span className="text-[10px] font-bold uppercase bg-srd-orange/10 text-srd-orange px-2.5 py-0.5 rounded-full inline-block mb-2">
                        {addr.label}
                      </span>
                      <p className="text-xs text-srd-maroon font-bold mb-1">Receiver: {addr.receiverName}</p>
                      <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                        {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-xs text-gray-400 font-medium mt-2">Mobile: +91 {addr.receiverPhone}</p>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. PAYMENT METHODS */}
            <div className="bg-white p-6 rounded-2xl border border-srd-gold/15 shadow-sm space-y-4">
              <h3 className="font-title font-bold text-lg text-srd-maroon border-b pb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-srd-gold" /> 2. Payment Method
              </h3>

              <div className="space-y-3 pt-2">
                {/* Cash on Delivery */}
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'COD' ? 'border-srd-gold bg-srd-cream/10' : 'border-gray-100 bg-white'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-srd-orange focus:ring-srd-gold"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-srd-maroon">Cash on Delivery (COD)</h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">Pay in cash or UPI when order reaches your door.</p>
                    </div>
                  </div>
                </label>

                {/* Razorpay Online */}
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'Razorpay' ? 'border-srd-gold bg-srd-cream/10' : 'border-gray-100 bg-white'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Razorpay"
                      checked={paymentMethod === 'Razorpay'}
                      onChange={() => setPaymentMethod('Razorpay')}
                      className="text-srd-orange focus:ring-srd-gold"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-srd-maroon">Online Cards & UPI (Razorpay)</h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">Secure payment via Netbanking, Credit/Debit cards or GPay.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-srd-orange bg-srd-orange/10 px-2 py-0.5 rounded-full">Secure</span>
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Review Items & Breakdown */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Review Items Plate */}
            <div className="bg-white p-6 rounded-2xl border border-srd-gold/15 shadow-sm space-y-4">
              <h4 className="font-title font-bold text-base text-srd-maroon border-b pb-3.5">Review Order Items</h4>
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={`${item.product}-${item.weight}`} className="py-3 flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded border border-gray-100 overflow-hidden bg-gray-50 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-srd-maroon leading-tight">{item.name}</h5>
                        <p className="text-[10px] text-gray-400 mt-0.5">{item.quantity} x {item.weight}</p>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-gray-700">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations and CTA */}
            <div className="bg-white p-6 rounded-2xl border border-srd-gold/15 shadow-sm space-y-4">
              <h4 className="font-title font-bold text-lg text-srd-maroon border-b pb-3.5">Cost Breakdown</h4>
              
              <div className="space-y-2 text-xs font-semibold text-gray-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.discountPercent}%)</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>GST (5% SGST + CGST)</span>
                  <span>₹{gst}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>{deliveryCharge === 0 ? <strong className="text-green-600 uppercase">FREE</strong> : `₹${deliveryCharge}`}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-3 flex justify-between items-baseline font-bold text-srd-maroon">
                <span className="text-sm font-title">Order Total</span>
                <span className="text-xl">₹{grandTotal}</span>
              </div>

              {/* Guarantee banner */}
              <div className="bg-[#faf3e0]/40 p-3 rounded-lg border border-srd-gold/10 flex items-center gap-2 text-[10px] text-gray-500">
                <ShieldCheck size={16} className="text-srd-orange shrink-0" />
                <span>By continuing, you agree to our terms of delivery. Sweets are prepared fresh and dispatched immediately.</span>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={orderLoading || cartItems.length === 0}
                className="w-full bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white py-4 rounded-xl font-bold text-sm tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                {orderLoading ? 'Placing Order...' : (
                  <>
                    Confirm Order <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
