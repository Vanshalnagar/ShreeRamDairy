import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Load cart items from localStorage
const storedCart = localStorage.getItem('srd_cart') ? JSON.parse(localStorage.getItem('srd_cart')) : [];

const initialState = {
  cartItems: storedCart,
  appliedCoupon: null,
  loading: false,
  error: null
};

export const applyCoupon = createAsyncThunk('cart/applyCoupon', async (code, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/coupons/validate', { code });
    return response.data; // returns { code, discountPercent }
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Coupon verification failed');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, name, price, image, quantity, weight } = action.payload;
      
      const existing = state.cartItems.find(
        item => item.product === product && item.weight === weight
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.cartItems.push({
          product,
          name,
          price,
          image,
          quantity,
          weight
        });
      }

      localStorage.setItem('srd_cart', JSON.stringify(state.cartItems));
    },
    updateQuantity: (state, action) => {
      const { product, weight, quantity } = action.payload;
      const item = state.cartItems.find(
        item => item.product === product && item.weight === weight
      );
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.cartItems = state.cartItems.filter(
            i => !(i.product === product && i.weight === weight)
          );
        }
      }
      localStorage.setItem('srd_cart', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const { product, weight } = action.payload;
      state.cartItems = state.cartItems.filter(
        item => !(item.product === product && item.weight === weight)
      );
      localStorage.setItem('srd_cart', JSON.stringify(state.cartItems));
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.error = null;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.appliedCoupon = null;
      state.error = null;
      localStorage.removeItem('srd_cart');
    },
    clearCartError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(applyCoupon.fulfilled, (state, action) => { state.loading = false; state.appliedCoupon = action.payload; })
      .addCase(applyCoupon.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.appliedCoupon = null; });
  }
});

export const { addToCart, updateQuantity, removeFromCart, removeCoupon, clearCart, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
