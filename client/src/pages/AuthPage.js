import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthPage({ onLogin }) {
  const navigate = useNavigate();

  useEffect(() => {
    const messageHandler = (event) => {
      if (event.data.type === 'LOGIN_SUCCESS') {
        onLogin(event.data.userData);
        navigate('/');
      } else if (event.data.type === 'NAVIGATE') {
        navigate(event.data.path);
      }
    };
    

    window.addEventListener('message', messageHandler);

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [onLogin, navigate]);

  return (
        <iframe 
          src="/auth/auth.html"
          style={{ width: '100%', height: '100vh', border: 'none' }}
          title="Authentication Page"
        ></iframe>
  );
}

export default AuthPage;
