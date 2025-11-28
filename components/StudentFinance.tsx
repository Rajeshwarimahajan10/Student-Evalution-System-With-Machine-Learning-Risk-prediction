'use client';

import { useState, useEffect } from 'react';
import { DollarSign, CreditCard, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface FinancialRecord {
  id: string;
  feeType: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
}

export default function StudentFinance() {
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFinancialRecords([
        {
          id: '1',
          feeType: 'Tuition Fee',
          amount: 50000,
          dueDate: '2024-01-31',
          paidDate: '2024-01-15',
          status: 'paid',
          description: 'Semester 1 Tuition Fee'
        },
        {
          id: '2',
          feeType: 'Library Fee',
          amount: 2000,
          dueDate: '2024-02-15',
          status: 'pending',
          description: 'Annual Library Membership'
        },
        {
          id: '3',
          feeType: 'Lab Fee',
          amount: 5000,
          dueDate: '2024-01-20',
          status: 'overdue',
          description: 'Computer Lab Equipment Fee'
        },
        {
          id: '4',
          feeType: 'Examination Fee',
          amount: 3000,
          dueDate: '2024-03-01',
          status: 'pending',
          description: 'Mid-term Examination Fee'
        },
        {
          id: '5',
          feeType: 'Sports Fee',
          amount: 1500,
          dueDate: '2024-01-10',
          paidDate: '2024-01-08',
          status: 'paid',
          description: 'Annual Sports Activities Fee'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const totalPaid = financialRecords
    .filter(record => record.status === 'paid')
    .reduce((sum, record) => sum + record.amount, 0);

  const totalPending = financialRecords
    .filter(record => record.status === 'pending')
    .reduce((sum, record) => sum + record.amount, 0);

  const totalOverdue = financialRecords
    .filter(record => record.status === 'overdue')
    .reduce((sum, record) => sum + record.amount, 0);

  const totalAmount = financialRecords.reduce((sum, record) => sum + record.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Financial Records</h2>
            <p className="text-gray-600">Track your fees and payments</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-3xl font-bold text-blue-600">
              ₹{totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{totalPaid.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                ₹{totalPending.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{totalOverdue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-center">
            <div className="glass-card p-3 mr-4">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Balance</p>
              <p className="text-2xl font-bold text-blue-600">
                ₹{(totalPending + totalOverdue).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Fee Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Paid Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {financialRecords.map((record) => (
                <tr key={record.id} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-800">{record.feeType}</p>
                      <p className="text-sm text-gray-600">{record.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-800">₹{record.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{record.dueDate}</td>
                  <td className="py-3 px-4 text-gray-700">
                    {record.paidDate || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span className="ml-1 capitalize">{record.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {record.status === 'pending' || record.status === 'overdue' ? (
                      <button className="glass-button px-3 py-1 text-sm text-blue-600 hover:bg-blue-50">
                        Pay Now
                      </button>
                    ) : (
                      <button className="glass-button px-3 py-1 text-sm text-gray-600" disabled>
                        Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="glass-button p-4 text-center hover:bg-white/30 transition-colors">
            <CreditCard className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-gray-800">Credit/Debit Card</p>
            <p className="text-sm text-gray-600">Pay with your card</p>
          </button>
          <button className="glass-button p-4 text-center hover:bg-white/30 transition-colors">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-gray-800">Net Banking</p>
            <p className="text-sm text-gray-600">Online banking</p>
          </button>
          <button className="glass-button p-4 text-center hover:bg-white/30 transition-colors">
            <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-gray-800">UPI Payment</p>
            <p className="text-sm text-gray-600">Quick UPI transfer</p>
          </button>
        </div>
      </div>
    </div>
  );
}
