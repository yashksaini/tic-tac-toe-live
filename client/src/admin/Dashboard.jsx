/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../main";
import { useSelector } from "react-redux";
import activeLogo from "@assets/active_users.png";
import Banner from "../components/Banner";
import { toast } from "react-toastify";
import { IoMdWifi } from "react-icons/io";
import { GiCrossedSwords } from "react-icons/gi";

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
    toast.success(`Challenge sent to ${targetUser?.fullName}`);
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
      <Banner
        bannerImage={activeLogo}
        heading={"Active Players List"}
        subheading={"#challange&win"}
      />
      <div className="px-4 w-full border-t mt-4 md:max-w-lg md:mx-auto md:p-4">
        {activeUsers
          ?.filter((data) => data.fullName !== fullName)
          ?.map((user) => (
            <div
              key={user.userId}
              className="flex items-center justify-between w-full px-2 py-2 md:py-4 bg-background border text-dark1 rounded-xl mt-4 gap-2"
            >
              <span className="text-3xl">
                <IoMdWifi className="text-green-500" />
              </span>
              <span className="text-xl font-bold flex-1">{user.fullName}</span>
              {user.userId !== userId ? (
                <button
                  className="border rounded-xl text-xs px-3 py-2 bg-white font-semibold hover:bg-dark2 hover:text-white hover:border-dark2 transition-all"
                  onClick={() => sendChallenge(user)}
                >
                  <GiCrossedSwords className="inline mr-1" /> Challenge
                </button>
              ) : null}
            </div>
          ))}
        {activeUsers?.filter((data) => data.fullName !== fullName).length ===
        0 ? (
          <div className="text-center text-gray-500 my-4">
            No active players right now
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Dashboard;
