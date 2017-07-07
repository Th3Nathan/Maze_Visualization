const canvasX = 50;
const canvasY = 50;

//need to divide canvas pixels into boxes

//Set dimentions for boxes
const boxWidth = 5;
const boxHeight = 5;

const rowNum = Math.floor(canvasX / boxWidth);
const colNum = Math.floor(canvasY / boxHeight);

//I need to decide whether I want a single or 2 dim array, 2d makes more sense to me

let grid = new Array(rowNum).fill(0).map(row => new Array(colNum).fill(0));

//Check if space is in bounds

const isInBounds = (row, col) => {
  return (row < rowNum && row >= 0) && (col < colNum && col >= 0);
};

// I need a way to open spaces

const openSpace = (pos) => {
  [row, col] = pos;
  grid[row][col] = 1;
};

const isValidSpace = (pos) => {
  let [row, col] = pos;
  return isInBounds(row, col) && grid[row][col] === 0;
};

//surrounding positions
const surroundingPositions = (pos) => {
  let [row, col] = pos;
  let positions = [];
  positions.push([row - 1, col]);
  positions.push([row, col + 1]);
  positions.push([row + 1, col]);
  positions.push([row, col - 1]);
  return positions.filter(pos => {
    return isInBounds(pos[0], pos[1]);
  });
};



const validProbe = (probe) => {
  //first, validate that the space is in bounds and empty using isValidSpace
  //lastly, should look at all directions except the one it came from, and return false if a space is opened
  if (!isValidSpace(probe.pos)) return false;
  let [row, col] = probe.pos;
  let [fromRow, fromCol] = probe.prev;
  return surroundingPositions(probe.pos).every((border) => {
    [borderingRow, borderingCol] = border;
    return (fromRow === borderingRow && fromCol === borderingCol) || isValidSpace(border);
  });
};

//need a function to build frontier, needs to take a move and store surrounding Positions as well as the directions.

// when you make a new frontier, clear frontiers of all surrounding spaces and then replace with own.
//this can be called absorb frontier?
const buildFrontier = (pos) => {
  //actually, should save frontier to temp array, then filter it for validProbe ness.
  let [row, col] = pos;
  let surroundingSquares = [];
  surroundingSquares.push({
    pos: [row - 1, col], prev: pos
  });
  surroundingSquares.push({
    pos: [row, col + 1], prev: pos
  });
  surroundingSquares.push({
    pos: [row + 1, col], prev: pos
  });
  surroundingSquares.push({
    pos: [row, col - 1], prev: pos
  });
  validSurrounding = surroundingSquares.filter(probe => validProbe(probe));
  frontier = frontier.concat(validSurrounding);
};


//needs to store all directions maze could go

let frontier = [];

//Will also need a way to pop a random frontier from the array of frontier spaces

Array.prototype.randomPop = function(){
  var i = 0, j = 0, temp = null;
  for (i = this.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
  return this.pop();
};

//will loop until what. Say we have a count of x * y. Everytime we open a space, we decrement. nope,
//because we dont know how many squares will be filled. Another strategy will be to go until there is
//nothing in the frontier, meaning it would need to start off with a little push...
const startPos = [0, 0];

//condition could be while fronier has something in it keep going?

const buildMaze = (start) => {
  //this is the push to get started
  openSpace(start);
  buildFrontier(start);

  while (frontier.length > 0){
    nextOpenSpace = frontier.randomPop();
    openSpace(nextOpenSpace.pos);
    //clear surrounding frontiers
    frontier = frontier.filter((probe) => {
      return surroundingPositions(nextOpenSpace.pos).every(pos => {
        return probe.pos[0] !== pos[0] || probe.pos[1] !== pos[1];
      });
    });
    //generate new frontiers
    buildFrontier(nextOpenSpace.pos);
    //eventually, do something visually
    //reloop!
  }
};

buildMaze(startPos);
