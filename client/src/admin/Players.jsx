import {
  useEffect,
  useState,
} from "react"; /* eslint-disable react/prop-types */
import axios from "axios";
import { BASE_URL } from "../main";
import { Link } from "react-router-dom";
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
    <div className="w-full p-4">
      <h1 className="text-4xl font-bold mb-4">All Users</h1>
      <div>
        {allUsers?.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between w-full p-4 mb-4  bg-gray-200 text-gray-800 rounded"
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
  );
};

export default Players;
