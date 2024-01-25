/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../main";

const TicTacToeBoard = ({
  socket,
  playerNames,
  updateIsCompleted,
  playerIds,
}) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const { fullName, userId } = useSelector((state) => state.userAuth);
  const { roomId } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/room-board/${roomId}`);
      const { board, isXNext } = response.data;
      setBoard(board);
      setIsXNext(isXNext);
    } catch (error) {
      console.error("Error fetching board data:", error);
      toast.error("Error fetching board data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [roomId]);

  const handleGameEnd = (status, points, delay) => {
    toast.success(status, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
      toastId: roomId,
    });

    if (points !== null) {
      toast.success(points, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        toastId: roomId + points.toLowerCase(),
        delay: 2000,
      });
    }

    setTimeout(() => {
      navigate("/");
    }, delay);
  };

  const handleClick = (index) => {
    if (!board[index] && !calculateWinner(board)) {
      const newBoard = board.slice();
      newBoard[index] = isXNext ? "X" : "O";
      setBoard(newBoard);

      let temp = isXNext;
      if (!calculateWinner(newBoard)) {
        temp = !isXNext;
        setIsXNext(temp);
      }

      socket.emit("updateBoard", { board: newBoard, roomId, isXNext: temp });
    }
  };

  socket.on("updateBoard", ({ board, isXNext }) => {
    setBoard(board);
    setIsXNext(isXNext);
  });

  const renderSquare = (index) => {
    const isLastColumn = index === 2 || index === 5 || index === 8;
    const isLastRow = index >= 6;
    const isX = board[index] === "X";

    return (
      <button
        key={index}
        className={`font-bold text-[48px] w-full aspect-square flex justify-center items-center border-dark1 hover:bg-background disabled:hover:bg-white ${
          isX ? "text-primary" : "text-dark1"
        } ${isLastColumn ? "" : "border-r-2 "} ${
          isLastRow ? "" : "border-b-2 "
        }`}
        disabled={isXNext !== (fullName === playerNames[0])}
        onClick={() => handleClick(index)}
      >
        {board[index]}
      </button>
    );
  };

  const winner = calculateWinner(board);

  useEffect(() => {
    if (winner) {
      const winnerName = isXNext ? playerNames[0] : playerNames[1];
      const status = `Winner is ${winnerName}`;
      const points = winnerName === fullName ? "+2 Points" : "0 Points";

      handleGameEnd(status, points, 5500);
    }
  }, [fullName, isXNext, navigate, playerNames, roomId, winner]);

  useEffect(() => {
    if (!winner && board.every((square) => square !== null)) {
      handleGameEnd("Match is drawn", "+1 Points", 3500);
    }
  }, [board, winner, roomId, navigate]);

  useEffect(() => {
    if (winner) {
      const winnerId = isXNext ? playerIds[0] : playerIds[1];
      updateIsCompleted(true);
      setTimeout(() => {
        updateIsCompleted(false);
      }, 7000);
      if (playerIds[0] === userId) {
        const data = {
          roomId,
          winnerId,
          isWinner: true,
          board,
          challenger: playerIds[0],
          challengedTo: playerIds[1],
        };
        axios.post(`${BASE_URL}/game-completed`, data);
      }
    } else if (!winner && board.every((square) => square !== null)) {
      updateIsCompleted(true);
      setTimeout(() => {
        updateIsCompleted(false);
      }, 7000);
      if (playerIds[0] === userId) {
        const data = {
          roomId,
          winnerId: "N/A",
          isWinner: false,
          board,
          challenger: playerIds[0],
          challengedTo: playerIds[1],
        };
        axios.post(`${BASE_URL}/game-completed`, data);
      }
    }
  }, [board, isXNext, playerIds, roomId, socket, updateIsCompleted, winner]);

  // Helper function to render player icon and information
  const renderPlayerIcon = (isCurrentPlayer, symbol, playerName, fullName) => {
    const iconClassName = `text-green-500 ${isCurrentPlayer ? "" : "hidden"}`;

    return (
      <>
        <span
          className={`text-xl w-10 h-10 rounded-full flex justify-center items-center font-bold bg-background text-dark1 border ${
            isCurrentPlayer ? "border-green-500 bg-green-50" : ""
          }`}
        >
          <span className={iconClassName}>{symbol}</span>
        </span>
        <span
          className={`text-sm font-bold rounded-md h-10 flex-1 px-4 flex justify-start items-center bg-background text-${
            isCurrentPlayer ? "primary" : "dark1"
          } border`}
        >
          {`${playerName} ${playerName === fullName ? "(You)" : ""}`}
        </span>
      </>
    );
  };
  return (
    <>
      <div className="w-64 mx-auto mt-24">
        <div className="w-full flex justify-center items-center gap-2">
          {renderPlayerIcon(isXNext, "X", playerNames[0], fullName)}
        </div>
        <div className="grid grid-cols-3 my-8">
          {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
        </div>
        <div className="w-full flex justify-center items-center gap-2 mt-2">
          {renderPlayerIcon(!isXNext, "O", playerNames[1], fullName)}
        </div>
      </div>
    </>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
};

export default TicTacToeBoard;
