"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const initialServices = {
  restaurant: [
    { id: 1, guest: "John Smith", room: "301", service: "Dinner", amount: 45, status: "Completed", date: "2024-03-20" },
    { id: 2, guest: "Maria Garcia", room: "102", service: "Lunch", amount: 30, status: "In Progress", date: "2024-03-20" },
  ],
  minibar: [
    { id: 1, room: "301", items: "Water, Snacks", amount: 15, status: "Completed", date: "2024-03-20" },
    { id: 2, room: "401", items: "Soft Drinks", amount: 10, status: "Pending", date: "2024-03-20" },
  ],
  spa: [
    { id: 1, guest: "Ahmed Hassan", service: "Massage", amount: 80, status: "Scheduled", date: "2024-03-21" },
    { id: 2, guest: "Sara Ahmed", service: "Hammam", amount: 60, status: "Completed", date: "2024-03-20" },
  ],
};

const serviceTypes:any = {
  restaurant: ["Breakfast", "Lunch", "Dinner", "Room Service"],
  spa: ["Massage", "Hammam", "Facial", "Manicure", "Pedicure"],
  minibar: ["Beverages", "Snacks", "Alcohol", "Soft Drinks"]
};

export default function ServicesPage() {
  const [services, setServices] = useState<any>(initialServices);
  const [activeTab, setActiveTab] = useState("restaurant");
  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    guest: "",
    room: "",
    service: "",
    items: "",
    amount: "",
    status: "Pending",
    date: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddService = () => {
    const newService = {
      id: services[activeTab].length + 1,
      ...formData
    };
    setServices((prev:any) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newService]
    }));
    setIsNewServiceOpen(false);
    resetForm();
  };

  const handleEditService = (service:any) => {
    setEditingService(service);
    setFormData(service);
  };

  const handleUpdateService = () => {
    setServices((prev:any) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((service:any) =>
        service.id === editingService.id ? { ...formData, id: service.id } : service
      )
    }));
    setEditingService(null);
    resetForm();
  };

  const handleDeleteService = (id:any) => {
    setServices((prev:any) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((service:any) => service.id !== id)
    }));
  };

  const resetForm = () => {
    setFormData({
      guest: "",
      room: "",
      service: "",
      items: "",
      amount: "",
      status: "Pending",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleStatusChange = (id:any, newStatus:any) => {
    setServices((prev:any)  => ({
      ...prev,
      [activeTab]: prev[activeTab].map((service:any) =>
        service.id === id ? { ...service, status: newStatus } : service
      )
    }));
  };

  const getTotalRevenue:any = () => {
    return Object.values(services).reduce((total, serviceList:any) => {
      return total + serviceList.reduce((sum:any, service:any) => sum + service.amount, 0);
    }, 0);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Services Management</h1>
          <p className="text-muted-foreground">Manage hotel services and amenities</p>
        </div>
        <Dialog open={isNewServiceOpen} onOpenChange={setIsNewServiceOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {(activeTab === "restaurant" || activeTab === "spa") && (
                <div className="grid gap-2">
                  <Label htmlFor="guest">Guest Name</Label>
                  <Input
                    id="guest"
                    name="guest"
                    value={formData.guest}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              {(activeTab === "restaurant" || activeTab === "minibar") && (
                <div className="grid gap-2">
                  <Label htmlFor="room">Room Number</Label>
                  <Input
                    id="room"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              {activeTab === "minibar" ? (
                <div className="grid gap-2">
                  <Label htmlFor="items">Items</Label>
                  <Textarea
                    id="items"
                    name="items"
                    value={formData.items}
                    onChange={handleInputChange}
                    placeholder="List items..."
                  />
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="service">Service</Label>
                  <Select
                    name="service"
                    onValueChange={(value) => handleInputChange({ target: { name: 'service', value }})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes[activeTab].map((service:any) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <Button onClick={handleAddService}>Add Service</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <h3 className="font-semibold">Restaurant Orders</h3>
          <p className="text-2xl font-bold">{services.restaurant.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Mini-bar Requests</h3>
          <p className="text-2xl font-bold">{services.minibar.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Spa Bookings</h3>
          <p className="text-2xl font-bold">{services.spa.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold">${getTotalRevenue()}</p>
        </Card>
      </div>

      <Card>
        <Tabs defaultValue="restaurant" className="p-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
            <TabsTrigger value="minibar">Mini-bar</TabsTrigger>
            <TabsTrigger value="spa">Spa & Hammam</TabsTrigger>
          </TabsList>

          <TabsContent value="restaurant">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.restaurant.map((service:any) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.guest}</TableCell>
                    <TableCell>{service.room}</TableCell>
                    <TableCell>{service.service}</TableCell>
                    <TableCell>${service.amount}</TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={service.status}
                        onValueChange={(value) => handleStatusChange(service.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>
                            <Badge 
                              variant={
                                service.status === "Completed" ? "success" :
                                service.status === "In Progress" ? "secondary" :
                                "warning"
                              }
                            >
                              {service.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{service.date}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="minibar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.minibar.map((service:any) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.room}</TableCell>
                    <TableCell>{service.items}</TableCell>
                    <TableCell>${service.amount}</TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={service.status}
                        onValueChange={(value) => handleStatusChange(service.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>
                            <Badge 
                              variant={
                                service.status === "Completed" ? "success" :
                                service.status === "Pending" ? "warning" :
                                "secondary"
                              }
                            >
                              {service.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{service.date}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="spa">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.spa.map((service:any) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.guest}</TableCell>
                    <TableCell>{service.service}</TableCell>
                    <TableCell>${service.amount}</TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={service.status}
                        onValueChange={(value) => handleStatusChange(service.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>
                            <Badge 
                              variant={
                                service.status === "Completed" ? "success" :
                                service.status === "Scheduled" ? "secondary" :
                                "warning"
                              }
                            >
                              {service.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Scheduled">Scheduled</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{service.date}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Edit Service Dialog */}
      <Dialog open={editingService !== null} onOpenChange={() => setEditingService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {(activeTab === "restaurant" || activeTab === "spa") && (
              <div className="grid gap-2">
                <Label htmlFor="guest">Guest Name</Label>
                <Input
                  id="guest"
                  name="guest"
                  value={formData.guest}
                  onChange={handleInputChange}
                />
              </div>
            )}
            {(activeTab === "restaurant" || activeTab === "minibar") && (
              <div className="grid gap-2">
                <Label htmlFor="room">Room Number</Label>
                <Input
                  id="room"
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                />
              </div>
            )}
            {activeTab === "minibar" ? (
              <div className="grid gap-2">
                <Label htmlFor="items">Items</Label>
                <Textarea
                  id="items"
                  name="items"
                  value={formData.items}
                  onChange={handleInputChange}
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="service">Service</Label>
                <Select
                  name="service"
                  value={formData.service}
                  onValueChange={(value) => handleInputChange({ target: { name: 'service', value }})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes[activeTab].map((service:any) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button onClick={handleUpdateService}>Update Service</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}