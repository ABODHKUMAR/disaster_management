import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import {
  updateField,
  addTag,
  removeTag,
  setCurrentTag,
  createDisaster,
  resetForm,
} from "@/features/disaster/disasterFormSlice";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AlertTriangle, MapPin, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateDisaster } from "@/features/disaster/disasterListSlice";

interface Disaster {
  id: string;
  title: string;
  description: string;
  location_name: string;
  tags: string[];
  audit_trail: { action: string; user_id: string; timestamp: string }[];
  owner_id: string;
}

interface DisasterFormProps {
  activeDisaster: Disaster | null;
  setActiveDisaster: (disaster: Disaster | null) => void;
}

const DisasterForm: React.FC<DisasterFormProps> = ({
  activeDisaster,
  setActiveDisaster,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    title,
    locationName,
    location,
    description,
    tags,
    currentTag,
    audit_trail,
    owner_id,
    loading,
    error,
  } = useSelector((state: RootState) => state.disasterForm);
  const { username, role } = useSelector((state: RootState) => state.auth);
  const disastersList = useSelector((state: RootState) => state.disasterList);
  
  //find
  console.log("Disaster List:", disastersList);
  

  const { toast } = useToast();

  const predefinedTags = [
    "flood",
    "earthquake",
    "fire",
    "hurricane",
    "tornado",
    "landslide",
    "urgent",
    "medical",
  ];

  const isEditMode = !!activeDisaster?.id;

  useEffect(() => {
    if (isEditMode) {
      dispatch(updateField({ field: "title", value: activeDisaster.title || "" }));
      dispatch(updateField({ field: "locationName", value: activeDisaster.location_name || "" }));
      dispatch(updateField({ field: "description", value: activeDisaster.description || "" }));
      dispatch(updateField({ field: "tags", value: activeDisaster.tags || [] }));
    }
  }, [activeDisaster, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && activeDisaster?.id) {
      dispatch(
        updateDisaster({
          id: activeDisaster.id,
          data: {
            title,
            description,
            location_name: locationName,
            tags,
            audit_trail: [
              ...activeDisaster.audit_trail,
              {
                action: "update",
                user_id: username,
                timestamp: new Date().toISOString(),
              },
            ],
          },
        })
      )
        .unwrap()
        .then(() => {
          toast({
            title: "Disaster Updated",
            description: `${title} has been updated.`,
          });
          dispatch(resetForm());
          setActiveDisaster(null);
        })
        .catch((err) =>
          toast({
            variant: "destructive",
            title: "Update Failed",
            description: err.toString(),
          })
        );
    } else {
      dispatch(createDisaster())
        .unwrap()
        .then(() => {
          toast({
            title: "Disaster Report Created",
            description: `${title} has been added to the system.`,
          });
          dispatch(resetForm());
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: "Creation Failed",
            description: err.toString(),
          });
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          {isEditMode ? "Edit Disaster Report" : "Create Disaster Report"}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update the disaster event details"
            : "Add a new disaster event to the coordination system"}
        </CardDescription>

        {isEditMode && (
          <Button
            variant="ghost"
            className="text-sm text-blue-600 underline p-0 mt-2"
            onClick={() => {
              dispatch(resetForm());
              setActiveDisaster(null);
            }}
          >
            Switch to Create Mode
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Disaster Title</Label>
            <Input
              id="title"
              placeholder="e.g., NYC Severe Flooding"
              value={title}
              onChange={(e) =>
                dispatch(updateField({ field: "title", value: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="location"
                placeholder="e.g., Manhattan, NYC"
                className="pl-10"
                value={locationName}
                onChange={(e) =>
                  dispatch(updateField({ field: "locationName", value: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the disaster situation..."
              value={description}
              onChange={(e) =>
                dispatch(updateField({ field: "description", value: e.target.value }))
              }
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => dispatch(removeTag(tag))}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom tag"
                value={currentTag}
                onChange={(e) => dispatch(setCurrentTag(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    dispatch(addTag(currentTag));
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => dispatch(addTag(currentTag))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {predefinedTags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => dispatch(addTag(tag))}
                  disabled={tags.includes(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            {loading
              ? "Submitting..."
              : isEditMode
              ? "Update Disaster"
              : "Create Disaster"}
          </Button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
};

export default DisasterForm;