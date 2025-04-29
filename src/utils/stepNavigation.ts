
import { NavigateFunction } from "react-router-dom";

/**
 * Handles navigation to the appropriate route based on step ID
 */
export const navigateToStep = (stepId: number, navigate: NavigateFunction): void => {
  console.log(`StepNavigation: Navigating to step ${stepId}`);
  
  // Add subtle animation before navigation - lighter transition
  document.body.style.opacity = '0.95';
  setTimeout(() => {
    document.body.style.opacity = '1';
    
    // Navigation logic for each step
    switch(stepId) {
      case 1:
        navigate("/step/1");
        break;
      case 2:
        navigate("/step/2");
        break;
      case 3:
        navigate("/step/3");
        break;
      case 4:
        navigate("/step/4");
        break;
      case 5:
        navigate("/step/4/archetype");
        break;
      case 6:
        console.log('Navigating to moodboards /step/5/attributes');
        navigate("/step/5/attributes");
        break;
      case 7:
        console.log('Navigating to stylescapes /step/6/craft');
        navigate("/step/6/craft");
        break;
      case 8:
        navigate("/step/8");
        break;
      case 9:
        navigate("/step/9");
        break;
      case 10:
        navigate("/step/10");
        break;
      case 11:
        navigate("/step/11");
        break;
      case 12:
        navigate("/step/12");
        break;
      case 13:
        navigate("/step/13");
        break;
      case 14:
        navigate("/step/14");
        break;
      default:
        navigate(`/step/${stepId}`);
    }
  }, 200); // Reduced transition time for more responsive feel
};
