import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const AddObjectType = ({ title, SelectedObject }) => {
    const [fieldName, setFieldName] = useState('');
    const [fields, setFields] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setFieldName('');
        setEditingIndex(null);
        setFields([]);

        if (SelectedObject) {
            fetchFields();
        }
    }, [SelectedObject]);

    const fetchFields = async () => {
        try {
            const response = await axios.get(`${API_URL}/CustomObject/GetObjectTypes?objectTypeId=-5&objectId=${SelectedObject ? SelectedObject.objectId : 0}`);
debugger
            if (Array.isArray(response.data)) {
                setFields(response.data);
            } else {
                throw new Error('API response is not an array');
            }
        } catch (error) {
            // setError(`Error fetching fields: ${error.message}`);
            console.error('Error fetching fields:', error);
        }
    };

    const handleAddField = async () => {
        if (fieldName.trim() === '') return;
        try {
            await axios.post(`${API_URL}/CustomObject/AddObjectType`, {
                objectID: SelectedObject ? SelectedObject.objectId : 0,
                objectTypeId: 0,
                objectTypeName: fieldName,
                status: 0,
                objectTypeFields: "",
                createdBy: 0
            });
            fetchFields();
            setFieldName('');
        } catch (error) {
            setError(`Error adding field: ${error.message}`);
            console.error('Error adding field:', error);
        }
    };

    const handleDeleteField = async (id) => {
        try {
            await axios.delete(`${API_URL}/CustomObject/DeleteObjectType/${id}`);
            setFields(fields.filter(field => field.objectTypeId !== id));
        } catch (error) {
            setError(`Error deleting field: ${error.message}`);
            console.error('Error deleting field:', error);
        }
    };

    const handleEditField = (index) => {
        setFieldName(fields[index].objectTypeName);
        setEditingIndex(index);
    };

    const handleUpdateField = async () => {
        if (fieldName.trim() === '') return;
        const fieldToUpdate = fields[editingIndex];
        try {
            debugger
            await axios.post(`${API_URL}/CustomObject/AddObjectType`, {
                objectID: fieldToUpdate.objectId,
                objectTypeName: fieldName,
                status: -2,
                objectTypeFields: "NA",
                createdBy: -2,
                objectTypeId:fieldToUpdate.objectTypeId,
            });
            fetchFields();
            setFieldName('');
            setEditingIndex(null);
        } catch (error) {
            setError(`Error updating field: ${error.message}`);
            console.error('Error updating field:', error);
        }
    };

    return (
        <div className="p-8 max-w-lg mx-auto bg-white shadow-lg rounded-xl border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">{title}</h2>

            {error && (
                <div className="mb-4 text-red-500 text-sm">
                    {error}
                </div>
            )}

            <div className="flex mb-4">
                <input
                    type="text"
                    className="flex-grow border border-gray-300 rounded-l-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={fieldName}
                    placeholder="Enter field name"
                    onChange={(e) => setFieldName(e.target.value)}
                />
                {editingIndex === null ? (
                    <button
                        onClick={handleAddField}
                        className="bg-blue-500 text-white rounded-r-lg px-4 py-2 text-sm hover:bg-blue-600 transition"
                    >
                        Add
                    </button>
                ) : (
                    <button
                        onClick={handleUpdateField}
                        className="bg-green-500 text-white rounded-r-lg px-4 py-2 hover:bg-green-600 transition text-sm"
                    >
                        Update
                    </button>
                )}
            </div>

            <div className="grid gap-2 mt-4">
                {fields.map((field, index) => (
                    <div
                        key={field.objectTypeId}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-md shadow-sm border border-gray-100"
                    >
                        <span className="text-sm text-gray-700">{field.objectTypeName}</span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEditField(index)}
                                className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 transition"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={() => handleDeleteField(field.objectTypeId)}
                                className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddObjectType;
