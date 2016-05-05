var tot = 0;
var gridSize = 20;
// var posX = gridSize/2;
// var posY = gridSize/2;
var posX = 0;
var posY = 0;
var tools = ['Dagger', 'Candlestick', 'Revolver'];
var suspects = ['Colonel Mustard', 'Professor Plum', 'Mrs. Peacock'];
var rooms = ['Hall', 'Kitchen', 'Lounge', 'Library'];
var weapon;
var crimescene;
var killer;
var playerCards = [];
var answerCards = [];
var steps = 0;
var playing = false;
var grid = [];

//add Hall value in gridarray
createRoom('Hall', 'Kitchen', 'Library', 'Lounge'/*, 5, 0*/);

// //add Library value in gridarray
// createRoom('Library', 20, 15);

//add Library value in gridarray
// createRoom('Kitchen', 20, 15);
var person = {
  name:'klara',
  hint:'tips'
};
var garderob = {
  name:'jacka',
  name2:'byxor'
};


var kitchen = 
[
  [
    [garderob, person]
  ]
];


var halldoor = [
  "nyckelhängare",
  "fönster"
];

var librarydoor = [
  "bokhylla",
  "fåtölj"
];

var loungedoor = [
  "bord",
  "gäst"
];


var board =
  [
    [
      [kitchen]
    ],
    [halldoor],
    [librarydoor],
    [loungedoor],
  ];

// console.log("array i tre nivåer: sista nivåns värde är en " + board[0/* X */][0/* Y */][0/* X i rum */][1/* Y i rum */]);
// console.log("Rum i board: " + board[0][0]);
// console.log("köket i board: garderob i kök: " + board[0][0][0][0][0]);
console.log("köket i board: person i kök: tips från " + board[0][0][0][0] + ": " + board[0][0][0][0][0].name);
function createRoom(room1,room2, room3, room4/* roomEnd, roomStart*/){
var hallgrid = [
    ['min X: 0','min Y: 0'],
    ['max X: 5','max Y: 5']
];

var kitchen = [
    ['kitchen00','kitchen11'],
    // ['kitchen10','kitchen11']
];

var library = [
    ['library00','library11'],
    // ['library10','library11']
];

var lounge = [
    ['lounge00','lounge11'],
    // ['lounge10','lounge11']
];
// hall[0][0] == 'hall';
// hall[1][1] == 'hall';


var board = [
    [hallgrid,kitchen],
    [library, lounge]
];

// board[0][0] == hall;
// board[0][1] == kitchen;
// board[1][0] == library;
// board[1][1] == lounge;
console.log("hallen ligger i: " + board[0][0]);
// console.log(board[0][0][0][0]);
console.log("hallens max värde har poitionen: " + board[posX][posY]);
}

function checkRoom(){
  if (playing !== false) {
    if (grid[posX][posY] !== null) {
      $('#room').html('<p>You have reached the ' + grid[posX][posY] + '</p>');
      $('#guess').removeClass('hide');
      $('#blame').removeClass('hide');
    }else{
      $('#room').html('<p>You are in the corridor, go to a room.</p>');
      $('#guess').addClass('hide');
      $('#blame').addClass('hide');
    }
  }
}

