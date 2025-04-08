import React, { useState, useEffect } from "react";

const CustomPopover = ({ isPopupVisible, PlansData, PlansFeatureData, closePopup }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const groupByFeatureCategory = (data) => {
    return data.reduce((grouped, item) => {
      const [feature, featureCategory] = item.title.split("#").map((str) => str.trim());
      const category = featureCategory || "Uncategorized";

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push({ feature, plans: item.plans });
      return grouped;
    }, {});
  };

  const groupedFeatures = groupByFeatureCategory(PlansFeatureData);
  const [expandedCategories, setExpandedCategories] = useState(
    Object.keys(groupByFeatureCategory(PlansFeatureData))
  );

  const toggleCategory = (category) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const renderPlanValue = (value) => {
    if (value === true) {
      return <span style={{ fontSize: "17px",  color: "green" }}>✓</span>;
    }
    if (value === false) return "";
    return (
      <div title={value} style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
        {value}
      </div>
    );
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    if (closePopup) closePopup();
  };

  useEffect(() => {
    setIsDrawerOpen(false);
  }, []);

  return (
    <div>
      {isPopupVisible && (
        <div className={`popup ${isDrawerOpen ? "open" : ""}`}>
          <div className="popup-content">
            <button className="close-button" onClick={closeDrawer} style={{ marginBottom: "2%" }}>
              &times;
            </button>

            {/* Table Header */}
            <div id="medicalPlans">
              <div className="scrollable-x-auto">
                <table className="table table-fixed">
                  <thead>
                    <tr>
                    <th style={{ fontWeight: "bold", fontSize: "16px" }}><strong>Feature</strong></th>

                      {Object.keys(PlansData || {}).map((planKey) => {
                        const plan = PlansData[planKey];
                        return <th key={planKey}>{plan.title}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(PlansData || {}).length > 0 && (
                      <>
                        <tr className="row-light">
                          <td style={{ fontWeight: "bold", fontSize: "16px" }}>Description</td>
                          {Object.keys(PlansData || {}).map((planKey) => {
                            const plan = PlansData[planKey];
                            return <td key={planKey}>{plan.description}</td>;
                          })}
                        </tr>
                        <tr className="row-dark">
                          <td style={{ fontWeight: "bold", fontSize: "16px" }}>Details</td>
                          {Object.keys(PlansData || {}).map((planKey) => {
                            const plan = PlansData[planKey];
                            return (
                              <td
                                key={planKey}
                                dangerouslySetInnerHTML={{ __html: plan.planDetail }}
                              />
                            );
                          })}
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Accordion */}
            <div className="accordion">
              {Object.keys(groupedFeatures).map((category, index) => (
                <div
                  key={category}
                  className="accordion-item"
                  style={{ marginTop: "3%" }}
                >
                <div className="accordion-header" onClick={() => toggleCategory(category)}>
  <span>{category}</span>
  <span className="accordion-arrow" style={{ fontSize: "15px" }}>
    {expandedCategories.includes(category) ? "▲" : "▼"}
  </span>
</div>

                  {expandedCategories.includes(category) && (
                    <div className="accordion-body">
                      <table className="table table-fixed">
                        <tbody>
                          {groupedFeatures[category].map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? "row-light" : "row-dark"}>
                              <td title={item.feature}>{item.feature}</td>
                              {Object.keys(item.plans).map((planKey) => (
                                <td key={planKey}>{renderPlanValue(item.plans[planKey])}</td>
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
        .popup {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.3);
          z-index: 1000;
        }
        .popup-content {
          position: relative;
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          max-width: 1200px;
          width: 95%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
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
        .table {
          width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
        }
        th {
          background-color: #f3f4f6;
          font-weight: bold;
          font-size: 1.2rem;
          color: #333;
          text-align: center;
          border: 1px solid #e5e7eb;
          padding: 10px;
        }
        td {
          border: 1px solid #e5e7eb;
          padding: 10px;
          text-align: center;
          word-wrap: break-word;
          white-space: normal;
        }
        .row-light {
          background-color: #e0f7fa; /* Light Cyan */
        }
        .row-dark {
          background-color: #f1f8e9; /* Light Green */
        }
        .accordion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          cursor: pointer;
          font-weight: bold;
          font-size: 1rem;
        }
        .accordion-arrow {
          font-size: 1.5rem;
          margin-left: 8px;
          color: #333;
        }
        .accordion-item {
          background-color: rgb(59, 130, 246, 0.2); /* Default semi-transparent blue */
          transition: background-color 0.3s ease; /* Smooth background color change */
        }
        .accordion-body {
          padding: 10px;
          border-top: 1px solid #e5e7eb;
        }
        .scrollable-x-auto {
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
};

export default CustomPopover;
