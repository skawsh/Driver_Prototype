
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, ChevronDown, ChevronUp, Clock, MapPin, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for order history
const orderHistory = [
  {
    id: '3456',
    customerName: 'Emma Wilson',
    address: '321 Elm St, San Francisco, CA',
    items: 4,
    completedAt: '2023-05-15T14:30:00',
    status: 'Delivered',
  },
  {
    id: '7890',
    customerName: 'David Lee',
    address: '654 Oak St, San Francisco, CA',
    items: 2,
    completedAt: '2023-05-14T12:15:00',
    status: 'Delivered',
  },
  {
    id: '1235',
    customerName: 'Jessica Chen',
    address: '987 Pine St, San Francisco, CA',
    items: 3,
    completedAt: '2023-05-12T16:45:00',
    status: 'Canceled',
  },
  {
    id: '6789',
    customerName: 'Robert Kim',
    address: '246 Cedar St, San Francisco, CA',
    items: 1,
    completedAt: '2023-05-10T11:20:00',
    status: 'Delivered',
  },
  {
    id: '0123',
    customerName: 'Olivia Martinez',
    address: '135 Spruce St, San Francisco, CA',
    items: 5,
    completedAt: '2023-05-08T15:10:00',
    status: 'Delivered',
  }
];

const HistoryOrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">Order #{order.id}</CardTitle>
          <Badge variant={order.status === 'Delivered' ? 'default' : 'destructive'}>
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(order.completedAt)}</span>
            </div>
            
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="p-1 rounded-md hover:bg-secondary text-muted-foreground"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
          
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="pt-2"
            >
              <Separator className="mb-3" />
              
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="flex-1">{order.customerName}</span>
                </div>
                
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="flex-1">{order.address}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{order.items} items</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const OrderHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const filteredOrders = orderHistory.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.id.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-1">Order History</h1>
        <p className="text-muted-foreground mb-6">View your past deliveries</p>
      </motion.div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredOrders.length === 0 ? (
        <Card className="w-full p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <Search className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-xl font-medium">No matching orders found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <HistoryOrderCard order={order} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
