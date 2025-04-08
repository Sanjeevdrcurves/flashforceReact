import { Navigate, Route, Routes } from 'react-router';
import { Login, ResetPassword, ResetPasswordChange, ResetPasswordChanged, ResetPasswordCheckEmail, ResetPasswordEnterEmail, Signup, TwoFactorAuth, StripePaymentSignup,ResetPasswordEnterOTP } from './pages/jwt';
import { AuthBrandedLayout } from '@/layouts/auth-branded';
import { AuthLayout } from '@/layouts/auth';
import { CheckEmail } from '@/auth/pages/jwt';
import { UserTwoFactorAuth } from './pages/jwt/UserTwoFactorAuth';
const AuthPage = () => <Routes>
    <Route element={<AuthBrandedLayout />}>
      <Route index element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/2fa" element={<TwoFactorAuth />} />
      <Route path="/signuppayment" element={<StripePaymentSignup />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password/enter-email" element={<ResetPasswordEnterEmail />} />
      <Route path="/reset-password/check-email" element={<ResetPasswordCheckEmail />} />
      <Route path="/reset-password/change" element={<ResetPasswordChange />} />
      <Route path="/reset-password/changed" element={<ResetPasswordChanged />} />
      <Route path="/reset-password/enter-otp" element={<ResetPasswordEnterOTP />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Route>

    <Route element={<AuthLayout />}>
      <Route path="/classic/login" element={<Login />} />
      <Route path="/classic/signup" element={<Signup />} />
      <Route path="/classic/2fa" element={<TwoFactorAuth />} />
      <Route path="/classic/User2fa" element={<UserTwoFactorAuth />} />
      <Route path="/classic/signuppayment" element={<StripePaymentSignup />} />
      <Route path="/classic/check-email" element={<CheckEmail />} />
      <Route path="/classic/reset-password" element={<ResetPassword />} />
      <Route path="/classic/reset-password/enter-email" element={<ResetPasswordEnterEmail />} />
      <Route path="/classic/reset-password/check-email" element={<ResetPasswordCheckEmail />} />
      <Route path="/classic/reset-password/change" element={<ResetPasswordChange />} />
      <Route path="/classic/reset-password/changed" element={<ResetPasswordChanged />} />
      <Route path="/classic/reset-password/enter-otp" element={<ResetPasswordEnterOTP />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Route>
  </Routes>;
export { AuthPage };