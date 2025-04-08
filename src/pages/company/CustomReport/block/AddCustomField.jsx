import React, { Fragment } from "react";
import { PageNavbar } from "@/pages/account";
import { KeenIcon } from "@/components";
import { Toolbar, ToolbarHeading, ToolbarActions } from "@/partials/toolbar";
import { Link } from "react-router-dom";

const AddCustomFiled = () => {
  return (
    <Fragment>
    
       

        {/* Form Section */}
        <div className="bg-white p-2 mb-6">
          <form>
            <div className="grid grid-cols-2 gap-4">
              {/* First Row */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Object
                </label>
                <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  <option>All Objects</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Group
                </label>
                <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  <option>All</option>
                </select>
              </div>

              {/* Second Row */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Field Name
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Field Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Field Type
                  <span className="text-red-500">*</span>
                </label>
                <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  <option>Monetary</option>
                </select>
              </div>

              {/* Third Row */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Placeholder
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Placeholder"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prefill Value
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Prefill Value"
                />
              </div>

              {/* Fourth Row */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unique Key
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Unique Key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Description"
                />
              </div>

              {/* Fifth Row */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Place where shown
                  <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 space-y-2">
                  <div>
                    <input
                      type="checkbox"
                      id="contactDrawer"
                      className="checkbox mr-2"
                                         />
                    <label htmlFor="contactDrawer">Contact Drawer</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="opportunityDrawer"
                       className="checkbox mr-2"
                      
                    />
                    <label htmlFor="opportunityDrawer">Opportunity Drawer</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="pipelineDrawer"
                        className="checkbox mr-2"
                      
                    />
                    <label htmlFor="pipelineDrawer">Pipeline Drawer</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="projectDrawer"
                       className="checkbox mr-2"
                     
                    />
                    <label htmlFor="projectDrawer">Project Drawer</label>
                  </div>
                </div>
              </div>

              {/* Sixth Row */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Folder
                </label>
                <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  <option>Select</option>
                </select>
              
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                className="btn btn-light text-gray-700 border-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary text-white bg-blue-600"
              >
                Create
              </button>
            </div>
          </form>
        </div>

        {/* Table Section */}
   
    </Fragment>
  );
};

export default AddCustomFiled;
