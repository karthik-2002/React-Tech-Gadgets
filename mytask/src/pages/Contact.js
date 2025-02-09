// src/pages/Contact.js
import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles.css';

const Contact = () => {
    const { user, logout } = useAuth();
    const { cartItemCount } = useCart();

    return (
        <div>
            <Navbar cartItemCount={cartItemCount} user={user} logout={logout} />
            <h1>Contact Us</h1>
            <p>If you have any questions, feel free to reach out!</p>
           
        </div>
    );
};

export default Contact;