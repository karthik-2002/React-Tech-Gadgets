// src/components/ProductListingPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import '../styles.css';

const ProductListingPage = () => {
    const { user, logout } = useAuth();
    const { addToCart, increaseQuantity, decreaseQuantity, cart, cartItemCount } = useCart();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [originalProducts, setOriginalProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [priceRange, setPriceRange] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://finaltask-b2794-default-rtdb.firebaseio.com/products.json');
                const data = response.data;

                const productsArray = data.filter(product => product !== null && product !== undefined && product.price);
                
                setProducts(productsArray);
                setOriginalProducts(productsArray);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        if (user) {
            if (product.price) {
                const priceNumber = parseFloat(product.price.replace(/[$,]/g, ''));
                const productToAdd = {
                    ...product,
                    price: priceNumber
                };
                addToCart(productToAdd);
            } else {
                console.error(`Product with ID ${product.id} does not have a price.`);
            }
        } else {
            navigate('/login');
        }
    };

    const handleSortChange = (e) => {
        const order = e.target.value;
        setSortOrder(order);

        const sortedProducts = [...originalProducts].sort((a, b) => {
            const priceA = parsePrice(a.price);
            const priceB = parsePrice(b.price);
            return order === 'asc' ? priceA - priceB : priceB - priceA;
        });

        setProducts(sortedProducts);
    };

    const getQuantity = (productId) => {
        const item = cart.find(item => item.id === productId);
        return item ? item.quantity : 0;
    };

    const parsePrice = (priceString) => {
        if (typeof priceString !== 'string') return 0;
        const price = parseFloat(priceString.replace(/[$,]/g, ''));
        return isNaN(price) ? 0 : price;
    };

    const handlePriceRangeChange = (e) => {
        setPriceRange(e.target.value);
    };

    const isPriceInRange = (priceString, range) => {
        const price = parsePrice(priceString);
        switch (range) {
            case 'under-200':
                return price < 200;
            case '200-500':
                return price >= 200 && price <= 500;
            case '500-1000':
                return price > 500 && price <= 1000;
            case 'above-1000':
                return price > 1000;
            default:
                return true;
        }
    };

    const filteredProducts = originalProducts.filter(product => {
        return priceRange === '' || isPriceInRange(product.price, priceRange);
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Navbar cartItemCount={cartItemCount} user={user} logout={logout} />
            <div className="featured-products">
                <h2>Featured Products</h2>
                <div className="sort-filter-container">
                    <div className="filters">
                        <h3>Filters</h3>
                        <div>
                            <h4>Price Range</h4>
                            {['', 'under-200', '200-500', '500-1000', 'above-1000'].map(range => (
                                <label key={range}>
                                    <input
                                        type="radio"
                                        name="priceRange"
                                        value={range}
                                        checked={priceRange === range}
                                        onChange={handlePriceRangeChange}
                                    />
                                    {range.replace('-', ' to ').replace('under', 'Under ')}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="product-grid">
                    {filteredProducts.map((product) => (
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
                            <button onClick={() => navigate(`/product/${product.id}`)}>View Details</button>
                        </div>
                    ))}
                </div>
            </div>
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

export default ProductListingPage;