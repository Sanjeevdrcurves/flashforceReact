/* eslint-disable prettier/prettier */
import { useRef, useState } from 'react';
import { KeenIcon } from '@/components';
import { Menu, MenuItem, MenuToggle, MenuSub } from '@/components';
import { useLanguage } from '@/i18n';

const CompanyFilter = ({filterTypes, handleFilter}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track menu state
  const { isRTL } = useLanguage();
  const [companyType, setCompanyType] = useState('');
  const [parentCompany, setParentCompany] = useState('');

  const handleCompanyTypeChange = (event) => {
    setCompanyType(event.target.value);
  };

  const handleParentCompanyChange = (event) => {
    setParentCompany(event.target.value);
  };

  const handleSearch = () => {
    console.log('Filters Applied:', { companyType, parentCompany });
    handleFilter({ companyType, parentCompany })
    setIsMenuOpen(false); // Close the menu
  };

  return (
    <Menu
      isOpen={isMenuOpen} // Control menu open state
      onClose={() => setIsMenuOpen(false)} // Close handler
    >
      <MenuItem
        toggle="dropdown"
        trigger="click"
        onClick={() => setIsMenuOpen((prev) => !prev)} // Toggle menu state
        dropdownProps={{
          placement: isRTL() ? 'bottom-start' : 'bottom-end',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [10, 10], // Adjust offset for dropdown placement
              },
            },
          ],
        }}
      >
        <MenuToggle className="btn btn-icon btn-icon-lg size-8 text-gray-600 hover:text-primary [dropdown-open:text-primary]">
          <KeenIcon icon="element-11" />
        </MenuToggle>
        <MenuSub
          rootClassName="w-full max-w-[320px]"
          className="light:border-gray-300"
          style={{
            position: 'absolute', // Required for correct dropdown placement
          }}
        >
          <div className="scrollable-y-auto">
            <div className="space-y-4 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={(e) => {
                    setIsMenuOpen(false); // Close the menu
                  }}
                  className="text-gray-500 hover:text-gray-800"
                >
                  &times;
                </button>
              </div>

              {/* Company Type Dropdown */}
              <div>
                <label
                  htmlFor="companyType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Type
                </label>
                <select
                  id="companyType"
                  value={companyType}
                  onChange={handleCompanyTypeChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                >
                  <option value="" >
                    Select
                  </option>
                  {/* <option value="plastic-surgery">Plastic Surgery</option>
                  <option value="type1">Type 1</option>
                  <option value="type2">Type 2</option> */}
                  {filterTypes.map((item, index) => (
                                  <option key={index} value={item}>{item}</option>
                                ))}
                </select>
              </div>

              {/* Parent Company Dropdown */}
              {/* <div>
                <label
                  htmlFor="parentCompany"
                  className="block text-sm font-medium text-gray-700"
                >
                  Parent Company
                </label>
                <select
                  id="parentCompany"
                  value={parentCompany}
                  onChange={handleParentCompanyChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                >
                  <option value="" disabled>
                    Select parent company
                  </option>
                  <option value="parent1">Parent 1</option>
                  <option value="parent2">Parent 2</option>
                  <option value="parent3">Parent 3</option>
                </select>
              </div> */}

              {/* Search Button */}
              <button
                type="button"
                onClick={handleSearch} // Close menu on search
                className="btn btn-primary w-full flex justify-center grow"
              >
                Search
              </button>
            </div>
          </div>
        </MenuSub>
      </MenuItem>
    </Menu>
  );
};

export { CompanyFilter };
