import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, MapPin, Package, User } from 'lucide-react';

// Mock data for assigned orders with Hyderabad addresses
const assignedOrders = [
  {
    id: '1234',
    customerName: 'Raj Sharma',
    address: '123 Jubilee Hills, Hyderabad, Telangana 500033',
    items: 3,
    estimatedTime: '30 min',
    status: 'Ready for pickup',
  },
  {
    id: '5678',
    customerName: 'Priya Patel',
    address: '456 Banjara Hills, Hyderabad, Telangana 500034',
    items: 2,
    estimatedTime: '45 min',
    status: 'Preparing',
  },
  {
    id: '9012',
    customerName: 'Arjun Reddy',
    address: '789 Gachibowli, Hyderabad, Telangana 500032',
    items: 1,
    estimatedTime: '15 min',
    status: 'Ready for pickup',
  },
  {
    id: '3456',
    customerName: 'Lakshmi Devi',
    address: '234 Madhapur, HITEC City, Hyderabad, Telangana 500081',
    items: 4,
    estimatedTime: '25 min',
    status: 'Ready for pickup',
  },
  {
    id: '7890',
    customerName: 'Vikram Singh',
    address: '567 Kukatpally, Hyderabad, Telangana 500072',
    items: 2,
    estimatedTime: '40 min',
    status: 'Preparing',
  }
];

const OrderCard = ({ order, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-medium">Order #{order.id}</CardTitle>
            <Badge variant={order.status === 'Ready for pickup' ? 'default' : 'secondary'}>
              {order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="flex-1">{order.customerName}</span>
            </div>
            
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="flex-1">{order.address}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between pt-1">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>{order.items} items</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{order.estimatedTime}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Index = () => {
  return (
    <div className="py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-1">Assigned Orders</h1>
        <p className="text-muted-foreground mb-6">View and manage your current delivery orders</p>
      </motion.div>
      
      {assignedOrders.length === 0 ? (
        <Card className="w-full p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <Package className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-xl font-medium">No orders assigned</h3>
            <p className="text-muted-foreground">When you receive new orders, they will appear here.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedOrders.map((order, index) => (
            <OrderCard key={order.id} order={order} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
