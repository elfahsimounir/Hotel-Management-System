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
import { Plus, Edit, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";


const initialUsers = [
  { id: 1, name: "Ahmed Hassan", role: "Admin", email: "ahmed@sahara.com", status: "Active", lastLogin: "2024-03-20 10:30" },
  { id: 2, name: "Sara Ahmed", role: "Receptionist", email: "sara@sahara.com", status: "Active", lastLogin: "2024-03-20 09:15" },
  { id: 3, name: "Mohammed Ali", role: "Restaurant Manager", email: "mohammed@sahara.com", status: "Active", lastLogin: "2024-03-20 08:45" },
  { id: 4, name: "Fatima Omar", role: "Billing Agent", email: "fatima@sahara.com", status: "Inactive", lastLogin: "2024-03-19 17:30" },
];

const roles = [
  "Admin",
  "Receptionist",
  "Restaurant Manager",
  "Billing Agent",
  "Housekeeping",
  "Maintenance"
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active"
  });

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      ...formData,
      lastLogin: new Date().toLocaleString()
    };
    setUsers(prev => [...prev, newUser]);
    setIsNewUserOpen(false);
    setFormData({
      name: "",
      email: "",
      role: "",
      status: "Active"
    });
  };

  const handleEditUser = (user:any) => {
    setEditingUser(user);
    setFormData(user);
  };

  const handleUpdateUser = () => {
    setUsers(prev => 
      prev.map(user => 
        user.id === editingUser.id ? { ...formData, id: user.id, lastLogin: user.lastLogin } : user
      )
    );
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "",
      status: "Active"
    });
  };

  const handleDeleteUser = (id:any) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const handleStatusChange = (id:any, newStatus:any) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground">Manage system users and their roles</p>
        </div>
        <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  name="role"
                  onValueChange={(value) => handleInputChange({ target: { name: 'role', value }})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddUser}>Create User</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <h3 className="font-semibold">Total Users</h3>
          <p className="text-2xl font-bold">{users.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Active Users</h3>
          <p className="text-2xl font-bold text-green-600">
            {users.filter(u => u.status === "Active").length}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Inactive Users</h3>
          <p className="text-2xl font-bold text-red-600">
            {users.filter(u => u.status === "Inactive").length}
          </p>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
            
            <TableHead><Checkbox/></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell><Checkbox/></TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>
                  <Select 
                    defaultValue={user.role}
                    onValueChange={(value) => {
                      setUsers(prev =>
                        prev.map(u =>
                          u.id === user.id ? { ...u, role: value } : u
                        )
                      );
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue>{user.role}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={user.status}
                    onValueChange={(value) => handleStatusChange(user.id, value)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue>
                        <Badge 
                          variant={user.status === "Active" ? "success" : "destructive"}
                        >
                          {user.status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editingUser !== null} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                name="role"
                value={formData.role}
                onValueChange={(value) => handleInputChange({ target: { name: 'role', value }})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleUpdateUser}>Update User</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}