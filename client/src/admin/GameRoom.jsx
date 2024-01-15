/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TicTacToeBoard from "../components/TicTacToeBoard";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const GameRoom = ({ socket }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [playerNames, setPlayerNames] = useState([]);
  const { userId, fullName } = useSelector((state) => state.userAuth);

  useEffect(() => {
    // Extract the player names from the location state
    const { state } = location;
    if (!state) {
      navigate("/dashboard");
      return;
    }

    if (state && state.playerNames) {
      setPlayerNames(state.playerNames);
    }
    // Remove the user from the room when the component is unmounted
    const cleanup = () => {
      socket.emit("leaveRoom", {
        roomId: roomId,
        userId: userId,
        fullName: fullName,
      });
      toast.info("You left the room");
    };

    // Handle the playerLeft event
    socket.on("playerLeft", ({ fullName }) => {
      toast.warning(`${fullName} has left the room`);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    });

    // Clean up function to be executed on component unmount
    return () => {
      socket.off("playerLeft");
      cleanup();
    };
  }, [location, roomId, userId, navigate, socket, fullName]);

  return (
    <div>
      <h1>Game Room</h1>
      <h2>Players in the Room:</h2>
      <ul>
        {playerNames.map((playerName) => (
          <li key={playerName}>{playerName}</li>
        ))}
      </ul>
      <TicTacToeBoard socket={socket} playerNames={playerNames} />
    </div>
  );
};

export default GameRoom;
