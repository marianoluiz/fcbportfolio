//Variables
let board;
let score = 0;
let rows = 4;
let columns = 4;

//to monitor if player won
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

//declaring variable used for touch input
let startX = 0;
let startY = 0;


//Function are callable programmed task.

//Create a function to set a game board.
function setGame(){	
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	]
  
	for(let r=0; r<rows; r++) {
		for(let c=0; c<columns; c++){
      
      //create div element
			let tile = document.createElement("div");

      //set id
			tile.id = r.toString() + "-" + c.toString();

      //get number of a tile from a backed board
			let num = board[r][c];

      //use number to update tile's appearance
			updateTile(tile, num);

			document.getElementById("board").append(tile);
		}
	}

  setTwo();
  setTwo();
}

//update appearance based on its number.
function updateTile(tile, num) {
  tile.innerText = "";
  tile.classList.value = "";

  tile.classList.add("tile");

    if(num > 0) {
      // This will display the number of the tile 
      tile.innerText = num.toString();
        
      if (num <= 4096){
          tile.classList.add("x"+num.toString());
      } else {
          // Then if the num value is greater than 4096, it will use class x8192 to color the tile
          tile.classList.add("x8192");
      }
  }
}

window.onload = function() {
  setGame();
}

function handleSlide(e){
	console.log(e.code); //prints the key pressed

  if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){

		if(e.code == "ArrowLeft"){
			slideLeft();
      setTwo();
		}
		else if(e.code == "ArrowRight"){
			slideRight();
      setTwo();
		}
		else if(e.code == "ArrowUp"){
			slideUp();
      setTwo();
		}
		else if(e.code == "ArrowDown"){
			slideDown();
      setTwo();
		}
	}


  document.getElementById("score").innerText = score;

  setTimeout(() => {
    checkWin();
  }, 200);

  if(hasLost() == true){

		setTimeout(() => {
			alert("Game Over! You have lost the game. Game will restart");
			restartGame();
			alert("Click any arrow key to restart");
		}, 100)
		// setTimeout is used to delay the execution of the code inside the arrow function 

	}
}

document.addEventListener("keydown", handleSlide);

//removes the zeroes from the row / col
function filterZero(row) {
  return row.filter(num => num != 0);
}

//slide func is the one merging
function slide(row) {
  //[0,2,0,2]

	row = filterZero(row); //[2,2]

	for(let i =0; i<row.length -1; i++){
		if(row[i] == row[i+1]){ //check if a tile is equal to adjacent tile
			row[i] *= 2; //merge - doubles the first tile to merge
      //[4, 2]
			row[i + 1] = 0; //[4,0]

      //this adds the merged tile to the score.
      score += row[i];
		}
	}

	row = filterZero(row);

	// Add zeroes on the back after merging
	while(row.length < columns){
		row.push(0);
	}

	return row;
}

function slideLeft(){
  for(let r = 0; r < rows; r++){
      let row = board[r];

      //Line for animation
      let originalRow = row.slice();

      row = slide(row); // we used the slide function so that the slide function will merge the adjacent tiles.

      board[r] = row;
      
      //after merging, the [position and value of tiles might change, thus it follows id, color, number  of tile must be changed
      for(let c = 0; c < columns; c++){
          let tile = document.getElementById(r.toString() + "-" + c.toString());
          let num = board[r][c];

          //Line for animation - document orig position of tiles
          if(originalRow[c] !== num && num !== 0) {
            tile.style.animation = "slide-from-right 0.3s"
            
            //remove animation after
            setTimeout(() => {
              tile.style.animation = "";
            }, 300)
          }

          updateTile(tile, num);
      }
  }
}

function slideRight(){
  for(let r = 0; r < rows; r++){
      let row = board[r];

      //Line for animation - document orig position of tiles
      let originalRow = row.slice();

      row.reverse();
      row = slide(row); // we used the slide function so that the slide function will merge the adjacent tiles.
      row.reverse();
      board[r] = row;
      
      //after merging, the [position and value of tiles might change, thus it follows id, color, number  of tile must be changed
      for(let c = 0; c < columns; c++){
          let tile = document.getElementById(r.toString() + "-" + c.toString());
          let num = board[r][c];
          updateTile(tile, num);

        //Line for animation - 
        if(originalRow[c] !== num && num !== 0) {
          tile.style.animation = "slide-from-left 0.3s"
          
          //remove animation
          setTimeout(() => {
            tile.style.animation = "";
          }, 300);
        }
      }
  }
}

