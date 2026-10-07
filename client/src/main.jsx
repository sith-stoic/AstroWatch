import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: '0.875rem',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              background: 'rgba(255, 255, 255, 0.96)',
              color: '#334155',
              boxShadow: '0 14px 36px rgba(15, 23, 42, 0.13)',
              padding: '12px 14px',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
