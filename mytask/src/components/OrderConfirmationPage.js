// src/components/OrderConfirmationPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
 // Optional: Import a CSS file for styling

const OrderConfirmationPage = () => {
    const location = useLocation();
    const { cart, total, userDetails } = location.state || { cart: [], total: 0, userDetails: {} };

    // Generate a random order number for demonstration purposes
    const orderNumber = Math.floor(Math.random() * 1000000);

    return (
        <div>
            <Navbar />
            <h1>Order Confirmation</h1>
            <p>Thank you for your purchase, {userDetails.name}!</p>
            <h2>Order Summary</h2>
            <ul>
                {cart.map(item => (
                    <li key={item.id}>
                        {item.name} - Quantity: {item.quantity} - Price: ${item.price}
                    </li>
                ))}
            </ul>
            <h3>Order Details</h3>
            <p>Order Number: {orderNumber}</p>
            <p>Estimated Delivery Date: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            <h2>Total Amount: ${total.toFixed(2)}</h2>
            <p>Your order has been successfully placed. You will receive a confirmation email shortly.</p>
        </div>
    );
};

export default OrderConfirmationPage;