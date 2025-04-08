import { Fragment, useState , useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';
import { ModalWelcomMessage } from '@/partials/modals/welcome-message';
import { AccountGetStartedContent } from '@/pages/account/home/get-started';
import { useDispatch, useSelector } from 'react-redux';
import { sendNotification } from '@/utils/notificationapi';
const AuthenticationWelcomeMessagePage = () => {
  const [profileModalOpen, setProfileModalOpen] = useState(true);
  const user=useSelector(state=>state.AuthReducerKey);
    console.log(user);

    useEffect(() => {
      if (user?.userId) {
        sendNotification(
          user?.userId,
          59, // Notification setting ID
          'First login post-payment notification',
          'First login post-payment Successful',
          '7',
          'User OnBoarding'
          //String(companyId)
        );
        sendNotification(
          user?.userId,
          60, // Notification setting ID
          'Profile setup incomplete notification',
          'Profile setup incomplete Successful',
          '8',
          ''
        );
      }
    }, []); // Runs when user changes
  

  const handleClose = () => {
    setProfileModalOpen(false);
  };
  return <Fragment>
      <PageNavbar />

      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle />
            <ToolbarDescription>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-gray-800 font-medium">{user?.fullName}</span>
                <a href="mailto:jaytatum@ktstudio.com" className="text-gray-700 hover:text-primary">
                {user?.email}
                </a>
                <span className="size-0.75 bg-gray-600 rounded-full"></span>
                <Link to="/account/members/team-info" className="font-semibold btn btn-link link">
                  Personal Info
                </Link>
              </div>
            </ToolbarDescription>
          </ToolbarHeading>
        </Toolbar>
      </Container>

      <Container>
        <AccountGetStartedContent />
        <ModalWelcomMessage open={profileModalOpen} onOpenChange={handleClose} />
      </Container>
    </Fragment>;
};
export { AuthenticationWelcomeMessagePage };