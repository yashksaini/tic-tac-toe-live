import {
  useEffect,
  useState,
} from "react"; /* eslint-disable react/prop-types */
import axios from "axios";
import { BASE_URL } from "../main";
import { Link } from "react-router-dom";
import logo from "@assets/logo.png";
import serverUsers from "@assets/server_users.jpg";

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
      <div className="h-40 w-full bg-dark2 rounded-bl-[32px] rounded-br-[32px] md:rounded-none">
        <div className="w-full flex flex-1 gap-1 justify-center items-center py-4">
          <img src={logo} alt="Logo" className="w-10 h-10 " />
          <span className="text-white text-xl font-bold tracking-tighter mt-[4px]">
            CONNECT
          </span>
        </div>
        <img
          src={serverUsers}
          alt="Profile"
          className="m-auto w-40 h-40 rounded-full shadow-md"
        />
      </div>
      <div className="w-full mt-20">
        <h1 className="w-full text-center text-2xl text-dark1 font-bold">
          Server Users List
        </h1>
        <p className="w-full text-center text-xl text-gray-500 font-medium">
          #visitprofile
        </p>
      </div>
      <div className="p-4 w-full border-t mt-4 md:max-w-lg md:mx-auto md:p-0">
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
