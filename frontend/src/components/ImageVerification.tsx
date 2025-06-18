
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Image, Shield, AlertTriangle, Search, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ImageVerification = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const { toast } = useToast();

  // Mock verification history
  const verificationHistory = [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400",
      filename: "flood_damage_manhattan.jpg",
      timestamp: "2025-06-18T11:30:00Z",
      status: "verified",
      authenticity: 92,
      analysis: {
        manipulation_detected: false,
        context_match: true,
        location_verified: true,
        timestamp_consistent: true,
        metadata_analysis: "Clean EXIF data, no signs of editing"
      },
      submitter: "citizen_reporter_1"
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=400",
      filename: "shelter_setup_brooklyn.jpg",
      timestamp: "2025-06-18T10:15:00Z",
      status: "verified",
      authenticity: 88,
      analysis: {
        manipulation_detected: false,
        context_match: true,
        location_verified: true,
        timestamp_consistent: true,
        metadata_analysis: "Valid disaster response setup"
      },
      submitter: "volunteer_coordinator"
    },
    {
      id: "3",
      imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400",
      filename: "suspicious_flood_claim.jpg",
      timestamp: "2025-06-18T09:45:00Z",
      status: "flagged",
      authenticity: 34,
      analysis: {
        manipulation_detected: true,
        context_match: false,
        location_verified: false,
        timestamp_consistent: false,
        metadata_analysis: "Multiple editing artifacts detected, inconsistent with claimed location"
      },
      submitter: "anonymous_user"
    }
  ];

  const handleImageVerification = async () => {
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please enter an image URL to verify.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const mockResult = {
        authenticity: Math.floor(Math.random() * 100),
        manipulation_detected: Math.random() > 0.7,
        context_match: Math.random() > 0.3,
        location_verified: Math.random() > 0.4,
        timestamp_consistent: Math.random() > 0.3,
        metadata_analysis: "AI analysis complete. See detailed report above."
      };

      setAnalysisResult(mockResult);
      setIsAnalyzing(false);

      toast({
        title: "Image Analysis Complete",
        description: `Authenticity score: ${mockResult.authenticity}%`,
      });
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-800 border-green-200";
      case "flagged": return "bg-red-100 text-red-800 border-red-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getAuthenticityColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Image Verification Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Image Verification System
          </CardTitle>
          <CardDescription>
            Use AI to analyze disaster images for authenticity and context verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input
              placeholder="https://example.com/disaster-image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleImageVerification}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing Image...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Verify Image
              </div>
            )}
          </Button>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="text-sm text-slate-600">AI Analysis in Progress...</div>
              <Progress value={66} className="h-2" />
              <div className="text-xs text-slate-500">
                Running authenticity checks, metadata analysis, and context verification...
              </div>
            </div>
          )}

          {analysisResult && (
            <div className="mt-6 p-4 border border-slate-200 rounded-lg space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Verification Results
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-600">Authenticity Score</div>
                  <div className={`text-2xl font-bold ${getAuthenticityColor(analysisResult.authenticity)}`}>
                    {analysisResult.authenticity}%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Manipulation Detected:</span>
                    <span className={analysisResult.manipulation_detected ? "text-red-600" : "text-green-600"}>
                      {analysisResult.manipulation_detected ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Context Match:</span>
                    <span className={analysisResult.context_match ? "text-green-600" : "text-red-600"}>
                      {analysisResult.context_match ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Location Verified:</span>
                    <span className={analysisResult.location_verified ? "text-green-600" : "text-red-600"}>
                      {analysisResult.location_verified ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Timestamp Consistent:</span>
                    <span className={analysisResult.timestamp_consistent ? "text-green-600" : "text-red-600"}>
                      {analysisResult.timestamp_consistent ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-slate-700 mb-1">Metadata Analysis:</div>
                <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                  {analysisResult.metadata_analysis}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-slate-500" />
            Verification History
          </CardTitle>
          <CardDescription>
            Recent image verification results and analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationHistory.map((item) => (
            <div key={item.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <img
                    src={item.imageUrl}
                    alt="Verification subject"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium">{item.filename}</h4>
                    <div className="text-sm text-slate-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600">
                      Submitted by: {item.submitter}
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.toUpperCase()}
                  </Badge>
                  <div className={`text-lg font-bold ${getAuthenticityColor(item.authenticity)}`}>
                    {item.authenticity}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className={`p-2 rounded text-center ${
                  item.analysis.manipulation_detected ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                }`}>
                  {item.analysis.manipulation_detected ? "⚠️ Manipulation" : "✅ Clean"}
                </div>
                <div className={`p-2 rounded text-center ${
                  item.analysis.context_match ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                  {item.analysis.context_match ? "✅ Context" : "❌ Context"}
                </div>
                <div className={`p-2 rounded text-center ${
                  item.analysis.location_verified ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                  {item.analysis.location_verified ? "✅ Location" : "❌ Location"}
                </div>
                <div className={`p-2 rounded text-center ${
                  item.analysis.timestamp_consistent ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                  {item.analysis.timestamp_consistent ? "✅ Time" : "❌ Time"}
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                {item.analysis.metadata_analysis}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageVerification;
