import React, { useState, Fragment } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const TestNew = () => {
  // State for form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    dateOfBirth: "",
    address: "",
    relationshipNumber: "",
    passwordHash: "",
    createdBy: "",
  });

  // State for success or error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Auth credentials
    // const username = "drcurves";
    // const password = "drCurves#!@@@";

    // // Encode credentials to Base64
    // const encodedCredentials = btoa(`${username}:${password}`);

    try {
      // Axios POST request with Basic Authentication
      const response = await axios.post(
        `${API_URL}/api/User/add`, // Replace with your API endpoint
        formData,
        {
          headers: {
            // Authorization: `Basic ${encodedCredentials}`, // Basic Auth header
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Handle success
      setSuccessMessage("User details saved successfully!");
      setErrorMessage(""); // Clear any previous error message
      console.log("API Response:", response.data);

      // Reset form fields after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        dateOfBirth: "",
        address: "",
        relationshipNumber: "",
        passwordHash: "",
        createdBy: "",
      });
    } catch (error) {
      // Handle error
      setErrorMessage("Failed to save user details. Please check the API credentials.");
      console.error("API Error:", error.response || error.message);
    }
  };

  return (
    <Fragment>
      <div className="container">
        <h1 className="mb-4">User Form</h1>

        {/* Display success or error messages */}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        {/* Form for user details */}
        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">
              First Namesfsfdsf
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter First Name"
              required
            />
          </div>

          {/* Last Name */}
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter Last Name"
              required
            />
          </div>

          {/* User Name */}
          <div className="mb-3">
            <label htmlFor="userName" className="form-label">
              User Name
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter User Name"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter Email Address"
              required
            />
          </div>

          {/* Date of Birth */}
          <div className="mb-3">
            <label htmlFor="dateOfBirth" className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          {/* Address */}
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter Address"
            />
          </div>

          {/* Relationship Number */}
          <div className="mb-3">
            <label htmlFor="relationshipNumber" className="form-label">
              Relationship Number (UUID)
            </label>
            <input
              type="text"
              id="relationshipNumber"
              name="relationshipNumber"
              value={formData.relationshipNumber}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter Relationship Number"
            />
          </div>

          {/* Password Hash */}
          <div className="mb-3">
            <label htmlFor="passwordHash" className="form-label">
              Password Hash
            </label>
            <input
              type="password"
              id="passwordHash"
              name="passwordHash"
              value={formData.passwordHash}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter Password Hash"
            />
          </div>

          {/* Created By */}
          <div className="mb-3">
            <label htmlFor="createdBy" className="form-label">
              Created By
            </label>
            <input
              type="text"
              id="createdBy"
              name="createdBy"
              value={formData.createdBy}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter Created By"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary">
            Save User
          </button>
        </form>
      </div>
    </Fragment>
  );
};

export default TestNew;


