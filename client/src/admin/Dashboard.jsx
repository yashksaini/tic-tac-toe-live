/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../main";
import { useSelector } from "react-redux";

const Dashboard = ({ socket }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const { fullName, userId } = useSelector((state) => state.userAuth);

  useEffect(() => {
    const fetchAllUsesr = async () => {
      try {
        const responseAll = await axios.get(`${BASE_URL}/all-users`);
        setAllUsers(responseAll.data);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    fetchAllUsesr();
  }, []);

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
      <div className="flex flex-col items-center w-2/3 p-4">
        <h1 className="text-4xl font-bold mb-4">Active Users</h1>
        <div>
          {activeUsers?.map((user) => (
            <div
              key={user.userId}
              className="flex items-center justify-between w-full p-4 m-2 bg-blue-500 text-white rounded"
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

      {/* Right Panel - All Users */}
      <div className="w-1/3 p-4">
        <h1 className="text-4xl font-bold mb-4">All Users</h1>
        <div>
          {allUsers?.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between w-full p-4 m-2 bg-gray-200 text-gray-800 rounded"
            >
              {/* Use an icon for the user profile */}
              <span>{user.fullName}</span>
              <Link to={`/profile/${user._id}`}>
                <button className="ml-2">
                  <span role="img" aria-label="View Profile">
                    👤
                  </span>
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
