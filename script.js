const boardContainer = document.querySelector(".board_container");
const rowContainer = document.querySelector(".row_container");
const colContainer = document.querySelector(".col_container");
const startingForm = document.querySelector(".starting_form");
const endingForm = document.querySelector(".ending_form");
const resultPanel = document.querySelector(".result_panel");
const result = document.querySelector(".result");
const resetBtn = document.querySelector(".reset_btn");

let startingX; let startingY;
let endingX; let endingY;
let possibleMoves = [
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
  [-1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2],
]

function createBoard(n = 8){
  for (let i = n - 1; i >= 0; i--){
    for (let j = 0; j < n; j++){
      let square = document.createElement("div");
      square.dataset.coordinates = `${i},${j}`;
      square.classList.add("square");
      if ((i + j) % 2 == 0){
        square.classList.add("black_square");
      }
      boardContainer.appendChild(square);
    }
  }
}

function createRowContainer(n = 8){
  for (let i = n - 1; i >= 0; i--){
    let cell = document.createElement("div");
    cell.textContent = i;
    cell.classList.add("square");
    rowContainer.appendChild(cell);
  }
}

function createColContainer(n = 8){
  for (let i = 0; i < n; i++){
    let cell = document.createElement("div");
    cell.textContent = i;
    cell.classList.add("square");
    colContainer.appendChild(cell);
  }
}

function getStartingPoints(){
  let xInput = document.getElementById("x_start");
  let x = parseInt(xInput.value);
  xInput.value = null;

  let yInput = document.getElementById("y_start");
  let y = parseInt(yInput.value);
  yInput.value = null;
  return [x, y];
}

function getEndingPoints(){
  let xInput = document.getElementById("x_end");
  let x = parseInt(xInput.value);
  xInput.value = null;

  let yInput = document.getElementById("y_end");
  let y = parseInt(yInput.value);
  yInput.value = null;
  return [x, y];
}

function getIcon(){
  let icon = document.createElement("img");
  icon.classList.add("icon");
  icon.src = "./knight-chess-svgrepo-com.svg";
  return icon;
}

function placeKnight(str){
  let allCells = boardContainer.querySelectorAll("div");
  let icon = getIcon();

  allCells.forEach(cell => {
    if (cell.dataset.coordinates == str){
      cell.appendChild(icon);
    };
  })
}

function startGame(e){
  e.preventDefault();
  startingForm.style.display = "none";
  endingForm.style.display = "flex";
  [startingX, startingY] = getStartingPoints();
  let coordinatesStr = `${startingX},${startingY}`;
  placeKnight(coordinatesStr);
}

function getShortestPath(startingX, startingY, endingX, endingY){
  let queue = [];
  let visited = new Set();
  let path = new Map();

  let startingPoints = [startingX, startingY];
  queue.push(startingPoints);
  visited.add(`${startingX},${startingY}`);

  while (queue.length){
    let [x, y] = queue.shift();
    if (x == endingX && y == endingY){
      const shortestPath = [];
      let current = [endingX, endingY];
      while(current.toString() !== startingPoints.toString()){
        shortestPath.unshift(current);
        current = path.get(current.toString());
      }
      shortestPath.unshift(startingPoints);
      return shortestPath;
    }

    for (const [dx, dy] of possibleMoves){
      let newX = x + dx;
      let newY = y + dy;

      if (newX >= 0 && newX <= 7 && 
        newY >= 0 && newY <= 7 &&
        !visited.has(`${newX},${newY}`)){
          queue.push([newX, newY]);
          visited.add(`${newX},${newY}`);
          path.set(`${newX},${newY}`, [x, y]);
        }
    }
  }
  return null;
}

function showResult(arr){
  let pathString = "";
  for (let i = 0; i < arr.length; i++){
    let [x, y] = arr[i];
    pathString += `[${x},${y}]`;
  }

  moves = arr.length > 2 ? "moves" : "move";
  result.textContent = `The shortest path : ${pathString} it took ${arr.length - 1} ${moves}`;
}

function clearElement(element){
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
}

function clearBoard(){
  let cells = boardContainer.querySelectorAll("div");
  cells.forEach(cell => clearElement(cell));
}

function showKnightPath(arr, index){
  if (index < arr.length){
    const [x, y] = arr[index];
    let str = `${x},${y}`;
    setTimeout(() =>{
      placeKnight(str);
      showKnightPath(arr, index + 1);
    }, 400);
  }
}

function endGame(e){
  e.preventDefault();
  [endingX, endingY] = getEndingPoints();
  let shortestPath = getShortestPath(startingX, startingY, endingX, endingY);
  endingForm.style.display = "none";
  resultPanel.style.display = "flex";
  showResult(shortestPath);
  showKnightPath(shortestPath, 1);
}

function restart(){
  clearBoard();
  resultPanel.style.display = "none";
  startingForm.style.display = "flex";
}

createBoard();
createRowContainer();
createColContainer();

startingForm.addEventListener("submit", startGame);
endingForm.addEventListener("submit", endGame);
resetBtn.addEventListener("click", restart);

