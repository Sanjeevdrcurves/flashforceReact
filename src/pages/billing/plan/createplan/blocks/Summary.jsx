import { Fragment } from 'react';
import { KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils/Assets';
import { CommonHexagonBadge } from '@/partials/common';
import React from "react";
import { useNavigate } from "react-router-dom";

const Summary = () => {
  const navigate = useNavigate();

  const handleCreatePlan = () => {
    debugger;
    navigate("./planconfig");
  };

  return <Fragment>
      <style>
        {`
          .upgrade-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1200/bg-14.png')}');
          }
          .dark .upgrade-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1200/bg-14-dark.png')}');
          }
        `}
      </style>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-2">

  <div className="grid grid-cols-1 gap-1.5 rounded-md px-2.5 py-2 shrink-0 min-w-24 max-w-auto">
   <div className="card rounded-xl">
        <div className="flex items-center justify-between grow gap-5 p-5 rtl:bg-[center_left_-8rem] bg-[center_right_-8rem] bg-no-repeat bg-[length:700px] upgrade-bg">
          <div className="flex items-center gap-4">
            <CommonHexagonBadge stroke="stroke-primary-clarity" fill="fill-primary-light" size="size-[50px]" badge={<KeenIcon icon="plus" className="text-1.5xl text-primary" />} />

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <a href="planconfig" className="text-base font-medium text-gray-900 hover:text-primary-active">
                 <h2>Create Plan</h2>
                </a>
                {/* <a onClick={handleCreatePlan} className="text-base font-medium text-gray-900 hover:text-primary-active">
                 <h2>Create Plan</h2>
                </a> */}
              </div>

            
            </div>
          </div>

         
        </div>
      </div>
  </div>

  
 
</div>
     
    </Fragment>;
};
export { Summary };