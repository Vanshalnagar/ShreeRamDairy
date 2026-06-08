import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { clearCart } from './cartSlice';

const initialState = {
  orders: [],
  adminOrders: [],
  orderDetails: null,
  analytics: null,
  loading: false,
  error: null
};

export const placeOrder = createAsyncThunk('orders/place', async (orderData, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post('/api/orders', orderData);
    dispatch(clearCart());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to place order');
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/orders/myorders');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch order history');
  }
});

export const trackOrderById = createAsyncThunk('orders/track', async (orderId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/orders/track/${orderId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to find order');
  }
});

// Admin thunks
export const adminFetchOrders = createAsyncThunk('orders/adminFetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/orders');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch orders queue');
  }
});

export const adminUpdateOrderStatus = createAsyncThunk('orders/adminUpdateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to update order status');
  }
});

export const adminFetchAnalytics = createAsyncThunk('orders/adminFetchAnalytics', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/orders/analytics');
    return response.data; // returns { stats, weeklyTrend }
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to load dashboard statistics');
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderDetails: (state) => {
      state.orderDetails = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Place Order
      .addCase(placeOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(placeOrder.fulfilled, (state) => { state.loading = false; })
      .addCase(placeOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // My Orders
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Track Order
      .addCase(trackOrderById.pending, (state) => { state.loading = true; state.error = null; state.orderDetails = null; })
      .addCase(trackOrderById.fulfilled, (state, action) => { state.loading = false; state.orderDetails = action.payload; })
      .addCase(trackOrderById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Admin Fetch All Orders
      .addCase(adminFetchOrders.fulfilled, (state, action) => { state.adminOrders = action.payload; })
      
      // Admin Update Order Status
      .addCase(adminUpdateOrderStatus.fulfilled, (state, action) => {
        state.adminOrders = state.adminOrders.map(order => 
          order._id === action.payload._id ? action.payload : order
        );
      })
      
      // Admin Fetch Analytics
      .addCase(adminFetchAnalytics.fulfilled, (state, action) => { state.analytics = action.payload; });
  }
});

export const { clearOrderDetails } = ordersSlice.actions;
export default ordersSlice.reducer;
