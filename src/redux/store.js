import { applyMiddleware, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers/rootReducer';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
const persistConfig = {
  key: 'root',
  storage,
  timeout: null,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer,  composeWithDevTools(applyMiddleware(thunk))); // Create the Redux store
const persistor = persistStore(store); // Create the persistor

export { store, persistor }; // Export store and persistor separately
