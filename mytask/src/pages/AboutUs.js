// src/pages/AboutUs.js
import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles.css';

const AboutUs = () => {
    const { user, logout } = useAuth();
    const { cartItemCount } = useCart();

    return (
        <div>
            <Navbar cartItemCount={cartItemCount} user={user} logout={logout} />
            <h1>About Us</h1>
            <p>Welcome to MyShop! We are dedicated to providing the best products for our customers.</p>
            
        </div>
    );
};

export default AboutUs;