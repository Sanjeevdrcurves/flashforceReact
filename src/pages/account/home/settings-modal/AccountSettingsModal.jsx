import { useEffect, useRef, useState } from 'react';
import { Scrollspy } from '@/components';
import { AccountSettingsSidebar } from '@/pages/account/home/settings-sidebar';
import { useResponsive, useViewport } from '@/hooks';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UserPreferencePage from '../../settings/UserPreferencePage';
import Notifications from '../../../drcurves/notification-settings/NotificationSettings';
import CreatePlan from '../../../billing/plan/createplan/CreatePlan';
import CreateANewPlan from '../../../billing/plan/createanewplan/CreateANewPlan';
import { MedicalPlans } from '../../../billing/plan/createanewplan/blocks';
import ClientBillingPage from '../../../billing/clientbilling/ClientBillingPage';
import BillingEnterprisePage from '../../../billing/billingenterprise/BillingEnterprisePage';
import Usagetracking from '../../../billing/usagetracking/usagetracking';
import CompanyManagement from '../../../company/companymanagement/CompanyManagement';
import MonthlyRevenueReport from '../../../billing/revenuereport/MonthlyRevenueReport';
import EncryptionSettings from '../../../security/encryption/encryptionsettings';
import Encryptionhistory from '../../../security/encryptionhistory/encryptionhistory';
import DataBackupDisasterRecovery from '../../../security/databackup/DataBackupDisasterRecovery';
import { AccountRolesPage } from '../../members/roles';
import SecuritySettings from '../../../drcurves/security-settings/SecuritySettings';
import ComplianceMonitoring from '../../../drcurves/security-settings/ComplianceMonitioring';

const AccountSettingsModal = ({ open, onOpenChange }) => {
  const desktopMode = useResponsive('up', 'lg');
  const navBar = useRef(null);
  const parentRef = useRef(null);

  const [sidebarHeight, setSidebarHeight] = useState(0);
  const [viewportHeight] = useViewport();
  const offset = 260;

  const [activeComponent, setActiveComponent] = useState('UserPreferencePage'); // Default component

  useEffect(() => {
    setSidebarHeight(viewportHeight - offset);
  }, [viewportHeight]);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'UserPreferencePage':
        return <UserPreferencePage />;
      case 'Notifications':
        return <Notifications />;
      case 'CreatePlan':
        return <CreatePlan />;
      case 'CreateANewPlan':
        return <CreateANewPlan />;
      case 'MedicalPlans':
        return <MedicalPlans />;
      case 'ClientBillingPage':
        return <ClientBillingPage />;
      case 'BillingEnterprisePage':
        return <BillingEnterprisePage />;
      case 'Usagetracking':
        return <Usagetracking />;
      case 'CompanyManagement':
        return <CompanyManagement />;
      case 'MonthlyRevenueReport':
        return <MonthlyRevenueReport />;
      case 'EncryptionSettings':
        return <EncryptionSettings />;
      case 'Encryptionhistory':
        return <Encryptionhistory />;
      case 'DataBackupDisasterRecovery':
        return <DataBackupDisasterRecovery />;
      case 'AccountRolesPage':
        return <AccountRolesPage />;
      case 'SecuritySettings':
        return <SecuritySettings />;
      case 'ComplianceMonitoring':
        return <ComplianceMonitoring />;
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed max-w-[auto] flex flex-col p-10 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none text-gray-900">Settings - Modal</h1>
              <div className="flex items-center gap-2 text-sm font-normal text-gray-700">
                Dynamic, Focused Adjustment Interface
              </div>
            </div>
            <button className="btn btn-sm btn-light" onClick={onOpenChange}>
              Close
            </button>
          </div>
        </DialogHeader>
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7" ref={parentRef}>
          <div className="flex grow gap-5 lg:gap-7.5">
            {desktopMode && (
              <div className="block w-[230px] shrink-0">
                <div
                  ref={navBar}
                  className="w-[230px] fixed z-10 scrollable-y-auto"
                  style={{
                    maxHeight: `${sidebarHeight}px`,
                  }}
                >
                  <Scrollspy offset={100} targetRef={parentRef}>
                    <AccountSettingsSidebar
                      onSelect={setActiveComponent} // Pass the handler to update active component
                    />
                  </Scrollspy>
                </div>
              </div>
            )}
            <div className="flex flex-col items-stretch grow gap-5 lg:gap-7.5">
              {renderComponent()} {/* Render the active component */}
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { AccountSettingsModal };
