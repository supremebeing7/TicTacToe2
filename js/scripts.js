var Player = {
  create: function(playerName) {
    var player = Object.create(Player);
    player.playerName = playerName;
    player.spotsUsed = [];
    return player;
  }
};
var Space = {
  create: function(coordinateX, coordinateY) {
    var space = Object.create(Space);
    space.coordinateX = coordinateX;
    space.coordinateY = coordinateY;
    space.markedBy = "";
    return space;
  },
  markBy: function(player) {
    this.markedBy = player;
  }
};  
var Board = {
  turns : [1, 2, 3, 4, 5, 6, 7, 8, 9],
  wins: [[[1,1],[1,2],[1,3]], [[2,1],[2,2],[2,3]], [[3,1],[3,2],[3,3]],
        [[1,1],[2,1],[3,1]], [[1,2],[2,2],[3,2]], [[1,3],[2,3],[3,3]], 
        [[1,1],[2,2],[3,3]], [[3,1],[2,2],[1,3]]],
  spaces: [],
  create: function() {
    var board = Object.create(Board);
    for (var i=1; i < 4; i++) {
      for (var j=1; j <4; j++) {
        var space = Space.create(i,j);
        board.spaces.push(space);
      };
    };
    return board;  
  },
  find: function(coordinateX, coordinateY) {
    var found = Board.spaces.filter(function(space) {
      return space.coordinateY === coordinateY && space.coordinateX === coordinateX;
    });
    return found[0];
  },
  didWin: function(player) {
    var winner = false;
    var inArow = 0;
    Board.wins.forEach(function(win) {
      inArow = 0;
      win.forEach(function(coordinateSet) {
        player.spotsUsed.forEach(function(playerCoord) {
          if (coordinateSet[0] === playerCoord[0] && coordinateSet[1] === playerCoord[1]) {
            inArow++;
          }          
        });
        if (inArow === 3) {
          winner = true;
        };
      });  
    });
    return winner;
  }
};
var Game = {
  players: [],
  create: function() {
    var game = Object.create(Game);
    var playerX = Player.create("PlayerX");
    Game.players.push(playerX);
    var playerO = Player.create("PlayerO");
    Game.players.push(playerO);
    return game;
  },
  nextTurn: function(currentPlayer) {
    if (currentPlayer !== Game.players[0].playerName) {
      return currentPlayer = Game.players[0].playerName;
    } else if (currentPlayer !== Game.players[1].playerName){
      return currentPlayer = Game.players[1].playerName;
    }
  }
};

$(document).ready(function() {
  var game = Game.create();
  var board = Board.create();
  var turnCounter = 9;
  var currentPlayer = Game.players[0];
  var currentSpace;
  var winner = false;

  // $('#gameboard div.cell').click(function() {
    
  board.spaces.forEach(function(space) {
    $('div.cell[data-coordinate="' + '[' + space.coordinateX + ',' + space.coordinateY + ']' + '"]').click(function() {
      if (turnCounter === 0 || winner === true) {
        alert("Refresh to start a new game.");      
      } else {
        currentSpace = board.find(space.coordinateX,space.coordinateY);
        if (currentSpace.markedBy === "") {
          if (turnCounter % 2 === 1) {
            $(this).html("<img src='http://realfood.tesco.com/Media/images/Goodness-Icon-4-resize-70508466-33cd-4efb-b7c9-e9880e1b77e9-0-100x120.jpg'>");
            Game.players[0].spotsUsed.push([space.coordinateX,space.coordinateY]);
          } else if (turnCounter % 2 === 0){
            $(this).html("<img src='http://www.knowbrainer.com/forums/forum/i/authorsicons/35938/20080224%20-%204900%20-%20Self%20portrait%20(100%20x%20120px).jpg'>");
            Game.players[1].spotsUsed.push([space.coordinateX,space.coordinateY])
          } 
          currentSpace.markBy(currentPlayer);
          turnCounter--;
        } else {
          alert("Choose another space");
        };
        
        if (board.didWin(Game.players[1]) === true) {
          winner = true;
          alert("Player O wins!");
        } else if (board.didWin(Game.players[0]) === true) {
          winner = true;
          alert("Player X wins!");
        } else if (turnCounter === 0) {          
          alert("Tie Game")
        }
    };
    currentPlayer = Game.nextTurn(currentPlayer);
    });
  });


});
