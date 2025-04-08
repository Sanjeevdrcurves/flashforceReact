import { KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils';

const PaymentMethods = () => {
  const items = [
    {
      logo: 'visa.svg',
      title: 'Jason Tatum',
      email: 'Ending 3604 • Expires on 12/2026',
      label: 'Primary',
    },
    {
      logo: 'ideal.svg',
      title: 'Jason Tatum',
      email: 'iDeal with ABN Ambro',
      label: null,
    },
    {
      logo: 'paypal.svg',
      title: 'Jason Tatum',
      email: 'jasontt@studio.co',
      label: null,
    },
  ];

  const renderPaymentMethod = (item, index) => (
    <div
      key={index}
      className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3"
    >
      {/* Payment Method Details */}
      <div className="flex items-center gap-4">
        <img
          src={toAbsoluteUrl(`/media/brand-logos/${item.logo}`)}
          alt="Logo"
          className="w-10 h-10"
        />
        <div>
          <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
          <p className="text-xs text-gray-600">{item.email}</p>
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-4">
        {item.label && (
          <span className="px-2 py-1 text-xs text-green-600 border border-green-500 rounded">
            {item.label}
          </span>
        )}
        <button className="p-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
          <KeenIcon icon="notepad-edit" />
        </button>
        <button className="p-2 text-red-600 bg-gray-100 rounded hover:bg-gray-200">
          <KeenIcon icon="trash" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-10">
      {/* Title Section with Border Bottom */}
      <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-4">
        Renew Subscription
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
        {/* Left Section */}
        <div>
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900">Advanced Analytics Pro</h3>
          <p className="text-sm text-gray-600 mt-3">Developer name</p>
          {/* Renewal Period */}
          <p className="mt-4 text-sm font-medium text-gray-900">Renewal Period</p>
          <div className="flex items-center gap-4 mt-5">
            <img
                    src={toAbsoluteUrl(`/media/brand-logos/ideal.svg`)}
              alt="Subscription Icon"
              className="w-12 h-12"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium text-gray-900">Subscription Period</p>
                <div className="flex items-center gap-4">
                <p className="text-sm font-medium text-gray-900">Status</p>
                <p className="text-sm font-medium text-green-600">Active</p>
              </div>
               
              </div>
              <div className="flex items-center gap-4">
              <p className="text-xs mt-2 text-gray-600">01/15/2024-02/15/2024</p>
              </div>
            </div>
          </div>
          <button className="btn btn-sm btn-primary mt-10">
            Renew Subscription
          </button>
        </div>

        {/* Right Section */}
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Payment Methods</h3>
            <button className="px-4 py-2 text-grey border-1 text-xs rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <KeenIcon icon="plus-squared" />
              Add New
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {items.map((item, index) => renderPaymentMethod(item, index))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { PaymentMethods };
