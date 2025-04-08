import { AuthPage } from '@/auth';
import { RequireAuth } from '@/auth/RequireAuth';
import { ErrorsRouting } from '@/errors';
import { Demo1Layout } from '@/layouts/demo1';
import TeamMain from '../pages/account/members/team/Main';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlanConfig from '@/pages/billing/plan/planconfig/PlanConfig';
import UserPlan from '@/pages/billing/plan/userplan/userplan';
import { UserPreferencePage, AccountActivityPage, AccountAllowedIPAddressesPage, AccountApiKeysPage, AccountAppearancePage, AccountBackupAndRecoveryPage, AccountBasicPage, AccountCompanyProfilePage, AccountCurrentSessionsPage, AccountDeviceManagementPage, AccountEnterprisePage, AccountGetStartedPage, AccountHistoryPage, AccountImportMembersPage, AccountIntegrationsPage, AccountInviteAFriendPage, AccountMembersStarterPage, AccountNotificationsPage, AccountOverviewPage, AccountPermissionsCheckPage, AccountPermissionsTogglePage, AccountPlansPage, AccountPrivacySettingsPage, AccountRolesPage, AccountSecurityGetStartedPage, AccountSecurityLogPage, AccountSettingsEnterprisePage, AccountSettingsModalPage, AccountSettingsPlainPage, AccountSettingsSidebarPage, AccountTeamInfoPage, AccountTeamMembersPage, AccountTeamsPage,AccountTeamPage, AccountTeamsStarterPage, AccountUserProfilePage } from '@/pages/account';
import { AuthenticationAccountDeactivatedPage, AuthenticationGetStartedPage, AuthenticationWelcomeMessagePage } from '@/pages/authentication';
import { DefaultPage, Demo1DarkSidebarPage } from '@/pages/dashboards';
import TestNew from '@/pages/drcurves/TestNew.jsx';
import TestPage from '@/pages/drcurves/TestPage.jsx';
import { NetworkAppRosterPage, NetworkAuthorPage, NetworkGetStartedPage, NetworkMarketAuthorsPage, NetworkMiniCardsPage, NetworkNFTPage, NetworkSaasUsersPage, NetworkSocialPage, NetworkStoreClientsPage, NetworkUserCardsTeamCrewPage, NetworkUserTableTeamCrewPage, NetworkVisitorsPage } from '@/pages/network';
import { CampaignsCardPage, CampaignsListPage, ProfileActivityPage, ProfileBloggerPage, ProfileCompanyPage, ProfileCreatorPage, ProfileCRMPage, ProfileDefaultPage, ProfileEmptyPage, ProfileFeedsPage, ProfileGamerPage, ProfileModalPage, ProfileNetworkPage, ProfileNFTPage, ProfilePlainPage, ProfileTeamsPage, ProfileWorksPage, ProjectColumn2Page, ProjectColumn3Page } from '@/pages/public-profile';
import { Navigate, Route, Routes } from 'react-router';
import CompanySettings from '@/pages/drcurves/CompanySettings';
import UserProfile from '@/pages/drcurves/UserProfile';
import Notifications from '@/pages/drcurves/notification-settings/NotificationSettings';
import RoleManagement from '@/pages/drcurves/RoleManagement';
import ClientBillingPage from '@/pages/billing/clientbilling/ClientBillingPage';
import BillingEnterprisePage from '@/pages/billing/billingenterprise/BillingEnterprisePage';
import BillingItems from '@/pages/billing/billingitems/BillingItems';
import UsageTracking from '@/pages/billing/usagetracking/usagetracking';
import EncryptionSettings from '@/pages/security/encryption/encryptionsettings';
import EncryptionHistory from '@/pages/security/encryptionhistory/encryptionhistory';
import MonthlyRevenueReport from '@/pages/billing/revenuereport/MonthlyRevenueReport';
import SecuritySettings from '../pages/drcurves/security-settings/SecuritySettings';
import ComplianceMonitioring from '../pages/drcurves/security-settings/ComplianceMonitioring';
import CreatePlan from '@/pages/billing/plan/createplan/CreatePlan';
import MedicalPlan from '@/pages/billing/plan/medicalplan/MedicalPlan'; // Import the MedicalPlan component
import OrgnizationalPlan from '@/pages/billing/plan/orgnizationalplan/OrgnizationalPlan'; 
import CreateANewPlan from '@/pages/billing/plan/createanewplan/createanewplan';
import DataBackupDisasterRecovery from "@/pages/Security/databackup/DataBackupDisasterRecovery";
import CompanyManagement from '@/pages/company/companymanagement/CompanyManagement';
import AuditComplianceModule from '../pages/company/Audit&Compliancemodule/AuditComplianceModule';
import SecurityMonitorIncidentReport from '../pages/company/SecurityMonitorIncidentReport/SecurityMonitorIncidentReport';
import { SignUp } from '../pages/billing/plan/medicalplan/SignUp';
import EventLog from '../pages/billing/Eventlog/EventLog';
import PlatformUsageAnalytics from '../pages/company/PlatformUsageAnalytics/PlatformUsageAnalytics';
import AddnewfeatureCategory from '../pages/billing/plan/AddnewfeatureCategory/AddnewfeatureCategory';
import Addnewfeature from '../pages/billing/plan/Addnewfeature/Addnewfeature';
import DataPreventionModule from '../pages/company/DatalosspreventionPolicy/DataPreventionModule';
import DataLossModule from '../pages/company/DataLossPreventionModule/DataLossModule';
import DataLossLogs from '../pages/company/DataLossPreventionlogs/DataLosslogs';
import DataPreventionSetting from '../pages/company/DataLossPreventionSettings/DataPreventionSetting';
import CrmMarketPlace from '../pages/company/CrmMarketPlace/CrmMarketPlace';
import CrmMarketPlaceClient from '../pages/company/CrmMarketPlaceClient/CrmMarketPlaceClient';
import CrmMarketPlaceSignUp from '../pages/company/CrmMarketPlaceSignUp/CrmMarketPlaceSignUp';
import CrmBillingHistory from '../pages/company/CrmBillingHistory/CrmBillingHistory';
import ConfigureAddOnSetting from '../pages/company/ConfigureAddOnSetting/ConfigureAddOnSetting';
// import GoogleProviderLogin from '../pages/email/google/GoogleProviderLogin';
import GoogleProviderLoginCallback from '../pages/email/google/GoogleProviderLoginCallback';
import GoogleLoginComponent from '../pages/email/google/GoogleLoginComponent';
import GoogleEmailList from '../pages/email/google/GoogleEmailList';
import InternalEmailList from '../pages/email/internal/InternalEmailList';
import InternalCommunications from '../pages/email/internal/InternalCommunications';
import CrmUsageAnalytics from '../pages/company/CrmUsageAnalytics/CrmUsageAnalytics';
import GroupTabel from '../pages/company/GroupTabel/GroupTabel';
import Grouptablefil from '../pages/company/GroupTabel2/Grouptabelfil';
import PlatformUsageReports from '../pages/company/PlatformUsageReport/PlatformUsagReport';
import Addnewmenu from '../pages/billing/plan/Addnewmenu/Addnewmenu';
import Addnewrole from '../pages/billing/plan/Addnewrole/Addnewrole';
import StripeAddPaymentMethod from '@/pages/billing/paymentmethods/StripeAddPaymentMethod';
import Conversations from '@/pages/communications/Conversations';
import ConversationsView from '@/pages/communications/ConversationsView';
import EmailCompose from '@/pages/communications/EmailCompose';
import TeamModule from '../pages/account/members/teamDetails/TeamModule';
import TeamListing from '../pages/account/members/team/TeamListing';
import TeamTypes from '../pages/account/members/team/TeamTypes';
import TeamRole from '../pages/account/members/team/TeamRole';
import AddObject from '../pages/company/CustomFileds/AddObject';
import CreateForm from '../pages/CustomForm/CreateForm';
import CustomFieldPage from '../pages/company/CustomFileds/block/CustomField';
import CustomFiledLisiting from '../pages/company/CustomFileds/FormListingPage';
import CustomFormFileds from '../pages/company/CustomFileds/CustomFormFileds';
import FormResponse from '../pages/CustomForm/FormResponse';
import PublicFormPage from '../pages/CustomForm/PublicFormPage';
import CustomReport from '../pages/company/CustomReport/Customreport';
import FormListingPage from '../pages/CustomForm/FormListingPage';
import CustomFieldResponseDemo from '../pages/company/CustomFileds/CustomFiledresponse';
import CustomFieldPlaceResponse from '../pages/company/CustomFileds/CustomFiledPlaceresponse';
import CustomFieldCommData from '../pages/company/CustomFileds/CustomFieldCommData';
import InvitationHandler from "../pages/InvitationHandler";
import { SetNewPassword } from '../pages/SetNewPassword';
import PasswordResetSuccess from '../pages/PasswordResetSuccess';
import Calendar from '../pages/Calendar/Calendar';
import LeaveManagement from '../pages/Calendar/LeaveManagement';
 
