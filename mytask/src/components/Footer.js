// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <p>© 2023 MyShop. All rights reserved.</p>
            <nav>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/privacy-policy">Privacy Policy</Link>
            </nav>
        </footer>
    );
};

export default Footer;