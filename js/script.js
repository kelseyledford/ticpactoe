var tptApp = angular.module ('tptApp', ["firebase"]);
tptApp.controller('TptController', function ($scope, $timeout, $firebase) { 
	var ticTacRef = new Firebase("https://tic-pac-toe.firebaseio.com/games");
	var playerNum;
	var lastGame;
	var	startSound = document.getElementById("startSound");

	ticTacRef.once("value", function(data){
		var games = data.val(); 
		if (games != null) {
			var keys = Object.keys(games);
			var lastKey = keys[keys.length-1];
			lastGame = games[lastKey];
			//Someone is already in the room
			if (lastGame.waiting==true) {
				lastGame = ticTacRef.child(lastKey);
				//Sets the state of the game for when both players have joined
				lastGame.set ( {box: 2, waiting: false, ghostGifSource: ' ', pacmanGifSource: ' ', ghostDiesSound: ' ', pacmanDiesSound: ' ', playAgainSound: ' ',
					gameOver: false, isPMTurn: true, showWinner: false, showPlayAgain: false, cells: [' ',' ',' ',' ',' ',' ',' ',' ',' '] } );
				playerNum = 2;
				startSound.play();
			} else {
				//You are the first person in the room
				lastGame = ticTacRef.push({box: 1, waiting: true});
				playerNum = 1;
				startSound.play();
			}
		//There are no games logged on Firebase
		} else {
			//You are the first person in the room
			lastGame = ticTacRef.push({box: 1, waiting:true});
			playerNum = 1;
			startSound.play();
		}
		$scope.game = $firebase(lastGame);
	});

	//When a cell is clicked, this function runs with the clicked cell's index passed as a parameter
	$scope.makeMove = function(clickedCellIndex) {
		if ($scope.game.cells[clickedCellIndex] == ' ' && $scope.game.isPMTurn == true && playerNum == 1) {
			$scope.game.cells[clickedCellIndex] = 1;
			$scope.game.$save();
			$scope.checkWinConditions();
		} else if ($scope.game.cells[clickedCellIndex] == ' ' && $scope.game.isPMTurn == false && playerNum == 2) {
			$scope.game.cells[clickedCellIndex] = -1;
			$scope.game.$save();
			$scope.checkWinConditions();
		}
	};

	$scope.checkWinConditions = function() {
		//Checks for a win
		if (Math.abs($scope.game.cells[0] + $scope.game.cells[1]+ $scope.game.cells[2]) == 3 ||
		Math.abs($scope.game.cells[3] + $scope.game.cells[4]+ $scope.game.cells[5]) == 3 ||
		Math.abs($scope.game.cells[6]+ $scope.game.cells[7] + $scope.game.cells[8]) == 3 ||
		Math.abs($scope.game.cells[0]+ $scope.game.cells[3] + $scope.game.cells[6]) == 3 ||
		Math.abs($scope.game.cells[1] + $scope.game.cells[4] + $scope.game.cells[7]) == 3 ||
		Math.abs($scope.game.cells[2]+ $scope.game.cells[5]+ $scope.game.cells[8]) == 3 ||
		Math.abs($scope.game.cells[0] + $scope.game.cells[4] + $scope.game.cells[8]) == 3 ||
		Math.abs($scope.game.cells[2] + $scope.game.cells[4] + $scope.game.cells[6]) == 3) {
			$scope.gameOverActions();
		//Cat's game
		} else if ($scope.game.cells[0] !== ' ' && $scope.game.cells[1] !== ' ' && $scope.game.cells[2] !== ' ' &&
		 $scope.game.cells[3] !== ' ' && $scope.game.cells[4] !== ' ' && $scope.game.cells[5] !== ' ' &&
		 $scope.game.cells[6] !== ' ' && $scope.game.cells[7] !== ' ' && $scope.game.cells[8]) {
			$scope.game.box = 5;
			$scope.game.showPlayAgain = true;
		//Changes to the other player's turn
		} else {
			$scope.game.isPMTurn = !$scope.game.isPMTurn; 
		}; 
		$scope.game.$save();
	};

	$scope.gameOverActions = function() {
		console.log($scope.game.box);
		if ($scope.game.isPMTurn == true) {
			$scope.game.box = 3;
			$scope.game.ghostDiesSound = "sounds/ghost_dies.mp3";
			$scope.game.pacmanGifSource = "images/pacman_wins.gif";
			$timeout(function() {$scope.game.pacmanGifSource=" "; $scope.game.$save();}, 2800);
			$timeout(function() {$scope.game.showWinner = true; $scope.game.$save();}, 3400);
			$timeout(function() {$scope.game.showPlayAgain = true; $scope.game.$save();}, 4800);
		//checks if ghost was the last one who played
		} else {
			$scope.game.box = 4;
			$scope.game.ghostDiesSound = "sounds/pacman_dies.mp3";
			$scope.game.ghostGifSource = "images/ghost_wins.gif";
			$timeout(function() {$scope.game.ghostGifSource=" "; $scope.game.$save();}, 3800);
			$timeout(function() {$scope.game.showWinner = true; $scope.game.$save();}, 4400);
			$timeout(function() {$scope.game.showPlayAgain = true; $scope.game.$save();}, 5800);
		}
		//actions that should be taken either way
		$scope.gameOver = true;
		$scope.game.$save();
	};

	$scope.restart = function () {
		$scope.game.cells = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
		$scope.game.box = 2;
		$scope.gameOver = false;
		$scope.game.showWinner = false;
		$scope.game.showPlayAgain = false;
		$scope.game.ghostDiesSound = ' ';
		$scope.game.pacmanDiesSound = ' ';
		$scope.game.playAgainSound = "sounds/pacman_intro.wav";
		$scope.game.$save();
	};

});