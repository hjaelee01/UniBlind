import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import feedReducer from './redux/feedSlice.ts';
import userReducer from './redux/userSlice.js';
import "firebase/firestore";

const store = configureStore({
  reducer: {
    feed: feedReducer,
    user: userReducer,
  }
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);