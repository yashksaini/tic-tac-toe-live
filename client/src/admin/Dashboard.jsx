import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "../App";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const { fullName, userId } = useSelector((state) => state.userAuth);

  useEffect(() => {
    const socket = io(BASE_URL);
    socket.emit("setName_Id", fullName, userId);
    // Listen for "userJoined" event to update the list of active users
    socket.on("userJoined", (user) => {
      setActiveUsers((prevUsers) => {
        console.log(prevUsers, "PREV USERS");
        const existingUserIndex = prevUsers.findIndex(
          (u) => u.userId === user.userId
        );

        if (existingUserIndex !== -1) {
          // If user already exists, update their information
          const updatedUsers = [...prevUsers];
          updatedUsers[existingUserIndex] = user;
          return updatedUsers;
        } else {
          // If user is new, add them to the list
          return [...prevUsers, user];
        }
      });
    });

    // Listen for "userLeft" event to update the list of active users
    socket.on("userLeft", (userId) => {
      setActiveUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
    });

    // Listen for "userUpdated" event to update the user's information
    socket.on("userUpdated", (updatedUser) => {
      setActiveUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    });

    // Fetch initial list of active users
    const fetchActiveUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/active-users`);
        setActiveUsers(response.data);
      } catch (error) {
        console.error("Error fetching active users:", error);
      }
    };
    fetchActiveUsers();

    return () => {
      socket.disconnect();
    };
  }, [fullName]);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {activeUsers.map((user) => (
          <Link to={`/profile/${user.userId}`} key={user.id}>
            <li key={user.id}>
              {user.name} {user.isLive ? "(Live)" : ""}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
