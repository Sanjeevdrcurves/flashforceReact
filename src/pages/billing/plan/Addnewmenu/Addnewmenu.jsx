// src/pages/billing/plan/createanewplan/CreateANewPlan.jsx
import React, { useState } from 'react';
import { Fragment } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toolbar, ToolbarActions, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';
import { NewMenuTabel } from './blocks/NewMenuTabel';
import { RightDrawer } from './blocks/RightDrawer';

const Addnewmenu = () => {
    return (
        <Fragment>
            <PageNavbar />
            <div className="container-fixed" id='createnewplan'>

                <Toolbar>
                    <ToolbarHeading>
                        <h1 className="text-xl font-medium leading-none text-gray-900">Add New Menus</h1>
                        <div class="flex items-center gap-2 text-sm font-normal text-gray-700"><div class="flex items-center gap-2 text-sm font-medium"><span class="text-gray-800 font-medium">Innovative strategy for effective execution</span></div></div>
                    </ToolbarHeading>

                    <ToolbarActions>

                    </ToolbarActions>
                </Toolbar>
                <NewMenuTabel />
            </div>
        </Fragment>
    );
}

export default Addnewmenu;
