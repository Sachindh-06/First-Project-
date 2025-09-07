import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Rocket, Target, Building } from "lucide-react";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";

interface Mission {
  id: string;
  name: string;
  agency: string;
  mission_date: string;
  objective: string;
  status: string;
  description: string;
}

export default function MissionTimeline() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const { data, error } = await supabase
          .from('missions')
          .select('*')
          .order('mission_date', { ascending: false });

        if (error) throw error;
        setMissions(data || []);
      } catch (error) {
        console.error('Error fetching missions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/20';
      case 'ongoing':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/20';
      case 'planned':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20';
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/20';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/20';
    }
  };

  const getAgencyColor = (agency: string) => {
    switch (agency) {
      case 'ISRO':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/20';
      case 'NASA':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/20';
      case 'ESA':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/20';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-space pt-20 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic">
      <Navigation />
      <div className="pt-20 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Mission Timeline
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the past, present, and future of space exploration missions
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20"></div>

          <div className="space-y-12">
            {missions.map((mission, index) => (
              <div
                key={mission.id}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10"></div>

                {/* Mission card */}
                <div className={`w-full max-w-md ${index % 2 === 0 ? 'mr-auto pr-8' : 'ml-auto pl-8'}`}>
                  <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-orbitron">{mission.name}</CardTitle>
                        <Badge className={getAgencyColor(mission.agency)}>
                          {mission.agency}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(mission.mission_date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(mission.status)} variant="outline">
                            {mission.status.charAt(0).toUpperCase() + mission.status.slice(1)}
                          </Badge>
                          <Rocket className="h-5 w-5 text-primary" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">Objective</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{mission.objective}</p>
                        </div>

                        {mission.description && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Building className="h-4 w-4 text-primary" />
                              <span className="font-medium text-sm">Description</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{mission.description}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

        {missions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No missions found.</p>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">
                {missions.filter(m => m.status === 'completed').length}
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-400">
                {missions.filter(m => m.status === 'ongoing').length}
              </div>
              <p className="text-sm text-muted-foreground">Ongoing</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-400">
                {missions.filter(m => m.status === 'planned').length}
              </div>
              <p className="text-sm text-muted-foreground">Planned</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-400">
                {missions.filter(m => m.agency === 'ISRO').length}
              </div>
              <p className="text-sm text-muted-foreground">ISRO Missions</p>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
      <FloatingChatbot />
    </div>
  );
}