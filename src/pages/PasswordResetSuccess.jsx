import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const PasswordResetSuccess = () => {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%' }} className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-200">
      <Card className="max-w-md w-full text-center p-6 shadow-2xl rounded-2xl bg-white">
        <CheckCircle className="text-green-500 mx-auto" size={64} />
        <h2 className="text-2xl font-bold text-gray-800 mt-4">Password Changed Successfully</h2>
        <p className="text-gray-600 mt-2">
          Your password has been updated successfully. You can now log in with your new credentials.
        </p>
        <CardContent className="mt-6">
          <Button onClick={() => navigate('/auth/login')} className="mx-auto">
            Go to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordResetSuccess;