import SendSMS from '../pages/drcurves/SendSMS';
import MakeCall from '../pages/drcurves/MakeCall';
import TwilioCallHandler from '../pages/drcurves/TwilioCallHandler';
import { TwilioUser } from '../pages/drcurves/Twilio/TwilioUser';
import AddnewTwilioUser from '../pages/drcurves/Twilio/AddnewTwilioUser';
import { TwilioAvailableNumbersTable } from '../pages/drcurves/TwilioAvailableNumbersTable';
import TwilioActiveNumbersTable from '../pages/drcurves/TwilioActiveNumbersTable';
import ContactListModule from '../pages/company/ContactListModule/ContactListModule';
import DefalutForm from '../pages/company/DefaultForm/defaultForm';
import DefulatReport from '../pages/company/DefulatFiledReport/DefualtForm';
import DefaultFormView from '../pages/company/DefulatFiledReport/DefualtFormView';
import ObjectTypeDefualt from '../pages/company/ObjectTypeDefault/ObjectTypeDefualt';
import DefaultCustomReport from '../pages/company/DefulatFiledReport/DefualtCustomReport';
import CustomDefaultform from '../pages/company/ObjectTypeDefault/customDefaultform';
//import StripePayment from '@/pages/billing/paymentmethods/StripePayment';
import AdvancedScheduler from '../pages/Calendar/Scheduler';
import Activity from '../pages/company/Activity/Activity';
import Place from '../pages/company/Place/Place';
import EditActivity from '../pages/company/Activity/EditActivity';
import EditPlace from '../pages/company/Place/EditPlace';
import TwilioPanel from '../pages/drcurves/TwilioPanel/block/TwilioPanel';
import TwilioCallHandlerNew from '../pages/drcurves/TwilioCallHandlerNew';
import TwilioCallLogs from '../pages/drcurves/TwilioCallLogs';
import TwilioRecordings from '../pages/drcurves/TwilioRecordings';
import Person from '../pages/company/Person/Person';
import CustomFieldPersonResponseDemo from '../pages/company/CustomFileds/CustomFiledPersonresponse';
import Comment from '../pages/Calendar/Comment';
import EditPerson from '../pages/company/Person/EditPerson';
import AddnewTabCategory from '../pages/billing/plan/AddnewTabCategory/AddnewTabCategory';
import AddnewTags from '../pages/billing/plan/AddnewTags/AddnewTags';
import ImageUpload from '../pages/Calendar/ImageUpload';

