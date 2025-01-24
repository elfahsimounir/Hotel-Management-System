"use client";

import { useState, useMemo } from "react";
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
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { 
  format, 
  addDays, 
  subDays,
  startOfWeek, 
  endOfWeek, 
  startOfMonth,
  endOfMonth,
  eachDayOfInterval, 
  addWeeks, 
  subWeeks,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  parseISO
} from "date-fns";

const initialReservations = [
  { 
    id: "RES001", 
    guest: "John Smith", 
    room: "301", 
    checkIn: "2024-03-20", 
    checkOut: "2024-03-25", 
    status: "Active",
    payment: "Paid",
    total: 1000
  },
  { 
    id: "RES002", 
    guest: "Maria Garcia", 
    room: "102", 
    checkIn: "2024-03-22", 
    checkOut: "2024-03-24", 
    status: "Upcoming",
    payment: "Pending",
    total: 400
  },
  { 
    id: "RES003", 
    guest: "Ahmed Hassan", 
    room: "401", 
    checkIn: "2024-03-19", 
    checkOut: "2024-03-21", 
    status: "Completed",
    payment: "Paid",
    total: 600
  },
];

const availableRooms = [
  { number: "101", type: "Normal", price: 100 },
  { number: "102", type: "Normal", price: 100 },
  { number: "201", type: "Triple", price: 150 },
  { number: "301", type: "Suite", price: 200 },
  { number: "401", type: "Junior", price: 180 },
];

interface CalendarCellProps {
  date: Date;
  room: typeof availableRooms[0];
  reservations: typeof initialReservations;
  onCellClick: (room: typeof availableRooms[0], date: Date) => void;
  isCurrentMonth?: boolean;
}

function CalendarCell({ date, room, reservations, onCellClick, isCurrentMonth = true }: CalendarCellProps) {
  const reservation = reservations.find(
    (r) => 
      r.room === room.number &&
      new Date(r.checkIn) <= date &&
      new Date(r.checkOut) >= date
  );

  const isAvailable = !reservation;
  const cellStyle = `
    border p-2 relative min-h-[80px] 
    ${isAvailable ? "hover:bg-secondary cursor-pointer" : "bg-primary/10"}
    ${!isCurrentMonth ? "text-muted-foreground bg-muted/50" : ""}
  `;

  return (
    <td 
      className={cellStyle}
      onClick={() => isAvailable && isCurrentMonth && onCellClick(room, date)}
    >
      <div className="text-xs">{format(date, 'MMM d')}</div>
      {reservation && (
        <div className="mt-1">
          <Badge 
            variant={
              reservation.status === "Active" ? "default" :
              reservation.status === "Upcoming" ? "secondary" :
              "outline"
            }
            className="w-full justify-center"
          >
            {reservation.guest}
          </Badge>
        </div>
      )}
    </td>
  );
}

