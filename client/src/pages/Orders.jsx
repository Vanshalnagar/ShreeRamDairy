import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Calendar, CreditCard, ChevronRight, CheckCircle2, Clock, Truck, ShieldAlert } from 'lucide-react';
import { fetchMyOrders } from '../store/slices/ordersSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
            <Clock size={12} /> Pending Approval
          </span>
        );
      case 'Preparing':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <ShoppingBag size={12} /> Kitchen preparing
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            <Truck size={12} /> Out for Delivery
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <CheckCircle2 size={12} /> Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-srd-cream py-12 px-4 md:px-12 font-body">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Title */}
        <div className="text-center mb-10">
          <h2 className="font-title font-bold text-3xl md:text-4xl text-srd-maroon">Your Orders History</h2>
          <p className="text-sm text-gray-500 mt-2">Track and view invoices for all your past purchases</p>
          <div className="w-16 h-0.5 bg-srd-gold mx-auto mt-3"></div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium bg-white rounded-2xl border border-gray-100 shadow-sm">
            Fetching order logs...
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center flex items-center justify-center gap-2 max-w-lg mx-auto">
            <ShieldAlert size={20} />
            <span>{error}</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-srd-gold/10 shadow-sm max-w-lg mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-srd-gold/10 text-srd-maroon flex items-center justify-center mx-auto">
              <ShoppingBag size={28} />
            </div>
            <h3 className="font-title font-bold text-xl text-srd-maroon">No Orders Placed Yet</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">You have not purchased any sweets yet. Order now to get door delivery!</p>
            <div className="pt-2">
              <Link to="/products" className="bg-srd-gold text-srd-maroon hover:bg-srd-orange hover:text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase shadow-sm">
                Shop Sweets Menu
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-srd-gold/15 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Left Side: ID, Date, Items summary */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-title font-bold text-lg text-srd-maroon tracking-wider">
                      {order.orderId}
                    </span>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-semibold uppercase tracking-wider flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard size={13} /> {order.paymentMethod} ({order.paymentStatus})
                    </span>
                  </div>

                  {/* Items Text snippet */}
                  <div className="text-sm text-gray-600 font-medium">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="after:content-[',_'] last:after:content-none font-semibold text-gray-700">
                        {item.name} ({item.weight} x{item.quantity})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Side: Total Cost & Button */}
                <div className="flex items-center md:text-right justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                  <div>
                    <span className="text-xs text-gray-400 font-bold block">Estimated Amount</span>
                    <span className="text-2xl font-bold text-srd-maroon">₹{order.total}</span>
                  </div>

                  <button
                    onClick={() => navigate(`/track?id=${order.orderId}`)}
                    className="bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1 transform hover:translate-x-0.5"
                  >
                    Track Order <ChevronRight size={14} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
