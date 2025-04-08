import { Fragment } from 'react';
import { Toolbar, ToolbarActions,  ToolbarHeading} from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';
import { NewTabCategoryTabel } from './blocks/NewTabCategoryTabel';

const AddnewTabCategory = () => {
    return (
        <Fragment>
            <PageNavbar />
            <div className="container-fixed" id='createnewplan'>

                <Toolbar>
                    <ToolbarHeading>
                        <h1 className="text-xl font-medium leading-none text-gray-900">Tag Category Management</h1>
                        <div className="flex items-center gap-2 text-sm font-normal text-gray-700"><div className="flex items-center gap-2 text-sm font-medium"><span className="text-gray-800 font-medium">Add New Tag Category</span></div></div>
                    </ToolbarHeading>

                    <ToolbarActions>

                    </ToolbarActions>
                </Toolbar>
                <NewTabCategoryTabel />
            </div>
        </Fragment>
    );
}

export default AddnewTabCategory;
