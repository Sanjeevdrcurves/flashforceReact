import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const InvitationHandler = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  useEffect(() => {
      debugger;
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${API_URL}/User/Invitation/${token}`);
      debugger
        if (response?.data === 0) {
          setError("Invalid or expired invitation link.");
        } else {
          navigate(`/setNewpassword/${token}`);
        }
      } catch (error) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="container">
      {loading ? <p>Validating your invitation...</p> : error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default InvitationHandler;
