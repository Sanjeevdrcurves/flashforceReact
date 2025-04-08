import React, { useState } from "react";

const AppointmentModal = ({ closeModal }) => {
  const [title, setTitle] = useState("");
  const [member, setMember] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !member || !contact) {
      alert("Please fill in all required fields!");
      return;
    }
    alert("Appointment booked successfully!");
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Book New Appointment</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Title</label>
          <input
            className="w-full border p-2 rounded mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label className="block mb-2">Select Member</label>
          <select className="w-full border p-2 rounded mb-2" value={member} onChange={(e) => setMember(e.target.value)} required>
            <option value="">Choose...</option>
            <option value="John Doe">John Doe</option>
            <option value="Jane Smith">Jane Smith</option>
          </select>
          <label className="block mb-2">Select Contact</label>
          <select className="w-full border p-2 rounded mb-4" value={contact} onChange={(e) => setContact(e.target.value)} required>
            <option value="">Choose...</option>
            <option value="Client A">Client A</option>
            <option value="Client B">Client B</option>
          </select>
          <div className="flex justify-between">
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
              Book
            </button>
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-red-500 text-white rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
