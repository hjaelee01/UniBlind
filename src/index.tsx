import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import feedReducer from './redux/feedSlice';
import userReducer from './redux/userSlice';
import { createFirestoreInstance } from 'redux-firestore';
import firebase from "firebase/compat/app";
// Required for side-effects
import "firebase/firestore";

const store = configureStore({
  reducer: {
    feed: feedReducer,
    user: userReducer,
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);