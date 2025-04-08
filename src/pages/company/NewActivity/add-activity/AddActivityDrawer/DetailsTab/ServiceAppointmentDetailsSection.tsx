
import React from "react";
import { Separator } from "@/components/ui/separator";
import { ServiceAppointmentDetails } from "@/components/add-activity/ServiceAppointmentDetails";

interface ServiceAppointmentDetailsSectionProps {
  patientBalance: number;
  setPatientBalance: (balance: number) => void;
  paperworkCompleted: boolean;
  setPaperworkCompleted: (completed: boolean) => void;
  assignedServices: Array<{ id: string; name: string; price?: number }>;
  addAssignedService: (service: { id: string; name: string; price?: number }) => void;
  removeAssignedService: (id: string) => void;
  assignedProducts: Array<{ id: string; name: string; quantity: number; price?: number }>;
  addAssignedProduct: (product: { id: string; name: string; quantity: number; price?: number }) => void;
  removeAssignedProduct: (id: string) => void;
  servicesOfInterest: Array<{ id: string; name: string; notes?: string }>;
  addServiceOfInterest: (service: { id: string; name: string; notes?: string }) => void;
  removeServiceOfInterest: (id: string) => void;
  productsOfInterest: Array<{ id: string; name: string; quantity: number; notes?: string }>;
  addProductOfInterest: (product: { id: string; name: string; quantity: number; notes?: string }) => void;
  removeProductOfInterest: (id: string) => void;
}

export const ServiceAppointmentDetailsSection: React.FC<ServiceAppointmentDetailsSectionProps> = ({
  patientBalance,
  setPatientBalance,
  paperworkCompleted,
  setPaperworkCompleted,
  assignedServices,
  addAssignedService,
  removeAssignedService,
  assignedProducts,
  addAssignedProduct,
  removeAssignedProduct,
  servicesOfInterest,
  addServiceOfInterest,
  removeServiceOfInterest,
  productsOfInterest,
  addProductOfInterest,
  removeProductOfInterest,
}) => {
  return (
    <>
      <Separator className="my-6" />
      <ServiceAppointmentDetails
        patientBalance={patientBalance}
        setPatientBalance={setPatientBalance}
        paperworkCompleted={paperworkCompleted}
        setPaperworkCompleted={setPaperworkCompleted}
        assignedServices={assignedServices}
        addAssignedService={addAssignedService}
        removeAssignedService={removeAssignedService}
        assignedProducts={assignedProducts}
        addAssignedProduct={addAssignedProduct}
        removeAssignedProduct={removeAssignedProduct}
        servicesOfInterest={servicesOfInterest}
        addServiceOfInterest={addServiceOfInterest}
        removeServiceOfInterest={removeServiceOfInterest}
        productsOfInterest={productsOfInterest}
        addProductOfInterest={addProductOfInterest}
        removeProductOfInterest={removeProductOfInterest}
      />
    </>
  );
};
