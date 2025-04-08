import { Fragment } from 'react';
import { Toolbar, ToolbarActions,  ToolbarHeading} from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';
import { NewTagTabel } from './blocks/NewTagTabel';

const AddnewTags = () => {
    return (
        <Fragment>
            <PageNavbar />
            <div className="container-fixed" id='createnewplan'>

                <Toolbar>
                    <ToolbarHeading>
                        <h1 className="text-xl font-medium leading-none text-gray-900">Tags Management</h1>
                        <div className="flex items-center gap-2 text-sm font-normal text-gray-700"><div className="flex items-center gap-2 text-sm font-medium"><span className="text-gray-800 font-medium">Add New Tag</span></div></div>
                    </ToolbarHeading>

                    <ToolbarActions>

                    </ToolbarActions>
                </Toolbar>
                <NewTagTabel />
            </div>
        </Fragment>
    );
}

export default AddnewTags;
