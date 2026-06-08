import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],
  productDetails: null,
  reviews: [],
  categories: [],
  loading: false,
  error: null
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async (filters = {}, { rejectWithValue }) => {
  try {
    const { category, search, sort, minPrice, maxPrice, rating } = filters;
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (rating) params.append('rating', rating);

    const response = await axios.get(`/api/products?${params.toString()}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch products');
  }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/products/${id}`);
    return response.data; // returns { product, reviews }
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch product details');
  }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/products/categories');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
  }
});

export const addProductReview = createAsyncThunk('products/addReview', async ({ productId, reviewData }, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post(`/api/products/${productId}/reviews`, reviewData);
    dispatch(fetchProductById(productId)); // Refresh details
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to submit review');
  }
});

// Admin-only thunks
export const adminCreateProduct = createAsyncThunk('products/adminCreate', async (formData, { rejectWithValue }) => {
  try {
    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await axios.post('/api/products', formData, { headers });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to create product');
  }
});

export const adminUpdateProduct = createAsyncThunk('products/adminUpdate', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await axios.put(`/api/products/${id}`, formData, { headers });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to update product');
  }
});

export const adminDeleteProduct = createAsyncThunk('products/adminDelete', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/products/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete product');
  }
});

export const adminCreateCategory = createAsyncThunk('products/adminCreateCategory', async (formData, { rejectWithValue }) => {
  try {
    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await axios.post('/api/products/categories', formData, { headers });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to create category');
  }
});

export const adminUpdateCategory = createAsyncThunk('products/adminUpdateCategory', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await axios.put(`/api/products/categories/${id}`, formData, { headers });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to update category');
  }
});

export const adminDeleteCategory = createAsyncThunk('products/adminDeleteCategory', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/products/categories/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete category');
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearDetails: (state) => {
      state.productDetails = null;
      state.reviews = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.products = action.payload; })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(fetchProductById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.loading = false; state.productDetails = action.payload.product; state.reviews = action.payload.reviews; })
      .addCase(fetchProductById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; })
      
      // Admin creators & deleters
      .addCase(adminCreateProduct.fulfilled, (state, action) => { state.products.unshift(action.payload); })
      .addCase(adminDeleteProduct.fulfilled, (state, action) => { state.products = state.products.filter(p => p._id !== action.payload); })
      .addCase(adminCreateCategory.fulfilled, (state, action) => { state.categories.push(action.payload); })
      .addCase(adminUpdateCategory.fulfilled, (state, action) => {
        state.categories = state.categories.map(c => c._id === action.payload._id ? action.payload : c);
      })
      .addCase(adminDeleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c._id !== action.payload);
      });
  }
});

export const { clearDetails } = productsSlice.actions;
export default productsSlice.reducer;
