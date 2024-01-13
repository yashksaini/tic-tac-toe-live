// Profile.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../App";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const { userId } = useParams();
  console.log(userId);

  useEffect(() => {
    // Fetch user data based on the userId
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div>
      <h1>User Profile</h1>
      <p>
        <strong>Full Name:</strong> {userData.fullName}
      </p>
      <p>
        <strong>Username:</strong> {userData.username}
      </p>
      {/* Add any other user data fields you want to display */}
    </div>
  );
};

export default Profile;
