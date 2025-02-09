// src/components/ProductDetailsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams for getting product ID
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext
import { useCart } from '../context/CartContext'; // Import the CartContext
import axios from 'axios';
// Import the CSS file
import '../styles.css'; // Ensure you import your CSS file for styling

const ProductDetailsPage = () => {
    const { user, logout } = useAuth(); // Get user and logout function from context
    const { addToCart, increaseQuantity, decreaseQuantity, cart, cartItemCount } = useCart(); // Get addToCart function from CartContext
    const navigate = useNavigate(); // For redirection
    const { id } = useParams(); // Get product ID from URL parameters
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Fetch all products first
                const response = await axios.get('https://finaltask-b2794-default-rtdb.firebaseio.com/products.json');
                const data = response.data;

                // Find the product with the matching ID
                const productData = Object.values(data).find(item => item.id === parseInt(id)); // Adjusting to find by id
                setProduct(productData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (user) {
            if (product && product.price) {
                const priceNumber = parseFloat(product.price.replace(/[$,]/g, '')); // Remove $ and , and convert to float
                const productToAdd = {
                    ...product,
                    price: priceNumber // Set price as a number
                };
                addToCart(productToAdd); // Add product to cart if user is logged in
            } else {
                console.error(`Product does not have a price.`);
            }
        } else {
            navigate('/login'); // Redirect to the login page if user is not logged in
        }
    };

    const getQuantity = (productId) => {
        const item = cart.find(item => item.id === productId);
        return item ? item.quantity : 0; // Return the quantity if the item exists in the cart
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>; // Display error message
    }

    return (
        <div>
            <Navbar cartItemCount={cartItemCount} user={user} logout={logout} />
            {product && (
                <div className="product-details">
                    <img src={product.image} alt={product.name} />
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>${product.price ? parseFloat(product.price.replace(/[$,]/g, '')).toFixed(2) : 'N/A'}</p>
                    {getQuantity(product.id) > 0 ? (
                        <div className="quantity-controls">
                            <button onClick={() => decreaseQuantity(product)}>-</button>
                            <span>{getQuantity(product.id)}</span>
                            <button onClick={() => increaseQuantity(product)}>+</button>
                        </div>
                    ) : (
                        <button onClick={() => handleAddToCart(product)}>
                            Add to Cart
                        </button>
                    )}
                </div>
            )}
            <footer className="footer">
                <p>© 2023 MyShop. All rights reserved.</p>
                <nav>
                    <a href="#">About Us</a>
                    <a href="#">Contact</a>
                    <a href="#">Privacy Policy</a>
                </nav>
            </footer>
        </div>
    );
};

export default ProductDetailsPage;