
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users, Shield, Search, Plus } from "lucide-react";

const ResourceMapper = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [resourceType, setResourceType] = useState("all");
  const [radius, setRadius] = useState("10");

  // Mock resource data
  const resources = [
    {
      id: "1",
      name: "Red Cross Emergency Shelter",
      type: "shelter",
      locationName: "Lower East Side, NYC",
      coordinates: { lat: 40.7186, lng: -73.9831 },
      capacity: 150,
      currentOccupancy: 89,
      status: "active",
      contact: "(555) 123-4567",
      amenities: ["Food", "Medical", "Pet-friendly"],
      lastUpdated: "2025-06-18T11:30:00Z"
    },
    {
      id: "2",
      name: "NYC Emergency Medical Station",
      type: "medical",
      locationName: "Brooklyn Bridge, NYC",
      coordinates: { lat: 40.7061, lng: -73.9969 },
      capacity: 50,
      currentOccupancy: 23,
      status: "active",
      contact: "(555) 987-6543",
      amenities: ["Emergency Care", "Pharmacy", "Ambulance"],
      lastUpdated: "2025-06-18T11:15:00Z"
    },
    {
      id: "3",
      name: "Community Food Distribution",
      type: "food",
      locationName: "Central Park, NYC",
      coordinates: { lat: 40.7829, lng: -73.9654 },
      capacity: 500,
      currentOccupancy: 312,
      status: "active",
      contact: "(555) 456-7890",
      amenities: ["Hot Meals", "Water", "Baby Formula"],
      lastUpdated: "2025-06-18T10:45:00Z"
    },
    {
      id: "4",
      name: "National Guard Supply Depot",
      type: "supplies",
      locationName: "Queens, NYC",
      coordinates: { lat: 40.7282, lng: -73.7949 },
      capacity: 1000,
      currentOccupancy: 234,
      status: "active",
      contact: "(555) 321-0987",
      amenities: ["Blankets", "Clothing", "Tools", "Generators"],
      lastUpdated: "2025-06-18T09:30:00Z"
    },
    {
      id: "5",
      name: "Evacuation Staging Area",
      type: "evacuation",
      locationName: "Battery Park, NYC",
      coordinates: { lat: 40.7033, lng: -74.0170 },
      capacity: 200,
      currentOccupancy: 45,
      status: "standby",
      contact: "(555) 555-1234",
      amenities: ["Transportation", "Registration", "Communication"],
      lastUpdated: "2025-06-18T08:00:00Z"
    }
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "shelter": return "🏠";
      case "medical": return "🏥";
      case "food": return "🍽️";
      case "supplies": return "📦";
      case "evacuation": return "🚌";
      default: return "📍";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "standby": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "full": return "bg-red-100 text-red-800 border-red-200";
      case "closed": return "bg-slate-100 text-slate-800 border-slate-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getCapacityPercentage = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const filteredResources = resources.filter(resource => {
    const matchesLocation = !searchLocation || 
                           resource.locationName.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesType = resourceType === "all" || resource.type === resourceType;
    return matchesLocation && matchesType;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-500" />
          Resource Mapper
        </CardTitle>
        <CardDescription>
          Locate and manage disaster response resources using geospatial queries
        </CardDescription>
        
        {/* Search and Filter Controls */}
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search location..."
              className="pl-10"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
          <Select value={resourceType} onValueChange={setResourceType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Resource type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resources</SelectItem>
              <SelectItem value="shelter">Shelters</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="supplies">Supplies</SelectItem>
              <SelectItem value="evacuation">Evacuation</SelectItem>
            </SelectContent>
          </Select>
          <Select value={radius} onValueChange={setRadius}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 km</SelectItem>
              <SelectItem value="10">10 km</SelectItem>
              <SelectItem value="25">25 km</SelectItem>
              <SelectItem value="50">50 km</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Resource
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {resources.filter(r => r.type === "shelter").length}
            </div>
            <div className="text-sm text-blue-600">Active Shelters</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {resources.filter(r => r.type === "medical").length}
            </div>
            <div className="text-sm text-green-600">Medical Facilities</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {resources.reduce((sum, r) => sum + r.capacity, 0).toLocaleString()}
            </div>
            <div className="text-sm text-purple-600">Total Capacity</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(resources.reduce((sum, r) => sum + (r.currentOccupancy / r.capacity), 0) / resources.length * 100)}%
            </div>
            <div className="text-sm text-orange-600">Avg. Utilization</div>
          </div>
        </div>

        {/* Resource List */}
        <div className="space-y-4">
          {filteredResources.map((resource) => {
            const capacityPercentage = getCapacityPercentage(resource.currentOccupancy, resource.capacity);
            
            return (
              <div key={resource.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getResourceIcon(resource.type)}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{resource.name}</h3>
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="h-4 w-4" />
                        <span>{resource.locationName}</span>
                        <span className="text-sm">
                          ({resource.coordinates.lat.toFixed(4)}, {resource.coordinates.lng.toFixed(4)})
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(resource.status)}>
                    {resource.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Capacity Indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Capacity: {resource.currentOccupancy} / {resource.capacity}
                    </span>
                    <span className="font-medium">{capacityPercentage}% full</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getCapacityColor(capacityPercentage)}`}
                      style={{ width: `${capacityPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2">
                  {resource.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>

                {/* Contact and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="text-sm text-slate-600">
                    📞 {resource.contact} • Updated {new Date(resource.lastUpdated).toLocaleTimeString()}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Navigate
                    </Button>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No resources found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceMapper;