function slideUp() {
  for(let c = 0; c < columns; c++) {
    let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

    //Line for animation - document orig position of tiles
    let originalCol = col.slice();

    col = slide(col);

    //record current position that have changed
    let changedIndeces = [];
    for( let c = 0; c < columns; c++) {
      if(originalCol[c] !== col[c]) {
        changedIndeces.push(c);
      }
    }

      //after merging, the [position and value of tiles might change, thus it follows id, color, number  of tile must be changed
      for(let r = 0; r < rows; r++){
        board[r][c] = col[r];
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        let num = board[r][c];

        //Line for animation - 
        if(changedIndeces.includes(r) && num !== 0) {
          tile.style.animation = "slide-from-bottom 0.3s";
          
          //remove animation
          setTimeout(() => {
            tile.style.animation = "";
          }, 300);
        }

      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for(let c = 0; c < columns; c++) {
    let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

    //Line for animation - document orig position of tiles
    let originalCol = col.slice();

    col.reverse();
    col = slide(col); //merge
    col.reverse();

    //record current position that have changed
    let changedIndeces = [];
    for( let c = 0; c < columns; c++) {
      if(originalCol[c] !== col[c]) {
        changedIndeces.push(c);
      }
    }

      //after merging, the [position and value of tiles might change, thus it follows id, color, number  of tile must be changed
      for(let r = 0; r < rows; r++){
        board[r][c] = col[r];
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        let num = board[r][c];

        //Line for animation - 
        if(changedIndeces.includes(r) && num !== 0) {
          tile.style.animation = "slide-from-top 0.3s";
          
          //remove animation
          setTimeout(() => {
            tile.style.animation = "";
          }, 300);
        }

        updateTile(tile, num);
    }
  }
}


function hasEmptyTile() {

  for(let r = 0; r < rows; r++) {
    for(let c = 0; c < columns; c++) {
      if(board[r][c] == 0) {
        return true;
      }
    }
  }

  return false; //need false after checking the whole board
}

function setTwo() {
  if(hasEmptyTile() == false) {
    return;
  }

  //next codes is for generation of the random 2 tile.
  let found = false;

  while(found == false) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);

    //check if tile is empty
    if(board[r][c] == 0) {
      // Generate new tile
      board[r][c] = 2;
      let tile = document.getElementById(r.toString() + "-" + c.toString());

      tile.innerText = "2";
      tile.classList.add("x2");
      found = true;

    }
  }

}

function checkWin() {

  for(let r=0; r<rows; r++) {
    for(let c=0; c<columns; c++) {

      if(board[r][c] == 2048 && is2048Exist == false) {
        alert("You Win! You got the 2048");
        is2048Exist = true;
      } else if (board[r][c] == 4096 && is4096Exist == false) {
        alert("You are unstoppable at 4096!");
        is4096Exist = true;
      } else if (board[r][c] == 8192 && is8192Exist == false) {
        alert("Victory! You have reached 8192, You are incredibly awesome x 8192.");
        is8192Exist = true;
      }
  }

  }

}

//haslost check if (empty tile || has adjacent with same value ||)

function hasLost() {
  for(let r=0; r<rows; r++) {
    for(let c=0; c<columns; c++) {

      if(board[r][c] === 0) {
        return false;
      }

      const currentTile = board[r][c];
      //ctrl + shift + v - auto aligned

      if(
        // row[1] be compared to row[0] if they equal. (to upper tile)
        r > 0 &&  board[r-1][c] === currentTile ||
        //check current tile if it has possible merge to lower tile.
        r < rows - 1 && board[r+1][c] === currentTile ||

        // check current tile if it has possible merge to left
        c > 0 && board[r][c-1] === currentTile ||
        
        // check current tile if it has possible merge to right
        c < rows - 1 && board[r][c+1] === currentTile
      ) {
        //if we found an adjacent tile with the same as the current tile, false, the use has not lost
        return false;
      }


    }
  }

  //no empty tiles and no possible moves
  return true;
}

function restartGame(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			board[r][c] = 0; 
		}
	}
  score = 0;
	setTwo();
}

//listen to touch screen
document.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;

});

document.addEventListener('touchmove', (e) => {
  if(!e.target.className.includes("tile")) {
    return
  }

  //to disable scrolling feature
  e.preventDefault();
}, {passive: false}) // use passive property to make sure that preventdefault() will work

document.addEventListener('touchend', (e) => {
  if(!e.target.className.includes("tile")) {
    return
  }

  let diffX = startX - e.changedTouches[0].clientX;
  let diffY = startY - e.changedTouches[0].clientY;

  // Check if the horizontal swipe is greater in magnitude than the vertical swipe
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe
    if (diffX > 0) {
        slideLeft(); // Call a function for sliding left
        setTwo(); // Call a function named "setTwo"
    } else {
        slideRight(); // Call a function for sliding right
        setTwo(); // Call a function named "setTwo"
    }
  } else {
      // Vertical swipe
      if (diffY > 0) {
        slideUp(); // Call a function for sliding up
        setTwo(); // Call a function named "setTwo"
    } else {
        slideDown(); // Call a function for sliding down
        setTwo(); // Call a function named "setTwo"
    }
  }

  document.getElementById("score").innerText = score;

	checkWin();

	// Call hasLost() to check for game over conditions
	if (hasLost()) {
	    // Use setTimeout to delay the alert
	    setTimeout(() => {
	    alert("Game Over! You have lost the game. Game will restart");
	    restartGame();
	    alert("Click any key to restart");
	    }, 100); 
	}
  
})

