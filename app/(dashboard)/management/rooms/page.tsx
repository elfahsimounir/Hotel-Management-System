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
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

const initialRooms = [
  { id: 1, number: "101", type: "Normal", status: "Available", guest: null, checkIn: null, checkOut: null, price: "100", maintenance: false },
  { id: 2, number: "102", type: "Normal", status: "Available", guest: null, checkIn: null, checkOut: null, price: "100", maintenance: false },
  { id: 3, number: "201", type: "Triple", status: "Available", guest: null, checkIn: null, checkOut: null, price: "150", maintenance: false },
  { id: 4, number: "301", type: "Suite", status: "Occupied", guest: "Jane Smith", checkIn: "2024-03-18", checkOut: "2024-03-22", price: "200", maintenance: false },
  { id: 5, number: "401", type: "Junior", status: "Maintenance", guest: null, checkIn: null, checkOut: null, price: "180", maintenance: true },
];

const roomTypes = [
  { name: "Normal", basePrice: "100" },
  { name: "Triple", basePrice: "150" },
  { name: "Suite", basePrice: "200" },
  { name: "Junior", basePrice: "180" },
  { name: "Royal Suite", basePrice: "300" },
];

export default function RoomsPage() {
  const [rooms, setRooms] = useState(initialRooms);
  const [isNewRoomOpen, setIsNewRoomOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [formData, setFormData] = useState({
    number: "",
    type: "",
    price: "",
    status: "Available",
    maintenance: false
  });
  const [showMaintenanceAlert, setShowMaintenanceAlert] = useState(false);
  const [maintenanceRoom, setMaintenanceRoom] = useState(null);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (value:any) => {
    const selectedType:any = roomTypes.find(type => type.name === value);
    setFormData(prev => ({
      ...prev,
      type: value,
      price: selectedType.basePrice
    }));
  };

  const handleAddRoom = () => {
    const newRoom = {
      id: rooms.length + 1,
      ...formData,
      guest: null,
      checkIn: null,
      checkOut: null,
    };
    setRooms(prev => [...prev, newRoom]);
    setIsNewRoomOpen(false);
    setFormData({
      number: "",
      type: "",
      price: "",
      status: "Available",
      maintenance: false
    });
  };

  const handleEditRoom = (room:any) => {
    setEditingRoom(room);
    setFormData(room);
  };

  const handleUpdateRoom = () => {
    setRooms((prev:any) => 
      prev.map((room:any) => 
        room.id === editingRoom.id ? { ...formData, id: room.id } : room
      )
    );
    setEditingRoom(null);
    setFormData({
      number: "",
      type: "",
      price: "",
      status: "Available",
      maintenance: false
    });
  };

  const handleDeleteRoom = (id:any) => {
    const room:any = rooms.find(r => r.id === id);
    if (room.status === "Occupied") {
      alert("Cannot delete an occupied room!");
      return;
    }
    setRooms(prev => prev.filter(room => room.id !== id));
  };

  const handleMaintenanceToggle = (room:any) => {
    if (room.status === "Occupied") {
      setShowMaintenanceAlert(true);
      setMaintenanceRoom(room);
      return;
    }
    
    setRooms(prev =>
      prev.map(r =>
        r.id === room.id
          ? {
              ...r,
              maintenance: !r.maintenance,
              status: !r.maintenance ? "Maintenance" : "Available"
            }
          : r
      )
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rooms Management</h1>
          <p className="text-muted-foreground">Manage hotel rooms and their status</p>
        </div>
        <Dialog open={isNewRoomOpen} onOpenChange={setIsNewRoomOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="number">Room Number</Label>
                <Input
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Room Type</Label>
                <Select
                  name="type"
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map(type => (
                      <SelectItem key={type.name} value={type.name}>
                        {type.name} - ${type.basePrice}/night
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price per Night</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <Button onClick={handleAddRoom}>Add Room</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <h3 className="font-semibold">Total Rooms</h3>
          <p className="text-2xl font-bold">{rooms.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Available</h3>
          <p className="text-2xl font-bold text-green-600">
            {rooms.filter(r => r.status === "Available").length}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Occupied</h3>
          <p className="text-2xl font-bold text-blue-600">
            {rooms.filter(r => r.status === "Occupied").length}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Maintenance</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {rooms.filter(r => r.status === "Maintenance").length}
          </p>
        </Card>
      </div>

      {showMaintenanceAlert && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Cannot put an occupied room into maintenance mode. Please wait until the guest checks out.
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMaintenanceAlert(false)}
          >
            Dismiss
          </Button>
        </Alert>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
            <TableHead><Checkbox/></TableHead>
              <TableHead>Room Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Price/Night</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                 <TableCell><Checkbox/></TableCell>
                <TableCell>{room.number}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      room.status === "Available" ? "success" : 
                      room.status === "Occupied" ? "secondary" :
                      "warning"
                    }
                  >
                    {room.status}
                  </Badge>
                </TableCell>
                <TableCell>{room.guest || "-"}</TableCell>
                <TableCell>{room.checkIn || "-"}</TableCell>
                <TableCell>{room.checkOut || "-"}</TableCell>
                <TableCell>${room.price}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditRoom(room)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRoom(room.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={room.maintenance ? "destructive" : "secondary"}
                      size="sm"
                      onClick={() => handleMaintenanceToggle(room)}
                    >
                      {room.maintenance ? "End Maintenance" : "Start Maintenance"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Room Dialog */}
      <Dialog open={editingRoom !== null} onOpenChange={() => setEditingRoom(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="number">Room Number</Label>
              <Input
                id="number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Room Type</Label>
              <Select
                name="type"
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map(type => (
                    <SelectItem key={type.name} value={type.name}>
                      {type.name} - ${type.basePrice}/night
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price per Night</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button onClick={handleUpdateRoom}>Update Room</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}