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
import { Plus, Edit, Trash, FileText, Send } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const initialInvoices = [
  { 
    id: "INV001", 
    reservation: "RES001",
    guest: "John Smith", 
    date: "2024-03-20", 
    amount: 1240,
    status: "Paid",
    type: "Room + Services",
    items: [
      { description: "Room 301 (5 nights)", amount: 1000 },
      { description: "Restaurant - Dinner", amount: 180 },
      { description: "Spa Services", amount: 60 }
    ]
  },
  { 
    id: "INV002", 
    reservation: "RES002",
    guest: "Maria Garcia", 
    date: "2024-03-20", 
    amount: 400,
    status: "Pending",
    type: "Room Only",
    items: [
      { description: "Room 102 (2 nights)", amount: 400 }
    ]
  },
  { 
    id: "INV003", 
    reservation: null,
    guest: "Walk-in Customer", 
    date: "2024-03-20", 
    amount: 80,
    status: "Paid",
    type: "Restaurant",
    items: [
      { description: "Restaurant - Lunch", amount: 80 }
    ]
  },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [formData, setFormData] = useState({
    guest: "",
    reservation: "",
    type: "",
    amount: "",
    status: "Pending",
    items: []
  });
  const [newItem, setNewItem] = useState({ description: "", amount: "" });

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = () => {
    if (newItem.description && newItem.amount) {
      setFormData((prev:any) => ({
        ...prev,
        items: [...prev.items, { ...newItem }],
        amount: String(Number(prev.amount || 0) + Number(newItem.amount))
      }));
      setNewItem({ description: "", amount: "" });
    }
  };

  const handleRemoveItem = (index:any) => {
    setFormData(prev => {
      const newItems = prev.items.filter((_, i) => i !== index);
      const newAmount = newItems.reduce((sum, item:any) => sum + Number(item.amount), 0);
      return {
        ...prev,
        items: newItems,
        amount: String(newAmount)
      };
    });
  };

  const handleAddInvoice = () => {
    const newInvoice = {
      id: `INV${String(invoices.length + 1).padStart(3, '0')}`,
      ...formData,
      date: new Date().toISOString().split('T')[0],
      amount: Number(formData.amount)
    };
    setInvoices(prev => [...prev, newInvoice]);
    setIsNewInvoiceOpen(false);
    resetForm();
  };

  const handleEditInvoice = (invoice:any) => {
    setEditingInvoice(invoice);
    setFormData(invoice);
  };

  const handleUpdateInvoice = () => {
    setInvoices((prev:any) => 
      prev.map((invoice:any) => 
        invoice.id === editingInvoice.id ? { ...formData, id: invoice.id, date: invoice.date } : invoice
      )
    );
    setEditingInvoice(null);
    resetForm();
  };

  const handleDeleteInvoice = (id:any) => {
    if (invoices.find(inv => inv.id === id)?.status === "Paid") {
      alert("Cannot delete a paid invoice!");
      return;
    }
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
  };

  const resetForm = () => {
    setFormData({
      guest: "",
      reservation: "",
      type: "",
      amount: "",
      status: "Pending",
      items: []
    });
    setNewItem({ description: "", amount: "" });
  };

  const handleStatusChange = (id:any, newStatus:any) => {
    setInvoices(prev =>
      prev.map(invoice =>
        invoice.id === id ? { ...invoice, status: newStatus } : invoice
      )
    );
  };

  const handleGeneratePDF = (invoice:any) => {
    // Implement PDF generation logic
    console.log("Generating PDF for invoice:", invoice.id);
  };

  const handleSendEmail = (invoice:any) => {
    // Implement email sending logic
    console.log("Sending email for invoice:", invoice.id);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage billing and invoices</p>
        </div>
        <Dialog open={isNewInvoiceOpen} onOpenChange={setIsNewInvoiceOpen}>
          {/* <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </DialogTrigger> */}
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="guest">Guest Name</Label>
                <Input
                  id="guest"
                  name="guest"
                  value={formData.guest}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reservation">Reservation ID (optional)</Label>
                <Input
                  id="reservation"
                  name="reservation"
                  value={formData.reservation}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Invoice Type</Label>
                <Select
                  name="type"
                  onValueChange={(value) => handleInputChange({ target: { name: 'type', value }})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Room Only">Room Only</SelectItem>
                    <SelectItem value="Room + Services">Room + Services</SelectItem>
                    <SelectItem value="Restaurant">Restaurant</SelectItem>
                    <SelectItem value="Spa">Spa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border p-4 rounded-lg space-y-4">
                <h4 className="font-semibold">Invoice Items</h4>
                {formData.items.map((item:any, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">{item.description}</div>
                    <div className="w-24">${item.amount}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-4">
                  <Input
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    className="w-32"
                    value={newItem.amount}
                    onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
                  />
                  <Button onClick={handleAddItem}>Add Item</Button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold">Total Amount:</span>
                <span className="text-xl font-bold">${formData.amount}</span>
              </div>
            </div>
            <Button onClick={handleAddInvoice}>Create Invoice</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <h3 className="font-semibold">Total Invoices</h3>
          <p className="text-2xl font-bold">{invoices.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Paid</h3>
          <p className="text-2xl font-bold text-green-600">
            {invoices.filter(i => i.status === "Paid").length}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {invoices.filter(i => i.status === "Pending").length}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold">
            ${invoices.reduce((sum, inv) => sum + inv.amount, 0)}
          </p>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
           
            <TableHead> <Checkbox/></TableHead>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Reservation ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell> <Checkbox/></TableCell>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.reservation || "-"}</TableCell>
                <TableCell>{invoice.guest}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.type}</TableCell>
                <TableCell>${invoice.amount}</TableCell>
                <TableCell>
                  <Select 
                    defaultValue={invoice.status}
                    onValueChange={(value) => handleStatusChange(invoice.id, value)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue>
                        <Badge 
                          variant={invoice.status === "Paid" ? "success" : "warning"}
                        >
                          {invoice.status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditInvoice(invoice)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteInvoice(invoice.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleGeneratePDF(invoice)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSendEmail(invoice)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Invoice Dialog */}
      <Dialog open={editingInvoice !== null} onOpenChange={() => setEditingInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="guest">Guest Name</Label>
              <Input
                id="guest"
                name="guest"
                value={formData.guest}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reservation">Reservation ID</Label>
              <Input
                id="reservation"
                name="reservation"
                value={formData.reservation}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Invoice Type</Label>
              <Select
                name="type"
                value={formData.type}
                onValueChange={(value) => handleInputChange({ target: { name: 'type', value }})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Room Only">Room Only</SelectItem>
                  <SelectItem value="Room + Services">Room + Services</SelectItem>
                  <SelectItem value="Restaurant">Restaurant</SelectItem>
                  <SelectItem value="Spa">Spa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border p-4 rounded-lg space-y-4">
              <h4 className="font-semibold">Invoice Items</h4>
              {formData.items.map((item:any, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">{item.description}</div>
                  <div className="w-24">${item.amount}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-4">
                <Input
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  className="w-32"
                  value={newItem.amount}
                  onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
                />
                <Button onClick={handleAddItem}>Add Item</Button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-xl font-bold">${formData.amount}</span>
            </div>
          </div>
          <Button onClick={handleUpdateInvoice}>Update Invoice</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}