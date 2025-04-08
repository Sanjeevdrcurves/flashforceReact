import { KeenIcon } from '@/components';
import { CommonHexagonBadge } from '@/partials/common';
const CreateBackupItems = () => {
  const items = [{
    icon: 'category',
    title: 'Workspace Settings',
    description: 'Users may view and update the settings of the workspace.',
    checked: true
  }, {
    icon: 'two-credit-cart',
    title: 'Billing Management',
    description: 'Users are authorized to review, update subscriptions.',
    checked: false
  }, {
    icon: 'mouse-square',
    title: 'Integration Setup',
    description: 'Manage user integrations and associated tags.',
    checked: true
  }, {
    icon: 'toggle-off-circle',
    title: 'Permissions Control',
    description: 'Grant or revoke user access and tags.',
    checked: false
  }, {
    icon: 'map',
    title: 'Map Creation',
    description: 'Initiate new mapping projects within workspace.',
    checked: false
  }, {
    icon: 'exit-up',
    title: 'Data Export',
    description: 'Allow extraction of workspace data for analysis.',
    checked: true
  }, {
    icon: 'security-user',
    title: 'User Roles',
    description: 'Update roles and permissions for map users.',
    checked: true
  }, {
    icon: 'shield-tick',
    title: 'Security Settings',
    description: 'Adjust workspace security protocols and measures.',
    checked: true
  }];
  const renderItem = (item, index) => {
    return <div key={index} className="rounded-xl border p-4 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-3.5">
          <CommonHexagonBadge stroke="stroke-gray-300" fill="fill-gray-100" size="size-[45px]" badge={<KeenIcon icon={item.icon} className="text-lg text-gray-500" />} />

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-gray-900">
              {item.title}
            </span>
            <span className="text-2sm text-gray-700">{item.description}</span>
          </div>
        </div>

        <div className="switch switch-sm">
          <input defaultChecked={item.checked} name="param" type="checkbox" value={index} readOnly />
        </div>
      </div>;
  };
  return <div className="card">
     
      <div className="card-body grid grid-cols-1 gap-5 lg:gap-2 mb-5">
        {items.map((item, index) => {
        return renderItem(item, index);
      })}
      </div>
      <div className="card-body  mb-5">
       <h3><b>Set Password</b></h3>`
       <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-7.5 mb-5">
       <div class="flex flex-col gap-1"><label class="form-label text-gray-900">Password</label><label class="input"><input type="password" placeholder="Enter Password" autocomplete="off" name="password" class="form-control bg-transparent" value="" /><button class="btn btn-icon"><i class="ki-filled ki-eye text-gray-500"></i><i class="ki-filled ki-eye-slash text-gray-500 hidden"></i></button></label></div>
       <div class="flex flex-col gap-1"><label class="form-label text-gray-900">Reenter Password</label><label class="input"><input type="password" placeholder="Enter Password" autocomplete="off" name="password" class="form-control bg-transparent" value="" /><button class="btn btn-icon"><i class="ki-filled ki-eye text-gray-500"></i><i class="ki-filled ki-eye-slash text-gray-500 hidden"></i></button></label></div>
        
        </div><div class="flex justify-end mb-10"><button class="btn btn-primary">Create Backup</button></div>
      
      </div>
    </div>;
    
};

export { CreateBackupItems };

