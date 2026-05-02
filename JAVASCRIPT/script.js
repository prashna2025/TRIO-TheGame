let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameActive = true;

let xScore=0, oScore=0, drawScore=0;

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const difficultySelect = document.getElementById("difficulty");

const winCond = [
 [0,1,2],[3,4,5],[6,7,8],
 [0,3,6],[1,4,7],[2,5,8],
 [0,4,8],[2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", handleClick));

function handleClick(e){
  let i = e.target.dataset.index;
  if(board[i] || !gameActive) return;

  makeMove(i,"X");

  if(gameActive) setTimeout(aiMove, 300);
}

function makeMove(i,player){
  board[i]=player;
  cells[i].innerText=player;
  checkWinner();
}

function aiMove(){
  let diff = difficultySelect.value;
  let move;

  if(diff==="easy"){
    move = randomMove();
  } else if(diff==="intermediate"){
    move = Math.random()<0.5 ? randomMove() : bestMove();
  } else {
    move = bestMove();
  }

  makeMove(move,"O");
}

function randomMove(){
  let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

function bestMove(){
  let bestScore=-Infinity, move;
  for(let i=0;i<9;i++){
    if(board[i]===""){
      board[i]="O";
      let score=minimax(board,false);
      board[i]="";
      if(score>bestScore){
        bestScore=score;
        move=i;
      }
    }
  }
  return move;
}

function minimax(b,isMax){
  let res = evaluate(b);
  if(res!==null) return res;

  if(isMax){
    let best=-Infinity;
    for(let i=0;i<9;i++){
      if(b[i]===""){
        b[i]="O";
        best=Math.max(best,minimax(b,false));
        b[i]="";
      }
    }
    return best;
  } else {
    let best=Infinity;
    for(let i=0;i<9;i++){
      if(b[i]===""){
        b[i]="X";
        best=Math.min(best,minimax(b,true));
        b[i]="";
      }
    }
    return best;
  }
}

function evaluate(b){
  for(let [a,b1,c] of winCond){
    if(b[a] && b[a]===b[b1] && b[a]===b[c]){
      return b[a]==="O"?1:-1;
    }
  }
  if(!b.includes("")) return 0;
  return null;
}

function checkWinner(){
  for(let [a,b,c] of winCond){
    if(board[a] && board[a]===board[b] && board[a]===board[c]){
      cells[a].classList.add("win");
      cells[b].classList.add("win");
      cells[c].classList.add("win");

      statusText.innerText=board[a]+" Wins!";
      gameActive=false;

      if(board[a]==="X") xScore++;
      else oScore++;

      updateScore();
      return;
    }
  }

  if(!board.includes("")){
    statusText.innerText="Draw!";
    drawScore++;
    updateScore();
    gameActive=false;
    return;
  }

  currentPlayer = currentPlayer==="X"?"O":"X";
  statusText.innerText="Turn: "+currentPlayer;
}

function updateScore(){
  document.getElementById("xScore").innerText=xScore;
  document.getElementById("oScore").innerText=oScore;
  document.getElementById("drawScore").innerText=drawScore;
}

function replayGame(){
  board=["","","","","","","","",""];
  gameActive=true;
  currentPlayer="X";
  statusText.innerText="Turn: X";

  cells.forEach(c=>{
    c.innerText="";
    c.classList.remove("win");
  });
}