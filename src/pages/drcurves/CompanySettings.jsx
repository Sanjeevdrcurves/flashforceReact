import { Container } from '@/components/container';
import { PageNavbar } from '@/pages/account';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/toolbar';
import CompanyAddress from './company-settings/CompanyAddress';
import CompanyData from './company-settings/CompanyData';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const CompanySettings = () => {

  const [settings, setSettings] = useState(null);
  const {userId,companyId}=useSelector(state=>state.AuthReducerKey)
  useEffect(() => {
    (async () => {
      const response = await axios.get(`${API_URL}/Company/${companyId}`);
          console.log('company response', response.data);
      setSettings(response.data);
    })();
  }, []);

  return (
    <>
    <PageNavbar />
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="Company Settings" />
            <ToolbarDescription>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-gray-800 font-medium">
                  Configure, customize & manage your company settings
                </span>
              </div>
            </ToolbarDescription>
          </ToolbarHeading>
        </Toolbar>
      </Container>

      {!!settings && <Container>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7.5">
                <div className="col-span-1">
                  <div className="flex flex-col gap-5 lg:gap-7.5">
                    <CompanyData settings={settings} userId={userId} />
                  </div>
                </div>
      
                <div className="col-span-1">
                  <div className="flex flex-col gap-5 lg:gap-7.5">
                    <CompanyAddress settings={settings} userId={userId} />
                  </div>
                </div>
              </div>
            </Container>}
    </>
  );
};

export default CompanySettings;


