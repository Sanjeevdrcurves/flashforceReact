import { ScrollspyMenu } from '@/partials/menu';

const AccountSettingsSidebar = ({ onSelect }) => {
  const items = [
    {
      title: 'Account',
      children: [
        {
          title: 'User Preferences ',
          target: 'user_prefrences',
          onClick: () => onSelect('UserPreferencePage'), // Map to component
        },
        {
          title: 'Notification',
          target: 'notification',
          onClick: () => onSelect('Notifications'),
        },
      ],
    },
    {
      title: 'Billing',
      children: [
        {
          title: 'Create Plan',
          target: 'createPlan',
          onClick: () => onSelect('CreatePlan'),
        },
        {
          title: 'Create a New Plan',
          target: 'createnewplan',
          onClick: () => onSelect('CreateANewPlan'),
        },
        {
          title: 'Medical Plans',
          target: 'medicalPlans',
          onClick: () => onSelect('MedicalPlans'),
        },
        {
          title: 'Client Billing',
          target: 'clientBilling',
          onClick: () => onSelect('ClientBillingPage'),
        },
        {
          title: 'Billing Enterprise',
          target: 'BillingEnterprisePage',
          onClick: () => onSelect('BillingEnterprisePage'),
        },
        {
          title: 'Usage Tracking',
          target: 'Usagetracking',
          onClick: () => onSelect('Usagetracking'),
        },
        {
          title: 'Company Management',
          target: 'CompanyManagement',
          onClick: () => onSelect('CompanyManagement'),
        },
        {
          title: 'Revenue Report',
          target: 'MonthlyRevenueReport',
          onClick: () => onSelect('MonthlyRevenueReport'),
        },
      ],
    },
    {
      title: 'Security',
      children: [
        {
          title: 'Encryption Settings',
          target: 'EncryptionSettings',
          onClick: () => onSelect('EncryptionSettings'),
        },
        {
          title: 'Encryption History',
          target: 'encryptionhistory',
          onClick: () => onSelect('Encryptionhistory'),
        },
        {
          title: 'Data Backup',
          target: 'DataBackupDisasterRecovery',
          onClick: () => onSelect('DataBackupDisasterRecovery'),
        },
        {
          title: 'Members & Roles',
          target: 'AccountRolesPage',
          onClick: () => onSelect('AccountRolesPage'),
        },
        {
          title: 'Global Settings',
          target: 'SecuritySettings',
          onClick: () => onSelect('SecuritySettings'),
        },
        {
          title: 'Compliance Monitoring',
          target: 'ComplianceMonitoring',
          onClick: () => onSelect('ComplianceMonitoring'),
        },
      ],
    },
    {
      title: 'Next Link',
      collapse: true,
      collapseTitle: 'Show less',
      expandTitle: 'Show 3 more',
      dropdownProps: {
        placement: 'right-start',
      },
    },
  ];

  return <ScrollspyMenu items={items} />;
};

export { AccountSettingsSidebar };
