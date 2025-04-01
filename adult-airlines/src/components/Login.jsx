import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = (userRole) => {
    const navigate = useNavigate(); // navigates active page to input route

    return (
        <div className='w-full h-dvh justify-items-center'>
            <h2>Welcome to Adult Airlines!</h2>
            <h2>Please log in below:</h2>
            <div className='flex flex-col justify-between h-[10%] w-80'>
                <input className='bg-stone-400 rounded shadow-md px-2 my-2' type='text' id='username' name='username' placeholder='Username:'/>
                <input className='bg-stone-400 rounded shadow-md px-2 my-2' type='password' id='password' name='password' placeholder='Password:'/>
                <button className='place-self-center duration-300 w-[20%] rounded hover:cursor-pointer bg-stone-400 hover:bg-stone-600 px-2 my-2' onClick={() => handleLogin(navigate, userRole)}>Login</button>
            </div>
        </div>
    )

}

const handleLogin = (nav, userRole) => {
    localStorage.setItem('userRole', userRole);
    nav('/dashboard');
}

export default Login;