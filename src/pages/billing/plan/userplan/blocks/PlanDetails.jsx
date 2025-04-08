import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RightDrawer.css'; 
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const fullName = "system";
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const PlanDetails = ({
  categories, 
  selectedCategory, 
  categoryChangeHandler,
  categoriesTypes, 
  selectedCatType, 
  handleCatTypeChange,
  isClear,
  setUpdateMasterPlanId,
  selectedFeatures, 
  fetchFlagHandler, 
  updateMasterPlanId, 
  updateMasterPlan,
  setIsDrawerOpen
}) => {
  
 
  const [planFreeTr, setPlanFreeTr] = useState('');
  const [createButtonTitle, setCreateButtonTitle] = useState('Create Plan');
  
  // This state tracks which rows (by index) should be disabled
  const [disabledRows, setDisabledRows] = useState({});
  
  const [disabledCat, setDisabledCat] = useState(false);
  const [disabledCatType, setDisabledCatType] = useState(false);

  const [planName, setPlanName] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [yearlyAmount, setYearlyAmount] = useState(0);
  const [isMostPopular, setIsMostPopular] = useState(0);
  const [isTrial, setIsTrial] = useState(false);
  const [freeTrailPeriod, setFreeTrailPeriod] = useState(0);
  const [featurelstData, setFeatureData] = useState(null);

  const [planDetail, setPlanDetail] = useState("");
 
  useEffect(() => {
    if (updateMasterPlanId) {
      fetchFeatureDetailById(updateMasterPlanId);
      fetchMasterPlanById(updateMasterPlanId);
    } else {
      fetchFeatureDetailById(0);
    }
  }, [updateMasterPlanId]);

  // -----------------------------------------------------------
  // fetchMasterPlanById
  // -----------------------------------------------------------
  const fetchMasterPlanById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/MasterPlan/GetById/${id}`);
      const masterPlan = response.data;
      if (masterPlan) {
        if (masterPlan.features && masterPlan.features.length) {
          categoryChangeHandler(masterPlan?.planCategoryId);
          handleCatTypeChange(masterPlan?.planTypeId);
          fetchFlagHandler(masterPlan?.masterPlanId);

          setPlanName(masterPlan?.planName);
          setDescription(masterPlan?.description);
          setMonthlyAmount(masterPlan?.monthlyAmount);
          setYearlyAmount(masterPlan?.yearlyAmount);
          setPlanFreeTr(masterPlan?.freeTrailPeriod);
          setPlanDetail(masterPlan?.planDetail);

          setIsMostPopular(masterPlan?.isMostPopular ? 1 : 0);
          setIsTrial(masterPlan?.isTrial ? 1 : 0);
          setDisabledCat(true);
          setDisabledCatType(true);
          setCreateButtonTitle('Update Plan');
        }
      }
    } catch (error) {
      console.error('Error fetching MasterPlan by ID:', error);
    }
  };

  // -----------------------------------------------------------
  // fetchFeatureDetailById
  // -----------------------------------------------------------
  const fetchFeatureDetailById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/MasterPlan/GetFeatureById/${id}`);
      const features = (response.data || []).map((item) => ({
        ...item,
        // Convert boolean to 1 or 0 for easier toggling
        isAddOnFree: item.isAddOnFree ? 1 : 0,
      }));
      setFeatureData(features);

      // Precompute which rows should be disabled (based on isAddOnFree)
      const initiallyDisabled = {};
      features.forEach((ftr, index) => {
        if (ftr.isAddOnFree === 1) {
          initiallyDisabled[index] = true;
        }
      });
      setDisabledRows(initiallyDisabled);
    } catch (error) {
      console.error('Error fetching MasterPlan features by ID:', error);
    }
  };

  // -----------------------------------------------------------
  // Clear effect
  // -----------------------------------------------------------
  useEffect(() => {
    if (isClear) {
      categoryChangeHandler('');
      handleCatTypeChange('');
      fetchFlagHandler('');

      setPlanName('');
      setDescription('');
      setMonthlyAmount('');
      setYearlyAmount('');
      setPlanFreeTr('');
      setPlanDetail('');
      setIsMostPopular(0);
      setIsTrial(0);
    }
  }, [isClear]);

  // -----------------------------------------------------------
  // handleCreatePlan
  // -----------------------------------------------------------
  function handleCreatePlan() {
    if (!planName) {
      toast.warning("Plan name required!");
      return;
    }
    if (!description) {
      toast.warning("Description required!");
      return;
    }

    if (!updateMasterPlanId) {
      addMasterPlan(false);
    } else {
      addMasterPlan(true);
    }
  }

  // -----------------------------------------------------------
  // addMasterPlan
  // -----------------------------------------------------------
  const addMasterPlan = async (update) => {
    try {
      let response = null;
      const payload = {
        masterPlanId: update ? updateMasterPlanId : 0,
        planCategoryId: selectedCategory,
        planTypeId: selectedCatType,
        planName: planName,
        monthlyAmount: monthlyAmount,
        yearlyAmount: yearlyAmount,
        description: description,
        freeTrailPeriod: planFreeTr || 0,
        planDetails: planDetail || "",
        isMostPopular: isMostPopular ? true : false,
        isTrial: isTrial ? true : false,
        modifiedBy: fullName,
        featureData: featurelstData.map((feature) => ({
          id: feature.masterPlanFeatureId || 0,
          baseAccounts: feature.baseAccounts || 0,
          groupSize: feature.groupSize || 0,
          pricePerGroup: feature.pricePerGroup || 0,
          // Ensure consistent naming for discount
          bulkDiscount: feature.bulkDiscount || 0,
          threshold: feature.threshold || 0,
          isAddOnFree: feature.isAddOnFree === 1 ? true : false
        })),
      };

      if (!update) {
        response = await axios.post(
          `${API_URL}/MasterPlan/AddWithFeatures`,
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        response = await axios.post(
          `${API_URL}/MasterPlan/UpdateWithFeatures`,
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.data && response.data.length) {
        handleReset();
        if (!update) {
          toast.success("Plan saved successfully!");
        } else {
          toast.success("Plan updated successfully!");
        }
        fetchFlagHandler(new Date());
        setUpdateMasterPlanId(0);
      }
    } catch (error) {
      toast.error("Error saving record. Please try again later.");
      console.log('Error:', error.response ? error.response.data : error.message);
    }
  };

  // -----------------------------------------------------------
  // handleFeatureChange
  // -----------------------------------------------------------
  function handleFeatureChange(index, field, value) {
    // If toggling isAddOnFree, disable or enable row
    if (field === "isAddOnFree") {
      setDisabledRows((prev) => ({
        ...prev,
        [index]: value === 1, // disable row when the switch is checked
      }));
    }

    setFeatureData((prevFeatures) =>
      prevFeatures.map((feature, i) =>
        i === index ? { ...feature, [field]: value } : feature
      )
    );
  }
  
  // -----------------------------------------------------------
  // handleReset
  // -----------------------------------------------------------
  function handleReset() {
    setUpdateMasterPlanId(0);
    setPlanName('');
    
    setPlanFreeTr('');
    setDescription('');
setMonthlyAmount('');
setYearlyAmount('');
setPlanDetail('');
    setDisabledCat(false);
    setDisabledCatType(false);
    setCreateButtonTitle('Create Plan');
    setIsDrawerOpen(false);

    setDisabledRows({});
   // setFeatureData(null);
   fetchFeatureDetailById(0);
  }

  // -----------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Plan</h3>
      </div>
      <div className="grid gap-5 lg:gap-7.5">
        <div className="flex">
          <div className="bg-white p-6 rounded-lg shadow-md w-full" >
            {/* Category / Category Type */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Category */}
              <div>
                <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900" >
                  Category
                </span>
                <Select
                  value={selectedCategory}
                  onValueChange={categoryChangeHandler}
                  disabled={disabledCat}
                >
                  <SelectTrigger className="w-full" size="sm">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="w-40 select-content">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.planCategoryId}
                        value={category.planCategoryId}
                      >
                        {category.planCategoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Category Type */}
              <div>
                <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">
                  Category Type
                </span>
                <Select
                  value={selectedCatType}
                  onValueChange={handleCatTypeChange}
                  disabled={disabledCatType}
                >
                  <SelectTrigger className="w-full" size="sm">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="w-40 select-content">
                    {categoriesTypes.map((item) => (
                      <SelectItem
                        key={item.planTypeId}
                        value={item.planTypeId}
                      >
                        {item.planTypeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Plan Name */}
            <div className="mb-4">
              <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">
                Plan Name
              </span>
              <input
                type="text"
                placeholder="Type plan name"
                className="w-full border rounded-lg p-2 text-gray-500 bg-gray-50"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">
                Description
              </span>
              <textarea
                placeholder="Type description"
                className="w-full border rounded-lg p-2 text-gray-500 bg-gray-50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Monthly Amount & Annual Amount */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">
                  Monthly Amount
                </span>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2 text-gray-500"
                  placeholder="Monthly Amount"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(e.target.value)}
                />
              </div>
              <div>
                <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">
                  Yearly Amount
                </span>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2 text-gray-500"
                  placeholder="Yearly Amount"
                  value={yearlyAmount}
                  onChange={(e) => setYearlyAmount(e.target.value)}
                />
              </div>
            </div>

            {/* Toggles: Most Popular & Trial */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-1 flex items-center">
                <div className="switch switch-sm inline-flex items-center">
                  <input
                    name="param"
                    type="checkbox"
                    checked={isMostPopular === 1}
                    onChange={(e) => {
                      setIsMostPopular(e.target.checked ? 1 : 0);
                    }}
                  />
                  <span className="ml-2 text-sm">Mark as Most Popular</span>
                </div>
              </div>
              <div className="col-span-1 flex items-center">
                <div className="switch switch-sm inline-flex items-center">
                  <input
                    name="param"
                    type="checkbox"
                    checked={isTrial === 1}
                    onChange={(e) => {
                      setIsTrial(e.target.checked ? 1 : 0);
                    }}
                  />
                  <span className="ml-2 text-sm">Free Trial Available</span>
                </div>
              </div>
            </div>

            {/* Free Trial Period */}
            <div className="mb-4 mt-4">
              <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">
                Free Trial Period
              </span>
              <input
                type="number"
                className="w-full border rounded-lg p-2 text-gray-500"
                placeholder="Free Trial Period"
                value={planFreeTr}
                onChange={(e) => setPlanFreeTr(e.target.value)}
              />
            </div>

            {/* Plan Details */}
            <div className="mb-4">
              <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">
                Plan Details
              </span>
              <textarea
                placeholder="Type description"
                className="w-full border rounded-lg p-2 text-gray-500 bg-gray-50"
                value={planDetail}
                onChange={(e) => setPlanDetail(e.target.value)}
              />
            </div>

            {/* Features Table */}
            <div className="overflow-x-auto">
              <table
                id="attributesTable1"
                className="min-w-full border-collapse border border-gray-300 rounded-lg shadow-sm"
              >
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                      Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                      Base Accounts
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                      Group Size
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                      Price Per Group
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                      Bulk Discount (%)
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                      Threshold
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {featurelstData && featurelstData.length > 0 ? (
                    featurelstData.map((ftr, index) => (
                      <tr key={index} className="odd:bg-white even:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {/* Hidden input for masterPlanFeatureId */}
                          <input
                            type="hidden"
                            value={ftr.masterPlanFeatureId || ""}
                            name={`masterPlanFeatureId-${index}`}
                          />
                          
                          {/* Feature Name */}
                          {ftr.name}

                          {/* "Free AddOn" Switch */}
                          {ftr.featureType === "addon" && (
                            <div className="switch switch-sm inline-flex items-center ml-2">
                              <input
                                name="param"
                                type="checkbox"
                                checked={ftr.isAddOnFree === 1}
                                onChange={(e) =>
                                  handleFeatureChange(
                                    index,
                                    "isAddOnFree",
                                    e.target.checked ? 1 : 0
                                  )
                                }
                              />
                              <span className="ml-1 text-xs">Free AddOn</span>
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="number"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            placeholder="Base Accounts"
                            value={ftr.baseAccounts || "0"}
                            disabled={disabledRows[index] || false}
                            onChange={(e) =>
                              handleFeatureChange(
                                index,
                                "baseAccounts",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="number"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            placeholder="Group Size"
                            value={ftr.groupSize || "0"}
                            disabled={disabledRows[index] || false}
                            onChange={(e) =>
                              handleFeatureChange(
                                index,
                                "groupSize",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="number"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            placeholder="Price Per Group"
                            value={ftr.pricePerGroup || "0"}
                            disabled={disabledRows[index] || false}
                            onChange={(e) =>
                              handleFeatureChange(
                                index,
                                "pricePerGroup",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="number"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            placeholder="Bulk Discount (%)"
                            value={ftr.bulkDiscount || "0"}
                            disabled={disabledRows[index] || false}
                            onChange={(e) =>
                              handleFeatureChange(
                                index,
                                "bulkDiscount",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="number"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            placeholder="Threshold"
                            value={ftr.threshold || "0"}
                            disabled={disabledRows[index] || false}
                            onChange={(e) =>
                              handleFeatureChange(
                                index,
                                "threshold",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-gray-500">
                        No features available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer buttons */}
            <div
              className="card-footer justify-center w-full gap-2.5"
              style={{ marginBottom: "5%" }}
            >
              {!updateMasterPlanId ? (
                <button
                  className="btn btn-primary w-full justify-center"
                  onClick={handleCreatePlan}
                >
                  {createButtonTitle}
                </button>
              ) : (
                <button
                  className="btn btn-primary w-full justify-center"
                  onClick={handleCreatePlan}
                >
                  Update Plan
                </button>
              )}
              <button
                className="btn btn-primary w-full justify-center"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PlanDetails };
