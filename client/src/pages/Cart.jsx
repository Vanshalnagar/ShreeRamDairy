import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Ticket, AlertCircle } from 'lucide-react';
import { updateQuantity, removeFromCart, applyCoupon, removeCoupon, clearCartError } from '../store/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, appliedCoupon, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [couponCode, setCouponCode] = useState('');

  const handleQtyChange = (product, weight, currentQty, amount) => {
    dispatch(updateQuantity({
      product,
      weight,
      quantity: currentQty + amount
    }));
  };

  const handleRemove = (product, weight) => {
    dispatch(removeFromCart({ product, weight }));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    dispatch(applyCoupon(couponCode));
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponCode('');
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const discountAmount = appliedCoupon 
    ? Math.round(subtotal * (appliedCoupon.discountPercent / 100)) 
    : 0;

  const priceAfterDiscount = subtotal - discountAmount;
  
  // 5% GST on sweets & dairy
  const gst = Math.round(priceAfterDiscount * 0.05);
  
  // Free delivery above ₹500, else flat ₹40
  const deliveryCharge = priceAfterDiscount >= 500 || priceAfterDiscount === 0 ? 0 : 40;
  
  const grandTotal = priceAfterDiscount + gst + deliveryCharge;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-srd-cream py-12 px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-srd-gold/10 text-srd-maroon rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag size={40} />
          </div>
          <h2 className="font-title font-bold text-3xl text-srd-maroon">Your Cart is Empty</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Looks like you haven't added any sweets or dairy products to your cart yet. Explore our traditional items to get started!
          </p>
          <div className="pt-2">
            <Link to="/products" className="bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-md transition-colors inline-block uppercase tracking-wider">
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-srd-cream py-12 px-4 md:px-12 font-body">
      <div className="max-w-7xl mx-auto">
        
        {/* Page title */}
        <div className="text-center mb-10">
          <h2 className="font-title font-bold text-3xl md:text-4xl text-srd-maroon">Your Shopping Cart</h2>
          <div className="w-16 h-0.5 bg-srd-gold mx-auto mt-3"></div>
        </div>

        {/* Layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
          
          {/* LEFT COLUMN: Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-srd-gold/15 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 hidden md:grid grid-cols-12 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span className="col-span-6">Product Details</span>
                <span className="col-span-2 text-center">Unit Price</span>
                <span className="col-span-2 text-center">Quantity</span>
                <span className="col-span-2 text-right">Subtotal</span>
              </div>

              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={`${item.product}-${item.weight}`} className="p-6 grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                    
                    {/* Image & Details */}
                    <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg border border-srd-gold/15 overflow-hidden shrink-0 bg-srd-cream/20">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { e.target.src = `https://placehold.co/100x100?text=${encodeURIComponent(item.name)}`; }}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-srd-maroon hover:text-srd-orange text-sm md:text-base">
                          <Link to={`/products/${item.product}`}>{item.name}</Link>
                        </h4>
                        <span className="text-[11px] font-bold bg-srd-gold/15 text-srd-maroon px-2.5 py-0.5 rounded-full inline-block mt-1 uppercase">
                          Weight: {item.weight}
                        </span>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-1 md:col-span-2 text-left md:text-center">
                      <span className="text-xs text-gray-400 md:hidden font-bold mr-1">Unit Price:</span>
                      <span className="font-bold text-gray-700 text-sm">₹{item.price}</span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white text-xs">
                        <button 
                          onClick={() => handleQtyChange(item.product, item.weight, item.quantity, -1)}
                          className="p-2 hover:bg-gray-50 text-gray-500"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 font-bold text-gray-700">{item.quantity}</span>
                        <button 
                          onClick={() => handleQtyChange(item.product, item.weight, item.quantity, 1)}
                          className="p-2 hover:bg-gray-50 text-gray-500"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-4">
                      <div className="text-right">
                        <span className="text-xs text-gray-400 md:hidden font-bold mr-1">Total:</span>
                        <span className="font-bold text-srd-dark text-sm md:text-base">₹{item.price * item.quantity}</span>
                      </div>
                      <button 
                        onClick={() => handleRemove(item.product, item.weight)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Back to Products */}
            <div className="pt-2">
              <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-srd-orange hover:text-srd-maroon transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Cart Summary */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Coupon Card */}
            <div className="bg-white p-6 rounded-2xl border border-srd-gold/15 shadow-sm">
              <h4 className="font-title font-bold text-base text-srd-maroon mb-4 flex items-center gap-2">
                <Ticket size={18} className="text-srd-gold" /> Have a Promo Coupon?
              </h4>
              
              {error && (
                <div className="bg-red-50 text-red-700 p-2.5 rounded-lg border border-red-200 mb-3 flex items-start gap-1.5 text-xs">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {appliedCoupon ? (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-green-700">COUPON APPLIED</span>
                    <h5 className="font-bold text-sm text-srd-maroon mt-0.5">{appliedCoupon.code}</h5>
                    <p className="text-[10px] text-gray-500">Savings: {appliedCoupon.discountPercent}% OFF Subtotal</p>
                  </div>
                  <button 
                    onClick={handleRemoveCoupon}
                    className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Code (e.g. WELCOME10)"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      dispatch(clearCartError());
                    }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:border-srd-gold"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white px-5 py-2 rounded-lg font-bold text-xs uppercase shadow-sm transition-colors shrink-0"
                  >
                    {loading ? '...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            {/* Price Breakdown Card */}
            <div className="bg-white p-6 rounded-2xl border border-srd-gold/15 shadow-sm space-y-4">
              <h4 className="font-title font-bold text-lg text-srd-maroon border-b pb-3.5">Order Summary</h4>
              
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Cart Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount ({appliedCoupon.discountPercent}%)</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600 font-medium">
                  <span>GST (5%)</span>
                  <span>₹{gst}</span>
                </div>

                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Delivery Charge</span>
                  <span>{deliveryCharge === 0 ? <strong className="text-green-600 font-bold uppercase text-xs">FREE</strong> : `₹${deliveryCharge}`}</span>
                </div>

                {deliveryCharge > 0 && (
                  <p className="text-[10px] text-gray-400 italic">Add products worth ₹{500 - priceAfterDiscount} more for free delivery!</p>
                )}
              </div>

              {/* Grand Total */}
              <div className="border-t pt-4 flex justify-between items-baseline font-bold text-srd-maroon">
                <span className="text-base font-title">Estimated Total</span>
                <span className="text-2xl">₹{grandTotal}</span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white py-4 rounded-xl font-bold text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-6"
              >
                Proceed To Checkout <ArrowRight size={18} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