export default function ReservationsPage() {
  const [view, setView] = useState<"day" | "week" | "month" >("week");
  const [selectedValue, setSelectedValue] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState(initialReservations);
  const [selectedRoom, setSelectedRoom] = useState<typeof availableRooms[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);
  const [formData, setFormData] = useState({
    guest: "",
    room: "",
    checkIn: "",
    checkOut: "",
    status: "Upcoming",
    payment: "Pending",
    total: ""
  });

  const calendarDays = useMemo(() => {
    switch (view) {
      case "day":
        return [currentDate];
      case "week":
        return eachDayOfInterval({
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate)
        });
      case "month":
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const start = startOfWeek(monthStart);
        const end = endOfWeek(monthEnd);
        return eachDayOfInterval({ start, end });
      default:
        return [];
    }
  }, [currentDate, view]);

  const handlePrevious = () => {
    switch (view) {
      case "day":
        setCurrentDate(prev => subDays(prev, 1));
        break;
      case "week":
        setCurrentDate(prev => subWeeks(prev, 1));
        break;
      case "month":
        setCurrentDate(prev => subMonths(prev, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case "day":
        setCurrentDate(prev => addDays(prev, 1));
        break;
      case "week":
        setCurrentDate(prev => addWeeks(prev, 1));
        break;
      case "month":
        setCurrentDate(prev => addMonths(prev, 1));
        break;
    }
  };

  const getDateRangeText = () => {
    switch (view) {
      case "day":
        return format(currentDate, 'MMMM d, yyyy');
      case "week":
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case "month":
        return format(currentDate, 'MMMM yyyy');
      default:
        return "";
    }
  };

  const handleCellClick = (room: typeof availableRooms[0], date: Date) => {
    setSelectedRoom(room);
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      room: room.number,
      checkIn: format(date, 'yyyy-MM-dd'),
      checkOut: format(addDays(date, 1), 'yyyy-MM-dd'),
      total: room.price.toString()
    }));
    setIsNewReservationOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if ((name === 'checkIn' || name === 'checkOut') && selectedRoom) {
      const checkIn = name === 'checkIn' ? value : formData.checkIn;
      const checkOut = name === 'checkOut' ? value : formData.checkOut;
      
      if (checkIn && checkOut) {
        const days = Math.ceil(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 
          (1000 * 60 * 60 * 24)
        );
        const total = days * selectedRoom.price;
        setFormData(prev => ({
          ...prev,
          total: total.toString()
        }));
      }
    }
  };

  const handleAddReservation = () => {
    const newReservation = {
      id: `RES${String(reservations.length + 1).padStart(3, '0')}`,
      ...formData,
      total: Number(formData.total)
    };
    setReservations(prev => [...prev, newReservation]);
    setIsNewReservationOpen(false);
    setFormData({
      guest: "",
      room: "",
      checkIn: "",
      checkOut: "",
      status: "Upcoming",
      payment: "Pending",
      total: ""
    });
    setSelectedRoom(null);
    setSelectedDate(null);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setReservations(prev =>
      prev.map(res =>
        res.id === id ? { ...res, status: newStatus } : res
      )
    );
  };

  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Room Calendar</h1>
          <p className="text-muted-foreground">Manage room reservations</p>
        </div>
        <div className="flex items-center gap-4">
          <Tabs value={view}   onValueChange={(v) => setView(v as "day" | "week" | "month")}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium min-w-[200px] text-center">
              {getDateRangeText()}
            </span>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="border p-2">Room</th>
              {calendarDays.map((day) => (
                <th key={day.toISOString()} className="border p-2">
                  <div>{format(day, view === "month" ? 'EEE' : 'EEE d')}</div>
                  {view === "month" && (
                    <div className="text-xs text-muted-foreground">
                      {format(day, 'MMM d')}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {availableRooms.map((room) => (
              <tr key={room.number}>
                <td className="border p-2">
                  <div className="font-medium">Room {room.number}</div>
                  <div className="text-sm text-muted-foreground">{room.type}</div>
                  <div className="text-sm">${room.price}/night</div>
                </td>
                {calendarDays.map((day) => (
                  <CalendarCell
                    key={day.toISOString()}
                    date={day}
                    room={room}
                    reservations={reservations}
                    onCellClick={handleCellClick}
                    isCurrentMonth={view !== "month" || isSameMonth(day, currentDate)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isNewReservationOpen} onOpenChange={setIsNewReservationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Reservation</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">

       <div className="grid gap-2">
  <Label htmlFor="guest">Guest Name</Label>
  <Select
    value={formData.guest} 
    onValueChange={(value) =>
      setFormData((prev) => ({
        ...prev,
        guest: value, 
      }))
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="Select a guest" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="John Smith">John Smith</SelectItem>
      <SelectItem value="Maria Garcia">Maria Garcia</SelectItem>
      <SelectItem value="Ahmed Hassan">Ahmed Hassan</SelectItem>
      <SelectItem value="New Guest">New Guest</SelectItem>
    </SelectContent>
  </Select>


            </div>
            {selectedRoom && (
              <div className="grid gap-2">
                <Label>Selected Room</Label>
                <div className="font-medium">
                  Room {selectedRoom.number} - {selectedRoom.type}
                  <div className="text-sm text-muted-foreground">
                    ${selectedRoom.price}/night
                  </div>
                </div>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="checkIn">Check In</Label>
              <Input
                id="checkIn"
                name="checkIn"
                type="date"
                value={formData.checkIn}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="checkOut">Check Out</Label>
              <Input
                id="checkOut"
                name="checkOut"
                type="date"
                value={formData.checkOut}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label>Total Amount</Label>
              <div className="font-medium">${formData.total}</div>
            </div>
          </div>
          <Button 
            onClick={handleAddReservation}
            disabled={!formData.guest || !formData.checkIn || !formData.checkOut}
          >
            Create Reservation
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}