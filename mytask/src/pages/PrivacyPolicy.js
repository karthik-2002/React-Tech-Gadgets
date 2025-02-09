// src/pages/PrivacyPolicy.js
import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles.css';

const PrivacyPolicy = () => {
    const { user, logout } = useAuth();
    const { cartItemCount } = useCart();

    return (
        <div>
            <Navbar cartItemCount={cartItemCount} user={user} logout={logout} />
            <h1>Privacy Policy</h1>
            <p>Your privacy is important to us. Please read our policy to understand how we handle your data.</p>
            
        </div>
    );
};

export default PrivacyPolicy;