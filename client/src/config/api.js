const FALLBACK_API_BASE_URL = 'https://shoppingapp-froy.onrender.com';

export const API_BASE_URL = (process.env.REACT_APP_API_BASE || FALLBACK_API_BASE_URL).replace(/\/+$/, '');
