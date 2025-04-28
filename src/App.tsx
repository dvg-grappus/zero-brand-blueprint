
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Timeline from "./pages/Timeline";
import NotFound from "./pages/NotFound";
import StepPage from "./pages/StepPage";
import AudiencePage from "./pages/AudiencePage";
import CompetitionPage from "./pages/CompetitionPage";
import MarketPage from "./pages/MarketPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <div className="dark">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/timeline" element={<Timeline />} />
            
            {/* Positioning module routes */}
            <Route path="/step/1" element={<StepPage />} /> 
            <Route path="/step/all" element={<StepPage />} />
            <Route path="/step/1/:substep" element={<StepPage />} />
            
            {/* Audience module routes */}
            <Route path="/step/2" element={<Navigate to="/step/2/cohort-canvas" replace />} /> {/* Add redirect for base audience path */}
            <Route path="/step/2/:substep" element={<AudiencePage />} />
            <Route path="/step/2/persona/:personaId" element={<AudiencePage />} />
            
            {/* Competition module routes */}
            <Route path="/step/3/:substep" element={<CompetitionPage />} />
            <Route path="/step/3" element={<CompetitionPage />} /> 
            
            {/* Market module routes */}
            <Route path="/step/4" element={<MarketPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
