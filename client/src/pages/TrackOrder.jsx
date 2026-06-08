import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { Search, Clock, ChefHat, Truck, CheckCircle2, ShieldAlert, FileText, ArrowRight } from 'lucide-react';
import { trackOrderById, clearOrderDetails } from '../store/slices/ordersSlice';

const TrackOrder = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Parse ID query
  const queryParams = new URLSearchParams(location.search);
  const urlOrderId = queryParams.get('id') || '';

  const { orderDetails: order, loading, error } = useSelector((state) => state.orders);

  const [searchId, setSearchId] = useState(urlOrderId);

  useEffect(() => {
    if (urlOrderId) {
      dispatch(trackOrderById(urlOrderId));
      setSearchId(urlOrderId);
    }
    return () => {
      dispatch(clearOrderDetails());
    };
  }, [dispatch, urlOrderId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId) return;
    dispatch(trackOrderById(searchId));
  };

  const getStepStatus = (stepName) => {
    if (!order) return 'upcoming';
    
    const statuses = ['Pending', 'Preparing', 'Shipped', 'Delivered'];
    const currentIdx = statuses.indexOf(order.orderStatus);
    const stepIdx = statuses.indexOf(stepName);

    if (currentIdx >= stepIdx) {
      return 'completed';
    }
    return 'upcoming';
  };

  return (
    <div className="w-full min-h-screen bg-srd-cream py-12 px-4 md:px-12 font-body">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Title */}
        <div className="text-center mb-8">
          <span className="font-title italic text-srd-orange text-lg block mb-1">Where is my Sweet Box?</span>
          <h2 className="font-title font-bold text-3xl md:text-4xl text-srd-maroon">Track Your Order</h2>
          <div className="w-16 h-0.5 bg-srd-gold mx-auto mt-3"></div>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12 flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              required
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Order ID (e.g. SRD-12345)"
              className="w-full border border-gray-200 rounded-lg pl-3 pr-9 py-2.5 text-sm uppercase focus:outline-none focus:border-srd-gold font-semibold"
            />
            <Search size={16} className="absolute right-3 top-3.5 text-gray-400" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white px-6 py-2.5 rounded-lg font-bold text-xs uppercase shadow-sm transition-colors"
          >
            Track
          </button>
        </form>

        {loading ? (
          <div className="text-center py-16 text-gray-500 font-medium bg-white rounded-2xl border border-gray-100 shadow-sm">
            Locating your sweet order in our database...
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <ShieldAlert size={36} className="mx-auto text-red-500" />
            <h4 className="font-title font-bold text-lg">Order Not Found</h4>
            <p className="text-xs leading-relaxed text-red-600">
              {error}
            </p>
          </div>
        ) : order ? (
          <div className="space-y-8">
            
            {/* STEPPER PANEL */}
            <div className="bg-white p-8 rounded-3xl border border-srd-gold/15 shadow-sm">
              <div className="flex justify-between items-center border-b pb-4 mb-8 flex-wrap gap-2">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Tracking Reference</span>
                  <h3 className="font-title font-bold text-xl text-srd-maroon">{order.orderId}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Placed On</span>
                  <span className="text-sm font-semibold text-gray-700">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Stepper Grid Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                {/* Visual Connection line (Desktop only) */}
                <div className="hidden md:block absolute top-6 left-10 right-10 h-0.5 bg-gray-100 -z-0">
                  <div 
                    className="h-full bg-srd-gold transition-all duration-500" 
                    style={{ 
                      width: 
                        order.orderStatus === 'Pending' ? '0%' : 
                        order.orderStatus === 'Preparing' ? '33.3%' : 
                        order.orderStatus === 'Shipped' ? '66.6%' : '100%' 
                    }}
                  />
                </div>

                {/* Milestone 1: Pending */}
                <div className="flex flex-col items-center text-center z-10">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm ${
                    getStepStatus('Pending') === 'completed'
                      ? 'bg-srd-gold border-srd-gold text-srd-maroon font-bold'
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    <Clock size={20} />
                  </div>
                  <h5 className="font-bold text-xs text-srd-maroon mt-3">Order Placed</h5>
                  <p className="text-[10px] text-gray-400 mt-1 max-w-[120px]">Awaiting verification</p>
                </div>

                {/* Milestone 2: Preparing */}
                <div className="flex flex-col items-center text-center z-10">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm ${
                    getStepStatus('Preparing') === 'completed'
                      ? 'bg-srd-gold border-srd-gold text-srd-maroon font-bold'
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    <ChefHat size={20} />
                  </div>
                  <h5 className="font-bold text-xs text-srd-maroon mt-3">Preparing</h5>
                  <p className="text-[10px] text-gray-400 mt-1 max-w-[120px]">Baking & boxing fresh</p>
                </div>

                {/* Milestone 3: Shipped */}
                <div className="flex flex-col items-center text-center z-10">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm ${
                    getStepStatus('Shipped') === 'completed'
                      ? 'bg-srd-gold border-srd-gold text-srd-maroon font-bold'
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    <Truck size={20} />
                  </div>
                  <h5 className="font-bold text-xs text-srd-maroon mt-3">On The Way</h5>
                  <p className="text-[10px] text-gray-400 mt-1 max-w-[120px]">Out for delivery</p>
                </div>

                {/* Milestone 4: Delivered */}
                <div className="flex flex-col items-center text-center z-10">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm ${
                    getStepStatus('Delivered') === 'completed'
                      ? 'bg-green-500 border-green-500 text-white font-bold'
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    <CheckCircle2 size={20} />
                  </div>
                  <h5 className="font-bold text-xs text-srd-maroon mt-3">Delivered</h5>
                  <p className="text-[10px] text-gray-400 mt-1 max-w-[120px]">Reached successfully</p>
                </div>
              </div>
            </div>

            {/* DETAILS ACCORDION GRID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Shipping & Payment summary */}
              <div className="md:col-span-6 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-srd-gold/10 shadow-sm space-y-4">
                  <h4 className="font-title font-bold text-base text-srd-maroon border-b pb-3 flex items-center gap-2">
                    <FileText size={16} className="text-srd-gold" /> Shipment details
                  </h4>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-gray-400 font-bold block">Deliver To</span>
                      <span className="font-bold text-gray-700">{order.user?.name || 'Customer'}</span>
                    </div>
                    {order.shippingAddress && (
                      <div>
                        <span className="text-gray-400 font-bold block">Shipping Address</span>
                        <p className="font-semibold text-gray-600 mt-0.5 leading-relaxed">
                          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400 font-bold block">Contact Phone</span>
                      <span className="font-bold text-gray-700">+91 {order.shippingAddress?.phone || order.user?.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-srd-gold/10 shadow-sm space-y-4">
                  <h4 className="font-title font-bold text-base text-srd-maroon border-b pb-3">Payment Summary</h4>
                  <div className="space-y-3 text-xs font-semibold text-gray-600">
                    <div className="flex justify-between">
                      <span>Payment Method</span>
                      <span className="text-srd-maroon font-bold uppercase">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                      }`}>{order.paymentStatus}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Invoice Details */}
              <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-srd-gold/10 shadow-sm space-y-4">
                <h4 className="font-title font-bold text-base text-srd-maroon border-b pb-3">Order Invoice Items</h4>
                
                <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <h5 className="font-bold text-srd-maroon">{item.name}</h5>
                        <p className="text-[10px] text-gray-400 mt-0.5">{item.quantity} x {item.weight}</p>
                      </div>
                      <span className="font-bold text-gray-700">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 space-y-2 text-xs font-semibold text-gray-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span>₹{order.gst}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span>₹{order.deliveryCharges}</span>
                  </div>
                  
                  <div className="border-t pt-2.5 flex justify-between font-bold text-srd-maroon text-sm">
                    <span>Grand Total</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-srd-gold/15 shadow-sm text-center py-12 max-w-md mx-auto space-y-4">
            <h4 className="font-title font-bold text-lg text-srd-maroon">No Tracking ID Specified</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Provide your unique SRD reference identifier (e.g. SRD-XXXXX) in the search bar above to fetch preparation milestones.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
