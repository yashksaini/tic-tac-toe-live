/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../main";
import { useSelector } from "react-redux";
import logo from "@assets/logo.png";
import activeLogo from "@assets/active_users.jpg";

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
    <>
      <div className="h-40 w-full bg-dark2 rounded-bl-[32px] rounded-br-[32px] md:rounded-none">
        <div className="w-full flex flex-1 gap-1 justify-center items-center py-4">
          <img src={logo} alt="Logo" className="w-10 h-10 " />
          <span className="text-white text-xl font-bold tracking-tighter mt-[4px]">
            CONNECT
          </span>
        </div>
        <img
          src={activeLogo}
          alt="Profile"
          className="m-auto w-40 h-40 rounded-full shadow-md"
        />
      </div>
      <div className="w-full mt-20">
        <h1 className="w-full text-center text-2xl text-dark1 font-bold">
          Active Players List
        </h1>
        <p className="w-full text-center text-xl text-gray-500 font-medium">
          #challange&win
        </p>
      </div>
      <div className="p-4 w-full border-t mt-4 md:max-w-lg md:mx-auto md:p-0">
        {activeUsers?.map((user) => (
          <div
            key={user.userId}
            className="flex items-center justify-between w-full px-4 py-2 md:py-4 bg-background border text-dark1 rounded mt-4 gap-2"
          >
            <span className="text-xl font-bold flex-1">
              {user.fullName === fullName ? "You" : user.fullName}{" "}
              <i className="fa-regular fa-circle-dot ml-2 text-green-500 text-sm"></i>
            </span>
            {user.userId !== userId ? (
              <button
                className="border rounded-md text-xs px-3 py-2 bg-white font-semibold"
                onClick={() => sendChallenge(user)}
              >
                Challenge
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
