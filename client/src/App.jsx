/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { Route, useNavigate, Navigate, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { changeAuthentication } from "./redux/userAuthentication";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./admin/Dashboard";
import Profile from "./admin/Profile";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import { BASE_URL } from "./main";
import GameRoom from "./admin/GameRoom";
import Players from "./admin/Players";
import ProfileVisits from "./admin/ProfileVisits";
import { FiCheckCircle } from "react-icons/fi";
import { IoIosCloseCircleOutline } from "react-icons/io";

function App({ socket }) {
  const dispatch = useDispatch();
  const { isAuth, userId, fullName } = useSelector((state) => state.userAuth);
  const [showChallengePopup, setShowChallangePopup] = useState(false);
  const [challangerData, setChallangerData] = useState({});
  const navigate = useNavigate();
  const [gameRoomId, setGameRoomId] = useState("");

  useEffect(() => {
    let currName = fullName;
    const getAuth = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/auth`);
        dispatch(changeAuthentication(response.data));
        currName = response.data.fullName;
        if (response.data) {
          socket.emit("login", response.data);
        } else {
          socket.emit("logout", socket.id);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getAuth();
    socket.on("profileVisit", ({ visitorName }) => {
      toast(`${visitorName} visited your profile.`);
    });

    socket.on("alreadyInRoom", ({ message }) => {
      toast.info(`${message}`);
    });

    socket.on("receiveChallenge", ({ challenger, roomId }) => {
      setGameRoomId(roomId);
      setShowChallangePopup(true);
      setChallangerData(challenger);
    });

    socket.on("challengeAccepted", ({ roomId, challenger, challengedTo }) => {
      if (challengedTo.fullName === currName) {
        toast.success("You Accepted the challange");
      } else {
        toast.success(`${challengedTo.fullName} accepted challange.`);
      }
      navigate(`/game-room/${roomId}`, {
        state: {
          playerNames: [challenger.fullName, challengedTo.fullName],
          playerIds: [challenger.userId, challengedTo.userId],
        },
      });
    });

    socket.on("challengeDeclined", ({ challengedTo }) => {
      toast.error(`${challengedTo.fullName} decline your challange.`);
    });
  }, []);

  const handleChallengeResponse = (response) => {
    if (response === "accept") {
      // Send a challenge accepted event to the server
      socket.emit("acceptChallenge", {
        roomId: gameRoomId,
        challenger: challangerData,
        challengedTo: { userId, fullName },
      });
    } else {
      // Send a challenge declined event to the server
      socket.emit("declineChallenge", {
        challenger: challangerData,
        challengedTo: { userId, fullName },
      });
    }

    setShowChallangePopup(false);
  };
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await axios.get(`${BASE_URL}/check-server-status`);
      } catch (error) {
        toast.warning("Server is sleeping", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
          closeOnClick: false,
          closeButton: false,
          draggable: false,
        });
        toast.success("Wait for 10s and reload", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 10000,
          closeOnClick: false,
          closeButton: false,
          draggable: false,
          delay: 1000,
        });
      }
    };
    checkServerStatus();
  }, []);

  return (
    <>
      {isAuth && <Navbar />}
      <div
        className={`${
          isAuth
            ? "pb-[72px] md:pb-0 md:w-[calc(100%_-_320px)] md:ml-[320px]"
            : ""
        }`}
      >
        <Routes>
          {/* For Unauthenticated Users */}
          {!isAuth && (
            <>
              <Route element={<Login />} path="/" />
              <Route element={<Signup />} path="/sign-up" />
            </>
          )}

          {/* If user is admin */}
          {isAuth && (
            <>
              <Route element={<Dashboard socket={socket} />} path="/" />
              <Route element={<Players socket={socket} />} path="/players" />
              <Route
                element={<ProfileVisits socket={socket} />}
                path="/visits"
              />
              <Route
                element={<Profile socket={socket} />}
                path="/profile/:id"
              />
              <Route
                element={<GameRoom socket={socket} />}
                path="/game-room/:roomId"
              />
            </>
          )}

          {/* Redirect unauthenticated users to Login for undefined routes */}
          {!isAuth && <Route element={<Login />} path="*" />}

          {/* Redirect unauthenticated users to Login for undefined routes */}
          {isAuth && <Route path="*" element={<Navigate to="/" />} />}
        </Routes>
      </div>

      <ToastContainer position="top-right" autoClose={1000} />
      {/* Challenge Popup */}
      {showChallengePopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-[51] p-4">
          <div className="bg-white p-12 rounded-3xl w-[480px] max-w-full text-center">
            <b className="text-2xl mb-2">{challangerData?.fullName}</b>
            <p className="mb-8">Challanged you for a game?</p>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-full"
                onClick={() => handleChallengeResponse("accept")}
              >
                <FiCheckCircle className="mr-1 inline" /> <span>Accept</span>
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-full"
                onClick={() => handleChallengeResponse("decline")}
              >
                <IoIosCloseCircleOutline className="mr-1 inline" />{" "}
                <span>Decline</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
