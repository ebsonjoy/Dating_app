// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { GameModel } from "../../models/GameModel";

// export class GameController {
//     async createGame(gameType: string, player1: any, player2: any) {
//       const game = new GameModel({
//         gameType,
//         players: [
//           {
//             userId: player1.userId,
//             email: player1.email,
//             symbol: 'X'
//           },
//           {
//             userId: player2.userId,
//             email: player2.email,
//             symbol: 'O'
//           }
//         ],
//         status: 'IN_PROGRESS'
//       });
  
//       return await game.save();
//     }
  
//     async makeMove(gameId: string, move: {
//       index: number, 
//       symbol: 'X' | 'O'
//     }) {
//       const game = await GameModel.findById(gameId);
//       if (!game) throw new Error('Game not found');
  
//       // Validate move
//       if (game.board[move.index] !== null) {
//         throw new Error('Invalid move');
//       }
  
//       // Update board
//       game.board[move.index] = move.symbol;
  
//       // Check win condition
//       const winningCombos = [
//         [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
//         [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
//         [0, 4, 8], [2, 4, 6] // Diagonals
//       ];
  
//       const isWinner = winningCombos.some(combo => 
//         game.board[combo[0]] === move.symbol &&
//         game.board[combo[1]] === move.symbol &&
//         game.board[combo[2]] === move.symbol
//       );
  
//       // Check draw
//       const isDraw = game.board.every(cell => cell !== null);
  
//       // Update game status
//       if (isWinner) {
//         game.status = 'FINISHED';
//         const winnerPlayer = game.players.find((p) => p.symbol === move.symbol);
//         if (winnerPlayer && winnerPlayer.userId) {
//           game.winner = winnerPlayer.userId; // Ensure ObjectId is assigned
//         }
//       } else if (isDraw) {
//         game.status = 'FINISHED';
//       } else {
//         // Switch turn
//         game.currentTurn = move.symbol === 'X' ? 'O' : 'X';
//       }
  
//       game.updatedAt = new Date();
//       return await game.save();
//     }
//   }