import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectOnReload = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const confirmationMessage = "Leaving the page will exit the game room.";
      e.returnValue = confirmationMessage; // Standard for most browsers
      if (window.confirm(confirmationMessage)) {
        navigate("/dashboard");
      }
      return confirmationMessage; // For some older browsers
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);

  return null;
};

export default RedirectOnReload;
