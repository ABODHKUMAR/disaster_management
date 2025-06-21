// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Progress } from "@/components/ui/progress";
// import { Shield, Search, Calendar } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const hardcodedDisasterIds = ["4cecf347-fdc5-4992-a54a-5ebd08240566"];

// type Report = {
//   id: string;
//   disaster_id: string;
//   user_id: string;
//   content: string;
//   image_url: string;
//   verification_status: string;
//   created_at: string;
// };

// type AnalysisResult = {
//   analysis?: string;
//   success?: boolean;
//   error?: string;
// };

// const getStatusColor = (status: string) => {
//   switch (status.toLowerCase()) {
//     case "verified":
//     case "success":
//       return "bg-green-100 text-green-800 border-green-200";
//     case "flagged":
//       return "bg-red-100 text-red-800 border-red-200";
//     case "pending":
//       return "bg-yellow-100 text-yellow-800 border-yellow-200";
//     default:
//       return "bg-slate-100 text-slate-800 border-slate-200";
//   }
// };

// const ImageVerification = () => {
//   const [imageUrl, setImageUrl] = useState("");
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
//   const [reports, setReports] = useState<Report[]>([]);
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const fetchReports = async () => {
//     try {
//       const res = await axios.get(
//         `https://disaster-management-k7ux.vercel.app/api/disasters/${hardcodedDisasterIds[0]}/reports/`
//       );
//       const data = Array.isArray(res.data) ? res.data : [];
//       setReports(data);
//     } catch (error: any) {
//       toast({
//         title: "Error fetching reports",
//         description: error.message || "Failed to load reports",
//         variant: "destructive",
//       });
//       setReports([]);
//     }
//   };

//   const handleImageVerification = async (url = imageUrl) => {
//     if (!url) {
//       toast({
//         title: "Error",
//         description: "Please enter an image URL to verify.",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setIsAnalyzing(true);
//       const res = await axios.post(
//         `https://disaster-management-k7ux.vercel.app/api/disasters/${hardcodedDisasterIds[0]}/verify-image/`,
//         { imageUrl: url }
//       );
//       setAnalysisResult(res.data);
//       toast({
//         title: "Image Verified",
//         description: res.data.analysis || "Verification complete",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Verification failed",
//         description: error.message || "Could not verify image",
//         variant: "destructive",
//       });
//     } finally {
//       setIsAnalyzing(false);
//       fetchReports(); // You can comment this out if blinking persists and you prefer local updates
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Manual Image Input */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Shield className="h-5 w-5 text-blue-500" />
//             Manual Image Verification
//           </CardTitle>
//           <CardDescription>Test image against disaster AI model</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <Input
//             placeholder="https://example.com/image.jpg"
//             value={imageUrl}
//             onChange={(e) => setImageUrl(e.target.value)}
//           />
//           <Button onClick={() => handleImageVerification()} disabled={isAnalyzing}>
//             {isAnalyzing ? "Analyzing..." : "Verify Image"}
//           </Button>
//           {isAnalyzing && <Progress value={60} className="h-2" />}
//           {analysisResult && (
//             <div className="bg-slate-100 text-sm p-2 rounded whitespace-pre-wrap">
//               {JSON.stringify(analysisResult, null, 2)}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Reports List */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Search className="h-5 w-5 text-slate-500" />
//             Disaster Reports
//           </CardTitle>
//           <CardDescription>All user-submitted reports with verification status</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {Array.isArray(reports) && reports.length > 0 ? (
//             reports.map((report) => (
//               <div
//                 key={report.id}
//                 className="border p-3 rounded flex gap-4 items-start justify-between"
//               >
//                 <div className="flex gap-4 items-start">
//                   <img
//                     src={report.image_url}
//                     loading="lazy"
//                     alt={report.content}
//                     className="w-20 h-20 object-cover rounded"
//                     onError={(e) => {
//                       e.currentTarget.onerror = null;
//                       e.currentTarget.src = "/placeholder.jpg";
//                     }}
//                   />
//                   <div>
//                     <div className="font-medium">{report.content}</div>
//                     <div className="text-sm text-slate-500 flex items-center gap-1">
//                       <Calendar className="h-3 w-3" />
//                       {new Date(report.created_at).toLocaleString()}
//                     </div>
//                     <div
//                       className={`mt-1 px-2 py-0.5 text-xs rounded ${getStatusColor(
//                         report.verification_status
//                       )}`}
//                     >
//                       {report.verification_status.toUpperCase()}
//                     </div>
//                   </div>
//                 </div>
//                 <Button size="sm" onClick={() => handleImageVerification(report.image_url)}>
//                   Verify
//                 </Button>
//               </div>
//             ))
//           ) : (
//             <div className="text-slate-500 text-sm">
//               No reports found for the selected disaster.
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ImageVerification;
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { RootState } from "@/app/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Shield, Search, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Report = {
  id: string;
  disaster_id: string;
  user_id: string;
  content: string;
  image_url: string;
  verification_status: string;
  created_at: string;
};

