import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const url = 'https://crackthecode-rpsi.onrender.com'
const Login = ({setLogin}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();                                                                                                          

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.email.trim()) {
            tempErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            tempErrors.password = 'Password is required';
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Handle login logic here
            await axios.post(`${url}/api/v1/users/login`,formData)
            .then((res)=>{
                console.log(res);
                alert("you have successfully logged in")
                setLogin(false);
                navigate('/dashboard');
               
            })
            .catch((error)=>{
                console.log(error);
                if (error.response) {
                    alert(error.response.data.error || "Something went wrong");
                } else {
                    alert("Network error. Please try again.");
                }
            })
            setFormData({
                username:"",
                email:"",
                password:""
            })
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/signup';
        alert("You have successfully logged out")
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    <div className="remember-forgot">
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="remember-me"
                                className="checkbox-input"
                            />
                            <label htmlFor="remember-me">Remember me</label>
                        </div>
                        <Link to='/signup' className="forgot-link" onClick={logout}>Logout</Link>
                    </div>

                    <button type="submit" className="auth-button">
                        Sign in
                    </button>

                    <div className="signup-link">
                        Don't have an account?{' '}
                        <Link to="/Signup">Create one now</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
