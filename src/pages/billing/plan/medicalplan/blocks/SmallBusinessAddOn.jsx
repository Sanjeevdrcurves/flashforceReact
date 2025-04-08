import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { KeenIcon } from '@/components';
import { useNavigate } from 'react-router';
import DOMPurify from "dompurify";
import './PlanTable.css';
import { Modal } from '@/components/Modal';
import { ModalContent } from '../../../../../components/modal/ModalContent';
import { ModalHeader } from '../../../../../components/modal/ModalHeader';
import Pricing from './NewPlan';



const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const SmallBusinessAddOn = ({ planTypeId, fetchFlag, editPlanHandler, showActions }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [visibleFeatures, setVisibleFeatures] = useState({});
    const [openIndex, setOpenIndex] = useState(null);
    const [modal, setModal] = useState(false);
    const [isAnnual, setIsAnnual] = useState(true);
    const [plans, setPlans] = useState(null);
    const navigate = useNavigate();

    const handleToggleBilling = () => setIsAnnual(!isAnnual);

    const HtmlContent = ({ content }) => {
        if (!content) return null;
        const sanitizedContent = DOMPurify.sanitize(content);
        return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
    };
    const toggleRow = (index) => {

        setOpenIndex(openIndex === index ? null : index); // Toggle the clicked row
    };
    useEffect(() => {
        fetchPlansAndFeatures();
    }, [planTypeId, fetchFlag]);




    const fetchPlansAndFeatures = async () => {
        try {
            const response = await axios.get(`${API_URL}/Feature/GetPlanFeatureDetail?planTypeId=${planTypeId}`);
            const rawPlans = JSON.parse(response.data);

            const transformedPlans = {
                info: {},
                features: [],
            };

            if (rawPlans && rawPlans.length) {
                rawPlans.forEach((plan, index) => {
                    const key = `plan${index + 1}`;
                    transformedPlans.info[key] = {
                        title: plan.PlanName,
                        description: plan.Description,
                        planDetail: plan.PlanDetail,
                        planId: plan.MasterPlanId,
                        price: {
                            regular: `$${plan.MonthlyAmount}`,
                            annual: `$${plan.YearlyAmount}`,
                        },
                        free: plan.MonthlyAmount <= 0,
                        freePeriod: plan.FreeTrailPeriod,
                        monthlyAmount: plan.MonthlyAmount,
                        yearlyAmount: plan.YearlyAmount,
                        isMostPopular: !!plan.IsMostPopular,
                    };
                });

                const featureKeys = Object.keys(rawPlans[0]).filter(
                    (key) =>
                      !["PlanName", "Description","PlanDetail", "MonthlyAmount", "YearlyAmount", "FreeTrailPeriod","MasterPlanId","IsMostPopular"].includes(key)
                  );

                featureKeys.forEach((feature) => {
                    const featureEntry = {
                        title: feature,
                        plans: {},
                    };

                    rawPlans.forEach((plan, index) => {
                        const key = `plan${index + 1}`;
                        if (feature === "TotalSeats") {
                               featureEntry.plans[key] = "Up to " + plan["TotalSeats"] + " Users" || 0;
                            // featureEntry.plans[key] = "Up to " + plan["TotalSeats"]  +" Users"|| 0; // Default to 0 if "TotalSeats" is not defined
                        } else {
                            featureEntry.plans[key] =
                                plan.hasOwnProperty(feature) && plan[feature] !== null && plan[feature] !== ''
                                    ? (!isNaN(plan[feature]) ? Number(plan[feature]) : !!plan[feature])
                                    : false;
                        }
                    });

                    transformedPlans.features.push(featureEntry);
                });
                // console.log('truansformedplans:'+JSON.stringify(transformedPlans.features));
                setPlans(transformedPlans);
            } else {
                setPlans(null);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const selectPlanHandler = (planDetails) => {
        navigate("/billing/plan/SignUp", {
            state: { planId: planDetails.planId, isAnnual },
        });
    };

    const deletePlanHandler = (planDetails) => {
        if (confirm("Are you sure to delete " + planDetails.title)) {
            deleteMasterPlan(planDetails.planId);
        }
    };

    const deleteMasterPlan = async (masterPlanId) => {
        try {
            const response = await axios.delete(`${API_URL}/MasterPlan/Delete`, {
                headers: { 'Accept': '*/*' },
                params: { masterPlanId },
            });
            console.log('Delete Response:', response.data);
            fetchPlansAndFeatures();
        } catch (error) {
            console.error('Error deleting MasterPlan:', error);
        }
    };


    const toggleFeaturesVisibility = (planId) => {
        setModal(true)
        setVisibleFeatures((prevState) => ({
            ...prevState,
            [planId]: !prevState[planId], // Toggle the visibility for the specific plan
        }));
    };
    // Function to close the modal
    const closeModal = () => {
        setModal(false);
    };
    const renderPlanInfo = (info) => {
        const isVisible = visibleFeatures[info.planId] || false;

        return (
            <Fragment>
                <div className="border rounded p-3 border-light-grey" style={{ height: "100%" }} >
                    {info.isMostPopular && (
                        <div className="badge badge-sm badge-outline badge-success align-center">
                            Most Popular Plan
                        </div>
                    )}
                    <div className="flex items-center justify-between py-4 gap-2.5">
                        <div className="flex flex-col justify-center gap-1.5">
                            <span className="leading-none font-medium text-sm text-gray-900">
                                {info?.title}
                            </span>
                        </div>

                        {showActions && (
                            <div className="flex">
                                <button
                                    className="btn btn-sm btn-icon btn-clear btn-light"
                                    onClick={() => editPlanHandler(info)}
                                >
                                    <KeenIcon icon="notepad-edit" />
                                </button>
                                <button
                                    className="btn btn-sm btn-icon btn-clear btn-light"
                                    onClick={() => deletePlanHandler(info)}
                                >
                                    <KeenIcon icon="trash" />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="text-gray-700 text-2sm">{info?.description}</div>
                    <div className="py-4">
                        {info?.free ? (
                            <h4 className="text-2xl text-gray-900 font-semibold leading-none">
                                Free
                            </h4>
                        ) : (
                            <div className="flex items-end gap-1.5">
                                <div className="text-2xl text-gray-900 font-semibold leading-none">
                                    {isAnnual ? info?.price?.annual : info?.price?.regular}
                                </div>
                                <div className="text-gray-700 text-2xs">
                                    {!isAnnual ? "per month" : "per year"}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="text-gray-700 text-2sm">
                        <HtmlContent content={info?.planDetail} />
                    </div>
                    <div>
          
                        <button
                            onClick={() => selectPlanHandler(info)}
                            className={'btn btn-primary btn-sm text-center flex justify-center w-full'}
                        >
                            {'Start Now'}
                        </button>

                    </div>

                    {/* See All Features Button */}
                    <div className="mt-4">
                        <button
                            className="btn btn-link btn-sm text-primary"
                            onClick={() => toggleFeaturesVisibility(info.planId)}
                        >
                            {isVisible ? "Hide Features" : "See All Features"}
                        </button>
                    </div>

                    {/* Features List */}
                    {isVisible && (
                        <div className="mt-2">
                            <ul className="list-disc pl-5 text-gray-700 text-sm">
                                {info.features?.map((feature, index) => (
                                    <li key={index} className="mb-1">
                                        {feature.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </Fragment>
        );
    };

    const renderPopupPlanInfo = (info) => {
        const isVisible = visibleFeatures[info.planId] || false;

        return (
            <Fragment>
                <div className="border rounded p-3 border-light-grey" style={{ height: "100%" }} >
                    {info.isMostPopular && (
                        <div className="badge badge-sm badge-outline badge-success align-center">
                            Most Popular Plan
                        </div>
                    )}
                    <div className="flex items-center justify-between py-4 gap-2.5">
                        <div className="flex flex-col justify-center gap-1.5">
                            <span className="leading-none font-medium text-sm text-gray-900">
                                {info?.title}
                            </span>
                        </div>

                        {showActions && (
                            <div className="flex">
                                <button
                                    className="btn btn-sm btn-icon btn-clear btn-light"
                                    onClick={() => editPlanHandler(info)}
                                >
                                    <KeenIcon icon="notepad-edit" />
                                </button>
                                <button
                                    className="btn btn-sm btn-icon btn-clear btn-light"
                                    onClick={() => deletePlanHandler(info)}
                                >
                                    <KeenIcon icon="trash" />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="text-gray-700 text-2sm">{info?.description}</div>
                    <div className="py-4">
                        {info?.free ? (
                            <h4 className="text-2xl text-gray-900 font-semibold leading-none">
                                Free
                            </h4>
                        ) : (
                            <div className="flex items-end gap-1.5">
                                <div className="text-2xl text-gray-900 font-semibold leading-none">
                                    {isAnnual ? info?.price?.annual : info?.price?.regular}
                                </div>
                                <div className="text-gray-700 text-2xs">
                                    {!isAnnual ? "per month" : "per year"}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="text-gray-700 text-2sm">
                        <HtmlContent content={info?.planDetail} />
                    </div>
                    <div>
                        <button
                            onClick={() => selectPlanHandler(info)}
                            className={
                                info?.free
                                    ? "btn btn-light btn-sm flex justify-center w-full"
                                    : "btn btn-primary btn-sm text-center flex justify-center w-full"
                            }
                        >
                            {info?.free ? "Switch to Team" : "Start Now"}
                        </button>
                    </div>


                </div>
            </Fragment>
        );
    };



    const renderFeatureDetail = (detail) => {
        if (typeof detail === 'boolean') {
            return detail ? <KeenIcon icon="check" className="text-success text-lg" /> : null;
        }
        return <div className="text-gray-800 text-2sm">{detail}</div>;
    };

    return (
        <div className="scrollable-x-auto pt-3 -mt-3">
            <table className="table  min-w-[1000px] table-border-b table-border-e table-rounded card-rounded">
                <thead>
                    {/* {Object.keys(plans?.info || {}).map((key) => (
      <th key={key} className="border-0 header-cell">
        {renderPlanInfo(plans.info[key])}
      </th>
    ))} */}
                    <tr>
                        <Pricing plans={plans?.info} plansfeatures={plans?.features} />
                    </tr>
                </thead>
                {/* <tbody>
          {plans?.features.map((feature, index) => (
            <tr key={index}>
              <td className="table-border-s !px-5 !py-3.5">
                <div className="text-gray-900 text-2sm leading-none font-medium">{feature.title}</div>
              </td>
              {Object.keys(plans?.info || {}).map((key) => (
                <td key={`${index}-${key}`} className="table-border-s !px-5 !py-3.5">
                  {renderFeatureDetail(feature?.plans[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody> */}
            </table>
            <Modal open={modal} onClose={closeModal} >


                <ModalHeader>
                    <ModalContent>
                        <table>
                            <thead>
                                <tr>
                                    <th className="align-bottom !p-5 !pt-7.5 !pb-6 border-0 header-cell">
                                        {/* Optional header content here */}
                                    </th>
                                    {Object.keys(plans?.info || {}).map((key) => (
                                        <th key={key} className="border-0 header-cell">
                                            {renderPopupPlanInfo(plans.info[key])}

                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            {/* <thead>
          <tr>
            <th className='text-center' colSpan={4}>Plan Feature Data
            <button onClick={() => closeModal}
        className="modal-close-btn float-right"
      >
        ✖
      </button></th>            
          </tr>
        </thead> */}
                            <tbody>
                                {plans?.features.map((feature, index) => (
                                    <React.Fragment key={index}>
                                        {/* Parent Row */}
                                        <tr
                                            className="cursor-pointer bg-gray-50 hover:bg-gray-100"
                                            onClick={() => toggleRow(index)}
                                        >
                                            <td className="border border-gray-300 px-5 py-3 font-medium">
                                                {feature.title}
                                            </td>
                                            {Object.keys(plans?.info || {}).map((key) => (
                                                <td
                                                    key={`${index}-${key}`}
                                                    className="border border-gray-300 px-5 py-3 text-center"
                                                >  {renderFeatureDetail(feature?.plans[key])}

                                                </td>
                                            ))}
                                        </tr>

                                        {/* Collapsible Child Row */}
                                        {openIndex === index && (
                                            <tr className="bg-gray-100">
                                                <td colSpan={Object.keys(plans?.info || {}).length + 1} className="border border-gray-300 px-5 py-3">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800 mb-2">Details:</h4>
                                                        <ul className="list-disc ml-5 text-gray-700">
                                                            {['lorem ipsum', 'lorem', 'ipsum'].map((child, childIndex) => (
                                                                <li key={childIndex}>{child}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </ModalContent>
                </ModalHeader>

            </Modal>
        </div>
    );
};

export { SmallBusinessAddOn };
