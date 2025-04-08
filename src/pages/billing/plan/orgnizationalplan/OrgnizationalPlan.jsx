import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { Toolbar, ToolbarHeading } from '@/partials/toolbar';
import axios from 'axios';
import { SmallBusinessAddOn } from './blocks';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const OrgnizationalPlan = ({ selectedPCategory, selectedPCatType, fetchFlag, editPlanHandler }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [radioOptions, setRadioOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null); // Single selected option
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hide sidebar and header
    useEffect(() => {
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
            if (header) sidebar.style.display = '';
            if (wrapper) {
                wrapper.style.marginLeft = '';
                wrapper.style.marginTop = '';
                wrapper.style.width = '';
            }
        };
    }, []);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}/PlanCategory/OrganizationalPlanCategories`);//getting only orgnizational plans
                setCategories(response.data);
                if (response.data.length > 0) {
                    if (!selectedPCategory)
                        setSelectedCategory(response.data[0].planCategoryId);
                    else
                        setSelectedCategory(selectedPCategory);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to load categories');
                setLoading(false);
            }
        };
        fetchCategories();
    }, [selectedPCategory]);

    // Fetch options when category changes
    useEffect(() => {
        if (!selectedCategory) return;
        const fetchRadioOptions = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/PlanType/GetByPlanCategory?planCategoryId=${selectedCategory}`
                );

                setRadioOptions(response.data);
                // if (!selectedPCatType)
                setSelectedOption(response?.data[0]?.planTypeId)
                // else
                //   setSelectedOption(selectedPCatType)



                // Reset selected option when category changes
                // setSelectedOption(null);
            } catch (err) {
                console.error('Failed to fetch options:', err);
            }
        };

        fetchRadioOptions();
    }, [selectedCategory, selectedPCatType]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setSelectedOption(null); // Reset dropdown
       // isplanChnage(categoryId);
    };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        console.log("Selected PlanTypeId:", e.target.value);
    };

    // Debugging Logs
    useEffect(() => {
        console.log("Selected Category:", selectedCategory);
        console.log("Radio Options:", radioOptions);
        console.log("Selected Option:", selectedOption);
        console.log("fetchFlag:", fetchFlag);
    }, [selectedCategory, radioOptions, selectedOption, fetchFlag]);

    return (
        <div style={{height: "100vh"}}>
            <Fragment>
                <div className="w-full px-4">
                    {/* <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium leading-none text-gray-900">Medical Plans</h1>
            <div className="flex items-center gap-2 text-sm font-normal text-gray-700">
              <span className="text-gray-800 font-medium">
                Innovative strategy for effective execution
              </span>
            </div>
          </ToolbarHeading>
        </Toolbar> */}

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
                                    className={`px-4 py-2 text-[10px] font-medium ${selectedCategory === category.planCategoryId
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

                {/* Pass the selectedOption (planTypeId) to SmallBusinessAddOn */}
                {selectedOption && <SmallBusinessAddOn planTypeId={selectedOption} fetchFlag={fetchFlag} editPlanHandler={(masterPlan) => editPlanHandler(masterPlan)} showActions={false} />}
                <div className="row gap-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5">


                    </div>
                </div>
            </Fragment>
        </div>
    );
};

export default OrgnizationalPlan;
