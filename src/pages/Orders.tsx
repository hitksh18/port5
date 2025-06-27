import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }>;
}

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 4999,
      items: [
        {
          id: '1',
          name: 'Premium Cotton T-Shirt',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
          quantity: 2,
          price: 1999
        },
        {
          id: '2',
          name: 'Designer Jeans',
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
          quantity: 1,
          price: 3000
        }
      ]
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      status: 'shipped',
      total: 2999,
      items: [
        {
          id: '3',
          name: 'Luxury Hoodie',
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
          quantity: 1,
          price: 2999
        }
      ]
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'processing':
        return <Package className="text-blue-500" size={20} />;
      case 'shipped':
        return <Truck className="text-purple-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Login Required</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Please login to view your orders</p>
          <Button onClick={() => navigate('/')} className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Order History</h1>
            <p className="text-gray-600 dark:text-gray-300">Track and manage your orders</p>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order {order.id}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">₹{order.total}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Quantity: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        ₹{item.quantity * item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                  Track Order
                </Button>
                <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                  View Details
                </Button>
                {order.status === 'delivered' && (
                  <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                    Reorder
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Start shopping to see your orders here</p>
            <Button onClick={() => navigate('/catalog')} className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Browse Collection
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;