type AnalysisResult = {
  analysis?: string;
  success?: boolean;
  error?: string;
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "verified":
    case "success":
      return "bg-green-100 text-green-800 border-green-200";
    case "flagged":
      return "bg-red-100 text-red-800 border-red-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

const ImageVerification = () => {
  const disasters = useSelector((state: RootState) => state.disasterList.disasters);
  const [selectedDisasterId, setSelectedDisasterId] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (disasters.length > 0 && !selectedDisasterId) {
      setSelectedDisasterId(disasters[0].id);
    }
  }, [disasters]);

  useEffect(() => {
    fetchReports();
  }, [selectedDisasterId]);

  const fetchReports = async () => {
    if (!selectedDisasterId) return;
    try {
      const res = await axios.get(
        `https://disaster-management-k7ux.vercel.app/api/disasters/${selectedDisasterId}/reports/`
      );
      const data = Array.isArray(res.data) ? res.data : [];
      setReports(data);
    } catch (error: any) {
      toast({
        title: "Error fetching reports",
        description: error.message || "Failed to load reports",
        variant: "destructive"
      });
      setReports([]);
    }
  };

  const handleImageVerification = async (url = imageUrl) => {
    if (!url || !selectedDisasterId) {
      toast({
        title: "Error",
        description: "Please select a disaster and provide an image URL.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      const res = await axios.post(
        `https://disaster-management-k7ux.vercel.app/api/disasters/${selectedDisasterId}/verify-image/`,
        { imageUrl: url }
      );
      setAnalysisResult(res.data);
      toast({
        title: "Image Verified",
        description: res.data.analysis || "Verification complete"
      });
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Could not verify image",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      fetchReports();
    }
  };

  return (
    <div className="space-y-6">
      {/* Disaster Selector */}
      <div className="w-full max-w-md">
        <Select value={selectedDisasterId ?? ""} onValueChange={setSelectedDisasterId}>
          <SelectTrigger>
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
      </div>

      {/* Manual Image Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Manual Image Verification
          </CardTitle>
          <CardDescription>Test image against disaster AI model</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Button onClick={() => handleImageVerification()} disabled={isAnalyzing}>
            {isAnalyzing ? "Analyzing..." : "Verify Image"}
          </Button>
          {isAnalyzing && <Progress value={60} className="h-2" />}
          {analysisResult && (
            <div className="bg-slate-100 text-sm p-2 rounded whitespace-pre-wrap">
              {JSON.stringify(analysisResult, null, 2)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-slate-500" />
            Disaster Reports
          </CardTitle>
          <CardDescription>
            All user-submitted reports with verification status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.isArray(reports) && reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report.id}
                className="border p-3 rounded flex gap-4 items-start justify-between"
              >
                <div className="flex gap-4 items-start">
                  <img
                    src={report.image_url}
                    loading="lazy"
                    alt={report.content}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                  <div>
                    <div className="font-medium">{report.content}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(report.created_at).toLocaleString()}
                    </div>
                    <div
                      className={`mt-1 px-2 py-0.5 text-xs rounded ${getStatusColor(
                        report.verification_status
                      )}`}
                    >
                      {report.verification_status.toUpperCase()}
                    </div>
                  </div>
                </div>
                <Button size="sm" onClick={() => handleImageVerification(report.image_url)}>
                  Verify
                </Button>
              </div>
            ))
          ) : (
            <div className="text-slate-500 text-sm">
              No reports found for the selected disaster.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageVerification;
