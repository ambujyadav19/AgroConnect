import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { boolAtom } from './Loged';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {jwtDecode} from 'jwt-decode'
import { Toaster } from 'react-hot-toast';
import { FarmerAtom } from './farmerAtom';
import { API_BASE_URL } from '../config';


const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const Navigate = useNavigate()
    const setMyBoolean = useSetRecoilState(boolAtom);
    const bool = useRecoilValue(boolAtom)
    const setMyType = useSetRecoilState(FarmerAtom);
    const typeBool = useRecoilValue(FarmerAtom)
    const [isFarmer, setIsFarmer] = useState(true);
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPass, setErrorPass] = useState('');

    const [usernameU, setUsernameU] = useState('');
    const [passwordU, setPasswordU] = useState('');
    const [errorEmailU, setErrorEmailU] = useState('');
    const [errorPassU, setErrorPassU] = useState('');
    
    

    const toggleBoolean = () => {
        // console.log(bool)
        setMyBoolean(prev => !prev);
        // console.log(bool)
    };
    const toggleType = () => {
        // console.log(bool)
        setMyType(true);
        // console.log(bool)
    };

    const handleSwitch = () => {
        setIsFarmer(!isFarmer);
    };

    const HandleSubmit = async () => {
        if (!username || !password) {
            setError('Please fill in both fields');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                body: JSON.stringify({
                    email: username,
                    password: password,
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('token', `Bearer ${result.token}`);
                const decodedToken = jwtDecode(result.token);
                localStorage.setItem('FarmerId', decodedToken.userId);
    
                console.log("Login successful:", result);
                toggleType()
                Navigate('/');  // Redirect to the home or dashboard page after successful login
                toggleBoolean(); // Toggle signup/login visibility
            } else {
                console.error("Login failed:", result);
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            console.error("Error during login:", err);
            setError('An error occurred during login');
        }
    };
    // USER---
    const HandleSubmitU = async () => {
        if (!usernameU || !passwordU) {
            setError('Please fill in both fields');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/loginUSER`, {
                method: 'POST',
                body: JSON.stringify({
                    email: usernameU,
                    password: passwordU,
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('token', `Bearer ${result.token}`);
                const decodedToken = jwtDecode(result.token);
                localStorage.setItem('UserId', decodedToken.userId);
    
                console.log("Login successful:", result);
                Navigate('/');  // Redirect to the home or dashboard page after successful login
                toggleBoolean(); // Toggle signup/login visibility
            } else {
                console.error("Login failed:", result);
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            console.error("Error during login:", err);
            setError('An error occurred during login');
        }
    };

    const handleChangeEmail = (e) => {
        const value = e.target.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for basic email validation

        // // Validate input to ensure it matches the email format
        setUsername(value);
        if (emailRegex.test(value)) {
            setErrorEmail(''); // Clear error if the email is valid
        } else if (value == "") {
            setErrorEmail('')
        }
        else {
            setErrorEmail('Invalid email address');
        }
    };
    const handleChangeEmailU = (e) => {
        const value = e.target.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for basic email validation

        // // Validate input to ensure it matches the email format
        setUsernameU(value);
        if (emailRegex.test(value)) {
            setErrorEmailU(''); // Clear error if the email is valid
        } else if (value == "") {
            setErrorEmailU('')
        }
        else {
            setErrorEmailU('Invalid email address');
        }
    };

    const handleChangePassword = (e) => {
        const value = e.target.value;
        const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/~`-]{0,6}$/; // Allows up to 8 alphanumeric or special characters

        // Validate input to ensure it is 8 characters long and contains allowed characters
        if (passwordRegex.test(value)) {
            setPassword(value);
            if (value.length === 6) {
                setErrorPass('');
            } else if (value == "") {
                setErrorPass("")
            }
            else {
                setErrorPass('Password must be exactly 6 characters long');
            }
        } else {
            setErrorPass('');
        }
    }
    const handleChangePasswordU = (e) => {
        const value = e.target.value;
        const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/~`-]{0,6}$/; // Allows up to 8 alphanumeric or special characters

        // Validate input to ensure it is 8 characters long and contains allowed characters
        if (passwordRegex.test(value)) {
            setPasswordU(value);
            if (value.length === 6) {
                setErrorPassU('');
            } else if (value == "") {
                setErrorPassU("")
            }
            else {
                setErrorPassU('Password must be exactly 6 characters long');
            }
        } else {
            setErrorPassU('');
        }
    }
    
    return (
        <>
        {/* {typeBool ? <>Yes</> : <>No</>} */}
        <div className=' max-h-screen overflow-y-auto mb-2'>
            <div className="  relative flex h-screen overflow-hidden bg-gray-100">
                <div
                    className={`
                            
                            absolute inset-0 flex justify-center items-center transition-transform duration-700 ease-in-out ${isFarmer ? 'translate-x-0' : '-translate-x-full'
                        } bg-gray-100 shadow-lg p-8`}
                >
                    <img className='absolute top-7 rounded-full border-4 border-blue-200'
                        src='data:image/jpeg;base64,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'
                        alt='Farmer Icon'
                    ></img>
                    <div className=" flex items-center justify-center min-h-screen  p-4 pt-0">
                        <div className="h-full w-full max-w-md px-8 py-4 bg-white shadow-md rounded-lg space-y-0">
                            <h2 className=" text-3xl font-semibold text-center text-blue-600 mb-2">Login <span className='text-sm text-gray-400 '>as farmer</span></h2>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <div className="space-y-3">
                                <div className='flex text-sm items-center ml-1 gap-4'>
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={handleSwitch}
                                    >
                                        Switch to User Login!
                                    </button>
                                    {/* <p className='m-2'>Already Have Account ? <a href='/login' className='text-blue-600 font-medium hover:underline'>Login</a></p> */}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={handleChangeEmail}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errorEmail && <p className="mx-2 text-red-500 text-sm">{errorEmail}</p>}
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={handleChangePassword}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errorPass && <p className="px-2 text-red-500 text-sm">{errorPass}</p>}
                                </div>
                                <button
                                    className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    onClick={HandleSubmit}
                                >
                                    Login <span className='text-sm font-normal text-gray-200'>as farmer</span>
                                </button>
                                <p className='m-2'>Already Have Account ? <a href='/signup' className='text-blue-600 font-medium hover:underline'>Signup</a></p>

                            </div>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            
            
                {/* AS USER----- */}
            <div
                className={` absolute inset-0 flex justify-center items-center transition-transform duration-700 ease-in-out ${isFarmer ? 'translate-x-full' : 'translate-x-0'
                    } bg-gray-100 shadow-lg p-8`}
                >
                    {/* <h1 className='absolute top-20'>User</h1> */}
                    <img className='absolute top-7 h-36 w-36 rounded-full border-4 border-blue-200'
                        src='data:image/jpeg;base64,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'
                        alt='Customer Icon'
                    ></img>
                
                    
                    <div className=" flex items-center justify-center min-h-screen bg-gray-100  p-4 pt-0">
                        <div className="h-full w-full max-w-md px-8 py-4 bg-white shadow-md rounded-lg space-y-0">
                            <h2 className=" text-3xl font-semibold text-center text-blue-600 mb-2">Login <span className='text-gray-400 text-sm  '>as User</span></h2>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <div className="space-y-3">
                                <div className='flex text-sm items-center ml-2 gap-4'>
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={handleSwitch}
                                    >
                                        Switch to Farmer Login!
                                    </button>
                                    {/* <p className='m-2'>Already Have Account ? <a href='/login' className='text-blue-600 font-medium hover:underline'>Login</a></p> */}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={usernameU}
                                        onChange={handleChangeEmailU}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errorEmailU && <p className="mx-2 text-red-500 text-sm">{errorEmailU}</p>}
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={passwordU}
                                        onChange={handleChangePasswordU}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errorPassU && <p className="px-2 text-red-500 text-sm">{errorPassU}</p>}
                                </div>
                                <button
                                    className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    onClick={HandleSubmitU}
                                >
                                    Login <span className='text-sm font-normal text-gray-100'>as user</span>
                                </button>
                                <p className='m-2'>Already Have Account ? <a href='/signup' className='text-blue-600 font-medium hover:underline'>Signup</a></p>
                            </div>
                        </div>
                    </div>
               
                </div>
            </div>
    </div>
    <Toaster/>
    </>
    );
};

export default LoginComponent;
