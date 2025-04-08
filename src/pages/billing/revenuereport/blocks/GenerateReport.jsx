import { Fragment } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KeenIcon } from '@/components';
const GenerateReport = () => {
  return <Fragment>
       <div className="flex items-center flex-wrap gap-5 lg:gap-7.5 mb-8">
          <Select defaultValue="active">
            <SelectTrigger className="w-40" size="sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-40">
              <SelectItem value="active">Select Month</SelectItem>
              <SelectItem value="disabled">1</SelectItem>
              <SelectItem value="pending">2</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="active">
            <SelectTrigger className="w-40" size="sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-40">
              <SelectItem value="active">Select Year</SelectItem>
              <SelectItem value="disabled">1</SelectItem>
              <SelectItem value="pending">2</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="active">
            <SelectTrigger className="w-40" size="sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-40">
              <SelectItem value="active">Client Segment</SelectItem>
              <SelectItem value="disabled">1</SelectItem>
              <SelectItem value="pending">2</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="latest">
            <SelectTrigger className="w-40" size="sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-40">
              <SelectItem value="latest">Usage Tier</SelectItem>
              <SelectItem value="older">1</SelectItem>
              <SelectItem value="oldest">2</SelectItem>
            </SelectContent>
          </Select>

          <button className="btn btn-sm btn-outline btn-primary">
            <KeenIcon icon="setting-4" /> Generate Report
          </button>

          
        </div>

      
      <div>
              <h3 className="text-xl font-medium leading-none text-gray-900">Total Summary</h3>
              <div class="flex items-center gap-2 text-sm font-normal text-gray-700"><div class="flex items-center gap-2 text-sm font-medium"><span class="text-gray-800 font-medium">Provides a quick snapshot of key metrics</span></div></div>
           

</div>
     
    </Fragment>;
};
export { GenerateReport };