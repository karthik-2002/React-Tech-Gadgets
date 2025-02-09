// src/components/CheckoutPage.js
import React, { useEffect } from 'react';
import { Field, Form, FormikProvider, useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import * as Yup from 'yup';
import Navbar from './Navbar';
import './CheckoutPage.css'; // Import the CSS file

const CheckoutPage = () => {
    const { cart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const formik = useFormik({
        initialValues: {
            name: '',
            mobile: '',
            address1: '',
            address2: '',
            pincode: '',
            payment: '',
        },
        onSubmit: (values) => handleSubmit(values),
        validationSchema: Yup.object().shape({
            name: Yup.string().required('Please Enter name'),
            mobile: Yup.string().required('Please Enter mobile'),
            address1: Yup.string().required('Please Enter address1'),
            address2: Yup.string().required('Please Enter address2'),
            pincode: Yup.string().required('Please Enter Pincode'),
            payment: Yup.string()
                .required('Please select payment option')
                .oneOf(
                    ['UPI', 'Credit/Debit', 'Net banking', 'Cash on delivery'],
                    'Select valid option'
                ),
        }),
    });

    const handleSubmit = (values) => {
        const subtotal = cart.reduce((acc, item) => {
            const price = typeof item.price === 'string' ? item.price : item.price?.toString() || '0';
            return acc + parseFloat(price.replace(/[$,]/g, '')) * item.quantity;
        }, 0);
        const tax = subtotal * 0.1; 
        const total = subtotal + tax;

        navigate('/order-confirmation', {
            state: {
                cart,
                total,
                userDetails: values,
            },
        });
    };

    const subtotal = cart.reduce((acc, item) => {
        const price = typeof item.price === 'string' ? item.price : item.price?.toString() || '0';
        return acc + parseFloat(price.replace(/[$,]/g, '')) * item.quantity;
    }, 0);
    const tax = subtotal * 0.1; // Assuming a 10% tax rate
    const total = subtotal + tax;

    return (
        <div className="checkout-container">
            <Navbar />
            <h1>Checkout</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty. Please add items to your cart before checking out.</p>
            ) : (
                <FormikProvider value={formik}>
                    <Form onSubmit={formik.handleSubmit} className="checkout-form">
                        <h3>Shipping Details</h3>
                        <div className="form-group">
                            <label>Name:</label>
                            <Field id="name" type="text" name="name" placeholder="Enter full name" />
                            {formik.touched.name && formik.errors.name && (
                                <span className="error">{formik.errors.name}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Mobile Number:</label>
                            <Field id="mobile" type="text" name="mobile" placeholder="Enter mobile" />
                            {formik.touched.mobile && formik.errors.mobile && (
                                <span className="error">{formik.errors.mobile}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Address Line 1:</label>
                            <Field id="address1" type="text" name="address1" placeholder="Enter address line 1" />
                            {formik.touched.address1 && formik.errors.address1 && (
                                <span className="error">{formik.errors.address1}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Address Line 2:</label>
 <Field id="address2" type="text" name="address2" placeholder="Enter address line 2" />
                            {formik.touched.address2 && formik.errors.address2 && (
                                <span className="error">{formik.errors.address2}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Pincode:</label>
                            <Field id="pincode" type="text" name="pincode" placeholder="Enter Postal code" />
                            {formik.touched.pincode && formik.errors.pincode && (
                                <span className="error">{formik.errors.pincode}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Payment mode:</label>
                            <Field as="select" id="payment" name="payment">
                                <option value="">Select payment mode</option>
                                <option value="UPI">UPI</option>
                                <option value="Credit/Debit">Credit/Debit Card</option>
                                <option value="Net banking">Net Banking</option>
                                <option value="Cash on delivery">Cash on Delivery</option>
                            </Field>
                            {formik.touched.payment && formik.errors.payment && (
                                <span className="error">{formik.errors.payment}</span>
                            )}
                        </div>

                        <h3>Order Summary</h3>
                        <div className="order-summary">
                            <p>Subtotal: ${subtotal.toFixed(2)}</p>
                            <p>Tax: ${tax.toFixed(2)}</p>
                            <p>Total: ${total.toFixed(2)}</p>
                        </div>

                        <button type="submit" className="checkout-button">Place Order</button>
                    </Form>
                </FormikProvider>
            )}
        </div>
    );
};

export default CheckoutPage;