/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../main";
import { useSelector } from "react-redux";

const Dashboard = ({ socket }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const { fullName, userId } = useSelector((state) => state.userAuth);

  useEffect(() => {
    const fetchInitialActiveUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/active-users`);
        setActiveUsers(response.data);
      } catch (error) {
        console.error("Error fetching initial active users:", error);
      }
    };

    fetchInitialActiveUsers();
  }, []);

  useEffect(() => {
    socket.on("activeUsers", (data) => {
      setActiveUsers(data);
    });
  }, [socket]);

  const sendChallenge = (targetUser) => {
    const data = {
      userId: userId,
      fullName: fullName,
    };
    socket.emit("sendChallenge", {
      opponentId: targetUser.userId,
      challenger: data,
    });
  };

  return (
    <div className="flex">
      {/* Left Panel - Active Users */}
      <div className="flex flex-col items-center p-4">
        <h1 className="text-4xl font-bold mb-4">Active Users</h1>
        <div>
          {activeUsers?.map((user) => (
            <div
              key={user.userId}
              className="flex items-center justify-between w-full p-4  bg-blue-500 text-white rounded"
            >
              <span>
                {user.fullName === fullName ? "You" : user.fullName} Live
              </span>
              <button
                className="ml-2 text-white"
                onClick={() => sendChallenge(user)}
              >
                Challenge
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
