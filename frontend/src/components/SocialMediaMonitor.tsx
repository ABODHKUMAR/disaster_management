import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { MessageSquare, Search, Twitter } from "lucide-react";

const SocialMediaMonitor = () => {
  const disasters = useSelector((state: RootState) => state.disasterList.disasters);
  const [selectedDisasterId, setSelectedDisasterId] = useState<string | null>(null);
  const [officialUpdates, setOfficialUpdates] = useState<any[]>([]);
  const [socialMediaPosts, setSocialMediaPosts] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [realTimeUpdates, setRealTimeUpdates] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default selected disaster from Redux
  useEffect(() => {
    if (disasters.length > 0 && !selectedDisasterId) {
      setSelectedDisasterId(disasters[0].id);
    }
  }, [disasters]);

  // Fetch updates (official + social)
  useEffect(() => {
    const fetchUpdates = async () => {
      if (!selectedDisasterId) return;

      try {
        const [officialRes, socialRes] = await Promise.all([
          fetch(`https://disaster-management-m7ghdiwwi-abodhkumars-projects.vercel.app//api/disasters/${selectedDisasterId}/official-updates`),
          fetch(`https://disaster-management-m7ghdiwwi-abodhkumars-projects.vercel.app//api/disasters/${selectedDisasterId}/social-media/`)
        ]);

        if (!officialRes.ok || !socialRes.ok) {
          throw new Error("Failed to fetch one or more endpoints");
        }

        const [officialData, socialData] = await Promise.all([
          officialRes.json(),
          socialRes.json()
        ]);

        setOfficialUpdates(officialData);
        setSocialMediaPosts(socialData);
        setError(null);
      } catch (err: any) {
        setError("Failed to load updates. Please try again later.");
        console.error("Error fetching updates:", err);
      }
    };

    fetchUpdates();

    if (realTimeUpdates) {
      const interval = setInterval(fetchUpdates, 30000);
      return () => clearInterval(interval);
    }
  }, [selectedDisasterId, realTimeUpdates]);

  const filteredOfficial = officialUpdates.filter((update) =>
    update.title?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const filteredSocial = socialMediaPosts.filter((post) =>
    post.post?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          Disaster Updates
          {realTimeUpdates && (
            <div className="flex items-center gap-1 ml-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600">Live</span>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          Official agency and social media reports related to disasters.
        </CardDescription>

        <div className="flex flex-wrap gap-4 mt-4">
          <Select value={selectedDisasterId ?? ""} onValueChange={setSelectedDisasterId}>
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

          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search updates..."
              className="pl-10"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        {/* Official Updates */}
        <section>
          <h3 className="font-semibold text-lg mb-2">Official Updates</h3>
          {filteredOfficial.length > 0 ? (
            filteredOfficial.map((update, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-600">{update.source}</span>
                    <Badge variant="secondary">Official</Badge>
                  </div>
                  {update.published_at && (
                    <span className="text-sm text-slate-500">
                      {new Date(update.published_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-slate-700">{update.title}</p>
                {update.url && (
                  <a
                    href={update.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Visit Source →
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No official updates found.</p>
          )}
        </section>

        {/* Social Media Posts */}
        <section>
          <h3 className="font-semibold text-lg mb-2">Social Media Posts</h3>
          {filteredSocial.length > 0 ? (
            filteredSocial.map((post, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-sky-500" />
                    <span className="font-medium">@{post.user}</span>
                  </div>
                  {post.timestamp && (
                    <span className="text-sm text-slate-500">
                      {new Date(post.timestamp).toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-slate-700">{post.post}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No social media posts found.</p>
          )}
        </section>
      </CardContent>
    </Card>
  );
};

export default SocialMediaMonitor;
