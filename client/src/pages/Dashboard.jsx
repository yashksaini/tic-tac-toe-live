import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { userType, isAuth, fullName } = useSelector((state) => state.userAuth);
  useEffect(() => {
    console.log(isAuth);
    if (isAuth === true && userType === "Admin") {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      navigate("/dashboard");
    }
  }, [isAuth, navigate, userType]);
  return <>{isLoading ? "Loading..." : <div>WELCOME ADMIN {fullName}</div>}</>;
};

export default Dashboard;
