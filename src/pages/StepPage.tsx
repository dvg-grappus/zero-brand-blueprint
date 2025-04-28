
import React from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import PositioningPage from "@/pages/PositioningPage";
import AudiencePage from "@/pages/AudiencePage";
import CompetitionPage from "@/pages/CompetitionPage";
import MarketPage from "@/pages/MarketPage";
import PersonalityPage from "@/pages/PersonalityPage";
import MoodboardsPage from "@/pages/MoodboardsPage";

interface Props {}

const StepPage: React.FC<Props> = () => {
  const { stepId } = useParams<{ stepId: string }>();

  if (!stepId) {
    return <Navigate to="/not-found" replace />;
  }

  const renderStepContent = () => {
    switch (stepId) {
      case "1":
        return <PositioningPage />;
      case "2":
        return <AudiencePage />;
      case "3":
        return <CompetitionPage />;
      case "4":
        return <PersonalityPage />;
      case "5":
        return <MoodboardsPage />;
      default:
        return <Navigate to="/not-found" replace />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={renderStepContent()} />
      <Route path="attributes" element={<MoodboardsPage />} />
      <Route path="directions" element={<MoodboardsPage />} />
      <Route path="moodboards" element={<MoodboardsPage />} />
      <Route path="compare" element={<MoodboardsPage />} />
      <Route path="*" element={renderStepContent()} />
    </Routes>
  );
};

export default StepPage;
