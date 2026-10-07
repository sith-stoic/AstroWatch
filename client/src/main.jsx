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
              fontWeight: 700,
              borderRadius: '0.9rem',
              border: '1px solid rgba(148, 163, 184, 0.13)',
              background: 'rgba(13, 17, 27, 0.96)',
              color: '#E8ECF3',
              boxShadow: '0 18px 46px rgba(0, 0, 0, 0.34)',
              padding: '12px 14px',
              backdropFilter: 'blur(18px)',
            },
            success: {
              iconTheme: { primary: '#34D399', secondary: '#0D111B' },
            },
            error: {
              iconTheme: { primary: '#FB7185', secondary: '#0D111B' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
