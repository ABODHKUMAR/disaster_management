
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MapPin, Search, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LocationExtractor = () => {
  const [description, setDescription] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedLocations, setExtractedLocations] = useState([]);
  const [manualLocation, setManualLocation] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingResult, setGeocodingResult] = useState(null);
  const { toast } = useToast();

  // Mock extraction history
  const extractionHistory = [
    {
      id: "1",
      originalText: "Severe flooding reported in Lower Manhattan, NYC. Water levels rising near Wall Street and Battery Park.",
      extractedLocations: [
        { name: "Lower Manhattan, NYC", confidence: 95, coordinates: { lat: 40.7074, lng: -74.0113 } },
        { name: "Wall Street, NYC", confidence: 88, coordinates: { lat: 40.7074, lng: -74.0113 } },
        { name: "Battery Park, NYC", confidence: 92, coordinates: { lat: 40.7033, lng: -74.0170 } }
      ],
      timestamp: "2025-06-18T11:30:00Z"
    },
    {
      id: "2",
      originalText: "Emergency evacuation needed in Venice Beach, California due to approaching wildfire.",
      extractedLocations: [
        { name: "Venice Beach, California", confidence: 97, coordinates: { lat: 33.9850, lng: -118.4695 } }
      ],
      timestamp: "2025-06-18T10:15:00Z"
    }
  ];

  const handleLocationExtraction = async () => {
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description to extract locations from.",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    
    // Simulate AI extraction delay
    setTimeout(() => {
      const mockLocations = [
        { 
          name: "Manhattan, NYC", 
          confidence: 94,
          coordinates: { lat: 40.7831, lng: -73.9712 }
        },
        { 
          name: "Brooklyn Bridge", 
          confidence: 87,
          coordinates: { lat: 40.7061, lng: -73.9969 }
        }
      ];

      setExtractedLocations(mockLocations);
      setIsExtracting(false);

      toast({
        title: "Location Extraction Complete",
        description: `Found ${mockLocations.length} locations in the text.`,
      });
    }, 2000);
  };

  const handleManualGeocoding = async () => {
    if (!manualLocation.trim()) {
      toast({
        title: "Error",
        description: "Please enter a location to geocode.",
        variant: "destructive"
      });
      return;
    }

    setIsGeocoding(true);
    
    // Simulate geocoding delay
    setTimeout(() => {
      const mockResult = {
        locationName: manualLocation,
        coordinates: { 
          lat: 40.7589 + (Math.random() - 0.5) * 0.1, 
          lng: -73.9851 + (Math.random() - 0.5) * 0.1 
        },
        confidence: Math.floor(Math.random() * 30) + 70,
        address: `${manualLocation}, United States`,
        source: "Google Maps API"
      };

      setGeocodingResult(mockResult);
      setIsGeocoding(false);

      toast({
        title: "Geocoding Complete",
        description: `Location converted to coordinates.`,
      });
    }, 1500);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (confidence >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="space-y-6">
      {/* Location Extraction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-500" />
            AI Location Extraction
          </CardTitle>
          <CardDescription>
            Extract location names from disaster descriptions using Google Gemini AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Disaster Description</label>
            <Textarea
              placeholder="Enter a detailed description of the disaster event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <Button 
            onClick={handleLocationExtraction}
            disabled={isExtracting}
            className="w-full"
          >
            {isExtracting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Extracting Locations...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Extract Locations with AI
              </div>
            )}
          </Button>

          {extractedLocations.length > 0 && (
            <div className="mt-6 p-4 border border-slate-200 rounded-lg space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Extracted Locations ({extractedLocations.length})
              </h3>
              
              <div className="space-y-3">
                {extractedLocations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium">{location.name}</div>
                      <div className="text-sm text-slate-600">
                        📍 {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                      </div>
                    </div>
                    <Badge className={getConfidenceColor(location.confidence)}>
                      {location.confidence}% confidence
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Geocoding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-500" />
            Manual Geocoding
          </CardTitle>
          <CardDescription>
            Convert location names to coordinates using mapping services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Location Name</label>
            <Input
              placeholder="e.g., Manhattan, NYC"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleManualGeocoding}
            disabled={isGeocoding}
            className="w-full"
          >
            {isGeocoding ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Geocoding...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Convert to Coordinates
              </div>
            )}
          </Button>

          {geocodingResult && (
            <div className="mt-6 p-4 border border-slate-200 rounded-lg space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Geocoding Result
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-600">Location</div>
                  <div className="font-medium">{geocodingResult.locationName}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Coordinates</div>
                  <div className="font-medium">
                    {geocodingResult.coordinates.lat.toFixed(6)}, {geocodingResult.coordinates.lng.toFixed(6)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Full Address</div>
                  <div className="font-medium">{geocodingResult.address}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Source</div>
                  <div className="font-medium">{geocodingResult.source}</div>
                </div>
              </div>
              
              <Badge className={getConfidenceColor(geocodingResult.confidence)}>
                {geocodingResult.confidence}% confidence
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Extraction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-slate-500" />
            Recent Extractions
          </CardTitle>
          <CardDescription>
            History of location extractions and geocoding results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {extractionHistory.map((item) => (
            <div key={item.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-sm text-slate-600 mb-2">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                  <div className="text-sm bg-slate-50 p-2 rounded mb-3">
                    "{item.originalText}"
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-700">
                  Extracted Locations ({item.extractedLocations.length}):
                </div>
                {item.extractedLocations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div>
                      <div className="font-medium text-sm">{location.name}</div>
                      <div className="text-xs text-slate-600">
                        {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {location.confidence}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationExtractor;
