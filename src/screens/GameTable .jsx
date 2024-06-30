import React from 'react';
import { useNavigate } from 'react-router-dom';

const GameTable = () => {
  const players = [
    { id: 1, name: 'Player 1', score: 0 },
    { id: 2, name: 'Player 2', score: 0 },
  ];

  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Fast Sling Puck</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 p-2">Player</th>
              <th className="border-b-2 p-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id}>
                <td className="border-b p-2">{player.name}</td>
                <td className="border-b p-2">{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-around">
          <button onClick={()=>navigate('/game')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Start Game
          </button>

          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Reset Scores
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameTable;
