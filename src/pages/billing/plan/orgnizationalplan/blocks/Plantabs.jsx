
// PlanTabs component with dynamic radio options
import React, { useState } from 'react';
import {
  SmallBusinessAddOn,
  EnterpriseAddOn,
  FranchiseAddOn,
  ConglomerateAddOn,
} from './';

const PlanTabs = ({ radioOptions }) => {
  const [selectedFilter, setSelectedFilter] = useState('SMA');

  return (
  
    <div className="container-fixed">
      {radioOptions?.length > 0 ? (
        <div className="mt-8 mb-5">
          <div className="flex items-center gap-2.5">
            {radioOptions?.map((option) => (
              <label key={option.id} className="flex items-center gap-2">
                <input
                  className="radio"
                  type="radio"
                  name="filter"
                  value={option.planTypeId}
                  checked={selectedFilter === option.planTypeId}
                  onChange={() => setSelectedFilter(option.planTypeId)}
                />
                {option.planTypeName}
              </label>
            ))}
          </div>
        </div>
      ) : (
        <p>No options available for the selected category.</p>
      )}

      {/* Content based on selected filter */}
      <div className="filtered-divs">
        {selectedFilter === 'SMA' && <SmallBusinessAddOn />}
        {selectedFilter === 'EMA' && <EnterpriseAddOn />}
        {selectedFilter === 'FDO' && <FranchiseAddOn />}
        {selectedFilter === 'CAO' && <ConglomerateAddOn />}
      </div>
    </div>
  );
};

export { PlanTabs };
