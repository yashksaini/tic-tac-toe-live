import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import Banner from "../components/Banner";
import profileVisitImg from "@assets/profile_visit.png";
import axios from "axios";
import { BASE_URL } from "../main";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ProfileVisits = () => {
  const [visitedUsers, setVistedUsers] = useState([]);
  const { userId } = useSelector((state) => state.userAuth);

  useEffect(() => {
    const getVistedUsers = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/profile-visitors?userId=${userId}`
        );
        setVistedUsers(response.data);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    getVistedUsers();
  }, [userId]);

  return (
    <>
      <Banner
        bannerImage={profileVisitImg}
        heading={"Profile visited by" + " " + visitedUsers.length}
        subheading={"#profilevisitors"}
      />
      <div className="p-4 w-full border-t mt-4 md:max-w-lg md:mx-auto md:p-2 md:pb-4">
        {visitedUsers?.map((user) => (
          <div
            key={user.userId}
            className="flex items-center justify-between w-full px-4 py-2 md:py-4 bg-background border text-dark1 rounded mt-4 gap-2"
          >
            <div>
              <span className="text-xl font-bold flex-1">
                {user?.visitorId?.fullName}
              </span>
              <span className="text-xs text-gray-500 block">
                <b>
                  {formatDistanceToNow(user?.timestamp, { addSuffix: true })}
                </b>{" "}
                visits your profile
              </span>
            </div>

            <Link to={`/profile/${user?.visitorId?._id}`}>
              <button className="border rounded-md text-xs px-3 py-2 bg-white font-semibold">
                Visit Profile
              </button>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfileVisits;
