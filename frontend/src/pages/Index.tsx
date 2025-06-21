
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
import WelcomeModal from "@/components/WelcomeModal";
import { UserCircle, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";

const Index = () => {
  const [activeDisaster, setActiveDisaster] = useState(null);
  const [realtimeUpdates, setRealtimeUpdates] = useState(0);
  const { username, role } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <WelcomeModal />
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
              {username ? (
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 cursor-pointer">
                    <UserCircle className="h-6 w-6 text-slate-700" />
                    <span className="text-base font-semibold">
                      {username + ", " + role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
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

        {/* Main Tabs Interface */}
        <Tabs defaultValue="disasters" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white border border-slate-200 p-1">
            {/* <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Dashboard
            </TabsTrigger> */}
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



          <TabsContent value="disasters">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <DisasterForm activeDisaster={activeDisaster} setActiveDisaster={setActiveDisaster} />
              </div>
              <div className="lg:col-span-2">
                <DisasterList setActiveDisaster={setActiveDisaster} />
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
