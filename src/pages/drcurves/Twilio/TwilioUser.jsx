import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const TwilioUser = ({ onClose, fetchTableData }) => {
  const [twilioUser, setTwilioUser] = useState({
    twilioAccountSid: '',
    twilioAuthToken: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const { companyId, userId } = useSelector(state => state.AuthReducerKey);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTwilioUser({ ...twilioUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/TwilioUsers/Insert`, {
        companyId,
        twilioAccountSid: twilioUser.twilioAccountSid,
        twilioAuthToken: twilioUser.twilioAuthToken,
        createdBy:userId, // Replace with actual user ID
        isActive: twilioUser.isActive,
      });
      toast.success('Twilio Account added successfully');
      fetchTableData();
      onClose();
    } catch (error) {
      toast.error('Failed to add Twilio Account');
      console.error('Error adding Twilio Account:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-lg font-semibold mb-4">Add Twilio Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-sm font-medium">Twilio Account SID</label>
          <input
            type="text"
            name="twilioAccountSid"
            value={twilioUser.twilioAccountSid}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">Twilio Auth Token</label>
          <input
            type="text"
            name="twilioAuthToken"
            value={twilioUser.twilioAuthToken}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-3 flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={twilioUser.isActive}
            onChange={(e) => setTwilioUser({ ...twilioUser, isActive: e.target.checked })}
          />
          <label className="ml-2 text-sm">Active</label>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Twilio Account'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export { TwilioUser };
