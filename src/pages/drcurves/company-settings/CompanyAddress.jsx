import { Alert, KeenIcon, Menu, MenuItem, MenuToggle } from "@/components";
import { useLanguage } from "@/i18n";
import { DropdownCard1 } from "@/partials/dropdowns/general";
import clsx from "clsx";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import { sendNotification } from "@/utils/notificationapi";
import { tzStrings, tzInts } from "./timeZoneList";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const companySchema = Yup.object().shape({
  address: Yup.string().nullable(),
  city: Yup.string().nullable(),
  zipCode: Yup.string().required("Zip code is required"),
  state: Yup.string().required("State is required"),
 // country: Yup.string().nullable(),
  // Make required if you want to force selection:
  timeZone: Yup.string().nullable(),
});

const CompanyAddress = (props) => {
  const userid = props.userId;
  const [initialValues, setInitialValues] = useState({
    ...(props.settings ?? {}),
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const { isRTL } = useLanguage();

  const handleSave = async (values, formikHelpers) => {
    try {
      console.log("Company Data:", values);

      const queryParams = new URLSearchParams({
        ...props.settings,
        ...values,
      });

      const response = await axios.put(
        `${API_URL}/Company/update-address?${queryParams.toString()}`
      );
      console.log("PUT response", response.data);

      toast.success("Address updated successfully!");

      await sendNotification(
        String(userid),
        61, // Notification setting ID
        "Company profile details updated",
        "Company profile details updation Successful",
        "9",
        ""
      );

      formikHelpers.setSubmitting(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update address. Please try again.");
      formikHelpers.setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: companySchema,
    onSubmit: handleSave,
  });

  return (
    <div className="card min-w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsSubmitClicked(true);
          formik.handleSubmit();
        }}
        noValidate
      >
        <div className="card-header">
          <h3 className="card-title">Company Data</h3>
          {formik.status && <Alert variant="danger">{formik.status}</Alert>}

          <Menu className="items-stretch">
            <MenuItem
              toggle="dropdown"
              trigger="click"
              dropdownProps={{
                placement: isRTL() ? "bottom-start" : "bottom-end",
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 10], // [skid, distance]
                    },
                  },
                ],
              }}
            >
              <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
                <KeenIcon icon="dots-vertical" />
              </MenuToggle>
              {DropdownCard1()}
            </MenuItem>
          </Menu>
        </div>

        <div className="card-body flex flex-col gap-5 lg:py-7.5">
          {/* Address */}
          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">Address</label>
            <label className="input">
              <input
                placeholder="Enter address"
                autoComplete="off"
                {...formik.getFieldProps("address")}
                className={clsx("form-control", {
                  "is-invalid":
                    formik.errors.address &&
                    (formik.touched.address || isSubmitClicked),
                })}
              />
            </label>
            {formik.errors.address &&
              (formik.touched.address || isSubmitClicked) && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.address}
                </span>
              )}
          </div>

          {/* City / Zip */}
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">City</label>
              <label className="input">
                <input
                  placeholder="Enter city"
                  autoComplete="off"
                  {...formik.getFieldProps("city")}
                  className={clsx("form-control", {
                    "is-invalid":
                      formik.errors.city &&
                      (formik.touched.city || isSubmitClicked),
                  })}
                />
              </label>
              {formik.errors.city &&
                (formik.touched.city || isSubmitClicked) && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.city}
                  </span>
                )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">Zip Code</label>
              <label className="input">
                <input
                  placeholder="Enter zip code"
                  autoComplete="off"
                  {...formik.getFieldProps("zipCode")}
                  className={clsx("form-control", {
                    "is-invalid":
                      formik.errors.zipCode &&
                      (formik.touched.zipCode || isSubmitClicked),
                  })}
                />
              </label>
              {formik.errors.zipCode &&
                (formik.touched.zipCode || isSubmitClicked) && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.zipCode}
                  </span>
                )}
            </div>
          </div>

          {/* State */}
          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">
              State / Prov / Region
            </label>
            <label className="input">
              <input
                placeholder="Enter state / prov / region"
                autoComplete="off"
                {...formik.getFieldProps("state")}
                className={clsx("form-control", {
                  "is-invalid":
                    formik.errors.state &&
                    (formik.touched.state || isSubmitClicked),
                })}
              />
            </label>
            {formik.errors.state &&
              (formik.touched.state || isSubmitClicked) && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.state}
                </span>
              )}
          </div>

          {/* Country / Time Zone */}
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            {/* <div className="flex flex-col gap-1" >
              <label className="form-label text-gray-900">Country</label>
              <label className="input">
                <input
                  placeholder="Enter country"
                  autoComplete="off"
                  {...formik.getFieldProps("country")}
                  className={clsx("form-control", {
                    "is-invalid":
                      formik.errors.country &&
                      (formik.touched.country || isSubmitClicked),
                  })}
                />
              </label>
              {formik.errors.country &&
                (formik.touched.country || isSubmitClicked) && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.country}
                  </span>
                )}
            </div> */}

            {/* Time Zone Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">Time Zone</label>
              <label className="input">
              <select
  value={formik.values.timeZone || ""}
  onChange={(e) => formik.setFieldValue("timeZone", e.target.value)}
>
  <option value="">-- Select Time Zone --</option>
  {tzStrings.map((tz) => (
    <option key={tz.value} value={tz.label}>
      {tz.label}
    </option>
  ))}
</select>

              </label>
              {formik.errors.timeZone &&
                (formik.touched.timeZone || isSubmitClicked) && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.timeZone}
                  </span>
                )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary flex justify-center"
              disabled={loading || formik.isSubmitting}
            >
              {loading ? "Please wait..." : "Update Address"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyAddress;
