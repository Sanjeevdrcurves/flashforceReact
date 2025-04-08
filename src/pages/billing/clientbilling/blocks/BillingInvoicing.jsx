import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { DropdownCardItem2 } from '@/partials/dropdowns/general';
import { useSelector } from 'react-redux';
import { MenuTitle, MenuIcon, MenuLink, MenuSeparator, MenuSub } from '@/components';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const BillingInvoicing = () => {

    const { userId, companyId } = useSelector(state => state.AuthReducerKey);
    // State to store the fetched billing data
    const [billingData, setBillingData] = useState([]);

    // State to control if all records or only the first 5 are shown
    const [showAll, setShowAll] = useState(false);
    //const companyId=1;
    // Fetch billing data from the API on component mount
    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                const response = await axios.get(`${API_URL}/Billing/GetAllInvoicesByUserCompany/${userId}`);
                // Map API response to the required format
                const formattedData = response.data.map(item => ({
                    number: item.invoiceNumber, // Using billingId to generate invoice number         
                    date: new Date(item.invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), // Format as "16 Dec 2024"
                    ammount: item.grandTotal.toFixed(2), // Format amount
                    label: item.status, // Directly use status for label
                    color: item.status === 'Paid' ? 'badge-success' :
                        item.status === 'Unpaid' ? 'badge-warning' : 'badge-danger' // Dynamic badge color
                }));
                setBillingData(formattedData);
            } catch (error) {
                console.error("Error fetching billing data:", error);
            }
        };

        fetchBillingData();
    }, []);

    // Function to render each table row
    const renderItem = (table, index) => {
        return (
            <tr key={index}>
                <td className="text-sm text-gray-800">{table.number}</td>
                <td className="lg:text-end">
                    <div className={`badge badge-sm ${table.color} badge-outline`}>{table.label}</div>
                </td>
                <td className="text-sm text-gray-800 lg:text-end">{table.date}</td>
                <td className="text-sm text-gray-800 lg:text-end">${table.ammount}</td>
                <td>
                    <Menu className="items-stretch">
                        <MenuItem toggle="dropdown" trigger="click" dropdownProps={{
                            placement: 'bottom-end',
                            modifiers: [{
                                name: 'offset',
                                options: {
                                    offset: [0, 10] // [skid, distance]
                                }
                            }]
                        }}>
                            <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear mb-2.5-">
                                <KeenIcon icon="dots-vertical" />
                            </MenuToggle>
                            {/* {DropdownCardItem2()} */}
                            <MenuSub className="menu-default" rootClassName="w-full max-w-[175px]">
                            {/* <MenuItem path="#">
                                <MenuLink>
                                <MenuIcon>
                                    <KeenIcon icon="file-up" />
                                </MenuIcon>
                                <MenuTitle>Export</MenuTitle>
                                </MenuLink>
                            </MenuItem>
                            <MenuSeparator /> */}
                            <MenuItem path="#">
                                <MenuLink>
                                <MenuIcon>
                                    <KeenIcon icon="trash" />
                                </MenuIcon>
                                <MenuTitle>Share</MenuTitle>
                                </MenuLink>
                            </MenuItem>
                            </MenuSub>
                            
                        </MenuItem>
                    </Menu>
                </td>
            </tr>
        );
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Billing and Invoicing</h3>

                <button className="btn btn-light btn-sm">
                    <KeenIcon icon="exit-down" />
                    Download All
                </button>
            </div>

            <div className="card-table scrollable-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="min-w-50">Invoice</th>
                            <th className="min-w-16 text-end">Status</th>
                            <th className="min-w-30 text-end">Date</th>
                            <th className="min-w-16 text-end">Amount</th>
                            <th className="w-8"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Render only first 5 records if showAll is false, else render all records */}
                        {billingData.length > 0
                            ? (showAll ? billingData : billingData.slice(0, 5)).map((table, index) => renderItem(table, index))
                            : (
                                <tr>
                                    <td colSpan="5" className="text-center">No billing data available</td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>

            <div className="card-footer justify-center">
                <a href="#" className="btn btn-link" onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Show Less' : 'View all Payments'}
                </a>
            </div>
        </div>
    );
};

export { BillingInvoicing };
