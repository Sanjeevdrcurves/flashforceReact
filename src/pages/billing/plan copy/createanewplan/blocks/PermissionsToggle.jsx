import { KeenIcon } from '@/components';
import { CommonHexagonBadge } from '@/partials/common';
const PermissionsToggle = () => {
  const items = [ {
    icon: 'users',
    title: 'Users',
    description: 'Sed do eiusmod tempor incididunt ut labore etds dolore magna aliqua',
    checked: true
  },
  {
    icon: 'emr',
    title: 'EMR',
    description: 'Ut enim ad minim veniam, qu nostrud exercitation ullamco',
    checked: true
  },
  {
    icon: 'leads',
    title: 'Leads',
    description: 'Sed do eiusmod tempor incididunt ut labore etds dolore magna aliqua',
    checked: false
  },
  {
    icon: 'opportunities',
    title: 'Opportunities',
    description: 'Lorem ipsum dolor sit ame consectetur adipiscing elit',
    checked: true
  },
  {
    icon: 'calendar',
    title: 'Calendar',
    description: 'Excepteur sint occaecat cupidiat non proident',
    checked: false
  },
  {
    icon: 'pipelines',
    title: 'Pipelines',
    description: 'Sed do eiusmod tempor incididunt ut labore etds dolore magna aliqua',
    checked: true
  },
  {
    icon: 'projects',
    title: 'Projects',
    description: 'Excepteur sint occaecat cupiatat non proident',
    checked: true
  },
  {
    icon: 'tasks',
    title: 'Tasks',
    description: 'Sed do eiusmod tempor incididunt ut labore etds dolore magna aliqua',
    checked: true
  },
  {
    icon: 'finance',
    title: 'Finance',
    description: 'Sed do eiusmod tempor incididunt ut labore etds dolore magna aliqua',
    checked: true
  },
  {
    icon: 'accounting',
    title: 'Accounting',
    description: 'Eiusmod tempor incididunt ut labore etds dolore magna aliqua',
    checked: false
  },
  {
    icon: 'twilio',
    title: 'Twilio Integration',
    description: 'Sed do eiusmod tempor incididunt ut labore etds dolore magna aliqua',
    checked: false
  },
  {
    icon: 'stripe',
    title: 'Stripe Integration',
    description: 'Tempor incididunt ut labore etds efte dolore magna aliqua',
    checked: true
  }];
  const renderItem = (item, index) => {
    return <div key={index} className="rounded-xl  flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-3.5">
        
          <div className="flex flex-col gap-1">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-7.5">
          <div className="col-span-1"><span className="flex items-center gap-1.5 leading-none font-medium text-sm text-gray-900">
              {item.title}
            </span></div>
          <div className="col-span-1"><span className="switch switch-sm">
          <input defaultChecked={item.checked} name="param" type="checkbox" value={index} readOnly />
        </span></div>
          </div>
            
             
            <span className="text-2sm text-gray-700">{item.description}</span>
          </div>
        </div>

       
      </div>;
  };
  return <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          List of Features 
        </h3>
      </div>
      <div className="card-body grid grid-cols-1 lg:grid-cols-2 gap-5 py-5 lg:py-7.5">
        {items.map((item, index) => {
          debugger;
        return renderItem(item, index);
      })}
      </div>
      
    </div>;
};
export { PermissionsToggle };