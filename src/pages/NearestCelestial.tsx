import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

type Section = {
  title: string;
  description: string;
  imageUrl: string;
};

const SECTIONS: Section[] = [
  {
    title: "Launches",
    description:
      "We track all orbital launches and a number of popular suborbital launches. Generally we will track all suborbital launches which aim to reach “space” or the Karman line and are live streamed, although, we will also occasionally track others by popular demand. The endpoint has a variety of filters and parameters, such as launch service provider, launcher config or spacecraft.",
    imageUrl: "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/static/home/thespacedevs/images/ll2features/launchvehicles.jpg",
  },
  {
    title: "Events",
    description:
      "These are typically space events which aren’t covered by the standard launches. These events could be spacecraft landings, engine tests or spacewalks. The endpoint has a search filter.",
    imageUrl: "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/static/home/thespacedevs/images/ll2features/events.jpg",
  },
  {
    title: "Agencies",
    description:
      "These are agencies involved in spaceflight that are somehow connected to data in other parts of the API. These could be launch service providers, space agencies or rocket manufacturers. The endpoint has a variety of filters and parameters, such as type or country code.",
    imageUrl: "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/static/home/thespacedevs/images/ll2features/agencies.jpeg",
  },
  {
    title: "Astronauts",
    description:
      "We aim to track every known astronaut past, present and future. The endpoint has a variety of filters and parameters, such as name, status or nationality.",
    imageUrl: "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/static/home/thespacedevs/images/ll2features/astronauts.jpg",
  },
  {
    title: "Space Stations",
    description:
      "We aim to track every known space station past, present and future. The endpoint has a variety of filters and parameters, such as name, status or owners.",
    imageUrl: "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/static/home/thespacedevs/images/ll2features/spacestations.jpg",
  },
  {
    title: "Expeditions",
    description:
      "These are expeditions that have been made to space stations. The endpoint has a variety of filters and parameters, such as name or space station.",
    imageUrl: "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/static/home/thespacedevs/images/ll2features/expeditions.jpg",
  },
  {
    title: "Dockings",
    description:
      "These are docking events that have occurred between a spacecraft and a space station. This is intended to track visiting vehicles, both crewed and uncrewed. The endpoint has a variety of filters and parameters, such as space station or docking location.",
    imageUrl: "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/static/home/thespacedevs/images/ll2features/dockings.jpg",
  },
  {
    title: "Launch Vehicles",
    description:
      "This contains rocket configurations, such as ‘Falcon 9 Block 5’. We only have launch vehicles which are used by our launch objects, we don’t have launch vehicles which are used in launches we don’t track. The endpoint has a variety of filters and parameters, such as name, family or agency.",
    imageUrl: "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/static/home/thespacedevs/images/ll2features/launchvehicles.jpg",
  },
  {
    title: "Reusable First Stages",
    description:
      "We track first rocket stages when a launch vehicle can be used more than once such as the Falcon 9 cores used by SpaceX. The endpoint has a variety of filters and parameters, such as serial number or flight number.",
    imageUrl: "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/static/home/thespacedevs/images/ll2features/firststages.jpg",
  },
  {
    title: "Spacecraft",
    description:
      "This contains a list of spacecraft configurations past, present and future, such as the “Mercury” or “Dragon” capsules. The endpoint has a variety of filters and parameters, such as name or status.",
    imageUrl: "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/static/home/thespacedevs/images/ll2features/spacecrafts.jpg",
  },
  {
    title: "Locations",
    description:
      "This contains a list of all locations where launch vehicles have flown from. These include locations such as Cape Canaveral, Florida and Kourou, French Guiana. The endpoint has a variety of filters and parameters, such as country code and name.",
    imageUrl: "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/static/home/thespacedevs/images/ll2features/location.jpg",
  },
  {
    title: "Pads",
    description:
      "This contains a list of all pads where launch vehicles have flown from. This endpoint is similar to that of the location endpoint, however, is more specific and contains information on the individual pads at each location. An example of this pad would be 'Space Launch Complex 40', which is located in Cape Canaveral. The endpoint has a variety of filters and parameters, such as location id and name.",
    imageUrl: "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/static/home/thespacedevs/images/ll2features/pad.jpg",
  },
];

const NearestCelestial = () => {
  return (
    <div className="min-h-screen bg-cosmic">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4">
              Space Data Libraries
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive space data from launches, missions, astronauts, and more. 
              All data below is static for demo purposes. In a real app, it can be fetched from a live API.
            </p>
          </div>
        </div>
      </section>

      {/* Data Sections */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTIONS.map((section, index) => (
              <Card 
                key={section.title}
                className="planet-card group hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="font-display text-lg group-hover:text-primary transition-colors">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={section.imageUrl}
                      alt={section.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NearestCelestial;
