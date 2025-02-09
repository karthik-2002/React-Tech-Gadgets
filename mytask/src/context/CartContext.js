
import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; 

const CartContext = createContext();


const initialState = {
    cart: [],
};


const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingProduct = state.cart.find(item => item.id === action.payload.id);
            if (existingProduct) {
                return {
                    ...state,
                    cart: state.cart.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: (item.quantity || 1) + 1 }
                            : item
                    ),
                };
            } else {
                return {
                    ...state,
                    cart: [...state.cart, { ...action.payload, quantity: 1 }],
                };
            }
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                cart: state.cart.map(item =>
                    item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
                ),
            };
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload.id),
            };
        case 'CLEAR_CART':
            return {
                ...state,
                cart: [],
            };
        case 'UPDATE_CART':
            return {
                ...state,
                cart: action.payload ?? []
            }
        default:
            return state;
    }
};

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth(); 
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addToCart = async (product) => {
        dispatch({ type: 'ADD_TO_CART', payload: product });

        // Update Firebase
        if (user) {
            await axios.put(`https://finaltask-b2794-default-rtdb.firebaseio.com/carts/${user.userId}/${product.id}.json`, {
                quantity: 1,
                name: product.name,
                price: product.price,
                id: product.id
            });
        }
    };

    const updateQuantity = async (product, quantity) => {
        if (quantity < 1) return; 
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: product.id, quantity } });

        
        if (user) {
            await axios.put(`https://finaltask-b2794-default-rtdb.firebaseio.com/carts/${user.userId}/${product.id}.json`, { 
                quantity, 
                ...product
            });
        }
    };

    const increaseQuantity = (product) => {
        const currentQuantity = state.cart.find(item => item.id === product.id)?.quantity || 0;
        updateQuantity(product, currentQuantity + 1);
    };

    const decreaseQuantity = (product) => {
        const currentQuantity = state.cart.find(item => item.id === product.id)?.quantity || 1;
        if (currentQuantity > 1) {
            updateQuantity(product, currentQuantity - 1);
        }
    };

    const removeFromCart = async (id) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });

        // Remove item from Firebase
        if (user) {
            await axios.delete(`https://finaltask-b2794-default-rtdb.firebaseio.com/carts/${user.userId}/${id}.json`);
        }
    };

    const updateCart = async (userId) => {
        const response = await axios.get(`https://finaltask-b2794-default-rtdb.firebaseio.com/carts/${userId}.json`);
        const data =  Object.values(response.data || {}).filter(item => item !== null && item !== undefined);
        dispatch({type: 'UPDATE_CART', payload: data})
    }

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const cartItemCount = state.cart?.reduce((count, item) => count + (item.quantity || 0), 0); // Calculate total items in cart

    return (
        <CartContext.Provider value={{ cart: state.cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart, cartItemCount, updateCart }}>
            {children}
        </CartContext.Provider>
    );
};