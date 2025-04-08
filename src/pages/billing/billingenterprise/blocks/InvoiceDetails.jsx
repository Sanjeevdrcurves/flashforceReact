import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./RightDrawer.css"; // Include your CSS file
import { Autocomplete, TextField } from "@mui/material";
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
//const companyId = 1; // Replace with the dynamic company ID
//const UserId = 1; // Replace with the dynamic company ID

const InvoiceDetails = ({ invoiceId, invoiceItemId }) => {
  const {userId, companyId, fullName} = useSelector(state => state.AuthReducerKey);
  const [invoiceDetails, setInvoiceDetails] = useState({
    date: "",
    dueDate: "",
    invoiceNumber: "",
    billFrom: { name: "", email: "", notes: "" },
    billTo: { name: "", email: "", notes: "" },
    notes: "",
    userName:"",
    companyName:""
  });
  const [isAdjustable, setIsAdjustable] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [adjustmentLog, setAdjustmentLog] = useState([]); // State to hold the adjustment log

  const [originalInvoiceTotal, setOriginalInvoiceTotal] = useState(0);
  const [adjustedTotal, setAdjustedTotal] = useState(0);
  const [productList, setProductList] = useState([]); 
  const modalRef=useRef(null);
  
  // const originalInvoice = [
  //   { name: "Product A", quantity: 2, price: 100, total: 200 },
  //   { name: "Service B", quantity: 1, price: 400, total: 400 },
  //   { name: "Test Name B", quantity: 3, price: 500, total: 1500 },
  // ];
  const [successMessage, setSuccessMessage] = useState(""); // State to store the success message

  const handleExport = () => {
    html2canvas(modalRef.current)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        // Adjust width and height if needed
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('download.pdf');
      })
      .catch((err) => console.error('Error generating PDF: ', err));
  };

  // Calculate grand total
  //const originalInvoicetotal = originalInvoice.reduce((acc, item) => acc + item.total, 0);

  // Fetch billing details and adjustment log
  useEffect(() => {
    // Fetch billing details
    if(invoiceId){
      axios
      .get(`${API_URL}/Billing/GetInvoiceByInvoiceId/${invoiceId}`)
      .then((response) => {
        const invoiceData = response.data;
        setInvoiceDetails((prevState) => ({
          ...prevState,
          invoiceNumber: invoiceData.invoiceNumber,
          date: invoiceData.invoiceDate,
          dueDate: invoiceData.dueDate, // Assuming due date is same as billing date, update as needed
          status: invoiceData.status,
          //paymentMethod: invoiceData.paymentMethod,
          userName:invoiceData.userName,
          companyName:invoiceData.companyName,
          companyId:companyId,
          userId:userId,
          //modifiedBy:String(userId),
          originalInvoiceTotal:invoiceData.grandTotal, //originalInvoiceTotal,
          adjustedInvoiceTotal:calculateAdjustedTotal()
        }));
      })
      .catch((error) => console.error("Error fetching billing details:", error));

      // Fetch invoice items
      axios
      .get(`${API_URL}/Billing/GetInvoiceItems?invoiceId=${invoiceId}`)
      .then((response) => {
        // const item = response.data;
        const items = response.data;
        // var items = [];
        // if(item)
        //   items.push(item);
        setInvoiceItems(items);
        // Calculate the total price of the original invoice
        debugger;
        const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
        setOriginalInvoiceTotal(total);
      })
      .catch((error) => console.error("Error fetching invoice items:", error));

      // Fetch adjustment log
      axios
      .get(`${API_URL}/Billing/GetInvoiceAdjustments?invoiceId=${invoiceId}`)
      .then((response) => {
        const adjustmentData = response.data;
        setAdjustmentLog(adjustmentData); // Update adjustment log state with fetched data
      })
      .catch((error) => console.error("Error fetching adjustment log:", error));
    }
    
  }, [invoiceId]);
  
  // useEffect(() => {
  //   axios
  //     .get(`${API_URL}/Product`)
  //     .then((response) => {
  //       const formattedProducts = response.data.map((product) => ({
  //         label: product.productName,
  //         categoryId:product.categoryId,
  //         productId:product.productId,
  //          // Displayed name
  //         price: product.price,       // Unit price
  //       }));
  //       setProductList(formattedProducts);
  //     })
  //     .catch((error) => console.error("Error fetching products:", error));
  // }, []);


  const calculateAdjustedTotal = () => {
    return invoiceItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    ).toFixed(2);
  };

  // const handleAddItem = () => {
  //   setInvoiceItems([
  //     ...invoiceItems,
  //     { name: "", description: "", quantity: 1, price: 0.0 },
  //   ]);
  // };
  const handleAddItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { 
        productName: "", 
        quantity: 1, // Set default quantity to 1
        unitPrice: 0.0, // Set default unit price to 0
        totalPrice: 0.0 // Set default total price to 0
      }
    ]);
  };
  const handleRemoveItem = (index) => {
    const updatedItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(updatedItems);
  };

  const calculateTotal = () =>
    invoiceItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ).toFixed(2);

  // const handleInputChange = (e, index, field) => {
  //   const updatedItems = [...invoiceItems];
  //   updatedItems[index][field] = e.target.value;
  //   setInvoiceItems(updatedItems);
  // };
  const handleInputChange = (e, index, field) => {
    const value = parseFloat(e.target.value); // Parse as a float
  
    const updatedItems = [...invoiceItems];
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index][field] = value; // Update the quantity or unitPrice as a number
    }
  
    // Update totalPrice based on quantity and unitPrice
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].totalPrice = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }
  
    setInvoiceItems(updatedItems);
  };
  
  const handleSave =async () => {
    console.log("Invoice Saved:", { ...invoiceDetails, items: invoiceItems });
    // alert("Invoice saved successfully!");


    try {
      const response =await  axios.post(
        `${API_URL}/Billing/SaveInvoice`, // Replace with your actual API URL
        { ...invoiceDetails, items: invoiceItems }
      );
      //alert(JSON.stringify(response));
      if (response.status === 200) {
        setSuccessMessage(response.data.message); // Set the success message from the API response
        alert(response.data.message); // Alert the success message
        //onClose();  
      }
    } catch (error) {
      console.error("There was an error saving the invoice!", error);
      alert("Failed to save invoice");
    }
  };

  const handlePrint = () => {
  
      const printContents = modalRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
  
      // Temporarily replace body content with modal content
      document.body.innerHTML = printContents;
  
      // Trigger print
      window.print();
  
      // Restore original content
      document.body.innerHTML = originalContents;
  
      // Ensure React re-renders the original DOM
      window.location.reload();
    };
  

  const handleNotify = () => {
    alert("Customer notified about the invoice!");
  };
  const handleAutoCompleteChange = (value, index) => {
    const updatedItems = [...invoiceItems];
    if (value) {
      updatedItems[index].productName = value.label?value.label:value;
      updatedItems[index].unitPrice = value.price?value.price:0;
      updatedItems[index].productId = value?.productId;
      updatedItems[index].categoryId = value.categoryId;
      updatedItems[index].totalPrice = updatedItems[index].quantity * value.price?value.price:0;
    } else {
      updatedItems[index].productName = value;
      updatedItems[index].unitPrice = 0;
      updatedItems[index].totalPrice = 0;
    }
    setInvoiceItems(updatedItems);
  };

  return (
    <div className="usage-tracking" ref={modalRef} style={{ padding: 20 }}>
      <div className="card">
        <div className="grid grid-cols-1 gap-5 lg:gap-7.5">
          <div>
            <table>
              <tr>
                <td><strong>Invoice ID:</strong> {invoiceDetails.invoiceNumber}</td>
                <td><strong>Status:</strong> {invoiceDetails.status}</td>
              </tr>
              <tr>
                <td><strong>Original Total:</strong> ${originalInvoiceTotal.toFixed(2)}</td>
                <td><strong>Client:</strong> {invoiceDetails.companyName}</td>
              </tr>
            </table>
          </div>
        </div>
        
        {/* Original Invoice Details */}
        <div className="invoice-section mt-3">
          <h3><b>Original Invoice Details</b></h3>
          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.unitPrice && !isNaN(item.unitPrice) ? item.unitPrice : 0).toFixed(2)}</td>
                  <td>${(item.totalPrice && !isNaN(item.totalPrice) ? item.totalPrice : 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 justify-content-end">
            <h4>
              <strong>Total Adjusted Invoice:</strong> ${calculateAdjustedTotal()}
            </h4>
          </div>
        </div>

        { isAdjustable && (<div>
          <form id="kt_invoice_form">
            {/* Invoice Header */}
            <div className="separator separator-dashed my-10"></div>

            {/* Items Table */}
            <div className="table-responsive mb-10">
              <h3><b>Adjust Invoice Details</b></h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>QTY</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                       <Autocomplete
                          options={productList}
                          getOptionLabel={(option) => option.label || ""}
                          value={
                            
                            productList.find((p) => p.label === item.productName) || null
                          }
                          onChange={(_, selectedItem) => {
                            if (selectedItem) {
                              // Pass the entire selected object to the handler
                              handleAutoCompleteChange(selectedItem, index);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Item name"
                              variant="outlined"
                              size="small"
                              placeholder="Select an item"
                            />
                          )}
                          disableClearable
                          sx={{ width: 200 }}
                        />

                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => handleInputChange(e, index, "quantity")}
                        />
                      </td>
                      <td>
                <label>${(item.unitPrice && !isNaN(item.unitPrice) ? item.unitPrice : 0).toFixed(2)}</label>
              </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={item.unitPrice}
                          min="0"
                          step="0.01"
                          disabled
                          onChange={(e) => handleInputChange(e, index, "unitPrice")}
                        />
                      </td>
                      {/* <td>${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}</td> */}
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveItem(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 justify-content-end">
                <h4>
                  <strong>Total Adjusted Invoice:</strong> ${calculateAdjustedTotal()}
                </h4>
              </div>
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={handleAddItem}
              >
                Add Item
              </button>
            </div>

            {/* Adjustment Log */}
            <div className="mb-4">
              <h3>Adjustment Log</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date/Time</th>
                    <th>Adjusted By</th>
                    <th>Change Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {adjustmentLog.map((log, index) => (
                    <tr key={index}>
                      <td>{new Date(log.adjustmentDateTime).toLocaleString()}</td>
                      <td>{log.adjustedBy}</td>
                      <td>{log.changeSummary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Client Notification Preview */}
            <div className="mt-3">
              <h3><b>Client Notification Preview</b></h3>
              <div className="notification-preview mt-2 mb-4">
                <p>Dear {fullName},</p>
                <p>Your invoice #{invoiceDetails.invoiceNumber} has been updated:</p>
                <ul>
                  <li>
                    {/* <strong>Original Amount:</strong> ${originalInvoicetotal.toFixed(2)}  */}
                    <strong>Original Amount:</strong> ${originalInvoiceTotal.toFixed(2)}
                  </li>
                  <li>
                    {/* <strong>Adjusted Amount:</strong> ${calculateTotal()} */}
                    <strong>Adjusted Amount:</strong> ${originalInvoiceTotal.toFixed(2)}
                  </li>
                  <li>
                    <strong>Reason:</strong> Applied promotional discount
                  </li>
                </ul>
                <p>
                  Please review the updated invoice at <a href="#link">[Link]</a>.
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save Invoice
              </button> */}
              <button
                type="button"
                className="btn btn-info"
                onClick={handlePrint}
              >
                Print Invoice
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleNotify}
              >
                Notify
              </button>
            </div>
             {/* Display the success message if available */}
            {successMessage && (
              <div className="alert alert-success mt-4">
                {successMessage}
              </div>
            )}
          </form>
        </div>)}
        <div className="flex items-center gap-2 shrink-0 mt-2">
              {/* <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save Invoice
              </button> */}
              <button
                type="button"
                className="btn btn-info"
                onClick={handlePrint}
              >
                Print Invoice
              </button>
              {/* <button
                type="button"
                className="btn btn-success"
                onClick={handleNotify}
              >
                Notify
              </button> */}
              <button
                type="button"
                className="btn btn-success"
                onClick={handleExport}
              >
                Export
              </button>
            </div>
      </div>
    </div>
  );
};

export { InvoiceDetails };
