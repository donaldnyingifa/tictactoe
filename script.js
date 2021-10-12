window.onload = function () {
  // Initial States
  let num;
  let box;
  let ctx; //contextVariable
  let turn = 1;
  let filled = new Array();
  let symbol = new Array();
  let winner = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let gameOver = false;
  const human = "X";
  const ai = "O";
  let result = {};

  const speak = (msg) => {
    const sp = new SpeechSynthesisUtterance(msg);
    [sp.voice] = speechSynthesis.getVoices();
    speechSynthesis.speak(sp);
  };

  for (let i = 0; i < 9; i++) {
    filled[i] = false;
    symbol[i] = "";
  }

  //New Game
  let n = document.getElementById("new");
  n.addEventListener("click", newGame);

  //Reload Page
  function newGame() {
    document.location.reload();
  }

  // Canvas click listener that determines the number associated with the canvas
  document.getElementById("tic").addEventListener("click", function (e) {
    boxClick(e.target.id);
  });

  // Drawing the X and O

  //Draw X
  function drawX() {
    box.style.backgroundColor = "#fb5181";
    ctx.beginPath();
    ctx.moveTo(15, 15);
    ctx.lineTo(85, 85);
    ctx.moveTo(85, 15);
    ctx.lineTo(15, 85);
    ctx.lineWidth = 21;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.closePath();

    symbol[num - 1] = human;
  }

  //Draaw O

  function drawO(next) {
    box.style.backgroundColor = "#93f273";
    ctx.beginPath();
    ctx.arc(50, 50, 35, 0, 2 * Math.PI);
    ctx.lineWidth = 20;
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.closePath();

    symbol[next] = ai;
  }

  // Winner check
  function winnerCheck(symbol, player) {
    for (let j = 0; j < winner.length; j++) {
      if (
        symbol[winner[j][0]] == player &&
        symbol[winner[j][1]] == player &&
        symbol[winner[j][2]] == player
      ) {
        return true;
      }
    }
    return false;
  }

  // Box click function - human player
  function boxClick(numId) {
    box = document.getElementById(numId);
    ctx = box.getContext("2d");

    switch (numId) {
      case "canv1":
        num = 1;
        break;
      case "canv2":
        num = 2;
        break;
      case "canv3":
        num = 3;
        break;
      case "canv4":
        num = 4;
        break;
      case "canv5":
        num = 5;
        break;
      case "canv6":
        num = 6;
        break;

      case "canv7":
        num = 7;
        break;
      case "canv8":
        num = 8;
        break;
      case "canv9":
        num = 9;
        break;
    }

    if (filled[num - 1] === false) {
      if (gameOver === false) {
        if (turn % 2 !== 0) {
          drawX();
          turn += 1;
          filled[num - 1] = true;

          if (winnerCheck(symbol, symbol[num - 1]) === true) {
            document.getElementById("result").innerHTML =
              "Player " + symbol[num - 1] + " won!";
            speak("You can never win me ");
            speak("ha ha ha");
            gameOver = true;
          }

          if (turn > 9 && gameOver !== true) {
            document.getElementById("result").innerHTML =
              "GAME OVER! IT WAS A DRAW";
            speak("A competitive game I will admit");
            return;
          }

          if (turn % 2 == 0) {
            playAI();
          }
        }
      } else {
        alert("GAME OVER, PLEASE START A NEW GAME");
      }
    } else {
      alert("This box is already filled, Please select an empty box");
    }
  }

  function emptyBoxes(newSymbol) {
    let j = 0;
    let empty = [];
    for (let i = 0; i < newSymbol.length; i++) {
      if (newSymbol[i] !== "X" && newSymbol[i] !== "O") {
        empty[j] = i;
        j++;
      }
    }
    return empty;
  }

  // Make AI Play and minimax function

  //Play AI
  function playAI() {
    //symbol = ['X', '','O', 'X', 'O','X', '','O','O']
    //ai = 'O'
    // nextMove = {id:1, score: 10}
    let nextMove = miniMax(symbol, ai); //object that stores id of next move and score of the box for next move
    
    let nextId = "canv" + (nextMove.id + 1);
    //let nextId = `canvas${nextMove.id + 1}`;
    box = document.getElementById(nextId);
    ctx = box.getContext("2d");
    if (gameOver === false) {
      if (turn % 2 === 0) {
        drawO(nextMove.id);
        turn += 1;
        filled[nextMove.id] = true;
        if (winnerCheck(symbol, symbol[nextMove.id]) === true) {
          //symbol[nextMove.id] is the player: ai
          document.getElementById("result").innerText =
            "Player " + symbol[nextMove.id] + " won!";
          speak("You can never win me ");
          speak("ha ha ");
          gameOver = true;
        }

        //draw condition
        if (turn > 9 && gameOver !== true) {
          document.getElementById("result").innerHTML =
            "GAME OVER! IT WAS A DRAW";
          speak("A competitve game I will admit");
          return;
        }
      }
    } else {
      alert("GAME OVER, PLEASE START A NEW GAME");
    }
  }

  //minimax algorithm
  function miniMax(newSymbol, player) {
    let empty = [];
    empty = emptyBoxes(newSymbol); // [1,4,6] it's zero indexed, returns empty positions from symbol

    if (winnerCheck(newSymbol, human)) {
      return { score: -10 };
    } else if (winnerCheck(newSymbol, ai)) {
      return { score: 10 };
    } else if (empty.length === 0) {
      if (winnerCheck(newSymbol, human)) {
        return { score: -10 };
      } else if (winnerCheck(newSymbol, ai)) {
        return { score: 10 };
      }
      return { score: 0 };
    }

    let possibleMoves = [];
    //[1,4,6] currMove.id = 1 then 4 then 6
    for (let i=0; i<empty.length; i++) {
        let currMove = {};
        //generate the new board with the current move
        currMove.id = empty[i];
        newSymbol[empty[i]] = player; // creates a new symbol with the player in the empty position

        if(player === ai ) {
          result = miniMax(newSymbol, human); // [{id:4, score: -10}]
          currMove.score = result.score;
        } else {
          result = miniMax(newSymbol, ai);
          currMove.score = result.score;

          //currMov = {id:4, score: -10}
          //possibleMov = [{id:4, score: -10}]
        }
        newSymbol[empty[i]] = '';
        possibleMoves.push(currMove); //[{id:1, score: -10}]
    }
    // Calculate scores of intermediate states - best move + score
    let bestMove;
    //AI - max player (always) -> choose maximum value,
    //human - min player -> choose minimum value
    if (player === ai) {
       // possMovs [{id:1, score: -10}. {id:4, score: 10}, {id:6, score: -10}]
      let highestScore = -1000;
      for (let j=0; j<possibleMoves.length; j++) {
        if (possibleMoves[j].score > highestScore) {
          highestScore = possibleMoves[j].score;
          bestMove = j
        }
      }
    } else {
      let lowestScore = 1000;
      for (let j=0; j<possibleMoves.length; j++) {
        if (possibleMoves[j].score < lowestScore) {
          lowestScore = possibleMoves[j].score;
          bestMove = j;
        }
      }
    }
    return possibleMoves[bestMove];
  }
};
