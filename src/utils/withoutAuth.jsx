import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withoutAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const userId = localStorage.getItem('token');
      if (userId) {
        navigate('/');
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
};

export default withoutAuth;