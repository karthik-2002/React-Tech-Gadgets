
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ cartItemCount, user, logout }) => {
    return (
        <header className="navbar">
            <h1 className="logo">MyShop</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/cart">
                    Cart <span className="cart-count">({cartItemCount})</span>
                </Link>
                {user ? (
                    <>
                        <span className="user-greeting">Welcome, {user.email}</span>
                        <button onClick={logout} className="logout-button">Logout</button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </nav>
        </header>
    );
};

export default Navbar;