import clsx from 'clsx';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import { toAbsoluteUrl } from '@/utils';
import { Alert } from '@/components';
import { useLayout } from '@/providers';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
import { sendNotification } from '@/utils/notificationapi';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';

const initialValues = {
  companyName: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  acceptTerms: false,
};

const signupSchema = Yup.object().shape({
  companyName: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Company name is required'),
  fullName: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Full name is required'),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Phone Number is required'),
    password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Maximum 50 symbols')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  acceptTerms: Yup.bool().oneOf([true], 'You must accept the terms and conditions'),
});

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [ user, setUser ] = useState([]);
  const [ profile, setProfile ] = useState([]);
  //planName: type, planPrice: price, planSub:subscription
  //const { planId, planName, planPrice, planSub } = location.state || {};
  const {productDetails } = location.state || {};
  const planId = productDetails.planId;
  const planName = productDetails.planName;
  const planPrice = productDetails.planPrice;
  const planSub = productDetails.planSub;
  var addOns = [];
  var selectedAddons = productDetails.selectedAddOns; //id, name, price, subType
  if(productDetails && selectedAddons && selectedAddons.length){
    selectedAddons.map((item, index) => {
      addOns.push({Id: item.id, SubType: item.subType});
    });
  }
  const { currentLayout } = useLayout();
  const [gId, setGoogleId] = useState("0"); 
  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {debugger;
        const response = await axios.post(
          `${API_URL}/Company/CompanyUserSignUp`,
          null,
          {
            params: {
              companyName: values.companyName,
              fullName: values.fullName,
              email: values.email,
              phoneNo: values.phoneNumber,
              planId :planId,
              password: gId === "0"?values.password:"Test@1234",
              isAnnual: planSub=='Yearly'?true:false,
           //isAnnual: planSub=='year'?true:false,
              addOns: JSON.stringify(addOns),
              googleId: gId
            },
          }
        );
        console.log(response.data);
        if(response.data.message.endsWith("Email already exists in the system."))
        {
          setStatus('Email already exists in the system');
        }
        else{
          debugger;
         // navigate('/auth/classic/2fa', { replace: true,state:{email:values.email,userid:response?.data?.message?.split("##")[0], isAnnual:planSub=='year'?true:false, chargingAmount:planPrice} });
         navigate('/auth/classic/2fa', { replace: true,state:{email:values.email, userid:response?.data?.message?.split("##")[0], productDetails} });
        }
          // Send Notification
          await sendNotification(
            response?.data?.message?.split("##")[0],
            41, // Assuming 21 is the notification setting ID for the update
            'User signup notification',
            'User Signup Successfull',
            '2',
            response?.data?.message?.split("##")[0]
          );
      } catch (error) {debugger
        console.error(error);
        setStatus('Error submitting the form. Please try again.');

        // Send Notification for signup failure
        await sendNotification(
         '',// userid /email to be send notification to be sent to
          41, // Assuming 21 is the notification setting ID for the update
          'User signup failure notification',
          'User Signup failure',
          '3',
          ''
        );

      } finally {
        setLoading(false);
        setSubmitting(false);
        

        
      }
    },
  });
  const responseMessage=(data)=>{
    console.log(data);
  }
  const errorMessage=(data)=>{
    console.log(data);
  }


  useEffect(() => {
    if(!planId || parseInt(planId)==0){
      navigate('/billing/plan/organizationalplans', { replace: false });
    }
    const sidebar = document.querySelector('.sidebar');
    const header = document.querySelector('header.fixed');
    const wrapper = document.querySelector('.wrapper.flex.grow.flex-col');

    if (sidebar) sidebar.style.display = 'none';
    if (header) header.style.display = 'none';
    if (wrapper) {
      wrapper.style.marginLeft = '0';
      wrapper.style.marginTop = '0';
      wrapper.style.width = '100%';
      wrapper.style.padding = '16px';
    }

    return () => {
      if (sidebar) sidebar.style.display = '';
      if (header) header.style.display = '';
      if (wrapper) {
        wrapper.style.marginLeft = '';
        wrapper.style.marginTop = '';
        wrapper.style.width = '';
      }
    };
  }, []);  
  
  useEffect(
    () => {
      debugger
        if (user.access_token != undefined) {
          debugger 
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                  debugger
                  formik.setFieldValue('fullName', res.data.name || '');
                  formik.setFieldValue('email', res.data.email || '');

                  setGoogleId(res.data.id || 0);
                   // setProfile(res.data);
                  //  axios
                  //  .post(
                  //    `${API_URL}/Auth/GoogleLogin`, // API endpoint
                  //    {
                  //      email: res.data.email,
                  //      familyName: res.data.family_name, // Ensure property names match API model
                  //      givenName: res.data.given_name,
                  //      id: res.data.id,
                  //      name: res.data.name,
                  //      picture: res.data.picture,
                  //      verifiedEmail: res.data.verified_email,
                  //      planId :planId,
                  //      isAnnual: planSub=='year'?true:false,
                  //    },
                  //    {
                  //      headers: {
                  //        "Content-Type": "application/json", // Set correct Content-Type
                  //        Accept: "application/json"
                  //      }
                  //    }
                  //  )
                  //  .then((resp) => {
                  //    console.log("Login successful:", resp.data);
                  //  })
                  //  .catch((err) => console.error("Google login error:", err));
                 

                })
                .catch((err) => console.log(err));
        }
    },
    [ user ]
);
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
});

  return (
    <div
    style={{
      margin: "0px auto"
    }}
    >
      <div className="card max-w-[370px] w-full">
        <form
          className="card-body flex flex-col gap-5 p-10"
          noValidate
          onSubmit={formik.handleSubmit}>
          <div className="text-center mb-2.5">
            <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">
              Sign up
            </h3>
            <div className="flex items-center justify-center font-medium">
              <span className="text-2sm text-gray-600 me-1.5">
                Already have an Account ?
              </span>
              <Link
                to={
                  currentLayout?.name === 'auth-branded'
                    ? '/auth/login'
                    : '/auth/classic/login'
                }
                className="text-2sm link"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <a onClick={()=>{login()}}  className="btn btn-light btn-sm justify-center">
              <img
                src={toAbsoluteUrl('/media/brand-logos/google.svg')}
                className="size-3.5 shrink-0"
              />
              Use Google
            </a>
            {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage} /> */}

            <a href="#" className="btn btn-light btn-sm justify-center">
              <img
                src={toAbsoluteUrl('/media/brand-logos/apple-black.svg')}
                className="size-3.5 shrink-0 dark:hidden"
              />
              <img
                src={toAbsoluteUrl('/media/brand-logos/apple-white.svg')}
                className="size-3.5 shrink-0 light:hidden"
              />
              Use Apple
            </a>
          </div>

          <div className="flex items-center gap-2">
            <span className="border-t border-gray-200 w-full"></span>
            <span className="text-2xs text-gray-500 font-medium uppercase">
              Or
            </span>
            <span className="border-t border-gray-200 w-full"></span>
          </div>

          {formik.status && <Alert variant="danger">{formik.status}</Alert>}
          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">Selected Plan</label>
            <label className="input">
              <h3 className='text-primary'>{planName} {planPrice}/{planSub}</h3>
            </label>
          </div>
          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">Company Name</label>
            <label className="input">
              <input
                placeholder=""
                type="text"
                autoComplete="off"
                {...formik.getFieldProps('companyName')}
                className={clsx('form-control bg-transparent', {
                  'is-invalid':
                    formik.touched.companyName && formik.errors.companyName,
                  'is-valid':
                    formik.touched.companyName && !formik.errors.companyName,
                })}
              />
            </label>
            {formik.touched.companyName && formik.errors.companyName && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.companyName}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">Full Name</label>
            <label className="input">
              <input
                placeholder=""
                type="text"
                autoComplete="off"
                {...formik.getFieldProps('fullName')}
                className={clsx('form-control bg-transparent', {
                  'is-invalid':
                    formik.touched.fullName && formik.errors.fullName,
                  'is-valid':
                    formik.touched.fullName && !formik.errors.fullName,
                })}
              />
            </label>
            {formik.touched.fullName && formik.errors.fullName && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.fullName}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">Email</label>
            <label className="input">
              <input
                placeholder=""
                type="email"
                autoComplete="off"
                {...formik.getFieldProps('email')}
                className={clsx('form-control bg-transparent', {
                  'is-invalid': formik.touched.email && formik.errors.email,
                  'is-valid': formik.touched.email && !formik.errors.email,
                })}
              />
            </label>
            {formik.touched.email && formik.errors.email && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.email}
              </span>
            )}
          </div>
          {gId === "0" && (
  <div className="flex flex-col gap-1">
    <label className="form-label text-gray-900">Password</label>
    <label className="input">
      <input
        type="password"
        {...formik.getFieldProps('password')}
        className={clsx('form-control bg-transparent', {
          'is-invalid': formik.touched.password && formik.errors.password,
        })}
      />
    </label>
    {formik.touched.password && formik.errors.password && (
      <span role="alert" className="text-danger text-xs mt-1">
        {formik.errors.password}
      </span>
    )}
  </div>
)}

          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">Phone Number</label>
            <label className="input">
              <input
                placeholder=""
                type="text"
                autoComplete="off"
                {...formik.getFieldProps('phoneNumber')}
                className={clsx('form-control bg-transparent', {
                  'is-invalid':
                    formik.touched.phoneNumber && formik.errors.phoneNumber,
                  'is-valid':
                    formik.touched.phoneNumber && !formik.errors.phoneNumber,
                })}
              />
            </label>
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.phoneNumber}
              </span>
            )}
          </div>
          <label className="checkbox-group">
            <input
              className="checkbox checkbox-sm"
              type="checkbox"
              {...formik.getFieldProps('acceptTerms')}
            />
            <span className="checkbox-label">
              I accept{' '}
              <Link to="#" className="text-2sm link">
                Terms & Conditions
              </Link>
            </span>
          </label>

          {formik.touched.acceptTerms && formik.errors.acceptTerms && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.acceptTerms}
            </span>
          )}

          <button
            type="submit"
            className="btn btn-primary flex justify-center grow"
            disabled={loading || formik.isSubmitting}
          >
            {loading ? 'Please wait...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export { SignUp };
