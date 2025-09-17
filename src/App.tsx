import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Knowledge from "./pages/Knowledge";
import LiveTracker from "./pages/LiveTracker";
import MissionTimeline from "./pages/MissionTimeline";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";
import SolarSystem from "./pages/SolarSystem";
import Exoplanets from "./pages/Exoplanets";
import Galaxies from "./pages/Galaxies";
import View from "./pages/View";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/tracker" element={<LiveTracker />} />
          <Route path="/missions" element={<MissionTimeline />} />
          <Route path="/quizzes" element={<Quiz />} />
          <Route path="/solar-system" element={<SolarSystem />} />
          <Route path="/exoplanets" element={<Exoplanets />} />
          <Route path="/galaxies" element={<Galaxies />} />
          <Route path="/Explore-the-Space" element={<View />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
