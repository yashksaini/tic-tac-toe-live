/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TicTacToeBoard from "../components/TicTacToeBoard";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import gameImage from "@assets/game_room.jpg";
import Banner from "../components/Banner";

let isCompleted = false;
const GameRoom = ({ socket }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [playerNames, setPlayerNames] = useState([]);
  const [playerIds, setPlayerIds] = useState([]);
  const { userId, fullName } = useSelector((state) => state.userAuth);

  const updateIsCompleted = () => {
    isCompleted = true;
  };

  useEffect(() => {
    // Extract the player names from the location state
    const { state } = location;
    if (!state) {
      navigate("/");
      return;
    }

    if (state && state.playerNames) {
      setPlayerNames(state.playerNames);
    }
    if (state && state.playerIds) {
      setPlayerIds(state.playerIds);
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

    if (!isCompleted) {
      // Handle the playerLeft event
      socket.on("playerLeft", ({ fullName }) => {
        toast.warning(`${fullName} has left. +2 Points`);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      });
    }

    // Clean up function to be executed on component unmount
    return () => {
      console.log(isCompleted, "COMPONENT UNMOUNT");

      if (!isCompleted) {
        socket.off("playerLeft");
        cleanup();
      }
    };
  }, [location, roomId, userId, navigate, socket, fullName]);

  return (
    <>
      <Banner bannerImage={gameImage} heading={""} subheading={""} />

      <TicTacToeBoard
        socket={socket}
        playerNames={playerNames}
        playerIds={playerIds}
        updateIsCompleted={updateIsCompleted}
      />
    </>
  );
};

export default GameRoom;
