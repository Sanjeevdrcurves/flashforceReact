import React, { Fragment, useState, useEffect  } from 'react';

const CustomPopover = ({ isPopupVisible, PlansData, PlansFeatureData, closePopup  }) => {
 const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const groupByFeatureCategory = (data) => {
    return data.reduce((grouped, item) => {
      const [feature, featureCategory] = item.title.split('#').map((str) => str.trim());
      const category = featureCategory || 'Uncategorized'; // Handle cases without a category

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push({ feature, plans: item.plans });
      return grouped;
    }, {});
  };

  const groupedFeatures = groupByFeatureCategory(PlansFeatureData);
  const [expandedCategories, setExpandedCategories] = useState(
    Object.keys(groupByFeatureCategory(PlansFeatureData)) // Initialize with all categories expanded
  );

  const toggleCategory = (category) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const renderPlanValue = (value) => {
    if (value === true) return '✔️';
    if (value === false) return '❌';
    return value; // Render as text for other values
  };
  const closeDrawer = () => {
    //updateMasterPlanId = null;
    setIsDrawerOpen(false);
    if (closePopup) closePopup(); // Call parent handler to hide the popup
  };
useEffect(() => {
    setIsDrawerOpen(false);
  },[]);

  return (
    <div>
      {isPopupVisible && (
        <div className={`popup ${isDrawerOpen ? 'open' : ''}`}>
          <div className="popup-header">
          <button className="btn btn-light close-button"  onClick={closeDrawer}>
            &times;
          </button>
          </div>
         
          <div className="popup-content">
            <div className="mt-1" id="medicalPlans">
              <div className="scrollable-x-auto pt-3 -mt-3">
                <table className="table table-fixed min-w-[1000px] table-border-b table-border-e table-rounded card-rounded">
                  <thead>
                    <tr>
                      <th className="!border-b-0 align-bottom w-1/4 h-1 p-3 font-bold text-gray-800">Feature</th>
                      {Object.keys(PlansData || {}).map((planKey) => {
                        const plan = PlansData[planKey];
                        return (
                          <th key={planKey} className="!border-b-0 align-bottom w-1/4 h-1 p-3 font-bold text-gray-800">
                            {plan.title}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="table-border-s !px-5 !py-3.5 text-gray-700">Description</td>
                      {Object.keys(PlansData || {}).map((planKey) => {
                        const plan = PlansData[planKey];
                        return (
                          <td key={planKey} className="table-border-s !px-5 !py-3.5 text-gray-800">
                            {plan.description}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="table-border-s !px-5 !py-3.5 text-gray-700">Details</td>
                      {Object.keys(PlansData || {}).map((planKey) => {
                        const plan = PlansData[planKey];
                        return (
                          <td
                            key={planKey}
                            className="table-border-s !px-5 !py-3.5 text-gray-800 text-sm"
                            dangerouslySetInnerHTML={{ __html: plan.planDetail }}
                          />
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Accordion for Features */}
            <div className="accordion mt-4">
              {Object.keys(groupedFeatures).map((category) => (
                <div key={category} className="accordion-item border rounded mb-2">
                  <div
                    className="accordion-header bg-gray-200 p-3 font-bold cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </div>
                  {expandedCategories.includes(category) && (
                    <div className="accordion-body bg-white p-3">
                      <table className="table-auto w-full">
                        <tbody>
                          {groupedFeatures[category].map((item, index) => (
                            <tr key={index}>
                              <td className="p-3 text-gray-700 font-medium w-1/4">{item.feature}</td>
                              {Object.keys(item.plans).map((planKey) => (
                                <td
                                  key={planKey}
                                  className="p-3 text-gray-800 text-center w-1/4"
                                >
                                  {renderPlanValue(item.plans[planKey])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .popup-header {
    position: relative;
    padding: 10px 20px;
    border-bottom: 1px solid #ddd;
    background-color: #f3f4f6; /* Light gray background */
  }
       .close-button {
    float: right; /* Aligns the button to the right */
    background: none;
    border: none;
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    cursor: pointer;
  }

  .close-button:hover {
    color: #555;
  }
        .popup {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.3); /* Dark overlay */
          z-index: 1000; /* Ensures it appears above other content */
        }
        .popup-content {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          max-width: 1200px; /* Extra-large size */
          width: 95%; /* Responsive width */
          height: auto;
          max-height: 90vh; /* Ensure the popup doesn't get too tall */
          overflow-y: auto; /* Enable scrolling if content is too long */
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        .table-border-s {
          border: 1px solid #e5e7eb;
        }
        th {
          font-weight: bold;
          color: #333;
          background-color: #f3f4f6; /* Light gray background */
        }
        td {
          color: #555;
        }
        .scrollable-x-auto {
          overflow-x: auto;
        }
        .accordion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .accordion-body {
          border-top: 1px solid #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default CustomPopover;
