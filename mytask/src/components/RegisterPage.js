
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const RegisterPage = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const initialValues = { email: '', password: '' };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    const handleSubmit = async (values) => {
        const { email, password } = values;

        try {
            
            const response = await axios.get('https://finaltask-b2794-default-rtdb.firebaseio.com/users.json');
            const users = response.data || {};
            const usersData = Object.values(users);
            
            let highestUserId = 0; 
            for (const user in usersData) {
                const userId = usersData[user].userId

                if (userId > highestUserId) {
                    highestUserId = userId; 
                }
            }
            console.log(highestUserId)
            
            const newUserId = highestUserId + 1; 

            
            await axios.put(`https://finaltask-b2794-default-rtdb.firebaseio.com/users/${email.replace('.', ',')}.json`, {
                userId: newUserId, 
                email,
                password,
            });

            setSuccess('Registration successful! You can now log in.');
            setError('');
        } catch (error) {
            console.error('Error registering:', error);
            setError('An error occurred. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form>
                    <div>
                        <label htmlFor="email">Email</label>
                        <Field name="email" type="email" />
                        <ErrorMessage name="email" component="div" className="error" />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <Field name="password" type="password" />
                        <ErrorMessage name="password" component="div" className="error" />
                    </div>
                    <button type="submit">Register</button>
                </Form>
            </Formik>
        </div>
    );
};

export default RegisterPage;