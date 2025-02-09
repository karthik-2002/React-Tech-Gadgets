// src/components/Homepage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext
import { useCart } from '../context/CartContext'; // Import the CartContext
import axios from 'axios';
import Footer from './Footer';
// Import the CSS file
import '../styles.css'; // Ensure you import your CSS file for styling



const Homepage = () => {
    const { user, logout } = useAuth(); // Get user and logout function from context
    const { addToCart, increaseQuantity, decreaseQuantity, cart, cartItemCount } = useCart(); // Get addToCart function and cartItemCount from CartContext
    const navigate = useNavigate(); // For redirection
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://finaltask-b2794-default-rtdb.firebaseio.com/products.json');
                const data = response.data;
            
                // Transform the data into an array
                const productsArray = data
                .filter(product => product !== null && product !== undefined && product.price);
                
                setProducts(productsArray);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false );
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        if (user) {
            // Check if price is defined
            if (product.price) {
                // Convert price from string to number
                const priceNumber = parseFloat(product.price.replace(/[$,]/g, '')); // Remove $ and , and convert to float
                const productToAdd = {
                    ...product,
                    price: priceNumber // Set price as a number
                };
                addToCart(productToAdd); // Add product to cart if user is logged in
            } else {
                console.error(`Product with ID ${product.id} does not have a price.`);
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
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Navbar cartItemCount={cartItemCount} user={user} logout={logout} />
            {user && (
                <div className="user-info">
                    <p>Logged in as: {user.email}</p>
                    <button onClick={logout}>Logout</button>
                </div>
            )}
            <div className="featured-products">
                <h2>Featured Products</h2>
                <div className="product-grid">
                    {products.map((product) => (
                        <div className="product-card" key={product.id}>
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
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
                    ))}
                </div>
            </div>
            <Footer /> 
        </div>
    );
};

export default Homepage;