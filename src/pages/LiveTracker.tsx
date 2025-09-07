import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Satellite, Globe, Clock } from "lucide-react";

interface ISSData {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export default function LiveTracker() {
  const [issData, setIssData] = useState<ISSData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchISSData = async () => {
      try {
        const response = await fetch('http://api.open-notify.org/iss-now.json');
        const data = await response.json();
        setIssData({
          latitude: parseFloat(data.iss_position.latitude),
          longitude: parseFloat(data.iss_position.longitude),
          timestamp: data.timestamp,
        });
      } catch (error) {
        console.error('Error fetching ISS data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchISSData();
    const interval = setInterval(fetchISSData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-cosmic">
      <Navigation />
      <div className="pt-20 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Live Space Tracker
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Track the International Space Station and satellites in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ISS Tracker */}
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Satellite className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl font-orbitron">International Space Station</CardTitle>
              </div>
              <CardDescription>
                Real-time position of the ISS orbiting Earth
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : issData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Latitude</span>
                      </div>
                      <p className="text-2xl font-mono text-primary">
                        {issData.latitude.toFixed(4)}°
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Longitude</span>
                      </div>
                      <p className="text-2xl font-mono text-primary">
                        {issData.longitude.toFixed(4)}°
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Last Updated</span>
                    </div>
                    <p className="text-lg">
                      {new Date(issData.timestamp * 1000).toLocaleString()}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-primary/20">
                    <Badge variant="secondary" className="mb-2">Live Data</Badge>
                    <p className="text-sm text-muted-foreground">
                      The ISS travels at approximately 17,500 mph (28,000 km/h) and completes an orbit around Earth every 90 minutes.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Unable to load ISS data</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Satellite Info */}
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl font-orbitron">Satellite Information</CardTitle>
              <CardDescription>
                Learn about satellites orbiting our planet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">International Space Station (ISS)</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    The largest human-made object in space, serving as a microgravity research laboratory.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Altitude:</span> ~408 km
                    </div>
                    <div>
                      <span className="font-medium">Speed:</span> 17,500 mph
                    </div>
                    <div>
                      <span className="font-medium">Crew:</span> 6-7 astronauts
                    </div>
                    <div>
                      <span className="font-medium">Launch:</span> 1998
                    </div>
                  </div>
                </div>

                <div className="border-t border-primary/20 pt-4">
                  <h4 className="font-semibold mb-2">Other Notable Satellites</h4>
                  <div className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-1">Communication</Badge>
                      <p className="text-sm">Geostationary satellites for TV, internet, and phone services</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-1">Navigation</Badge>
                      <p className="text-sm">GPS, GLONASS, and Galileo satellite constellations</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-1">Earth Observation</Badge>
                      <p className="text-sm">Landsat, Sentinel, and weather monitoring satellites</p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-sm text-center">
                    <strong>Did you know?</strong> There are over 8,000 satellites currently orbiting Earth!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Future Features */}
        <div className="mt-12">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl font-orbitron">Coming Soon</CardTitle>
              <CardDescription>
                Enhanced tracking features in development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-primary/20 rounded-lg">
                  <Satellite className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">More Satellites</h4>
                  <p className="text-sm text-muted-foreground">Track multiple satellites simultaneously</p>
                </div>
                <div className="text-center p-4 border border-primary/20 rounded-lg">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">3D Visualization</h4>
                  <p className="text-sm text-muted-foreground">Interactive 3D Earth model with orbital paths</p>
                </div>
                <div className="text-center p-4 border border-primary/20 rounded-lg">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">Pass Predictions</h4>
                  <p className="text-sm text-muted-foreground">Know when satellites will be visible from your location</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
      <FloatingChatbot />
    </div>
  );
}