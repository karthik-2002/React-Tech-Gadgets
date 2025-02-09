// src /components/ShoppingCartPage.js
import React, { useEffect, useReducer } from 'react';
import { useCart } from '../context/CartContext';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ShoppingCartPage = () => {
    const { cart, removeFromCart, increaseQuantity, decreaseQuantity,cartItemCount} = useCart();
    const { user,logout  } = useAuth();
    const navigate = useNavigate();

    
    const parsePrice = (price) => {
        if (typeof price === 'string') {
            return parseFloat(price.replace(/[$,]/g, ''));
        } else if (typeof price === 'number') {
            return price;
        }
        return 0;
    };

    const subtotal = cart.reduce((acc, item) => acc + parsePrice(item.price) * item.quantity, 0);
    const tax = subtotal * 0.1; 
    const total = subtotal + tax;

    const handleCheckout = () => {
        if (!user) {
            navigate('/login'); 
        } else {
            navigate('/checkout'); 
        }
    };

    return (
        <div>
            <Navbar cartItemCount={cartItemCount} user={user} logout={logout} />
            {user && (
                <div className="user-info">
                    <p>Logged in as: {user.email}</p>
                    <button onClick={logout}>Logout</button>
                </div>
            )}
            <h1>Shopping Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    <ul>
                        {cart.map(item => (
                            <li key={item.id}>
                                <h2>{item.name}</h2>
                                <p>Price: ${item.price}</p>
                                <p>Quantity: 
                                    <button onClick={() => decreaseQuantity(item)}>-</button>
                                    {item.quantity}
                                    <button onClick={() => increaseQuantity(item)}>+</button>
                                </p>
                                <button onClick={() => removeFromCart(item.id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <h2>Subtotal: ${subtotal.toFixed(2)}</h2>
                    <h2>Tax: ${tax.toFixed(2)}</h2>
                    <h2>Total: ${total.toFixed(2)}</h2>
                    <button onClick={handleCheckout}>Checkout</button>

                </div>
            )}
        </div>
    );
};

export default ShoppingCartPage;