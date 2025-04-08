import React from 'react';
import { toAbsoluteUrl } from '../../utils/Assets';
import { useSelector } from 'react-redux';

const CompanySettings = () => {
  const user=useSelector(state=>state.AuthReducerKey);


  return (
    <main className="grow content pt-5" id="content" role="content">
      {/* Container */}
      <div className="container-fixed" id="content_container"></div>
      {/* End of Container */}

      {/* Header Section */}
      <div className="container-fixed">
        <div className="flex flex-wrap items-center lg:items-end justify-between gap-5 pb-7.5">
          <div className="flex flex-col justify-center gap-2">
            <h1 className="text-xl font-medium leading-none text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-2 text-sm font-normal text-gray-700">
              Central Hub for Personal Customization
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <a
              className="btn btn-sm btn-light"
              href="/metronic/tailwind/demo1/public-profile/profiles/default"
            >
              View Profile
            </a>
          </div>
        </div>
      </div>
      {/* End of Header Section */}

      {/* Navigation Section */}
      <div className="container-fixed">
        <div className="flex items-center flex-wrap md:flex-nowrap lg:items-end justify-between border-b border-b-gray-200 dark:border-b-coal-100 gap-3 lg:gap-6 mb-5 lg:mb-10">
          <div className="grid">
            <div className="scrollable-x-auto">
              <div className="menu gap-3">
                <div className="menu-item menu-item-dropdown border-b-2 border-b-transparent menu-item-active:border-b-primary menu-item-here:border-b-primary here">
                  <div className="menu-link gap-1.5 pb-2 lg:pb-4 px-2">
                    <div className="menu-title text-nowrap text-sm text-gray-700 menu-item-active:text-primary menu-item-active:font-medium menu-item-here:text-primary menu-item-here:font-medium menu-item-show:text-primary menu-link-hover:text-primary">
                      Company Settings
                    </div>
                    <div className="menu-arrow">
                      <i className="ki-filled ki-down text-2xs text-gray-500 menu-item-active:text-primary menu-item-here:text-primary menu-item-show:text-primary menu-link-hover:text-primary"></i>
                    </div>
                  </div>
                </div>
                <div className="menu-item menu-item-dropdown border-b-2 border-b-transparent menu-item-active:border-b-primary menu-item-here:border-b-primary">
                  <div className="menu-link gap-1.5 pb-2 lg:pb-4 px-2">
                    <div className="menu-title text-nowrap text-sm text-gray-700 menu-item-active:text-primary menu-item-active:font-medium menu-item-here:text-primary menu-item-here:font-medium menu-item-show:text-primary menu-link-hover:text-primary">
                      Projects
                    </div>
                    <div className="menu-arrow">
                      <i className="ki-filled ki-down text-2xs text-gray-500 menu-item-active:text-primary menu-item-here:text-primary menu-item-show:text-primary menu-link-hover:text-primary"></i>
                    </div>
                  </div>
                </div>
                <div className="menu-item border-b-2 border-b-transparent menu-item-active:border-b-primary menu-item-here:border-b-primary">
                  <a
                    className="menu-link gap-1.5 pb-2 lg:pb-4 px-2"
                    href="/metronic/tailwind/react/demo1/public-profile/works"
                  >
                    <div className="menu-title text-nowrap font-medium text-sm text-gray-700 menu-item-active:text-primary menu-item-active:font-semibold menu-item-here:text-primary menu-item-here:font-semibold menu-item-show:text-primary menu-link-hover:text-primary">
                      Works
                    </div>
                  </a>
                </div>
                {/* Add other menu items here as needed */}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end grow lg:grow-0 lg:pb-4 gap-2.5 mb-3 lg:mb-0">
            <button type="button" className="btn btn-sm btn-primary">
              <i className="ki-filled ki-users"></i> Connect
            </button>
            <button className="btn btn-sm btn-icon btn-light">
              <i className="ki-filled ki-messages"></i>
            </button>
            <div className="menu items-stretch">
              <div className="menu-item menu-item-dropdown">
                <div className="menu-toggle btn btn-sm btn-icon btn-light">
                  <i className="ki-filled ki-dots-vertical"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End of Navigation Section */}

      {/* Settings Section */}
      <div className="container-fixed">
        <div className="flex flex-wrap items-center lg:items-end justify-between gap-5 pb-7.5">
          <div className="flex flex-col justify-center gap-2">
            <h1 className="text-xl font-medium leading-none text-gray-900">Company Settings</h1>
            <div className="flex items-center gap-2 text-sm font-normal text-gray-700">
              Configure, customize &amp; manage your company settings
            </div>
          </div>
          
        </div>
      </div>
      {/* End of Settings Section */}

      {/* Settings Section */}
      <div className="container-fixed">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-7.5">
              <div className="col-span-1">
          <div className="grid gap-5 lg:gap-7.5 ">
            <div className="card min-w-full">
              <div className="card-header">
                <h3 className="card-title">Company Data</h3>
              </div>
              <div className="card-table scrollable-x-auto pb-3">
                <table className="table align-middle text-sm text-gray-500">
                  <tbody>
                    <tr>
                      <td className="py-2 min-w-28 text-gray-600 font-normal">Company Logo</td>
                      <td className="py-2 text-gray700 font-normal min-w-32 text-2sm">
                        150x150px JPEG, PNG Image
                      </td>
                      <td className="py-2 text-center">
                        <div className="flex justify-center items-center">
                          <input type="file" accept="image/*" style={{ display: "none" }} />
                          <div className="image-input size-16">
                            <div className="btn btn-icon btn-icon-xs btn-light shadow-default absolute z-1 size-5 -top-0.5 -end-0.5 rounded-full">
                              <i className="ki-filled ki-cross"></i>
                            </div>
                            <span className="tooltip" id="image_input_tooltip">Click to remove or revert</span>
                            <div
                              className="image-input-placeholder rounded-full border-2 border-success image-input-empty:border-gray-300"
                              style={{ backgroundImage: 'url("/metronic/tailwind/react/media/avatars/blank.png")' }}
                            >
                              <img src={toAbsoluteUrl(`/media/avatars/${user.imageName}`)} alt="avatar" />
                              <div className="flex items-center justify-center cursor-pointer h-5 left-0 right-0 bottom-0 bg-dark-clarity absolute">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="12"
                                  viewBox="0 0 14 12"
                                  className="fill-light opacity-80"
                                >
                                  <path
                                    d="M11.6665 2.64585H11.2232C11.0873 2.64749 10.9538 2.61053 10.8382 2.53928C10.7225 2.46803 10.6295 2.36541 10.5698 2.24335L10.0448 1.19918C9.91266 0.931853 9.70808 0.707007 9.45438 0.550249C9.20068 0.393491 8.90806 0.311121 8.60984 0.312517H5.38984C5.09162 0.311121 4.799 0.393491 4.5453 0.550249C4.2916 0.707007 4.08701 0.931853 3.95484 1.19918L3.42984 2.24335C3.37021 2.36541 3.27716 2.46803 3.1615 2.53928C3.04584 2.61053 2.91234 2.64749 2.77642 2.64585H2.33317C2.14844 2.64585 1.97313 2.74312 1.86517 2.89668C1.75721 3.05024 1.75688 3.23727 1.86412 3.39183L3.46412 6.39183L6.36412 6.39183L5.96412 8.39183L3.46412 8.39183L1.36412 9.39183C1.27249 9.46319 1.20524 9.56314 1.16255 9.67273C1.11986 9.78232 1.10474 9.89762 1.11694 10.012C1.12914 10.1264 1.16791 10.2366 1.23085 10.3379C1.29379 10.4392 1.37656 10.5282 1.47485 10.6065C1.57314 10.6848 1.68646 10.7518 1.80533 10.8042C1.92421 10.8566 2.04759 10.8931 2.1732 10.9017C2.29881 10.9103 2.4234 10.8906 2.54133 10.8431C2.65926 10.7956 2.76819 10.7218 2.85849 10.6258C2.9488 10.5298 3.01729 10.4153 3.06145 10.2917L3.41645 9.39183L6.41645 9.39183L5.41645 8.39183L7.41645 7.39183L7.41645 6.39183L8.41645 6.39183L8.41645 7.39183L10.41645 7.39183L9.41645 8.39183L11.41645 8.39183L11.41645 9.39183L11.41645 6.39183C11.41645 6.39183 10.41645 7.39183L11.41645 9.39183L11.41645 10.39183L12.41645 10.39183Z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr><td class="py-2 text-gray-600 font-normal">Company Name</td><td class="py-2 text-gray-800 font-normaltext-sm">Company Name</td><td class="py-2 text-center"><a href="#" class="btn btn-sm btn-icon btn-clear btn-primary"></a></td></tr>
                    <tr><td class="py-2 text-gray-600 font-normal">Company Email</td><td class="py-2 text-gray-800 font-normaltext-sm">Company Email</td><td class="py-2 text-center"><a href="#" class="btn btn-sm btn-icon btn-clear btn-primary"></a></td></tr>
                    <tr><td class="py-2 text-gray-600 font-normal">Company Phone</td><td class="py-2 text-gray-800 font-normaltext-sm">Company Phone</td><td class="py-2 text-center"><a href="#" class="btn btn-sm btn-icon btn-clear btn-primary"></a></td></tr>
                    <tr><td class="py-2 text-gray-600 font-normal">Company Website</td><td class="py-2 text-gray-800 font-normaltext-sm">Company Website</td><td class="py-2 text-center"><a href="#" class="btn btn-sm btn-icon btn-clear btn-primary"></a></td></tr>
                    {/* Add other rows as needed */}
                  </tbody>
                </table>
              </div>
               <div className="container-fixed">
              <div className="flex gap-2.5 justify-end mb-5"><a href="#" className="btn btn-sm btn-primary">Update Company</a></div>
              </div>
            </div>
          </div>
        </div>
           <div className="col-span-1">
          <div className="grid gap-5 lg:gap-7.5 mb-5">
            <div className="card min-w-full">
              <div className="card-header">
                <h3 className="card-title">Company Data</h3>
              </div>
              <div className="card-table scrollable-x-auto pb-3">
                <table className="table align-middle text-sm text-gray-500">
                  <tbody>
                   
                    <tr><td class="py-2 text-gray-600 font-normal">Address</td><td class="py-2 text-gray-800 font-normaltext-sm"> </td><td class="py-2 text-center"><a href="#" class="btn btn-sm btn-icon btn-clear btn-primary"></a></td></tr>
                    <tr><td class="py-2 text-gray-600 font-normal">City</td><td class="py-2 text-gray-800 font-normaltext-sm"> </td><td class="py-2 text-center"><a href="#" class="btn btn-sm btn-icon btn-clear btn-primary"></a></td>
                    <td class="py-2 text-gray-600 font-normal">Zip Code</td><td class="py-2 text-gray-800 font-normaltext-sm"> </td><td class="py-2 text-center"><a href="#" class="btn btn-sm btn-icon btn-clear btn-primary"></a></td></tr>
                    <tr><td class="py-2 text-gray-600 font-normal">State</td><td class="py-2 text-gray-800 font-normaltext-sm"> </td><td class="py-2 text-center"><a href="#" class="btn btn-sm btn-icon btn-clear btn-primary"></a></td></tr>
                   <tr><td class="py-2 text-gray-600 font-normal">Country</td><td class="py-2 text-gray-800 font-normaltext-sm"> </td><td class="py-2 text-center"><a href="#" class="btn btn-sm btn-icon btn-clear btn-primary"></a></td>
                    <td class="py-2 text-gray-600 font-normal">Time Zone</td><td class="py-2 text-gray-800 font-normaltext-sm"> </td><td class="py-2 text-center"><a href="#" class="btn btn-sm btn-icon btn-clear btn-primary"></a></td></tr>
                    
                    {/* Add other rows as needed */}
                  </tbody>
                </table>
              </div>
               <div className="container-fixed">
              <div className="flex gap-2.5 justify-end mb-5"><a href="#" className="btn btn-sm btn-primary">Update Address</a></div>
              </div>
            </div>
             <div className="card min-w-full">
              <div className="card-header">
                <h3 className="card-title">Optimize Experience</h3>
              </div>
              <div className="card-table scrollable-x-auto pb-3">
               <div className="rounded-xl border p-4 flex items-center justify-between gap-2.5">
  <div className="flex items-center gap-3.5">
  <div className="relative size-[45px] shrink-0 switch switch-sm ml-3">
    <input name="param" type="checkbox"  value="0"  />
  </div>
   
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-gray-900">
        NPS Survey
      </span>
      <span className="text-2sm text-gray-700">
        We use Net Promoter Score surveys to make the experience better for your clients.
We recommend enabling NPS Survey
      </span>
    </div>
  </div>
  
</div>
 <div className="rounded-xl border p-4 flex items-center justify-between gap-2.5">
  <div className="flex items-center gap-3.5">
  <div className="relative size-[45px] shrink-0 switch switch-sm ml-3">
    <input name="param" type="checkbox"  value="0"  />
  </div>
   
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-gray-900">
        Product Guides
      </span>
      <span className="text-2sm text-gray-700">
       When new users sign-up, we show guides to them as they discover
new features. It helps with adoption & engagement which results in better retention of clients.
We recommend enabling Product Guides
      </span>
    </div>
  </div>
  
</div>
 <div className="rounded-xl border p-4 flex items-center justify-between gap-2.5">
  <div className="flex items-center gap-3.5">
  <div className="relative size-[45px] shrink-0 switch switch-sm ml-3">
    <input name="param" type="checkbox"  value="0"  />
  </div>
   
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-gray-900">
        Daily Updates
      </span>
      <span className="text-2sm text-gray-700">
        Everyday we'll send a report to your clients prompting them to get back to leads faster. It is critical to improve response rates and improve lead conversions.
      </span>
    </div>
  </div>
  
</div>
 <div className="rounded-xl border p-4 flex items-center justify-between gap-2.5">
  <div className="flex items-center gap-3.5">
  <div className="relative size-[45px] shrink-0 switch switch-sm ml-3">
    <input name="param" type="checkbox"  value="0"  />
  </div>
   
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-gray-900">
       Beta Features
      </span>
      <span className="text-2sm text-gray-700">
        Early access to major feature upgrades across all accounts
      </span>
    </div>
  </div>
  
</div>


              </div>
 </div>
          </div>
          <div className="grid gap-5 lg:gap-7.5 mb-5">
            <div className="card min-w-full ">
              <div className="card-header">
                <h3 className="card-title">Al Employee</h3>
    <div className="relative size-[45px] shrink-0 switch switch-sm ml-3">
    <input name="param" type="checkbox"  value="0"  />
  </div>
              </div>
          
   
  
              <div className="card-table scrollable-x-auto pb-3 pl-7">
               <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-gray-900">
       Enable Al Employee
      </span>
      <span className="text-2sm text-gray-700">
        We use Net Promoter Score surveys to make the experience better for your clients.
      </span>
               
               

              </div>

              
            </div>
            </div>
              <div className="grid gap-5 lg:gap-7.5 mb-5">
            <div className="card min-w-full ">
              <div className="card-header">
                <h3 className="card-title">LC - Premium Triggers & Actions</h3>
    <div className="relative size-[45px] shrink-0 switch switch-sm ml-3">
    <input name="param" type="checkbox"  value="0" checked />
  </div>
              </div>
          
   
  
              <div className="card-table scrollable-x-auto pb-3 pl-7">
               <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-gray-900">
     Enable LC - Premium Triggers & Actions 
      </span>
      <span className="text-2sm text-gray-700">
       What is LC - Premium Triggers & Actions?
      </span>
               
               

              </div>

              
            </div>
            </div>
              <div className="grid gap-5 lg:gap-7.5 mb-5">
            <div className="card min-w-full ">
              <div className="card-header">
                <h3 className="card-title">Workflow Al</h3>
    <div className="relative size-[45px] shrink-0 switch switch-sm ml-3">
    <input name="param" type="checkbox"  value="0"  />
  </div>
              </div>
          
   
  
              <div className="card-table scrollable-x-auto pb-3 pl-7">
               <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-gray-900">
      Enable Workflow Al
      </span>
      <span className="text-2sm text-gray-700">
     What is Workflow Al?
      </span>
               
               

              </div>

              
            </div>
            </div>
              <div className="grid gap-5 lg:gap-7.5 mb-5">
            <div className="card min-w-full ">
              <div className="card-header">
                <h3 className="card-title">Domain Purchase</h3>
    <div className="relative size-[45px] shrink-0 switch switch-sm ml-3">
    <input name="param" type="checkbox"  value="0" checked />
  </div>
              </div>
          
   
  
              <div className="card-table scrollable-x-auto pb-3 pl-7">
               <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-gray-900">
       Enable Al Employee
      </span>
      <span className="text-2sm text-gray-700">
        We use Net Promoter Score surveys to make the experience better for your clients.
      </span>
               
               

              </div>

              
            </div>
            </div>
              <div className="grid gap-5 lg:gap-7.5 mb-5">
            <div className="card min-w-full ">
              <div className="card-header">
                <h3 className="card-title">Auto-Complete Address</h3>
    <div className="relative size-[45px] shrink-0 switch switch-sm ml-3">
    <input name="param" type="checkbox"  value="0" checked />
  </div>
              </div>
          
   
  
              <div className="card-table scrollable-x-auto pb-3 pl-7">
               <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-gray-900">
       Enable Al Employee
      </span>
      <span className="text-2sm text-gray-700">
        We use Net Promoter Score surveys to make the experience better for your clients.
      </span>
               
               

              </div>

              
            </div>
            </div>
              <div className="grid gap-5 lg:gap-7.5 mb-5">
            <div className="card min-w-full ">
              <div className="card-header">
                <h3 className="card-title">Template Library</h3>
    <div className="relative size-[45px] shrink-0 switch switch-sm ml-3">
    <input name="params" type="checkbox"  value="0"  />
  </div>
              </div>
          
   
  
              <div className="card-table scrollable-x-auto pb-3 pl-7">
               <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-gray-900">
       Enable Al Employee
      </span>
      <span className="text-2sm text-gray-700">
        We use Net Promoter Score surveys to make the experience better for your clients.
      </span>
               
               

              </div>

              
            </div>
            </div>

        </div>

        </div>

      </div>
      {/* End of Settings Section */}
    </main>
  );
}

export default CompanySettings;
