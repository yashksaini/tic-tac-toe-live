/* eslint-disable react/prop-types */
// TicTacToeBoard.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../main";

const TicTacToeBoard = ({ socket, playerNames }) => {
  console.log(socket, socket.id);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const { fullName } = useSelector((state) => state.userAuth);
  const { roomId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/room-board/${roomId}`);
        const { board, isXNext } = response.data;
        setBoard(board);
        setIsXNext(isXNext);

        console.log("Initial Data", response.data);
      } catch (error) {
        console.error("Error fetching board data:", error);
      }
    };

    fetchData();
  }, [roomId]);

  // Emit the updated board to the other player

  const handleClick = (index) => {
    if (!board[index] && !calculateWinner(board)) {
      const newBoard = board.slice();
      newBoard[index] = isXNext ? "X" : "O";
      setBoard(newBoard);
      setIsXNext(!isXNext);
      const temp = !isXNext;

      // Emit the updated board to the other player
      socket.emit("updateBoard", { board: newBoard, roomId, isXNext: temp });
    }
  };

  // Listen for updates from the other player
  socket.on("updateBoard", ({ board, isXNext }) => {
    console.log("Inside Getting board update", board, isXNext);
    setBoard(board);
    setIsXNext(isXNext);
  });

  const renderSquare = (index) => {
    return (
      <button
        className="square border p-4"
        disabled={isXNext !== (fullName === playerNames[0])}
        onClick={() => handleClick(index)}
      >
        {board[index]}
      </button>
    );
  };

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner} ${isXNext ? playerNames[0] : playerNames[1]}`
    : `Next player: ${isXNext ? playerNames[0] : playerNames[1]}`;

  return (
    <div className="w-64 mx-auto">
      <div className="status mb-4 text-center">{status}</div>
      <div className="grid grid-cols-3 gap-2">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

// Helper function to calculate the winner
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
