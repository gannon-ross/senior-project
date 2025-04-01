import React from 'react';
import { useNavigate } from 'react-router-dom';



const Login = (userRole) => {
    const navigate = useNavigate(); // navigates active page to input route

    return (
        <div className='login'>
            <h2>Welcome to Adult Airlines!</h2>
            <h2>Please log in below:</h2>
            <button onClick={() => handleLogin(navigate, userRole)}>Login</button>
        </div>
    )

}

const handleLogin = (nav, userRole) => {
    localStorage.setItem('userRole', userRole);
    nav('/dashboard');
}

export default Login;