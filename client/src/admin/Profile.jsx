/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../main";
import { useSelector } from "react-redux";
import profileImage from "@assets/default_profile.jpg";
import logo from "@assets/logo.png";

const Profile = ({ socket }) => {
  const [userData, setUserData] = useState({});
  const { id } = useParams();
  const { fullName, userId } = useSelector((state) => state.userAuth);
  const [userExists, setUserExists] = useState(true);

  useEffect(() => {
    // Fetch user data based on the userId
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/${id}`);
        if (!response.data) {
          setUserExists(false);
          return;
        }

        setUserData(response.data);

        // Emit a "profileVisit" event when the user's profile is visited
        if (userId !== id) {
          socket.emit("profileVisit", {
            visitedUserId: id,
            visitorName: fullName, // Send the name of the visitor
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserExists(false);
      }
    };

    fetchUserData();
  }, [fullName, id, socket, userId]);

  return (
    <div className="">
      {userExists ? (
        <>
          <div className="h-40 w-full bg-dark2 rounded-bl-[32px] rounded-br-[32px] md:rounded-none">
            <div className="w-full flex flex-1 gap-1 justify-center items-center py-4">
              <img src={logo} alt="Logo" className="w-10 h-10 " />
              <span className="text-white text-xl font-bold tracking-tighter mt-[4px]">
                CONNECT
              </span>
            </div>
            <img
              src={profileImage}
              alt="Profile"
              className="m-auto w-40 h-40 rounded-full shadow-md"
            />
          </div>
          <div className="w-full mt-20">
            <h1 className="w-full text-center text-2xl text-dark1 font-bold">
              {userData?.fullName}
            </h1>
            <p className="w-full text-center text-xl text-gray-500 font-medium">
              @{userData?.username}
            </p>
          </div>
          <div className="w-full p-4 border-t mt-4 grid grid-cols-2 gap-4 text-dark1 md:max-w-lg md:mx-auto">
            <div className=" bg-background  text-center rounded-xl p-8 border">
              <span className="text-[48px] font-bold">
                {userData?.gamesPlayed}
              </span>
              <h2 className="text-xs">Played</h2>
            </div>
            <div className=" bg-background  text-center rounded-xl p-8 border">
              <span className="text-[48px] font-bold">
                {userData?.gamesWon}
              </span>
              <h2 className="text-xs">Won</h2>
            </div>
            <div className=" bg-background text-center rounded-xl p-8 border">
              <span className="text-[48px] font-bold">
                {userData?.gamesDrawn}
              </span>
              <h2 className="text-xs">Drawn</h2>
            </div>
            <div className=" bg-background text-center rounded-xl p-8 border">
              <span className="text-[48px] font-bold">
                {userData?.gamesLost}
              </span>
              <h2 className="text-xs">Lost</h2>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-md shadow-md">
          <p className="text-xl text-gray-700">
            This user doesn&apos;t exist or an error occurred while fetching the
            data.
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;
