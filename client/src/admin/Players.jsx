import {
  useEffect,
  useState,
} from "react"; /* eslint-disable react/prop-types */
import axios from "axios";
import { BASE_URL } from "../main";
import { Link } from "react-router-dom";
import serverUsers from "@assets/server_users.jpg";
import Banner from "../components/Banner";

const Players = () => {
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
  const [allUsers, setAllUsers] = useState([]);
  return (
    <>
      <Banner
        bannerImage={serverUsers}
        heading={"Server Players List"}
        subheading={"#visitprofile"}
      />
      <div className="p-4 w-full border-t mt-4 md:max-w-lg md:mx-auto md:p-2 md:pb-4">
        {allUsers?.map((user) => (
          <div
            key={user.userId}
            className="flex items-center justify-between w-full px-4 py-2 md:py-4 bg-background border text-dark1 rounded mt-4 gap-2"
          >
            <span className="text-xl font-bold flex-1">{user?.fullName}</span>

            <Link to={`/profile/${user?._id}`}>
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

export default Players;
