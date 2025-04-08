import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Fragment } from 'react';
import { PageNavbar } from '@/pages/account';
import Chart from "react-apexcharts";
import { KeenIcon } from '@/components';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import FormBuilder from './block/FormBuilder';


const CreateForm = () => {
  const handleSave = async (formMetadata) => {
  console.log(formMetadata);
  
  };


  return (
    <div>
    <FormBuilder onSave={handleSave} />
  </div>
  );
};

export default CreateForm;
