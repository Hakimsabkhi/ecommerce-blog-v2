import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
//import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice'; // Import your wishlist reducer

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();
// Combine your reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
});

// Create a persist configuration
const persistConfig = {
  key: 'root', 
  storage,
 
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializability check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // If there are specific state paths with non-serializable values, ignore them:
        // ignoredPaths: ['some.nested.path'],
      },
    }),
});

// Create the persistor for the store
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;