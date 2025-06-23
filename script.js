let gridSize = 4;
let tiles = [];
let moves = 0;
let seconds = 0;
let timerInterval;
const puzzle = document.getElementById("puzzle");

function init() {
  gridSize = parseInt(document.getElementById("gridSize").value);
  const difficulty = document.getElementById("difficulty").value;
  let shuffleMoves = difficulty === "easy" ? 20 : difficulty === "medium" ? 100 : 300;

  clearInterval(timerInterval);
  seconds = 0;
  moves = 0;
  document.getElementById("moves").textContent = 0;
  document.getElementById("timer").textContent = 0;

  puzzle.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
  puzzle.style.gridTemplateRows = `repeat(${gridSize}, 80px)`;

  const total = gridSize * gridSize;
  tiles = [...Array(total - 1).keys()].map(x => x + 1);
  tiles.push(null);

  for (let i = 0; i < shuffleMoves; i++) {
    const neighbors = getValidMoves(tiles.indexOf(null));
    const move = neighbors[Math.floor(Math.random() * neighbors.length)];
    [tiles[tiles.indexOf(null)], tiles[move]] = [tiles[move], tiles[tiles.indexOf(null)]];
  }

  draw();
  timerInterval = setInterval(() => {
    seconds++;
    document.getElementById("timer").textContent = seconds;
  }, 1000);
}

function draw() {
  puzzle.innerHTML = "";
  tiles.forEach((val, idx) => {
    const div = document.createElement("div");
    div.classList.add("tile");
    if (val === null) {
      div.classList.add("empty");
    } else {
      // Use emoji or number
      const emojis = ["🍎", "🍌", "🍇", "🍊", "🍉", "🥝", "🍍", "🍑", "🥕", "🍆", "🥦", "🌽", "🧄", "🍒", "🍓", "🍞", "🧀", "🍗", "🍖", "🍔", "🍟", "🍕", "🌮", "🍣"];
      div.textContent = emojis[val % emojis.length];
    }
    div.addEventListener("click", () => moveTile(idx));
    puzzle.appendChild(div);
  });
}

function moveTile(index) {
  const empty = tiles.indexOf(null);
  const valid = getValidMoves(empty);
  if (!valid.includes(index)) return;

  [tiles[empty], tiles[index]] = [tiles[index], tiles[empty]];
  moves++;
  document.getElementById("moves").textContent = moves;
  draw();

  if (checkWin()) {
    clearInterval(timerInterval);
    setTimeout(() => alert(`🎉 You win! Moves: ${moves}, Time: ${seconds}s`), 100);
  }
}

function getValidMoves(emptyIndex) {
  const moves = [];
  const row = Math.floor(emptyIndex / gridSize);
  const col = emptyIndex % gridSize;

  if (row > 0) moves.push(emptyIndex - gridSize); // up
  if (row < gridSize - 1) moves.push(emptyIndex + gridSize); // down
  if (col > 0) moves.push(emptyIndex - 1); // left
  if (col < gridSize - 1) moves.push(emptyIndex + 1); // right

  return moves;
}

function checkWin() {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return true;
}

window.onload = init;
