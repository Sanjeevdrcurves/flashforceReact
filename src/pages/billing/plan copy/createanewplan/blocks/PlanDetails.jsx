import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PlanDetails = () => {
return(
  <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          List of 
        </h3>
      </div>
        <div className="grid gap-5 lg:gap-7.5">
            <div className="flex">
      <div className="bg-white p-6 rounded-lg shadow-md w-full">

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Category */}
          <div>
            <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Category</span>
               <Select defaultValue="active">
            <SelectTrigger className="w-full" size="sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-40">
              <SelectItem value="active">Select Month</SelectItem>
              <SelectItem value="disabled">1</SelectItem>
              <SelectItem value="pending">2</SelectItem>
            </SelectContent>
          </Select>
          </div>
          {/* Category Type */}
        <div>
            <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Category Type</span>
               <Select defaultValue="active">
            <SelectTrigger className="w-full" size="sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-40">
              <SelectItem value="active">Select Month</SelectItem>
              <SelectItem value="disabled">1</SelectItem>
              <SelectItem value="pending">2</SelectItem>
            </SelectContent>
          </Select>
          </div>
        </div>

        {/* Plan Name */}
        <div className="mb-4">
        <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Plan Name</span>
          <input
            type="text"
            placeholder="Advanced Plastic Surgery Solutions"
            className="w-full border rounded-lg p-2 text-gray-500 bg-gray-50"
            value="Advanced Plastic Surgery Solutions"
            readOnly
          />
        </div>

        {/* Description */}
        <div className="mb-4">
        <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Description</span>
          
          <textarea
            placeholder="drj@drcurves.com"
            className="w-full border rounded-lg p-2 text-gray-500 bg-gray-50"
            readOnly
          >
            drj@drcurves.com
          </textarea>
        </div>

        {/* Monthly Amount & Annual Amount */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
          <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Monthly Amount</span>
            <input
              type="number"
              className="w-full border rounded-lg p-2 text-gray-500"
              placeholder="Monthly Amount"
            />
          </div>
          <div>
          <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Annual Amount</span>

            <input
              type="number"
              className="w-full border rounded-lg p-2 text-gray-500"
              placeholder="Annual Amount"
            />
          </div>
        </div>

        {/* Free Trial Period */}
        <div className="mb-4">
          <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Free Trial Period</span>

          <input
            type="number"
            className="w-full border rounded-lg p-2 text-gray-500"
            placeholder="Free Trial Period"
          />
        </div>
        <div className="card-footer justify-center w-full">
        <a href="#" className="btn btn-primary w-full justify-center">
          Create Plan
        </a>
      </div>
      </div>
    </div>
          
        </div>
      </div>
  )
}
export { PlanDetails };