
import BriefIntake from "@/components/positioning/BriefIntake";
import GoldenCircle from "@/components/positioning/GoldenCircle";
import OpportunitiesChallenges from "@/components/positioning/OpportunitiesChallenges";
import Roadmap from "@/components/positioning/Roadmap";
import Values from "@/components/positioning/Values";
import Differentiators from "@/components/positioning/Differentiators";
import Statements from "@/components/positioning/Statements";

export const STEP_CONFIG = [
  { 
    id: "brief", 
    name: "Brief Intake", 
    component: BriefIntake, 
    isValid: (ctx: any) => ctx.briefContext.split(/\s+/).filter(Boolean).length >= 20 
  },
  { 
    id: "golden-circle", 
    name: "Golden Circle", 
    component: GoldenCircle, 
    isValid: (ctx: any) => ctx.selectedGoldenCircle.why.length > 0 && 
      ctx.selectedGoldenCircle.how.length > 0 && 
      ctx.selectedGoldenCircle.what.length > 0 
  },
  { 
    id: "opportunities-challenges", 
    name: "Opportunities & Challenges", 
    component: OpportunitiesChallenges, 
    isValid: (ctx: any) => ctx.selectedOpportunities.length >= 2 && ctx.selectedChallenges.length >= 2 
  },
  { 
    id: "roadmap", 
    name: "Roadmap", 
    component: Roadmap, 
    isValid: () => true 
  },
  { 
    id: "values", 
    name: "Values", 
    component: Values, 
    isValid: (ctx: any) => ctx.selectedValues.length >= 3 && ctx.selectedValues.length <= 7 
  },
  { 
    id: "differentiators", 
    name: "Differentiators", 
    component: Differentiators, 
    isValid: (ctx: any) => ctx.pinnedDifferentiators.length === 3 
  },
  { 
    id: "statements", 
    name: "Statements", 
    component: Statements, 
    isValid: () => true 
  },
];
