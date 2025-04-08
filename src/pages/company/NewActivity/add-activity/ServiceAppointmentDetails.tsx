
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, FileText, AlertCircle, Package, ClipboardCheck, Wallet, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Service {
  id: string;
  name: string;
  price?: number;
}

interface Product {
  id: string;
  name: string;
  quantity: number;
  price?: number;
}

interface ServiceAppointmentDetailsProps {
  patientBalance: number;
  setPatientBalance: (balance: number) => void;
  paperworkCompleted: boolean;
  setPaperworkCompleted: (completed: boolean) => void;
  assignedServices: Service[];
  addAssignedService: (service: Service) => void;
  removeAssignedService: (id: string) => void;
  assignedProducts: Product[];
  addAssignedProduct: (product: Product) => void;
  removeAssignedProduct: (id: string) => void;
  servicesOfInterest: Service[];
  addServiceOfInterest: (service: Service) => void;
  removeServiceOfInterest: (id: string) => void;
  productsOfInterest: Product[];
  addProductOfInterest: (product: Product) => void;
  removeProductOfInterest: (id: string) => void;
}

export const ServiceAppointmentDetails: React.FC<ServiceAppointmentDetailsProps> = ({
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
  const [activeTab, setActiveTab] = useState("client");
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState("1");

  const handleAddAssignedService = () => {
    if (newServiceName.trim()) {
      addAssignedService({
        id: Date.now().toString(),
        name: newServiceName.trim(),
        price: newServicePrice ? parseFloat(newServicePrice) : undefined,
      });
      setNewServiceName("");
      setNewServicePrice("");
    }
  };

  const handleAddAssignedProduct = () => {
    if (newProductName.trim()) {
      addAssignedProduct({
        id: Date.now().toString(),
        name: newProductName.trim(),
        quantity: parseInt(newProductQuantity) || 1,
        price: newProductPrice ? parseFloat(newProductPrice) : undefined,
      });
      setNewProductName("");
      setNewProductPrice("");
      setNewProductQuantity("1");
    }
  };

  return (
    <div className="space-y-6 pt-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-5 h-10 mb-6 bg-muted/50">
          <TabsTrigger value="client" className="text-xs">
            <div className="flex items-center space-x-1">
              <ClipboardCheck className="h-4 w-4" />
              <span>Client Details</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="services" className="text-xs">
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>Services</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="products" className="text-xs">
            <div className="flex items-center space-x-1">
              <Package className="h-4 w-4" />
              <span>Products</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="interest" className="text-xs">
            <div className="flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>Interest</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>History</span>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Client Details Tab */}
        <TabsContent value="client">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-muted-foreground" />
              <Label htmlFor="patientBalance" className="text-sm font-medium">Patient Balance</Label>
            </div>
            <Input
              id="patientBalance"
              type="number"
              value={patientBalance.toString()}
              onChange={(e) => setPatientBalance(parseFloat(e.target.value) || 0)}
              className="h-9"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            
            <div className="flex items-start space-x-2 pt-4">
              <Checkbox 
                id="paperworkCompleted" 
                checked={paperworkCompleted} 
                onCheckedChange={(checked) => setPaperworkCompleted(!!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="paperworkCompleted"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Paperwork Completed
                </Label>
                <p className="text-xs text-muted-foreground">
                  Check if all required paperwork has been completed and verified.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Assigned Services</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Service name"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="h-8 w-40 text-sm"
                />
                <Input
                  placeholder="Price"
                  type="number"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  className="h-8 w-24 text-sm"
                  step="0.01"
                  min="0"
                />
                <Button size="sm" variant="outline" onClick={handleAddAssignedService}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {assignedServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                  <div>
                    <span className="text-sm font-medium">{service.name}</span>
                    {service.price && <span className="text-sm text-muted-foreground ml-2">${service.price.toFixed(2)}</span>}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeAssignedService(service.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
              {assignedServices.length === 0 && (
                <p className="text-sm text-muted-foreground">No services assigned yet.</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Assigned Products</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Product name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="h-8 w-36 text-sm"
                />
                <Input
                  placeholder="Qty"
                  type="number"
                  value={newProductQuantity}
                  onChange={(e) => setNewProductQuantity(e.target.value)}
                  className="h-8 w-16 text-sm"
                  min="1"
                />
                <Input
                  placeholder="Price"
                  type="number"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  className="h-8 w-24 text-sm"
                  step="0.01"
                  min="0"
                />
                <Button size="sm" variant="outline" onClick={handleAddAssignedProduct}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {assignedProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                  <div>
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">x{product.quantity}</span>
                    {product.price && <span className="text-sm text-muted-foreground ml-2">${product.price.toFixed(2)}</span>}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeAssignedProduct(product.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
              {assignedProducts.length === 0 && (
                <p className="text-sm text-muted-foreground">No products assigned yet.</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Interest Tab */}
        <TabsContent value="interest">
          <div className="space-y-4">
            <Label className="text-sm font-medium">Services of Interest</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Service name"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                className="h-8"
              />
              <Button size="sm" variant="outline" onClick={() => {
                if (newServiceName.trim()) {
                  addServiceOfInterest({
                    id: Date.now().toString(),
                    name: newServiceName.trim()
                  });
                  setNewServiceName("");
                }
              }}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {servicesOfInterest.map((service) => (
                <div key={service.id} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                  <span className="text-sm font-medium">{service.name}</span>
                  <Button size="sm" variant="ghost" onClick={() => removeServiceOfInterest(service.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <Label className="text-sm font-medium">Products of Interest</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Product name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="h-8"
              />
              <Button size="sm" variant="outline" onClick={() => {
                if (newProductName.trim()) {
                  addProductOfInterest({
                    id: Date.now().toString(),
                    name: newProductName.trim(),
                    quantity: 1
                  });
                  setNewProductName("");
                }
              }}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {productsOfInterest.map((product) => (
                <div key={product.id} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                  <span className="text-sm font-medium">{product.name}</span>
                  <Button size="sm" variant="ghost" onClick={() => removeProductOfInterest(product.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Viewing history of services, products, and appointment notes.
            </p>
            <div className="bg-muted/50 p-4 rounded">
              <p className="text-sm font-medium">This tab will show the client's history</p>
              <p className="text-sm text-muted-foreground mt-2">
                • Previous appointments<br />
                • Service history<br />
                • Product purchases<br />
                • Notes and alerts<br />
                • Forms completed
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
