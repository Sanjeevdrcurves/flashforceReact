import React, { useEffect, useState } from "react";

const PermissionsToggle = ({ features, isClear, featureToggleChangeHandler, setPFeatures }) => {
  const [featureList, setFeatureList] = useState([]);

  useEffect(() => {
    setFeatureList(features);
  }, [features]);

  const toggle_handler = (id) => {
    setPFeatures((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.id === id ? { ...feature, checked: !feature.checked } : feature
      )
    );

    if (featureToggleChangeHandler) {
      const updatedFeature = features.find((feature) => feature.id === id);
      featureToggleChangeHandler({ ...updatedFeature, checked: !updatedFeature.checked });
    }
  };

  const handleInputChange = (id, value) => {
    setPFeatures((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.id === id ? { ...feature, entityCount: value } : feature
      )
    );
  };

  const groupedData = featureList.reduce((acc, item) => {
    const { featureCategoryName } = item;
    if (!acc[featureCategoryName]) {
      acc[featureCategoryName] = [];
    }
    acc[featureCategoryName].push(item);
    return acc;
  }, {});

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">List of Features</h3>
      </div>
      <div className="card-body grid grid-cols-1 lg:grid-cols-2 gap-5 py-5 lg:py-7.5">
        <div className="space-y-5">
          {Object.entries(groupedData).map(([categoryName, items]) => (
            <div key={categoryName || "Uncategorized"} className="rounded-lg p-4 border border-gray-300">
              <div className="text-xl font-semibold text-gray-900 mb-3">
              {categoryName || "Uncategorized"}
              </div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2.5 border-b border-gray-200 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0"
                >
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-7.5">
                    <div className="col-span-1">
                      <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-gray-900">
                        {item.title}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <span className="switch switch-sm">
                        <input
                          checked={item.checked}
                          name="param"
                          type="checkbox"
                          value={item.id}
                          onChange={() => toggle_handler(item.id)}
                        />
                      </span>
                    </div>
                  </div>
                  <span className="text-2sm text-gray-700">{item.description}</span>
                  {item.isToggle && item.checked && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={item?.entityCount}
                        onChange={(e) => handleInputChange(item.id, e.target.value)}
                        placeholder="Enter value..."
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { PermissionsToggle };