import NotesData from '../pages/company/CustomFileds/NotesData';
import Notes from '../pages/company/Notes/Notes';
import EditNotes from '../pages/company/Notes/EditNotes';
import TemplateSelector from '../pages/company/template/TemplateSelector';
import TemplatesData from '../pages/company/CustomFileds/TemplatesData';
import Template from '../pages/company/template/Template';
import EditTemplates from '../pages/company/template/EditTemplates';
import AddTemplate from '../pages/company/template/AddTemplate';
import AddPipleline from '../pages/company/Piplelines/AddPipleline';
import PipeLineData from '../pages/company/Piplelines/PipelineData';
import Document from '../pages/company/Document/Document';
import DocumentData from '../pages/company/Document/DocumentData';
import PaymentData from '../pages/company/Payment/PaymentData';
import Payment from '../pages/company/Payment/Payment';
import EditPayment from '../pages/company/Payment/EditPayment';
import NewActivity from '../pages/company/NewActivity/NewActivity';

// import SetNewPassword from "@/components/SetNewPassword";

//import StripePayment from '@/pages/billing/paymentmethods/StripePayment';

const AppRoutingSetup = () => {
    return <Routes>
        <Route element={<RequireAuth />}>
            <Route element={<Demo1Layout />}>
                <Route path="/" element={<DefaultPage />} />
                {/* Add the new User Preference route */}
                <Route path="/account/settings/preferences" element={<UserPreferencePage />} /> {/* <-- New route */}
                <Route path="billing/clientbilling" element={<ClientBillingPage />} />



                <Route path="/company/template" element={<TemplateSelector />} />

                <Route path="/company/template/AddTemplate" element={<AddTemplate />} />




                <Route path="/public-profile/drcurves/RoleManagement" element={<RoleManagement />} />
                <Route path="/dark-sidebar" element={<Demo1DarkSidebarPage />} />
                <Route path="/company/settings" element={<CompanySettings />} />

                <Route path="/public-profile/drcurves/UserProfile" element={<UserProfile />} />
                <Route path="/NotesData/:formid?" element={<NotesData />} />

                <Route path="/PersonData/:formid?" element={<CustomFieldPersonResponseDemo />} />
                <Route path="/Person/AddPerson" element={<Person />} />
                <Route path="/Person/EditPerson/:name?/:objectid?/:objecttypeid?/:personId?" element={<EditPerson />} />

                <Route path="/TemplateData/:formid?" element={<TemplatesData />} />
                <Route path="/Template/AddTemplate" element={<Template />} />
                <Route path="/company/NewActivity" element={<NewActivity />} />
                <Route path="/Template/EditTemplates/:name?/:objectid?/:objecttypeid?/:templateId?" element={<EditTemplates />} />



                <Route path="/billing/revenue-report" element={<MonthlyRevenueReport />} />  <Route path="/company/notificationsettings" element={<Notifications />} />
                <Route path="billing/billingenterprise" element={<BillingEnterprisePage />} />
                <Route path="billing/billingitems" element={<BillingItems />} />
                <Route path="billing/usage-tracking" element={<UsageTracking />} />
                <Route path="/addobject" element={<AddObject />} />
                <Route path="/company/customReport" element={<CustomReport/>} />
                <Route path="/customfieldresponsedemo/:formid?" element={<CustomFieldResponseDemo />} />
                <Route path="/customfieldplaceresponse/:formid?" element={<CustomFieldPlaceResponse />} />
                <Route path="/customfieldcommdata/:formid?" element={<CustomFieldCommData />} />
                <Route path="/customField/:formid?" element={<CustomFieldPage />} />
                <Route path="/customfieldListing" element={<CustomFiledLisiting />} />
                <Route path="/customformfielddemo/:filedid?/:responseid?" element={<CustomFormFileds />} />
                <Route path="security/encryption-settings" element={<EncryptionSettings />} />
                <Route path="/publicForm/:formId?" element={<PublicFormPage />} />
                <Route path="security/encryptionhistory" element={<EncryptionHistory />} />
                <Route path="/billing/plan/createplan" element={<CreatePlan />} />
                <Route path="/billing/plan/createanewplan" element={<CreateANewPlan />} />
                <Route
                    path="/security/databackup/disaster-recovery"
                    element={<DataBackupDisasterRecovery />}
                />
                  <Route path="/formResponse/:formId?" element={<FormResponse />} />
                 <Route path="/formLisitng" element={<FormListingPage />} />
                <Route path="/company/management/:type" element={<CompanyManagement />} />
                <Route path="/company/management" element={<CompanyManagement />} />
                <Route path="/billing/plan/planconfig" element={<PlanConfig />} />
                <Route path="/billing/plan/userplan" element={<UserPlan />} />
                <Route path="/company/auditcompliance" element={<AuditComplianceModule />} />
                <Route path="/company/securityincidentReport" element={<SecurityMonitorIncidentReport />} />
                <Route path="/customPlans/:formid?/:linkingid?" element={<CreateForm />} />
                <Route path="/billing/eventlog" element={<EventLog />} />
                <Route path="/company/addpipleine" element={<AddPipleline />} />
                <Route path="/company/pipelinedata" element={<PipeLineData />} />




                <Route path="/Notes/AddNotes" element={<Notes />} />
                <Route path="/Notes/EditNotes/:name?/:objectid?/:objecttypeid?/:noteId?" 
element={<EditNotes />} />
                <Route path="/company/defaultReport" element={<DefulatReport />} />
                <Route path="/company/defaultform/:masterid?" element={<DefalutForm />} />
                <Route path="/company/objectDefaultTypeform/:objectid?/:objecttypeid?" element={<ObjectTypeDefualt />} />
                <Route path="/company/customDefaultform/:formname?/:objectid?/:objecttypeid?" element={<CustomDefaultform />} />
                <Route path="/company/customObjectReport" element={<DefaultCustomReport />} />
                <Route path="/activity" element={<DefaultFormView />} />
                <Route path="/company/contat" element={<ContactListModule />} />
                <Route path="/company/platformusage" element={<PlatformUsageAnalytics />} />
                <Route path="/company/platformusagereport" element={<PlatformUsageReports />} />
                <Route path="/plans/addnewfeatureCategory" element={<AddnewfeatureCategory />} />
                <Route path="/plans/addnewfeature" element={<Addnewfeature />} />
                <Route path="/plans/addnewmenu" element={<Addnewmenu />} />
                <Route path="/plans/addnewrole" element={<Addnewrole />} />
                <Route path="/company/datapreventionpolicy" element={<DataPreventionModule />} />
                <Route path="/company/datapreventionlogs" element={<DataLossLogs />} />
                <Route path="/company/activity" element={<Activity />} />
                <Route path="/company/document" element={<Document />} />
                <Route path="/documentData/:formid?" element={<DocumentData />} />
                <Route path="/company/payment" element={<Payment />} />
                <Route path="/paymentData/:formid?" element={<PaymentData />} />
                <Route path="/Payment/AddPayment" element={<Person />} />
                <Route path="/Payment/EditPayment/:name?/:objectid?/:objecttypeid?/:paymentId?" element={<EditPayment />} />

                <Route path="/company/place" element={<Place />} />
                <Route path="/company/editactivity/:name?/:objectid?/:objecttypeid?/:activityId?" element={<EditActivity />} />
                <Route path="/company/editplace/:name?/:objectid?/:objecttypeid?/:placeId?" element={<EditPlace />} />
                <Route path="/company/objectDefaultTypeform/:name?/:objectid?/:objecttypeid?" element={<ObjectTypeDefualt />} />
                <Route path="/company/datapreventionmodule" element={<DataLossModule />} />
                <Route path="/company/crmmarketplace" element={<CrmMarketPlace />} />
                <Route path="/company/crmmarketplaceclient" element={<CrmMarketPlaceClient />} />
                <Route path="/company/crmbillinghistory" element={<CrmBillingHistory />} />
                <Route path="/company/crmusageanalytics" element={<CrmUsageAnalytics />} />
                <Route path="/company/grouptab" element={<GroupTabel />} />
                <Route path="/company/grouptab2" element={<Grouptablefil />} />
                <Route path="/company/configureaddonsetting" element={<ConfigureAddOnSetting />} />
                {/* <Route path="/email/googleproviderlogin" element={<GoogleProviderLogin />} /> */}
                <Route path="/email/google/callback" element={<GoogleProviderLoginCallback />} />
                <Route path="/email/googleuseremail" element={<GoogleLoginComponent />} />
                <Route path="/email/googleemaillist" element={<GoogleEmailList />} />
                <Route path="/email/internalemaillist" element={<InternalEmailList />} />
                <Route path="/email/internalcommunications" element={<InternalCommunications />} />
                <Route path="/company/datapreventionsetting" element={<DataPreventionSetting />} />

                <Route path="/public-profile/profiles/default" element={<ProfileDefaultPage />} />
                <Route path="/public-profile/profiles/creator" element={<ProfileCreatorPage />} />
                <Route path="/public-profile/profiles/company" element={<ProfileCompanyPage />} />
                <Route path="/public-profile/profiles/nft" element={<ProfileNFTPage />} />
                <Route path="/public-profile/profiles/blogger" element={<ProfileBloggerPage />} />
                <Route path="/public-profile/profiles/crm" element={<ProfileCRMPage />} />
                <Route path="/public-profile/profiles/gamer" element={<ProfileGamerPage />} />
                <Route path="/public-profile/profiles/feeds" element={<ProfileFeedsPage />} />
                <Route path="/public-profile/profiles/plain" element={<ProfilePlainPage />} />
                <Route path="/public-profile/profiles/modal" element={<ProfileModalPage />} />
                <Route path="/public-profile/projects/3-columns" element={<ProjectColumn3Page />} />
                <Route path="/public-profile/projects/2-columns" element={<ProjectColumn2Page />} />
                <Route path="/public-profile/works" element={<ProfileWorksPage />} />
                <Route path="/public-profile/drcurves/test" element={<TestPage />} />
                <Route path="/public-profile/drcurves/testnew" element={<TestNew />} />
                <Route path="/public-profile/teams" element={<ProfileTeamsPage />} />
                <Route path="/public-profile/drcurves/security-settings/SecuritySettings" element={<SecuritySettings />} />
                <Route path="/public-profile/drcurves/security-settings/ComplianceMonitioring" element={<ComplianceMonitioring />} />
                <Route path="/public-profile/network" element={<ProfileNetworkPage />} />
                <Route path="/public-profile/activity" element={<ProfileActivityPage />} />
                <Route path="/public-profile/campaigns/card" element={<CampaignsCardPage />} />
                <Route path="/public-profile/campaigns/list" element={<CampaignsListPage />} />
                <Route path="/public-profile/empty" element={<ProfileEmptyPage />} />
                <Route path="/account/home/get-started" element={<AccountGetStartedPage />} />
                <Route path="/account/home/user-profile" element={<AccountUserProfilePage />} />
                <Route path="/account/home/company-profile" element={<AccountCompanyProfilePage />} />
                <Route path="/account/home/settings-sidebar" element={<AccountSettingsSidebarPage />} />
                <Route path="/account/home/settings-enterprise" element={<AccountSettingsEnterprisePage />} />
                <Route path="/account/home/settings-plain" element={<AccountSettingsPlainPage />} />
                <Route path="/account/home/settings-modal" element={<AccountSettingsModalPage />} />
                <Route path="/account/billing/basic" element={<AccountBasicPage />} />
                <Route path="/account/billing/enterprise" element={<AccountEnterprisePage />} />
                <Route path="/account/billing/plans" element={<AccountPlansPage />} />
                <Route path="/account/billing/history" element={<AccountHistoryPage />} />
                <Route path="/account/security/get-started" element={<AccountSecurityGetStartedPage />} />
                <Route path="/account/security/overview" element={<AccountOverviewPage />} />
                <Route path="/account/security/allowed-ip-addresses" element={<AccountAllowedIPAddressesPage />} />
                <Route path="/account/security/privacy-settings" element={<AccountPrivacySettingsPage />} />
                <Route path="/account/security/device-management" element={<AccountDeviceManagementPage />} />
                <Route path="/account/security/backup-and-recovery" element={<AccountBackupAndRecoveryPage />} />
                <Route path="/account/security/current-sessions" element={<AccountCurrentSessionsPage />} />



                <Route path="/plans/AddnewTabCategory" element={<AddnewTabCategory />} />
                <Route path="/plans/AddnewTags" element={<AddnewTags />} />


                <Route path="/account/security/security-log" element={<AccountSecurityLogPage />} />
                <Route path="/account/members/team-starter" element={<AccountTeamsStarterPage />} />
                <Route path="/account/members/teams" element={<AccountTeamsPage />} />
                <Route path="/account/members/team" element={<AccountTeamPage />} />
                <Route path="/account/members/teamDetails" element={<TeamModule />} />
                <Route path="/account/members/TeamListing" element={<TeamListing />} />
                <Route path="/account/members/TeamTypes" element={<TeamTypes />} />
                <Route path="/account/members/TeamRole" element={<TeamRole />} />
                <Route path="/account/members/team-info" element={<AccountTeamInfoPage />} />
                <Route path="/account/members/members-starter" element={<AccountMembersStarterPage />} />
                <Route path="/account/members/team-members" element={<AccountTeamMembersPage />} />
                <Route path="/account/members/import-members" element={<AccountImportMembersPage />} />
                <Route path="/account/members/roles" element={<AccountRolesPage />} />
                <Route path="/account/members/permissions-toggle" element={<AccountPermissionsTogglePage />} />
                <Route path="/account/members/permissions-check" element={<AccountPermissionsCheckPage />} />
                <Route path="/account/integrations" element={<AccountIntegrationsPage />} />
                <Route path="/account/notifications" element={<AccountNotificationsPage />} />
                <Route path="/account/api-keys" element={<AccountApiKeysPage />} />
                <Route path="/account/appearance" element={<AccountAppearancePage />} />
                <Route path="/account/invite-a-friend" element={<AccountInviteAFriendPage />} />
                <Route path="/account/activity" element={<AccountActivityPage />} />
                <Route path="/network/get-started" element={<NetworkGetStartedPage />} />
                <Route path="/network/user-cards/mini-cards" element={<NetworkMiniCardsPage />} />
                <Route path="/network/user-cards/team-crew" element={<NetworkUserCardsTeamCrewPage />} />
                <Route path="/network/user-cards/author" element={<NetworkAuthorPage />} />
                <Route path="/network/user-cards/nft" element={<NetworkNFTPage />} />
                <Route path="/network/user-cards/social" element={<NetworkSocialPage />} />
                <Route path="/Scheduler" element={<AdvancedScheduler />} />
                <Route path="/Comment" element={<Comment />} />
                <Route path="/ImageUpload" element={<ImageUpload />} />
                <Route path="/network/user-table/team-crew" element={<NetworkUserTableTeamCrewPage />} />
                <Route path="/network/user-table/app-roster" element={<NetworkAppRosterPage />} />
                <Route path="/network/user-table/market-authors" element={<NetworkMarketAuthorsPage />} />
                <Route path="/network/user-table/saas-users" element={<NetworkSaasUsersPage />} />
                <Route path="/network/user-table/store-clients" element={<NetworkStoreClientsPage />} />
                <Route path="/network/user-table/visitors" element={<NetworkVisitorsPage />} />
                <Route path="/auth/welcome-message" element={<AuthenticationWelcomeMessagePage />} />
                <Route path="/auth/account-deactivated" element={<AuthenticationAccountDeactivatedPage />} />
                <Route path="/authentication/get-started" element={<AuthenticationGetStartedPage />} />
                <Route path="billing/paymentmethods" element={<StripeAddPaymentMethod />} />
                <Route path="/conversations" element={<Conversations />} />
                <Route path="/conversationsview" element={<ConversationsView />} />
                <Route path="/emailcompose" element={<EmailCompose />} />
                <Route path="/Calendar" element={<Calendar />} />
                <Route path="/Leave" element={<LeaveManagement />} />
                <Route path="/account/members/TeamMain" element={<TeamMain />} />
                  </Route>
        </Route>
        <Route path="error/*" element={<ErrorsRouting />} />
        <Route path="auth/*" element={<AuthPage />} />
        <Route path="/billing/plan/medicalplan" element={<MedicalPlan />} />
        <Route path="/billing/plan/organizationalplans" element={<OrgnizationalPlan />} />
        <Route path="/billing/plan/SignUp" element={<SignUp />} />
        <Route path="/company/crmmarketplacesignup" element={<CrmMarketPlaceSignUp />} />


      
       <Route path="*" element={<Navigate to="/error/404" />} />
       <Route path="/User/Invitation/:token" element={<InvitationHandler />} />
       <Route path="/setNewpassword/:token" element={<SetNewPassword />} />
        <Route path="/PasswordResetSuccess" element={<PasswordResetSuccess />} />


         

        <Route path="/public-profile/drcurves/TwilioAvailableNumbersTable" element={<TwilioAvailableNumbersTable />} />
        <Route path="/public-profile/drcurves/TwilioActiveNumbersTable" element={<TwilioActiveNumbersTable />} />
        <Route path="/public-profile/drcurves/Twilio/TwilioUser" element={<TwilioUser />} />
        <Route path="/public-profile/drcurves/TwilioCallHandler" element={<TwilioCallHandler />} />
        <Route path="/public-profile/drcurves/Twilio" element={<AddnewTwilioUser />} />





        <Route path="/public-profile/drcurves/SendSMS" element={<SendSMS />} />
        <Route path="/public-profile/drcurves/MakeCall" element={<MakeCall />} />


        <Route path="/drcurves/TwilioPanel" element={<TwilioPanel />} />
        <Route path="/public-profile/drcurves/TwilioCallLogs" element={<TwilioCallLogs />} />
        <Route path="/public-profile/drcurves/TwilioRecordings" element={<TwilioRecordings />} />
        <Route path="/public-profile/drcurves/TwilioCallHandlerNew" element={<TwilioCallHandlerNew />} />


        <Route path="/public-profile/drcurves/TwilioCallLogs" element={<TwilioCallLogs />} />

        <Route path="/public-profile/drcurves/TwilioAvailableNumbersTable" element={<TwilioAvailableNumbersTable />} />
        <Route path="/public-profile/drcurves/TwilioActiveNumbersTable" element={<TwilioActiveNumbersTable />} />

 
        <Route path="/PersonData/:formid?" element={<CustomFieldPersonResponseDemo />} />
        <Route path="/Person/AddPerson" element={<Person />} />
        <Route path="/Person/EditPerson/:name?/:objectid?/:objecttypeid?/:personId?" element={<EditPerson />} />


     </Routes>;
};

export { AppRoutingSetup };
