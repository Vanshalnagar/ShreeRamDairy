import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get initial state from localStorage
const storedUser = localStorage.getItem('srd_user') ? JSON.parse(localStorage.getItem('srd_user')) : null;
const storedToken = localStorage.getItem('srd_token') || null;

const initialState = {
  user: storedUser,
  token: storedToken,
  addresses: [],
  wishlist: [],
  loading: false,
  error: null
};

// Axios base setup
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/auth/register', userData);
    localStorage.setItem('srd_token', response.data.accessToken);
    localStorage.setItem('srd_user', JSON.stringify(response.data.user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Registration failed');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/auth/login', userData);
    localStorage.setItem('srd_token', response.data.accessToken);
    localStorage.setItem('srd_user', JSON.stringify(response.data.user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Login failed');
  }
});

export const googleLoginUser = createAsyncThunk('auth/google', async (credential, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/auth/google', { credential });
    localStorage.setItem('srd_token', response.data.accessToken);
    localStorage.setItem('srd_user', JSON.stringify(response.data.user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Google login failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await axios.post('/api/auth/logout');
    localStorage.removeItem('srd_token');
    localStorage.removeItem('srd_user');
    delete axios.defaults.headers.common['Authorization'];
    return null;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Logout failed');
  }
});

export const fetchUserProfile = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/users/profile');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch profile');
  }
});

export const updateUserProfile = createAsyncThunk('auth/updateProfile', async (formData, { rejectWithValue }) => {
  try {
    // If formData is multi-part (like profile pic uploads), send it directly
    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await axios.put('/api/users/profile', formData, { headers });
    localStorage.setItem('srd_user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to update profile');
  }
});

export const fetchAddresses = createAsyncThunk('auth/fetchAddresses', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/users/addresses');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch addresses');
  }
});

export const addAddress = createAsyncThunk('auth/addAddress', async (addressData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/users/addresses', addressData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to add address');
  }
});

export const deleteAddress = createAsyncThunk('auth/deleteAddress', async (addressId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`/api/users/addresses/${addressId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete address');
  }
});

export const fetchWishlist = createAsyncThunk('auth/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/users/wishlist');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch wishlist');
  }
});

export const toggleWishlist = createAsyncThunk('auth/toggleWishlist', async ({ productId, inWishlist }, { rejectWithValue }) => {
  try {
    if (inWishlist) {
      await axios.delete(`/api/users/wishlist/${productId}`);
    } else {
      await axios.post(`/api/users/wishlist/${productId}`);
    }
    return { productId, inWishlist: !inWishlist };
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Wishlist operation failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.accessToken; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.accessToken; })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Google Login
      .addCase(googleLoginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(googleLoginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.accessToken; })
      .addCase(googleLoginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.token = null; state.addresses = []; state.wishlist = []; })
      // Fetch profile
      .addCase(fetchUserProfile.fulfilled, (state, action) => { state.user = action.payload; })
      // Update profile
      .addCase(updateUserProfile.fulfilled, (state, action) => { state.user = action.payload.user; })
      // Addresses
      .addCase(fetchAddresses.fulfilled, (state, action) => { state.addresses = action.payload; })
      .addCase(addAddress.fulfilled, (state, action) => { state.addresses = action.payload; })
      .addCase(deleteAddress.fulfilled, (state, action) => { state.addresses = action.payload; })
      // Wishlist
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.wishlist = action.payload; })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { productId, inWishlist } = action.payload;
        if (!inWishlist) {
          state.wishlist = state.wishlist.filter(item => item._id !== productId);
        }
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
