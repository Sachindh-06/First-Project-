import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Calendar, Target } from 'lucide-react';

interface Mission {
  id: string;
  name: string;
  agency: string;
  mission_date: string;
  objective: string;
  status: string;
}

interface ISROMission {
  id: number;
  name: string;
  description: string;
}

const RecentMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isroMissions, setIsroMissions] = useState<ISROMission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      
      // Fetch local Supabase missions
      const response = await fetch('/api/missions');
      if (response.ok) {
        const data = await response.json();
        setMissions(data.slice(0, 3));
      }

      // Fetch ISRO missions
      try {
        const isroResponse = await fetch('https://isro.vercel.app/api/customer_satellites');
        if (isroResponse.ok) {
          const isroData = await isroResponse.json();
          setIsroMissions(isroData.customer_satellites?.slice(0, 2) || []);
        }
      } catch (error) {
        console.log('ISRO API unavailable, using fallback data');
        setIsroMissions([
          { id: 1, name: 'Chandrayaan-3', description: 'Lunar exploration mission' },
          { id: 2, name: 'Gaganyaan', description: 'Human spaceflight program' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching missions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="planet-card">
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const allMissions = [
    ...missions.map(m => ({ ...m, source: 'NASA' })),
    ...isroMissions.map(m => ({ 
      id: m.id.toString(), 
      name: m.name, 
      agency: 'ISRO',
      mission_date: new Date().toISOString().split('T')[0],
      objective: m.description,
      status: 'active',
      source: 'ISRO'
    }))
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold text-gradient mb-2">
          Recent Space Missions
        </h2>
        <p className="text-muted-foreground">
          Latest missions from NASA and ISRO
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allMissions.map((mission) => (
          <Card key={`${mission.source}-${mission.id}`} className="planet-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge 
                  variant={mission.agency === 'ISRO' ? 'default' : 'secondary'}
                  className="mb-2"
                >
                  <Rocket className="h-3 w-3 mr-1" />
                  {mission.agency}
                </Badge>
                <Badge 
                  variant="outline"
                  className={
                    mission.status === 'active' ? 'border-green-500 text-green-500' :
                    mission.status === 'completed' ? 'border-blue-500 text-blue-500' :
                    'border-yellow-500 text-yellow-500'
                  }
                >
                  {mission.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">{mission.name}</CardTitle>
              {mission.mission_date && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(mission.mission_date).toLocaleDateString()}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <CardDescription className="text-sm">
                  {mission.objective}
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentMissions;