
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MessageSquare, AlertTriangle, Users, Bell } from "lucide-react";

const SocialMediaMonitor = () => {
  const [searchKeyword, setSearchKeyword] = useState("flood");
  const [filterType, setFilterType] = useState("all");
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  // Mock social media data
  const [reports, setReports] = useState([
    {
      id: "1",
      platform: "twitter",
      user: "citizen1",
      content: "#floodrelief Need food and water in Lower East Side NYC. Many families stranded on upper floors.",
      timestamp: "2025-06-18T11:30:00Z",
      location: "Lower East Side, NYC",
      priority: "high",
      keywords: ["flood", "relief", "food", "water"],
      verified: false,
      sentiment: "urgent"
    },
    {
      id: "2",
      platform: "bluesky",
      user: "volunteer_nyc",
      content: "Setting up emergency shelter at PS 234. Can accommodate 50 families. #disasterrelief #nyc",
      timestamp: "2025-06-18T11:15:00Z",
      location: "Manhattan, NYC",
      priority: "medium",
      keywords: ["shelter", "relief", "families"],
      verified: true,
      sentiment: "helpful"
    },
    {
      id: "3",
      platform: "twitter",
      user: "emergency_update",
      content: "⚠️ URGENT: Subway lines 4,5,6 completely flooded. Do NOT attempt to enter stations. #MTA #flood",
      timestamp: "2025-06-18T11:00:00Z",
      location: "NYC",
      priority: "critical",
      keywords: ["urgent", "subway", "flood", "MTA"],
      verified: true,
      sentiment: "warning"
    },
    {
      id: "4",
      platform: "mock",
      user: "local_resident",
      content: "Elderly neighbor needs medical evacuation from 3rd floor. Water rising fast! SOS #help #medical",
      timestamp: "2025-06-18T10:45:00Z",
      location: "Brooklyn, NYC",
      priority: "critical",
      keywords: ["SOS", "medical", "evacuation", "elderly"],
      verified: false,
      sentiment: "emergency"
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "emergency": return "text-red-600";
      case "urgent": return "text-orange-600";
      case "warning": return "text-yellow-600";
      case "helpful": return "text-green-600";
      default: return "text-slate-600";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter": return "🐦";
      case "bluesky": return "🦋";
      case "mock": return "📱";
      default: return "💬";
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeUpdates) return;

    const interval = setInterval(() => {
      const newReport = {
        id: Date.now().toString(),
        platform: "twitter",
        user: `user${Math.floor(Math.random() * 1000)}`,
        content: `Real-time update: Situation developing in area ${Math.floor(Math.random() * 10)}. #flood #help`,
        timestamp: new Date().toISOString(),
        location: "NYC Area",
        priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        keywords: ["flood", "help"],
        verified: Math.random() > 0.5,
        sentiment: "urgent"
      };

      setReports(prev => [newReport, ...prev.slice(0, 9)]);
    }, 15000); // New report every 15 seconds

    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  const filteredReports = reports.filter(report => {
    const matchesKeyword = report.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchKeyword.toLowerCase())
    ) || report.content.toLowerCase().includes(searchKeyword.toLowerCase());
    
    const matchesFilter = filterType === "all" || 
                         (filterType === "verified" && report.verified) ||
                         (filterType === "unverified" && !report.verified) ||
                         report.priority === filterType;
    
    return matchesKeyword && matchesFilter;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          Social Media Monitor
          {realTimeUpdates && (
            <div className="flex items-center gap-1 ml-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600">Live</span>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          Real-time monitoring of social media for disaster-related reports and needs
        </CardDescription>
        
        {/* Controls */}
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search keywords..."
              className="pl-10"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter reports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={realTimeUpdates ? "default" : "outline"}
            onClick={() => setRealTimeUpdates(!realTimeUpdates)}
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Real-time
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">
              {reports.filter(r => r.priority === "critical").length}
            </div>
            <div className="text-sm text-red-600">Critical Reports</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {reports.filter(r => r.verified).length}
            </div>
            <div className="text-sm text-blue-600">Verified Reports</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((reports.filter(r => r.verified).length / reports.length) * 100)}%
            </div>
            <div className="text-sm text-green-600">Verification Rate</div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredReports.map((report) => (
            <div key={report.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getPlatformIcon(report.platform)}</span>
                  <span className="font-medium">@{report.user}</span>
                  {report.verified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      ✓ Verified
                    </Badge>
                  )}
                  <Badge className={getPriorityColor(report.priority)}>
                    {report.priority.toUpperCase()}
                  </Badge>
                </div>
                <span className="text-sm text-slate-500">
                  {new Date(report.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <p className={`text-slate-700 ${getSentimentColor(report.sentiment)}`}>
                {report.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>📍 {report.location}</span>
                  <div className="flex gap-1">
                    {report.keywords.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        #{keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Verify
                  </Button>
                  <Button variant="outline" size="sm">
                    Respond
                  </Button>
                  <Button variant="destructive" size="sm">
                    Flag
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No social media reports found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialMediaMonitor;
