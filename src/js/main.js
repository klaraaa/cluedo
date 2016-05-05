var tot = 0, gridSize = 20, posX = 0, posY = 0;
var grid = [];
var tools = ['Dagger', 'Candlestick', 'Revolver'];
var suspects = ['Colonel Mustard', 'Professor Plum', 'Mrs. Peacock'];
var rooms = ['Hall', 'Kitchen', 'Lounge', 'Library'];
var weapon, crimescene, killer, keystate;
var playerCards = [], answerCards = [];
var steps = 0, playing = false;
var UpArrow = 38, DownArrow = 40, LeftArrow = 37, RightArrow = 39, DiceKey = 32;

createRoom('Hall', 'Kitchen', 'Library', 'Lounge');

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
function createRoom(room1,room2, room3, room4){
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

  var board = [
      [hallgrid,kitchen],
      [library, lounge]
  ];


  // hall[0][0] == 'hall';
  // hall[1][1] == 'hall';
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
      $('#guess').show();
      $('#blame').show();
    }else{
      $('#room').html('<p>Go to a room.</p>');
      $('#guess').hide();
      $('#blame').hide();
    }
  }
}

/**
* This function is run when the document is loaded. Sets everything up.
**/
$(document).ready(function() {

  //lyssna på knapptryckningar och lagra keyCode i vår keystate
  keystate = {};
  document.addEventListener('keydown', function(evt){
    keystate[evt.keyCode] = true;
  });
  document.addEventListener('keyup', function(evt){
    delete keystate[evt.keyCode];
  });

  //create new answer and deal cards when start is clicked. playing status to true and show the players marker
  $('#start').on('click', function(){
    if (playing === false) {
      playing = true;
      $('#player').show();
      $('#response').append('<p>Nu kan du börja spela!</p>');
      createAnswer();
    }else{
      init();
      $('#player').hide();
      $('#response').html('<p>Spelet är avslutat.</p>');
    }
  });

  /**
  * Rolls dice and adds random steps
  **/
  if (keystate[DiceKey]) {
    steps = (Math.floor(Math.random()*6)+1);
    $('#stepCounter').html('<p>Du fick ' + steps + ' slag!</p>');
  }

  /**
  * Moves player if there are steps left
  **/
  if (steps >= 1 && steps <=6  && playing === true) {
    if (keystate[RightArrow]) posX++;
    if (keystate[LeftArrow]) posX--;
    if (keystate[DownArrow]) posY++;
    if (keystate[UpArrow]) posY--;
    

    steps--;
    checkRoom();

    $('#player').css('left', (gridSize * posX) + "px");
    $('#player').css('top', (gridSize * posY) + "px");
    $('#stepCounter').html('<p>steg kvar: ' + steps + '</p>');
    console.log('position X är nu: ' + posX + ' position Y är nu: ' + posY);
    console.log('du står i ' + grid[posX][posY]);
  }
  
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
  // console.log(playerCards);

  //remove cards from old arrays
  suspects.splice(suspect, 1);
  tools.splice(weapon, 1);
  rooms.splice(room, 1);

  //Debug
  // console.log('Antal mistänkta: ' + suspects.length);
  // console.log('Antal möjliga vapen: ' + tools.length);
  // console.log('Rooms to investigate: ' + rooms.length);
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
