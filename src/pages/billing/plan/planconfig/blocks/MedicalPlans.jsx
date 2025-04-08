import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { Toolbar, ToolbarHeading } from '@/partials/toolbar';
import axios from 'axios';
import { SmallBusinessAddOn } from './SmallBusinessAddOn';
import { useSelector } from 'react-redux';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const MedicalPlans = ({
  selectedPCategory,
  selectedPCatType,
  fetchFlag,
  editPlanHandler,
  isplanChnage
}) => {
  const [categories, setCategories] = useState([]);
  const { PlanReducer } = useSelector((state) => state);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [radioOptions, setRadioOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hide sidebar and header (use with caution; it may cause layout issues)
  

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/PlanCategory`);
        setCategories(response.data);

        if (response.data.length > 0) {
          // Default to first category or the passed-in selectedPCategory
          if (!selectedPCategory) {
            setSelectedCategory(response.data[0].planCategoryId);
          } else {
            setSelectedCategory(selectedPCategory);
          }
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load categories');
        setLoading(false);
      }
    };
    fetchCategories();
  }, [selectedPCategory, PlanReducer]);

  // Fetch options (PlanTypes) for the selected category
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchRadioOptions = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/PlanType/GetByPlanCategory?planCategoryId=${selectedCategory}`
        );
        setRadioOptions(response.data);

        // Default to the first planType or the passed-in selectedPCatType
        if (response.data && response.data.length > 0) {
          setSelectedOption(response.data[0].planTypeId);
        }
      } catch (err) {
        console.error('Failed to fetch options:', err);
      }
    };

    fetchRadioOptions();
  }, [selectedCategory, selectedPCatType]);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedOption(null);
    isplanChnage(categoryId);
  };

  // Handle planType option change
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    console.log('Selected PlanTypeId:', e.target.value);
  };

  // Debugging Logs
  useEffect(() => {
    console.log('Selected Category:', selectedCategory);
    console.log('Radio Options:', radioOptions);
    console.log('Selected Option:', selectedOption);
    console.log('fetchFlag:', fetchFlag);
  }, [selectedCategory, radioOptions, selectedOption, fetchFlag]);

  return (
    // Instead of <Fragment className="scrollable-x-auto ..."> use a real <div>
    <div  >
      <div className="w-full px-4">
        {loading ? (
          <p>Loading categories...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <nav className="flex border-b border-gray-200 mb-4">
            {categories.map((category) => (
              <button
                key={category.planCategoryId}
                onClick={() => handleCategoryChange(category.planCategoryId)}
                className={`px-4 py-2 text-[10px] font-medium ${
                  selectedCategory === category.planCategoryId
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {category.planCategoryName}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="w-full px-4 mb-10">
        <b>Select Option</b>
        {radioOptions.length === 0 ? (
          <p>No options available</p>
        ) : (
          <select
            value={selectedOption || ''}
            onChange={handleOptionChange}
            className="block w-80 p-2 mt-2 border border-gray-300 rounded"
          >
            {radioOptions.map((option) => (
              <option key={option.planTypeId} value={option.planTypeId}>
                {option.planTypeName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Wrap the child component in an overflow-x-auto container if needed */}
        {selectedOption && (
          <SmallBusinessAddOn
            planTypeId={selectedOption}
            fetchFlag={fetchFlag}
            editPlanHandler={(masterPlan) => editPlanHandler(masterPlan)}
          />
        )}
    </div>
  );
};

export default MedicalPlans;
