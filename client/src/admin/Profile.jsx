/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../main";
import { useSelector } from "react-redux";
import profileImage from "@assets/default_profile.jpg";
import logo from "@assets/logo.png";
import { TbCameraPlus } from "react-icons/tb";
import { toast } from "react-toastify";
const Profile = ({ socket }) => {
  const [userData, setUserData] = useState({});
  const { id } = useParams();
  const { fullName, userId } = useSelector((state) => state.userAuth);
  const [userExists, setUserExists] = useState(true);
  const [profileUpdated, setProfileUpdated] = useState(false);

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
            visitorId: userId, // Send the userId of the visitor
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserExists(false);
      }
    };

    fetchUserData();
  }, [fullName, id, socket, userId, profileUpdated]);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 500 KB

      if (file && file.size > maxSize) {
        toast.error("File size exceeds the limit (5 MB)");
      } else {
        toast.success("Uploading Image...");
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const img = reader.result.split(",")[1];
          try {
            const response = await axios.put(`${BASE_URL}/update-image`, {
              profileImage: img,
              userId: userId,
            });
            if (response.status === 200) {
              toast.success("Profile updated successfully");
              setProfileUpdated(!profileUpdated);
            }
          } catch (error) {
            toast.error("Error updating profile image");
            console.log(error);
          }
        };
      }
    }
  };

  return (
    <>
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
              src={
                userData?.profileImage
                  ? "data:image/png;base64," + userData?.profileImage
                  : profileImage
              }
              alt="Profile"
              className="m-auto w-40 h-40 rounded-full shadow-md"
            />
          </div>
          <div className="w-full mt-20">
            <h1 className="w-full text-center text-2xl text-dark1 font-bold flex justify-center items-center gap-3">
              {userData?.fullName}
              {userId === id ? (
                <>
                  <label htmlFor="profileImg">
                    <TbCameraPlus className="inline-block cursor-pointer" />
                  </label>
                  <input
                    type="file"
                    id="profileImg"
                    accept="image/*"
                    className="hidden"
                    onChange={onSelectFile}
                  />
                </>
              ) : null}
            </h1>

            <p className="w-full text-center text-xl text-gray-500 font-medium ">
              @{userData?.username}
            </p>
          </div>
          <div className="w-full p-4 border-t mt-4 grid grid-cols-2 gap-4 text-dark1 md:max-w-lg md:mx-auto relative">
            <div className="absolute w-32 h-32 top-[calc(50%_-_64px)] left-[calc(50%_-_64px)] rounded-full bg-background border flex justify-center items-center flex-col">
              <span className="text-[36px] font-bold text-primary">
                {userData?.points}
              </span>
              <h2 className="text-xs">Points</h2>
            </div>
            <div className=" bg-background text-center rounded-xl p-8 border">
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
    </>
  );
};

export default Profile;
