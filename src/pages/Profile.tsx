
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Car, 
  Clock, 
  Edit, 
  MapPin, 
  Medal, 
  Package, 
  Phone, 
  Star, 
  Truck 
} from 'lucide-react';

// Mock data for profile
const profileData = {
  name: 'Alex Johnson',
  avatar: 'https://i.pravatar.cc/300',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  address: 'San Francisco, CA',
  vehicle: 'Toyota Prius (2018)',
  licensePlate: 'ABC123',
  deliveriesMade: 1248,
  rating: 4.9,
  memberSince: 'March 2021',
  currentStatus: 'Active',
  badges: ['Top Driver', 'Fast Delivery', 'Customer Favorite']
};

const StatsCard = ({ icon: Icon, label, value }) => {
  return (
    <Card>
      <CardContent className="p-4 flex items-center space-x-4">
        <div className="bg-primary/10 p-2 rounded-full">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const Profile = () => {
  return (
    <div className="py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-1">My Profile</h1>
        <p className="text-muted-foreground mb-6">View and manage your driver profile</p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="relative">
            <CardHeader className="pb-0 pt-6 text-center">
              <div className="mx-auto mb-3">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{profileData.name}</CardTitle>
              <div className="flex justify-center mt-2 space-x-1">
                {Array(5).fill(0).map((_, index) => (
                  <Star 
                    key={index} 
                    className={`h-4 w-4 ${index < Math.floor(profileData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
                  />
                ))}
                <span className="ml-1 text-sm font-medium">{profileData.rating}</span>
              </div>
              <Badge className="absolute top-4 right-4" variant={profileData.currentStatus === 'Active' ? 'default' : 'outline'}>
                {profileData.currentStatus}
              </Badge>
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{profileData.phone}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{profileData.address}</span>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Car className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{profileData.vehicle} ({profileData.licensePlate})</span>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">Member since {profileData.memberSince}</span>
                </div>
                
                <Separator />
                
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Achievements</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <Medal className="h-3 w-3 mr-1" />
                        <span>{badge}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Stats & Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard 
              icon={Package} 
              label="Deliveries" 
              value={profileData.deliveriesMade} 
            />
            <StatsCard 
              icon={Star} 
              label="Rating" 
              value={profileData.rating} 
            />
            <StatsCard 
              icon={Truck} 
              label="Vehicle" 
              value={profileData.vehicle.split(' ')[0]} 
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* This would be a good place for performance charts or graphs */}
                <div className="bg-secondary rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">Performance data visualization would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* This would be a good place for upcoming shifts or schedules */}
                <div className="bg-secondary rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">Calendar or schedule information would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
