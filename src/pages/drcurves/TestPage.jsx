import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const TestPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    dateOfBirth: "",
    address: "",
    relationshipNumber: "", // Should map to company relationshipNumber
    passwordHash: "",
    createdBy: "Test",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false); // Toggle for Create form

  useEffect(() => {
    getAllUsers();
    getAllCompanies();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/User/all`);
      setAllUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const getAllCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/Company/all`);
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const url = `${API_URL}/User/add`;
      const queryParams = new URLSearchParams({
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.userName,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        relationshipNumber: formData.relationshipNumber,
        passwordHash: formData.passwordHash,
        createdBy: "Test",
      });

      const response = await axios.post(`${url}?${queryParams.toString()}`, null, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setSuccessMessage("User created successfully!");
        resetForm();
        setIsCreating(false); // Hide Create Form
        getAllUsers();
      }
    } catch (error) {
      setErrorMessage("Failed to create user. Please check your input.");
      console.error("Error during user creation:", error.message, error.response?.data);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const url = `https://flashforceapi.drcurves.com/api/User/update`;
      const queryParams = new URLSearchParams({
        userId: currentUser.userID.toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.userName,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        relationshipNumber: formData.relationshipNumber,
        passwordHash: formData.passwordHash,
        modifiedBy: "Test",
      });

      const response = await axios.put(`${url}?${queryParams.toString()}`);
      if (response.status === 200) {
        setSuccessMessage("User updated successfully!");
        setCurrentUser(null); // Clear current user
        resetForm();
        getAllUsers();
      }
    } catch (error) {
      setErrorMessage("Failed to update user. Please check your input.");
      console.error("Error during user update:", error.message, error.response?.data);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API_URL}/User/delete/${user.userID}?modifiedBy=Test`);
      getAllUsers();
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      userName: user.userName || "",
      email: user.email || "",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "", // Format date
      address: user.address || "",
      relationshipNumber: user.relationshipNumber || "",
      passwordHash: user.passwordHash || "",
    });
    setIsCreating(false); // Hide Create Form
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      dateOfBirth: "",
      address: "",
      relationshipNumber: "",
      passwordHash: "",
      createdBy: "Test",
    });
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <Fragment>
      <div className="container-fixed">
        <div className="grid gap-5 lg:gap-7.5 mx-auto">
          <div className="card pb-2.5">
            <div className="card-header" id="general_settings">
              <h3 className="card-title">Users Management</h3>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  resetForm();
                  setIsCreating(true);
                  setCurrentUser(null); // Clear current user
                }}
              >
                Create New
              </button>
            </div>
            <div className="card-body grid gap-5">
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              {!isCreating && !currentUser && (
                <div>
                  <h3>All Users</h3>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>User Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.length > 0 ? (
                        allUsers.map((user) => (
                          <tr key={user.userID}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.userName}</td>
                            <td>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="btn btn-sm btn-primary"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(user)}
                                className="btn btn-sm btn-danger"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No users found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {isCreating && (
                <form onSubmit={handleCreateUser}>
                  <h3>Create User</h3>
                  <UserFormFields
                    formData={formData}
                    handleInputChange={handleInputChange}
                    companies={companies}
                  />
                  <button type="submit" className="btn btn-primary">
                    Create User
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </button>
                </form>
              )}
              {currentUser && (
                <form onSubmit={handleUpdateUser}>
                  <h3>Update User</h3>
                  <UserFormFields
                    formData={formData}
                    handleInputChange={handleInputChange}
                    companies={companies}
                  />
                  <button type="submit" className="btn btn-primary">
                    Update User
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setCurrentUser(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const UserFormFields = ({ formData, handleInputChange, companies }) => (
  <>
    {[ 
      { label: "First Name", name: "firstName", type: "text", placeholder: "Enter First Name" },
      { label: "Last Name", name: "lastName", type: "text", placeholder: "Enter Last Name" },
      { label: "User Name", name: "userName", type: "text", placeholder: "Enter User Name" },
      { label: "Email", name: "email", type: "email", placeholder: "Enter Email Address" },
      { label: "Date of Birth", name: "dateOfBirth", type: "date" },
      { label: "Address", name: "address", type: "text", placeholder: "Enter Address" },
      { label: "Password Hash", name: "passwordHash", type: "password", placeholder: "Enter Password Hash" },
    ].map(({ label, name, type, placeholder }) => (
      <div key={name} className="flex items-baseline gap-2.5">
        <label className="form-label">{label}</label>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className="input"
          placeholder={placeholder || ""}
        />
      </div>
    ))}

    <div className="flex items-baseline gap-2.5">
      <label className="form-label">Company</label>
      <select
        name="relationshipNumber"
        value={formData.relationshipNumber}
        onChange={handleInputChange}
        className="input">
        <option value="">Select a company</option>
        {companies.map((company) => (
          <option key={company.relationshipNumber} value={company.relationshipNumber}>
            {company.companyName}
          </option>
        ))}
      </select>
    </div>
  </>
);

export default TestPage;


