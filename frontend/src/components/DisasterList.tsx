import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Calendar,
  User,
  AlertTriangle,
  Search,
  Filter,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
  fetchDisasters,
  removeDisaster,
  updateDisaster,
} from "@/features/disaster/disasterListSlice";

const DisasterList = ({ setActiveDisaster }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("all");

  const dispatch = useDispatch<AppDispatch>();
  const { disasters, loading, error } = useSelector(
    (state: RootState) => state.disasterList
  );

  useEffect(() => {
    dispatch(fetchDisasters());
  }, [dispatch]);

  const handleEdit = (disaster) => {
    setActiveDisaster(disaster);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this disaster?")) {
      await fetch(`http://localhost:8000/api/disasters/${id}`, {
        method: "DELETE",
      });
      dispatch(removeDisaster(id));
    }
  };

  const filteredDisasters = disasters.filter((disaster) => {
    const matchesSearch =
      disaster.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.location_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterTag === "all" || disaster.tags.includes(filterTag);
    return matchesSearch && matchesFilter;
  });

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    disasters.forEach((d) => d.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [disasters]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Active Disasters
        </CardTitle>
        <CardDescription>
          Monitor and manage ongoing disaster events
        </CardDescription>

        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search disasters..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterTag} onValueChange={setFilterTag}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {filteredDisasters.map((disaster) => (
          <div
            key={disaster.id}
            className="border border-slate-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{disaster.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{disaster.location_name}</span>
                </div>
                <p className="text-slate-700 mb-3">{disaster.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {disaster.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{disaster.owner_id}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(disaster.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(disaster)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(disaster.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredDisasters.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No disasters found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DisasterList;
