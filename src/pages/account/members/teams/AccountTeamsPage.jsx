import { Fragment } from 'react'; 
import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';
import { AccountTeamsContent } from '.';
import { useLayout } from '@/providers';
import { Link } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// import { useDemo1Layout } from '../../../../layouts/demo1';
const AccountTeamsPage = () => {
  // const { getPermision } = useDemo1Layout();  
  // const location = useLocation();
  // const {canEdit,canDelete} = getPermision(location.pathname);
  // console.log(location.pathname);
  // console.log(canEdit,canDelete);
  
  const {
    currentLayout
  } = useLayout();
  return <Fragment>
      <PageNavbar />

      {currentLayout?.name === 'demo1-layout' && <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
            {/* navigator('', {state:  {userId:row.original.userId} , replace: false })} */}
            <Link
              to="/public-profile/drcurves/RoleManagement"
              className="btn btn-sm btn-light">
                Add User
            </Link>
            </ToolbarActions>
          </Toolbar>
        </Container>}

      <Container>
        <AccountTeamsContent />
      </Container>
    </Fragment>;
};
export { AccountTeamsPage };