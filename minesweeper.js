/*let matrix = math.matrix([[1, 2], [3, 4]]);
console.log(matrix);*/
var board = [];
var rows = 8;
var columns = 8;

var mineCount = 10;
var mineStartCount = mineCount;
var minesPlace = [];  // row-column "3-8"
var placedFlags = []; // row-column "3-8"

var minesFound = [];
var tilesRevealed = 0;

var gameOver = false;

window.onload = function() {
    handleGame();
}

// Generating a board, where start position has no adjancent mines
function generateMines(sr, sc) {
    // Mines cannot be placed on:
    let cell1 = (sr-1).toString() + "-" + (sc-1).toString();
    let cell2 = (sr-1).toString() + "-" + (sc).toString();
    let cell3 = (sr-1).toString() + "-" + (sc+1).toString();

    let cell4 = (sr+1).toString() + "-" + (sc-1).toString();
    let cell5 = (sr+1).toString() + "-" + (sc).toString();
    let cell6 = (sr+1).toString() + "-" + (sc+1).toString();

    let cell7 = sr.toString() + "-" + (sc-1).toString();
    let cell8 = sr.toString() + "-" + sr.toString();
    let cell9 = sr.toString() + "-" + (sc+1).toString();

    let startPoint = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9];
    console.log(startPoint);
    let minesLeft = mineCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let minePos = r.toString() + "-" + c.toString();

        if (!minesPlace.includes(minePos) && !startPoint.includes(minePos)) {
            minesPlace.push(minePos);
            minesLeft--;
        }
    }
    console.log("Created board, minesleft: ", minesLeft);
    console.log(minesPlace); 
}


function setBoard() {
    for (i = 0; i < rows; i++) {
        let singleRow = [];
        for (j = 0; j < columns; j++) {
            let cell = document.createElement("div");
            cell.id = i.toString()  + "-" + j.toString();
            cell.addEventListener("click", clickCell);
            cell.addEventListener("contextmenu", placeFlag);
            cell.addEventListener("contextmenu", e=> {
                e.preventDefault();
                placeFlag(this);
            }); 
            document.getElementById("board").append(cell);
            singleRow.push(cell);
        }
        board.push(singleRow);
    }
    console.log(board);
}

function clickCell() {
    if (gameOver || this.classList.contains("cell-clicked")) {
        return;
    }

    // Handle first cell click (start of game).
    console.log("CLICK", this.id);
    let location = this.id.split("-");
    let r = parseInt(location[0]);
    let c = parseInt(location[1]);
    console.log(r,c);
    if (tilesRevealed == 0) {
        generateMines(r, c);
    }
    
    
        // Check if clicked on a bomb
        if (minesPlace.includes(this.id)) {
            console.log("BOOM", this.id);
            let cell = board[r][c];
            cell.innerText = "💣";
            cell.style.backgroundColor = "red";
            gameOver = true;
        }
        else {
            revealCell(r, c);
        }


}

function revealCell(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }

    if (board[r][c].classList.contains("cell-clicked")) {
        return;
    }

    board[r][c].classList.add("cell-clicked");
    tilesRevealed++;
    console.log(tilesRevealed, rows*columns - mineCount);

    let adjBombCount = 0;

    // Check top 3 cells
    adjBombCount += checkMine(r-1, c-1);
    adjBombCount += checkMine(r-1, c);
    adjBombCount += checkMine(r-1, c+1);

    // Check bottom 3 cells
    adjBombCount += checkMine(r+1, c-1);
    adjBombCount += checkMine(r+1, c);
    adjBombCount += checkMine(r+1, c+1);

    // Check left and right
    adjBombCount += checkMine(r, c-1);
    adjBombCount += checkMine(r, c+1);

    if (adjBombCount > 0) {
        board[r][c].innerText = adjBombCount;
        board[r][c].style.backgroundColor = "white";
    }
    else {
        board[r][c].innerText = adjBombCount;
        board[r][c].style.backgroundColor = "blue";
        // Check top 3 cells
        adjBombCount += revealCell(r-1, c-1);
        adjBombCount += revealCell(r-1, c);
        adjBombCount += revealCell(r-1, c+1);

        // Check bottom 3 cells
        adjBombCount += revealCell(r+1, c-1);
        adjBombCount += revealCell(r+1, c);
        adjBombCount += revealCell(r+1, c+1);

        // Check left and right
        adjBombCount += revealCell(r, c-1);
        adjBombCount += revealCell(r, c+1);
    }

    if (tilesRevealed == rows*columns - mineStartCount) {
        document.getElementById("mineCount").innerText = "Completed";
        gameOver = true;
    }

    //return adjBombCount;
}

function checkMine(r, c) {
    // Out of bounds
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }

    let cell = r.toString() + "-" + c.toString();
    if (minesPlace.includes(cell)) {
        return 1;
    }

    return 0;
}

function revealAdjCells(r, c) {
    let cell1 = board[r-1][c-1];
    let cell2 = board[r-1][c];
    let cell3 = board[r-1][c+1];

    let cell4 = board[r+1][c-1];
    let cell5 = board[r+1][c];
    let cell6 = board[r+1][c+1];

    let cell7 = board[r][c-1];
    let cell8 = board[r][c+1];

    let adjList = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8];
    let bombCountList = [];
    for (let i = 0; i < adjList.length; i++) {
        let position = adjList[i].id.split("-");
        let x = position[0];
        let y = position[1];

        let bombCount = revealCell(x, y);

        console.log(position, bombCount);
        bombCountList.push(bombCount);

        adjList[i].innerText = bombCount;
        adjList[i].style.backgroundColor = "white";
        //console.log("POS (", position, "), ", bombCount);
    } 
    //cell1.id.replace("-","")
    console.log(adjList);
    console.log(bombCountList);
    /*    cell.innerText = "💣";
        cell.style.backgroundColor = "red"; */


}


function placeFlag() {
    if (this.id == undefined) {
        return;
    }

    if (this.classList.contains("cell-clicked") || gameOver) {
        return;
    }

    let location = this.id.split("-");
    let r = parseInt(location[0]);
    let c = parseInt(location[1]);
    let cell = board[r][c];

    if (placedFlags.includes(this.id)) {
        cell.innerText = "";
        let index = placedFlags.indexOf(this.id);
        placedFlags.splice(index, 1);
        mineCount++;
        document.getElementById("mineCount").innerText = "Mine Count: " + mineCount;
    }
    else {
        placedFlags.push(this.id);
        cell.innerText = "🚩";
        mineCount--;
        document.getElementById("mineCount").innerText = "Mine Count: " + mineCount;
    }

    console.log(this.id);
    
}

function handleGame() {
    //generateMines();
    setBoard();
}
