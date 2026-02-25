import { useState } from "react";
import Cell from "./Cell";


function Game() {

    const initialBoard = [
        [-1,-1, 1, 1, 1,-1,-1],
        [-1,-1, 1, 1, 1,-1,-1],
        [ 1, 1, 1, 1, 1, 1, 1],
        [ 1, 1, 1, 0, 1, 1, 1],
        [ 1, 1, 1, 1, 1, 1, 1],
        [-1,-1, 1, 1, 1,-1,-1],
        [-1,-1, 1, 1, 1,-1,-1],
    ];

    const [board, setBoard] = useState(initialBoard);
    const [selected, setSelected] = useState(null);
    const [history, setHistory] = useState([]);
    const [gameStatus, setGameStatus] = useState(null);

    const undoMove = () => {
        setHistory(prevHistory => {
            if (prevHistory.length === 0)
                return prevHistory;
            const previousBoard = prevHistory[prevHistory.length - 1];
            setBoard(previousBoard);
            if (hasPossibleMoves(previousBoard))
                setGameStatus(null);
            return prevHistory.slice(0, -1);
        });
    };

    const countMarbles = (currentBoard) => {
        let count = 0;
        for (let i = 0; i < 7; i++)
            for (let j = 0; j < 7; j++)
                if (currentBoard[i][j] === 1)
                    count++;
        return count;
    };

    const hasPossibleMoves = (currentBoard) => {
        const directions = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ];
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                if (currentBoard[i][j] !== 1)
                    continue;
                for (let [dx, dy] of directions) {
                    const midX = i + dx;
                    const midY = j + dy;
                    const landingX = i + 2 * dx;
                    const landingY = j + 2 * dy;
                    if (landingX < 0 || landingX >= 7 || landingY < 0 || landingY >= 7)
                        continue;
                    if (currentBoard[midX][midY] === 1 && currentBoard[landingX][landingY] === 0)
                        return true;
                }
            }
        }
        return false;
    };

    const handleClick = (row, col) => {
        if (gameStatus)
            return;
        if (board[row][col] === -1)
            return;
        if (board[row][col] === 1) {
            setSelected({ row, col });
            return;
        }
        if (board[row][col] === 0 && selected) {
            attemptMove(selected.row, selected.col, row, col);
            setSelected(null);
        }
    };

    const isMoveValid = (r1, c1, r2, c2) => {
        if (r1 !== r2 && c1 !== c2)
            return false;
        const rowDiff = r2 - r1;
        const colDiff = c2 - c1;
        if (!(Math.abs(rowDiff) === 2 || Math.abs(colDiff) === 2))
            return false;
        const midRow = r1 + rowDiff / 2;
        const midCol = c1 + colDiff / 2;
        if (board[midRow][midCol] !== 1)
            return false;
        if (board[r2][c2] !== 0)
            return false;
        return true;
    };

    const attemptMove = (r1, c1, r2, c2) => {
        if (!isMoveValid(r1, c1, r2, c2))
            return;
        const rowDiff = r2 - r1;
        const colDiff = c2 - c1;
        const midRow = r1 + rowDiff / 2;
        const midCol = c1 + colDiff / 2;
        const newBoard = board.map(r => [...r]);
        newBoard[r1][c1] = 0;
        newBoard[midRow][midCol] = 0;
        newBoard[r2][c2] = 1;
        setHistory(prev => [...prev, board.map(r => [...r])]);
        setBoard(newBoard);
        const remaining = countMarbles(newBoard);
        if (remaining === 1)
            setGameStatus("win");
        else if (!hasPossibleMoves(newBoard))
            setGameStatus("lose");
    };

    const handleDropMove = (r1, c1, r2, c2) => {
        if (gameStatus)
            return;
        attemptMove(r1, c1, r2, c2);
    };

    const restartGame = () => {
        setBoard(initialBoard);
        setSelected(null);
        setHistory([]);
        setGameStatus(null);
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <h1 className="text-5xl font-bold mb-4">Brainvita</h1>
            {gameStatus === "win" && (
                <div className="mb-4 text-green-600 text-xl font-bold">
                    Congratulations! You Won!
                </div>
            )}
            {gameStatus === "lose" && (
                <div className="mb-4 text-red-600 text-xl font-bold">
                    No more possible moves. Game Over.
                </div>
            )}
            <div className="flex gap-4">
                <button onClick={undoMove} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Undo</button>
                <button onClick={restartGame} className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Restart</button>
            </div>
            <div className="mb-2 text-lg">
                Marbles Left: {countMarbles(board)}
            </div>
            {board.map((row, rIndex) => (
                <div key={rIndex} className="flex">
                    {row.map((cell, cIndex) => (
                        <Cell key={cIndex} value={cell} row={rIndex} col={cIndex} onClick={() => handleClick(rIndex, cIndex)} onDropMove={handleDropMove} selected={selected}/>
                    ))}
                </div>
            ))}
            <h1 className="absolute bottom-4 right-1 transform -translate-x-1/2 text-gray-700">By Devkumar Baheti</h1>
        </div>
    )
}

export default Game