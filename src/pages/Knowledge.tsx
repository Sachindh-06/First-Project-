import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Rocket, Satellite, Globe, ChevronRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";

interface Planet {
  id: string;
  name: string;
  description: string;
  planet_type: string;
  distance_from_earth: string;
  size_comparison: string;
}

interface Mission {
  id: string;
  name: string;
  agency: string;
  mission_date: string;
  objective: string;
  status: string;
  description: string;
}

export default function Knowledge() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [planetsResponse, missionsResponse] = await Promise.all([
        supabase.from('planets').select('*').order('name'),
        supabase.from('missions').select('*').order('mission_date', { ascending: false })
      ]);

      setPlanets(planetsResponse.data || []);
      setMissions(missionsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "All", icon: Globe },
    { id: "planets", name: "Planets", icon: Globe },
    { id: "missions", name: "Missions", icon: Rocket },
    { id: "technology", name: "Technology", icon: Satellite },
    { id: "astrobiology", name: "Astrobiology", icon: BookOpen },
  ];

  const articles = [
    {
      id: 1,
      title: "Understanding Planetary Formation",
      category: "planets",
      description: "Learn how planets form from cosmic dust and gas in stellar nurseries.",
      readTime: "5 min read",
      tags: ["formation", "planets", "science"],
    },
    {
      id: 2,
      title: "The Search for Exoplanets",
      category: "exoplanets", 
      description: "Discover how astronomers find planets orbiting distant stars.",
      readTime: "7 min read",
      tags: ["exoplanets", "discovery", "space telescopes"],
    },
    {
      id: 3,
      title: "ISRO's Mars Mission Success",
      category: "missions",
      description: "The incredible journey of India's Mars Orbiter Mission.",
      readTime: "6 min read",
      tags: ["ISRO", "Mars", "missions"],
    },
    {
      id: 4,
      title: "Life in the Goldilocks Zone",
      category: "astrobiology",
      description: "Exploring the habitable zone around stars where life could exist.",
      readTime: "8 min read",
      tags: ["habitable zone", "life", "astrobiology"],
    },
    {
      id: 5,
      title: "Rockets: From Earth to Space", 
      category: "technology",
      description: "How rocket technology has evolved to take us beyond Earth.",
      readTime: "10 min read",
      tags: ["rockets", "technology", "space travel"],
    },
    {
      id: 6,
      title: "Satellites and Communication",
      category: "technology",
      description: "The role of satellites in modern communication and Earth observation.",
      readTime: "6 min read",
      tags: ["satellites", "communication", "technology"],
    },
  ];

  const filteredPlanets = planets.filter(planet =>
    (selectedCategory === "all" || selectedCategory === "planets") &&
    planet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMissions = missions.filter(mission =>
    (selectedCategory === "all" || selectedCategory === "missions") &&
    (mission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     mission.agency.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredArticles = articles.filter(article =>
    (selectedCategory === "all" || article.category === selectedCategory) &&
    (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-gradient-space">
      <Navigation />
      
      <div className="pt-20 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Knowledge Hub
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore comprehensive information about planets, space missions, and cutting-edge space technology
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles, planets, missions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Content Based on Category */}
          {(selectedCategory === "all" || selectedCategory === "planets") && (
            <div className="mb-12">
              <h3 className="text-2xl font-orbitron font-bold mb-6">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Planet Database
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlanets.map((planet) => (
                  <Card
                    key={planet.id}
                    className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{planet.name}</CardTitle>
                        <Badge variant="outline">{planet.planet_type}</Badge>
                      </div>
                      <CardDescription>{planet.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p><strong>Distance:</strong> {planet.distance_from_earth}</p>
                        <p><strong>Size:</strong> {planet.size_comparison}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {(selectedCategory === "all" || selectedCategory === "missions") && (
            <div className="mb-12">
              <h3 className="text-2xl font-orbitron font-bold mb-6">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Space Missions
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMissions.map((mission) => (
                  <Card
                    key={mission.id}
                    className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{mission.name}</CardTitle>
                        <Badge variant="outline">{mission.agency}</Badge>
                      </div>
                      <CardDescription>{mission.objective}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p><strong>Date:</strong> {new Date(mission.mission_date).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {mission.status}</p>
                        {mission.description && (
                          <p className="text-muted-foreground">{mission.description}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Educational Articles */}
          <div>
            <h3 className="text-2xl font-orbitron font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Educational Articles
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer group"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{article.readTime}</span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription>{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/10">
                      Read Article
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <FloatingChatbot />
    </div>
  );
}