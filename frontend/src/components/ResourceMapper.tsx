import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

const ResourceMapper = () => {
  const disasters = useSelector((state: RootState) => state.disasterList?.disasters || []);

  const [selectedDisasterId, setSelectedDisasterId] = useState<string | null>(null);
  const [resourceType, setResourceType] = useState("all");
  const [searchLocation, setSearchLocation] = useState("");
  const [resources, setResources] = useState<any[]>([]);
  const [radius, setRadius] = useState("10");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default selected disaster
  useEffect(() => {
    if (disasters.length > 0 && !selectedDisasterId) {
      setSelectedDisasterId(disasters[0]?.id ?? null);
    }
  }, [disasters]);

  // Fetch resources when selected disaster changes
  useEffect(() => {
    const fetchResources = async () => {
      if (!selectedDisasterId) return;

      setLoading(true);
      setError(null);
      try {
        const lat = 28.6139;
        const lon = 77.2090;
        const response = await fetch(
          `http://localhost:8000/api/disasters/${selectedDisasterId}/resources?lat=${lat}&lon=${lon}`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected API response format.");
        }

        setResources(data);
      } catch (err: any) {
        console.error("Error fetching resources:", err);
        setError("Failed to load resources. Please try again.");
        setResources([]); // fallback to empty
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [selectedDisasterId]);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "shelter":
        return "🏠";
      case "medical":
        return "🏥";
      case "food":
        return "🍽️";
      case "supplies":
        return "📦";
      case "evacuation":
        return "🚌";
      default:
        return "📍";
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesLocation =
      !searchLocation ||
      resource?.location_name?.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesType = resourceType === "all" || resource?.type === resourceType;
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
          View and manage relief resources based on disaster selection
        </CardDescription>

        {/* Controls */}
        <div className="flex gap-4 mt-4 flex-wrap">
          <Select
            value={selectedDisasterId ?? ""}
            onValueChange={setSelectedDisasterId}
            disabled={disasters.length === 0}
          >
            <SelectTrigger className="min-w-[240px]">
              <SelectValue placeholder="Select Disaster" />
            </SelectTrigger>
            <SelectContent>
              {disasters.map((disaster) => (
                <SelectItem key={disaster.id} value={disaster.id}>
                  {disaster.title} — {disaster.location_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Search location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="min-w-[200px]"
          />

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
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading && (
          <div className="text-center text-slate-500 py-6">Loading resources...</div>
        )}

        {error && (
          <div className="text-center text-red-500 py-6">{error}</div>
        )}

        {!loading && !error && filteredResources.length > 0 && filteredResources.map((r) => (
          <div
            key={r.id}
            className="border border-slate-200 rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getResourceIcon(r.type)}</span>
                <div>
                  <h3 className="text-lg font-semibold">{r.name}</h3>
                  <p className="text-sm text-slate-600">{r.location_name}</p>
                </div>
              </div>
              <Badge variant="outline">{r.type}</Badge>
            </div>
            <p className="text-sm text-slate-500">
              Created: {new Date(r.created_at).toLocaleString()}
            </p>
          </div>
        ))}

        {!loading && !error && filteredResources.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No resources found for this disaster.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceMapper;