/**
* This function is run when the document is loaded. Sets everything up.
**/
$(document).ready(function() {
  //create new answer and deal cards when start is clicked. playing status to true and show the players marker
  $('#start').on('click', function(){
    if (playing === false) {
      playing = true;
      $('#player').removeClass('hide');
      $('#response').append('<p>Nu kan du börja spela!</p>');
      createAnswer();
    }else{
      init();
      $('#player').addClass('hide');
      $('#response').html('<p>Spelet är avslutat.</p>');
    }
  });

    /**
    * Moves player div depending on keyCode
    **/
    $(window).keydown(function(e){
      // console.log(e.keyCode);

      /**
      * Moves player if there are steps left
      **/
      if (steps >= 1 && steps <=6) {
        /**
        * Moves player div right if arrow right is pressed
        **/
        if (e.keyCode === 39) {
          if (playing === true) {
            console.log('du gick höger');
            posX++;
            $('#player').css('left', (gridSize * posX) + "px");
            console.log('position X är nu: ' + posX);
            steps--;
            $('#stepCounter').html('<p>steg kvar: ' + steps + '</p>');
            // console.log('du står i ' + grid[posX][posY]);
            checkRoom();
          }
        }

        /**
        * Moves player div down if arrow down is pressed
        **/
        if (e.keyCode === 40) {
          if (playing === true) {
            console.log('du gick neråt');
            posY++;
            $('#player').css('top', (gridSize * posY) + "px");
            console.log('position Y är nu: ' + posY);
            steps--;
            $('#stepCounter').html('<p>steg kvar: ' + steps + '</p>');
            // console.log('du står i ' + grid[posX][posY]);
            checkRoom();
          }
        }

        /**
        * Moves player div left if arrow left is pressed
        **/
        if (e.keyCode === 37) {
          if (playing === true) {
            // console.log('du gick vänster');
            posX--;
            $('#player').css('left', (gridSize * posX) + "px");
            // console.log('position X är nu: ' + posX);
            steps--;
            $('#stepCounter').html('<p>steg kvar: ' + steps + '</p>');
            // console.log('du står i ' + grid[posX][posY]);
            checkRoom();
          }
        }

        /**
        * Moves player div up if arrow up is pressed
        **/
        if (e.keyCode === 38) {
          if (playing === true) {
            // console.log('du gick uppåt');
            posY--;
            $('#player').css('top', (gridSize * posY) + "px");
            console.log('position Y är nu: ' + posY);
            steps--;
            $('#stepCounter').html('<p>steg kvar: ' + steps + '</p>');
            // console.log('du står i ' + grid[posX][posY]);
            checkRoom();
          }
        }
      }

      /**
      * Rolls dice, getting random number of steps when pressing space
      **/
      if (e.keyCode === 32) {
        if (playing === true) {
          steps = (Math.floor(Math.random()*6)+1);
          $('#stepCounter').html('<p>Du fick ' + steps + ' slag!</p>');
        }
      }
    });
});

/**
* Return random int based on given array length param
**/
function randInt(tot){
  return Math.floor((Math.random() * tot - 1) + 1);
}

/**
* Randomize correct answers and store them in variables, remove from original arrays
*/
function createAnswer(){
  //random card ints
  killerInt = randInt(suspects.length);
  weaponInt = randInt(tools.length);
  roomInt = randInt(rooms.length);

  //save answer cards
  answerCards.push(suspects[killerInt], tools[weaponInt], rooms[roomInt]);
  console.log('answerCards är: ');
  console.log(answerCards);

  //remove cards from old arrays
  // console.log(suspects, rooms, tools);
  suspects.splice(killerInt, 1);
  rooms.splice(roomInt, 1);
  tools.splice(weaponInt, 1);
  // console.log(suspects, rooms, tools);

  //Debug killer
  console.log('Antal mistänkta: ' + suspects.length);
  console.log('Rooms to investigate: ' + rooms.length);
  console.log('Antal möjliga vapen: ' + tools.length);

  //start dealing player cards
  dealCards();
}

function dealCards(){
  //random card ints
  suspect = randInt(suspects.length);
  weapon = randInt(tools.length);
  room = randInt(rooms.length);

  //save players cards in array
  // console.log(suspects, rooms, tools);
  playerCards.push(suspects[suspect], tools[weapon], rooms[room]);
  $('#response').append('<p>Du vet att ' + playerCards[0] + ' är oskyldig, att ' + playerCards[1] + ' inte är mordvapnet och att ' + playerCards[2] + ' inte är brottsplatsen.</p>');
  console.log(playerCards);

  //remove cards from old arrays
  suspects.splice(suspect, 1);
  tools.splice(weapon, 1);
  rooms.splice(room, 1);

  //Debug
  console.log('Antal mistänkta: ' + suspects.length);
  console.log('Antal möjliga vapen: ' + tools.length);
  console.log('Rooms to investigate: ' + rooms.length);
}

function init(){
  tot = 0;
  posX = gridSize/2;
  posY = gridSize/2;
  gridSize = 20;
  tools = ['Dagger', 'Candlestick', 'Revolver'];
  suspects = ['Colonel Mustard', 'Professor Plum', 'Mrs. Peacock'];
  rooms = ['Hall', 'Kitchen', 'Lounge', 'Library'];
  weapon;
  crimescene;
  killer;
  playerCards = [];
  answerCards = [];
  steps = 0;
  playing = false;
}
