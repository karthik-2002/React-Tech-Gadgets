
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RegisterPage from './RegisterPage'; 
import { useNavigate } from 'react-router-dom'; 
import '../styles.css'; 
import { useCart } from '../context/CartContext';

const LoginPage = () => {
    const [error, setError] = useState('');
    const [showRegister, setShowRegister] = useState(false); 
    const { login } = useAuth();
    const navigate = useNavigate(); 
    const data = useCart();

    const initialValues = { email: '', password: '' };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleSubmit = async (values) => {
        const { email, password } = values;

        try {
            const response = await axios.get(`https://finaltask-b2794-default-rtdb.firebaseio.com/users/${email.replace('.', ',')}.json`);
            const userData = response.data;
            
            if (userData && userData.password === password) {
                login({ email, userId: userData.userId });
                navigate('/home'); 
                data.updateCart( userData.userId)
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <h2>{showRegister ? 'Register' : 'Login'}</h2>
            {error && <div className="error">{error}</div>}
            {!showRegister ? (
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <Field name="email" type="email" />
                            <ErrorMessage name="email" component="div" className="error" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Field name="password" type="password" />
                            <ErrorMessage name="password" component="div" className="error" />
                        </div>
                        <button type="submit">Login</button>
                    </Form>
                </Formik>
            ) : (
                <RegisterPage /> 
            )}
            <div>
                <p>
                    {showRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button onClick={() => setShowRegister(!showRegister)}>
                        {showRegister ? 'Login here' : 'Register here'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;