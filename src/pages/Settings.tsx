
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  BellRing, 
  Moon, 
  Radio, 
  Save,
  Volume2, 
  VolumeX
} from 'lucide-react';

const SettingItem = ({ title, description, children }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4">
      <div className="mb-2 sm:mb-0">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center">
        {children}
      </div>
    </div>
  );
};

const Settings = () => {
  return (
    <div className="py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground mb-6">Customize your app preferences</p>
      </motion.div>
      
      <div className="space-y-6">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BellRing className="h-5 w-5 mr-2" />
                Notifications
              </CardTitle>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                <SettingItem 
                  title="New Order Alerts"
                  description="Receive notifications when you get a new order"
                >
                  <Switch defaultChecked />
                </SettingItem>
                
                <Separator />
                
                <SettingItem 
                  title="Order Updates"
                  description="Get notified about changes to your active orders"
                >
                  <Switch defaultChecked />
                </SettingItem>
                
                <Separator />
                
                <SettingItem 
                  title="Delivery Reminders"
                  description="Receive reminders about upcoming deliveries"
                >
                  <Switch defaultChecked />
                </SettingItem>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Display & Sound */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Moon className="h-5 w-5 mr-2" />
                Display & Sound
              </CardTitle>
              <CardDescription>Adjust appearance and audio settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                <SettingItem 
                  title="Dark Mode"
                  description="Switch between light and dark themes"
                >
                  <Switch />
                </SettingItem>
                
                <Separator />
                
                <SettingItem 
                  title="Sound Effects"
                  description="Play sounds for notifications and actions"
                >
                  <Switch defaultChecked />
                </SettingItem>
                
                <Separator />
                
                <SettingItem 
                  title="Volume"
                  description="Adjust notification volume"
                >
                  <div className="flex items-center space-x-2">
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                    <input type="range" className="w-24" defaultValue={75} />
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </SettingItem>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Navigation & Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Radio className="h-5 w-5 mr-2" />
                Navigation & Location
              </CardTitle>
              <CardDescription>Configure mapping and location preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="nav-app">Default Navigation App</Label>
                  <Select defaultValue="google">
                    <SelectTrigger id="nav-app">
                      <SelectValue placeholder="Select navigation app" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Maps</SelectItem>
                      <SelectItem value="apple">Apple Maps</SelectItem>
                      <SelectItem value="waze">Waze</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="distance-unit">Distance Unit</Label>
                  <Select defaultValue="miles">
                    <SelectTrigger id="distance-unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="miles">Miles</SelectItem>
                      <SelectItem value="kilometers">Kilometers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Location Tracking</h3>
                    <p className="text-sm text-muted-foreground">Allow location access while on duty</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="alex.johnson@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="San Francisco, CA" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Vehicle Model</Label>
                    <Input id="vehicle" defaultValue="Toyota Prius (2018)" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="license">License Plate</Label>
                    <Input id="license" defaultValue="ABC123" />
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button type="submit" className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
