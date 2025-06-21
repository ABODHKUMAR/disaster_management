import { useState } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LocationExtractor = () => {
  const [description, setDescription] = useState("");
  const [manualLocation, setManualLocation] = useState("");

  const [isExtracting, setIsExtracting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const [extractionResponse, setExtractionResponse] = useState(null);
  const [geocodingResponse, setGeocodingResponse] = useState(null);

  const { toast } = useToast();

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
    setExtractionResponse(null);

    try {
      const res = await fetch("https://disaster-management-m7ghdiwwi-abodhkumars-projects.vercel.app//api/geocode_location/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description })
      });

      if (!res.ok) throw new Error("Failed to extract locations");

      const data = await res.json();
      setExtractionResponse(data);
      toast({
        title: "Extraction Complete",
        description: "See raw JSON response below."
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Extraction failed.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
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
    setGeocodingResponse(null);

    try {
      const res = await fetch("https://disaster-management-m7ghdiwwi-abodhkumars-projects.vercel.app//api/geocode/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: manualLocation })
      });

      if (!res.ok) throw new Error("Geocoding failed");

      const data = await res.json();
      setGeocodingResponse(data);
      toast({
        title: "Geocoding Complete",
        description: "See raw JSON response below."
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Geocoding failed.",
        variant: "destructive"
      });
    } finally {
      setIsGeocoding(false);
    }
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
            Submit disaster descriptions and see the raw JSON of extracted locations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., Flood near Krishna Nagar, Delhi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <Button onClick={handleLocationExtraction} disabled={isExtracting} className="w-full">
            {isExtracting ? "Extracting..." : "Extract Locations"}
          </Button>

          {extractionResponse && (
            <div className="bg-slate-100 p-4 rounded border text-sm overflow-auto">
              <h3 className="font-semibold mb-2">📦 Extraction Response</h3>
              <pre>{JSON.stringify(extractionResponse, null, 2)}</pre>
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
            Enter a location name and get coordinates in raw JSON format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="e.g., Krishna Nagar, Delhi"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
          />
          <Button onClick={handleManualGeocoding} disabled={isGeocoding} className="w-full">
            {isGeocoding ? "Geocoding..." : "Convert to Coordinates"}
          </Button>

          {geocodingResponse && (
            <div className="bg-slate-100 p-4 rounded border text-sm overflow-auto">
              <h3 className="font-semibold mb-2">📦 Geocoding Response</h3>
              <pre>{JSON.stringify(geocodingResponse, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationExtractor;
