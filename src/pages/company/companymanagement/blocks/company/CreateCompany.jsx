
/* eslint-disable prettier/prettier */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { DataGrid, DataGridColumnHeader, KeenIcon, useDataGrid, DataGridRowSelectAll, DataGridRowSelect } from '@/components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {  RightDrawerEntity } from './RightDrawerEntity';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const CreateCompany = ({onItemSaved, toast}) => {
  const[isDrawerOpen,setisDrawerOpen]=useState(false);
//   const closeDrawer
const onCloseHandler=()=>{
  setisDrawerOpen(false)
}
    return (
        <div>

            <button className="btn btn-primary" onClick={()=>{setisDrawerOpen(true)}}><i className="ki-duotone ki-plus"></i>Add Entity</button>
            {isDrawerOpen && (
              <RightDrawerEntity
                isDrawerOpen={isDrawerOpen}
                onClose={onCloseHandler}
                billingId={''}
                onItemSaved={onItemSaved} toast={toast}
              />
            )}
        </div>


        
    )
};
export { CreateCompany };