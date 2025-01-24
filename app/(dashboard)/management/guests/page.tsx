"use client";

import React, { useState } from 'react';
import { Download, Edit, Trash2, UserPlus, Check, X } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  marital_status: string;
  id_card_number: string;
  image_url?: string;
  check_in_date: string;
  check_out_date?: string;
}

function GuestManagement() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGuest, setCurrentGuest] = useState<Partial<Guest>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      let imageUrl = currentGuest.image_url;
      
      if (imageFile) {
        // In a real app, this would upload to a server
        // Here we just create an object URL for demo purposes
        imageUrl = URL.createObjectURL(imageFile);
      }

      const newGuest = {
        ...currentGuest,
        id: currentGuest.id || Math.random().toString(36).substr(2, 9),
        image_url: imageUrl,
      };

      if (currentGuest.id) {
        setGuests(guests.map(g => g.id === currentGuest.id ? newGuest as Guest : g));
      } else {
        setGuests([...guests, newGuest as Guest]);
      }

    //   toast.success(currentGuest.id ? 'Guest updated successfully' : 'Guest added successfully');
      setIsModalOpen(false);
      setCurrentGuest({});
      setImageFile(null);
    } catch (error) {
    //   toast.error('Error saving guest');
      console.error(error);
    }
  }

  function handleDelete(id: string) {
    setGuests(guests.filter(g => g.id !== id));
    // toast.success('Guest deleted successfully');
  }

  function generatePDF(selectedOnly: boolean = false) {
    const doc = new jsPDF();
    const guestsToExport = selectedOnly
      ? guests.filter(guest => selectedGuests.includes(guest.id))
      : guests;

    doc.setFontSize(20);
    doc.text('Hotel Guest Report', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('For Security Purposes', 105, 25, { align: 'center' });
    doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 105, 35, { align: 'center' });

    const tableData = guestsToExport.map(guest => [
      guest.first_name,
      guest.last_name,
      guest.marital_status,
      guest.id_card_number,
      format(new Date(guest.check_in_date), 'dd/MM/yyyy'),
      guest.check_out_date ? format(new Date(guest.check_out_date), 'dd/MM/yyyy') : 'N/A'
    ]);

    (doc as any).autoTable({
      head: [['First Name', 'Last Name', 'Marital Status', 'ID Card', 'Check In', 'Check Out']],
      body: tableData,
      startY: 45,
      styles: { fontSize: 10, cellPadding: 5 },
      headStyles: { fillColor: [66, 66, 66] },
    });

    doc.save(`guest-report-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.pdf`);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Guest Management</h1>
        <button
          onClick={() => {
            setCurrentGuest({});
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Guest
        </button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <button
                onClick={() => generatePDF(true)}
                disabled={selectedGuests.length === 0}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </button>
              <button
                onClick={() => generatePDF(false)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export All
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedGuests.length === guests.length}
                    onChange={(e) => {
                      setSelectedGuests(
                        e.target.checked ? guests.map(g => g.id) : []
                      );
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Card
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In/Out
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {guests.map((guest) => (
                <tr key={guest.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedGuests.includes(guest.id)}
                      onChange={(e) => {
                        setSelectedGuests(
                          e.target.checked
                            ? [...selectedGuests, guest.id]
                            : selectedGuests.filter(id => id !== guest.id)
                        );
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {guest.image_url ? (
                        <img
                          src={guest.image_url}
                          alt={`${guest.first_name} ${guest.last_name}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            {guest.first_name[0]}
                            {guest.last_name[0]}
                          </span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {guest.first_name} {guest.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{guest.id_card_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {guest.marital_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>In: {format(new Date(guest.check_in_date), 'dd/MM/yyyy')}</div>
                    {guest.check_out_date && (
                      <div>Out: {format(new Date(guest.check_out_date), 'dd/MM/yyyy')}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setCurrentGuest(guest);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(guest.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {currentGuest.id ? 'Edit Guest' : 'Add New Guest'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCurrentGuest({});
                  setImageFile(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <Input
                    type="text"
                    required
                    value={currentGuest.first_name || ''}
                    onChange={(e) => setCurrentGuest({ ...currentGuest, first_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    required
                    value={currentGuest.last_name || ''}
                    onChange={(e) => setCurrentGuest({ ...currentGuest, last_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID Card Number
                </label>
                <Input
                  type="text"
                  required
                  value={currentGuest.id_card_number || ''}
                  onChange={(e) => setCurrentGuest({ ...currentGuest, id_card_number: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Marital Status
                </label>
                <div className='border rounded-md overflow-hidden'>
                <select
                  required
                  value={currentGuest.marital_status || ''}
                  onChange={(e) => setCurrentGuest({ ...currentGuest, marital_status: e.target.value })}
                  className="block w-full py-2 px-4 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
                </div>
                
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Check In Date
                  </label>
                  <Input
                    type="date"
                    required
                    value={currentGuest.check_in_date?.split('T')[0] || ''}
                    onChange={(e) => setCurrentGuest({ ...currentGuest, check_in_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Check Out Date
                  </label>
                  <Input
                    type="date"
                    value={currentGuest.check_out_date?.split('T')[0] || ''}
                    onChange={(e) => setCurrentGuest({ ...currentGuest, check_out_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentGuest({});
                    setImageFile(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {currentGuest.id ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuestManagement;