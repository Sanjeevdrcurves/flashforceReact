import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils';
import { useAuthContext } from '@/auth';
import { useLayout } from '@/providers';
import { Alert } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Authhandler } from '../../../redux/actions';
import { fetchMenu } from "../../../config/menu.config"; // Import the fetchMenu function
import { sendNotification } from '@/utils/notificationapi';
import { useGoogleLogin } from '@react-oauth/google';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Wrong email format')
        .min(3, 'Minimum 3 symbols')
        .max(50, 'Maximum 50 symbols')
        .required('Email is required'),
    password: Yup.string()
        .min(3, 'Minimum 3 symbols')
        .max(50, 'Maximum 50 symbols')
        .required('Password is required'),
    remember: Yup.boolean(),
});

const initialValues = {
    email: '',
    password: '',
    remember: false,
};

const Login = () => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [ipAddress, setIpAddress] = useState('');
    const [geoLocation, setGeoLocation] = useState({
        latitude: '0',
        longitude: '0',
        location: '',
    });
    const { login } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const [showPassword, setShowPassword] = useState(false);
   const { currentLayout } = useLayout(); 
   const [googleId, setGoogleId] = useState(null);
   const [user, setUser] = useState(null);
   const [loginStatus, setLoginStatus] = useState(null); 
   useEffect(() => {
    if (user) {
        axios
            .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                    Accept: 'application/json',
                },
            })
            .then((res) => {

                debugger
                axios
                    .post(
                        `${API_URL}/Auth/GoogleLogin`,
                        {
                            email: res.data.email,
                            familyName: res.data.family_name,
                            givenName: res.data.given_name,
                            id: res.data.id,
                            name: res.data.name,
                            picture: res.data.picture,
                            verifiedEmail: res.data.verified_email,
                            iPAddress: ipAddress,
                            latitude: geoLocation.latitude.toString(),
                            longitude: geoLocation.longitude.toString(),
                            location: geoLocation.location,
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json',
                            },
                        }
                    )
                    .then(async (resp) => {
                        if (resp.data.user2FA === true) {
                            localStorage.setItem('token', resp.data.token);

                            try {
                                const responseVerifyCode = await axios.post(
                                    `${API_URL}/Company/ResendVerifyCode`,
                                    null,
                                    {
                                        params: {
                                            userId: resp.data.userId, // Corrected variable reference
                                        },
                                    }
                                );

                                if (responseVerifyCode.status === 200) {
                                    navigate('/auth/classic/User2fa', {
                                        replace: true,
                                        state: {
                                            email: res.data.email, // Ensure correct email reference
                                            userid: resp.data.userId,
                                        },
                                    });
                                }
                            } catch (verifyError) {
                                console.error('Error resending verification code:', verifyError);
                            }
                        } else {
                            dispatch(Authhandler(resp.data));
                            // Fetch the menu dynamically after login
                            fetchMenu();
                            navigate('/', { replace: true });
                        }
                    })
                    .catch(async (err) => {
                        debugger
                       // console.error('Login error:', err);
                        setLoginStatus(err.response?.data?.message || 'The login details are incorrect'); // Store error in state
                       

                        // Send Notification
                        try {
                            await sendNotification(
                                0,
                                57,
                                'suspicious activity notification',
                                'suspicious activity updation Successful',
                                '41',
                                res.data.email // Ensure correct email reference
                            );
                        } catch (notificationError) {
                            console.error('Error sending notification:', notificationError);
                        }
                    });
            })
            .catch((err) => console.error('Error fetching user info:', err));
    }
}, [user]);


   useEffect(() => {
       
        // Fetch the IP address and geolocation on component mount
        const fetchIPAddress = async () => {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                setIpAddress(response.data.ip);
            } catch (error) {
                setIpAddress("74.235.56.134");
                console.error('Error fetching IP address:', error);
            }
            
        };

        const fetchGeoLocation = () => {
            try{
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords;
    
                            // Fetch location data using reverse geocoding
                            const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                            );
                            const locationData = await response.json();
    
                            setGeoLocation({
                                latitude,
                                longitude,
                                location: locationData.display_name || 'Unknown location',
                            });
                        },
                        (error) => {
                            console.error('Geolocation error:', error);
                            setGeoLocation({
                                latitude: '0',
                                longitude: "0",
                                location: 'Unable to fetch location',
                            });
                        }
                    );
                } else {
                    console.warn('Geolocation is not supported by your browser.');
                }

            }
            catch(errr)
            {
                console.log(errr);
                
                setGeoLocation({
                    latitude: '0',
                    longitude: "0",
                    location: 'Unable to fetch location',
                });   
            }
        };

        fetchIPAddress();
        fetchGeoLocation();
    }, []);

    const formik = useFormik({
        initialValues,
        validationSchema: loginSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true);
            try {
                const response = await axios.post(
                    `${API_URL}/auth/login`,
                    null, // No body is sent for query params
                    {
                        params: {
                            username: values.email,
                            password: values.password,
                            iPAddress: ipAddress,
                            latitude: geoLocation.latitude,
                            longitude: geoLocation.longitude,
                            location: geoLocation.location,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                if(response.data.user2FA == true)
                {
                    localStorage.setItem("token",response.data.token);
                     const responseVerifyCode = await axios.post(
                            `${API_URL}/Company/ResendVerifyCode`,
                            null,
                            {
                              params: {
                                userId: response?.data?.userId
                              },
                            }
                          );
                          if (responseVerifyCode.status === 200){
                    
                    navigate('/auth/classic/User2fa', { replace: true,state:{email:values.email,userid:response?.data?.userId} });
                 }

                }
                else
                {
                dispatch(Authhandler(response.data));
                // Fetch the menu dynamically after login
                await fetchMenu();
                navigate('/', { replace: true }); 
            }
            } catch (error) {
                console.error('Login error:', error);
                setStatus(error.response?.data?.message || 'The login details are incorrect');
                setSubmitting(false);
                     // Send Notification
await sendNotification(
    0,
     57, 
     'suspicious activity notification',
     'suspicious activity updation Successful',
     '41',
	 values.email
   ); 
            }

            finally {
                setLoading(false);
            }
        },

    });

    const togglePassword = (event) => {
        event.preventDefault();
        setShowPassword(!showPassword);
    };
    const handleGoogleSignIn = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });
    return (
        <div className="card max-w-[390px] w-full">
            <form
                className="card-body flex flex-col gap-5 p-10"
                onSubmit={formik.handleSubmit}
                noValidate
            >
                <div className="text-center mb-2.5">
                    <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">
                        Sign in
                    </h3>
                    <div className="flex items-center justify-center font-medium">
                        <span className="text-2sm text-gray-600 me-1.5">Need an account?</span>
                        <Link
                            onClick={(event) => {
                                event.preventDefault();
                                navigate('/billing/plan/organizationalplans', { replace: false });
                            }}
                            className="text-2sm link"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>

                {formik.status && <Alert variant="danger">{formik.status}</Alert>}
                {loginStatus && <Alert variant="danger">{loginStatus}</Alert>}

                <div className="flex flex-col gap-1">
                    <label className="form-label text-gray-900">Email</label>
                    <label className="input">
                        <input
                            placeholder="Enter username"
                            autoComplete="off"
                            {...formik.getFieldProps('email')}
                            className={clsx('form-control', {
                                'is-invalid': formik.touched.email && formik.errors.email,
                            })}
                        />
                    </label>
                    {formik.touched.email && formik.errors.email && (
                        <span role="alert" className="text-danger text-xs mt-1">
                            {formik.errors.email}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-1">
                        <label className="form-label text-gray-900">Password</label>
                        <Link
                            to={
                                currentLayout?.name === 'auth-branded'
                                    ? '/auth/reset-password'
                                    : '/auth/classic/reset-password'
                            }
                            className="text-2sm link shrink-0"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <label className="input">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter Password"
                            autoComplete="off"
                            {...formik.getFieldProps('password')}
                            className={clsx('form-control', {
                                'is-invalid': formik.touched.password && formik.errors.password,
                            })}
                        />
                        <button className="btn btn-icon" onClick={togglePassword}>
                            <KeenIcon
                                icon="eye"
                                className={clsx('text-gray-500', {
                                    hidden: showPassword,
                                })}
                            />
                            <KeenIcon
                                icon="eye-slash"
                                className={clsx('text-gray-500', {
                                    hidden: !showPassword,
                                })}
                            />
                        </button>
                    </label>
                    {formik.touched.password && formik.errors.password && (
                        <span role="alert" className="text-danger text-xs mt-1">
                            {formik.errors.password}
                        </span>
                    )}
                </div>

                <label className="checkbox-group">
                    <input
                        className="checkbox checkbox-sm"
                        type="checkbox"
                        {...formik.getFieldProps('remember')}
                    />
                    <span className="checkbox-label">Remember me</span>
                </label>

                <button
                    type="submit"
                    className="btn btn-primary flex justify-center grow"
                    disabled={loading || formik.isSubmitting}
                >
                    {loading ? 'Please wait...' : 'Sign In'}
                </button> 
                <button
                    type="button"
                     className="btn flex justify-center items-center gap-2 mt-2 border border-gray-300 rounded-md p-2 hover:bg-gray-100 transition"
                    onClick={handleGoogleSignIn}
                >
                    <img src={toAbsoluteUrl('/media/brand-logos/google.svg')} alt="Google" className="w-5 h-5" />
                    Sign in with Google
                </button>
                </form>
        </div>
    );
};

export { Login };
