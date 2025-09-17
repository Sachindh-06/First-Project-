import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Calendar, Target } from 'lucide-react';

interface ISROSatellite {
  id: string;
  country: string;
  launch_date: string;
  mass: string;
  launcher: string;
}

interface Mission {
  id: string;
  name: string;
  agency: string;
  mission_date: string;
  objective: string;
  status: string;
}

const RecentMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://isro.vercel.app/api/customer_satellites');
      if (response.ok) {
        const data = await response.json();
        const satellites: ISROSatellite[] = data.customer_satellites || [];

        const mappedMissions: Mission[] = satellites.map((sat) => ({
          id: sat.id,
          name: sat.id,
          agency: 'ISRO',
          mission_date: formatDate(sat.launch_date),
          objective: `Launched for ${sat.country} using ${sat.launcher}. Mass: ${sat.mass || 'N/A'} kg`,
          status: 'completed',
        }));

        setMissions(mappedMissions.slice(18, 36)); // show latest 12
      }
    } catch (error) {
      console.error('Error fetching ISRO missions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert DD-MM-YYYY → YYYY-MM-DD
  const formatDate = (dateStr: string): string => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    }
    return new Date().toISOString().split('T')[0];
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold text-gradient mb-2">
          Recent ISRO Customer Satellites
        </h2>
        <p className="text-muted-foreground">
          Latest satellites launched by ISRO for other countries
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.map((mission) => (
          <Card key={mission.id} className="planet-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="default" className="mb-2">
                  <Rocket className="h-3 w-3 mr-1" />
                  {mission.agency}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-blue-500 text-blue-500"
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
