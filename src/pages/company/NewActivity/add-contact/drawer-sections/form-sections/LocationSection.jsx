
import React from "react";
import AddressEntries from "../../AddressEntries";
import TimezoneSelector from "../../TimezoneSelector";

const LocationSection = ({
  addressEntries,
  timezone,
  updateAddressEntry,
  addAddressEntry,
  removeAddressEntry,
  setTimezone,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 pb-2 border-b">Location Information</h3>
      
      <AddressEntries 
        addressEntries={addressEntries}
        updateAddressEntry={updateAddressEntry}
        addAddressEntry={addAddressEntry}
        removeAddressEntry={removeAddressEntry}
      />
      
      <TimezoneSelector 
        timezone={timezone}
        setTimezone={setTimezone}
      />
    </div>
  );
};

export default LocationSection;
