
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { MapPin, AlertTriangle, Users, Shield, Search, Bell, Image, Calendar } from "lucide-react";
import DisasterForm from "@/components/DisasterForm";
import DisasterList from "@/components/DisasterList";
import SocialMediaMonitor from "@/components/SocialMediaMonitor";
import ResourceMapper from "@/components/ResourceMapper";
import ImageVerification from "@/components/ImageVerification";
import LocationExtractor from "@/components/LocationExtractor";
import { UserCircle, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";

const Index = () => {
  const [activeDisaster, setActiveDisaster] = useState(null);
  const [realtimeUpdates, setRealtimeUpdates] = useState(0);
  const user = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Disaster Response Platform</h1>
                <p className="text-sm text-slate-600">Real-time coordination and response management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live
              </Badge>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-1" />
                Alerts ({realtimeUpdates})
              </Button>
              {user ? (
                <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
                  <UserCircle className="h-6 w-6 text-slate-700" />
                  <span className="text-base font-semibold">{user.username} { ", " + user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogin}
                  className="flex items-center space-x-1 text-slate-700"
                >
                  <LogIn className="h-5 w-5" />
                  <span className="text-sm font-medium">Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Active Disasters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">12</span>
                <AlertTriangle className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Resources Deployed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">247</span>
                <MapPin className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">People Assisted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">1,847</span>
                <Users className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Verified Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">89%</span>
                <Shield className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Alerts */}
        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">High Priority Alert</AlertTitle>
          <AlertDescription className="text-red-700">
            Severe flooding reported in Manhattan, NYC. Multiple evacuation centers activated.
            <Button variant="link" className="text-red-600 p-0 ml-2 h-auto">
              View Details →
            </Button>
          </AlertDescription>
        </Alert>

        {/* Main Tabs Interface */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white border border-slate-200 p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="disasters" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Disasters
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Social Monitor
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Verification
            </TabsTrigger>
            <TabsTrigger value="geocoding" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">NYC Flood - Status Updated</p>
                      <p className="text-sm text-slate-600">Emergency shelters at capacity</p>
                    </div>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">New Resource Deployed</p>
                      <p className="text-sm text-slate-600">Medical team dispatched to Brooklyn</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">Image Verification Complete</p>
                      <p className="text-sm text-slate-600">Flood damage photos authenticated</p>
                    </div>
                    <Badge variant="secondary">Verified</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>API Response Time</span>
                      <span className="text-green-600">Optimal</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Database Performance</span>
                      <span className="text-green-600">Good</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>External API Health</span>
                      <span className="text-yellow-600">Warning</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="disasters">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <DisasterForm />
              </div>
              <div className="lg:col-span-2">
                <DisasterList />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social">
            <SocialMediaMonitor />
          </TabsContent>

          <TabsContent value="resources">
            <ResourceMapper />
          </TabsContent>

          <TabsContent value="verification">
            <ImageVerification />
          </TabsContent>

          <TabsContent value="geocoding">
            <LocationExtractor />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
