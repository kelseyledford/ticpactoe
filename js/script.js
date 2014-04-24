//make an array with hardcoded cell indexes (8 arrays inside of array that are possible win conditions)
//run a for loop through the array to check for win conditions
//add turn counter and count up to 9 for cat's game
var tptApp = angular.module ('tptApp', []);
tptApp.controller('TptController', function ($scope) { 
	//sets the first box to appear on the front
	$scope.box = 1;
	//clicking the box makes a new one appear
	$scope.clickTheBox = function () {
		//increments the box# first, then if it reaches 4 (which doesn't exist)
		if (++$scope.box == 4) {
			//cycles back to the first div
			$scope.box = 1;
		};
	};
	var startSound = document.getElementById("startSound");
	var winnerAlert = document.getElementById("winnerAlert");
	var gameOverAlert = document.getElementById("gameOverAlert");
	var startSound;
	$scope.cells = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
	$scope.gameOver = false;
	$scope.isPMTurn = true;
	$scope.winner = null;
	window.onload = function() {
		startSound.play();
	};
	$scope.restart = function () {
		$scope.cells = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
		$scope.gameOver = false;
		$scope.winner = null;
		gameOverAlert.innerHTML = " ";
		winnerAlert.innerHTML = " ";
		startSound.play();
	};
	$scope.ghostDies = function() {
		ghostDiesSound = document.getElementById("ghostDiesSound");
		ghostDiesSound.play();
	};
	$scope.pacmanDies = function() {
		pacmanDiesSound = document.getElementById("pacmanDiesSound");
		pacmanDiesSound.play();
	};
	$scope.gameOverActions = function() {
		if ($scope.isPMTurn == true) {
			$scope.ghostDies();
			winnerAlert.innerHTML = "PACMAN WINS!";
			$scope.winner = "pacman";
		//checks if ghost was the last one who played
		} else {
			$scope.pacmanDies();
			winnerAlert.innerHTML = "GHOST WINS!";
			$scope.winner = "ghost";
		}
		//actions that should be taken either way
		gameOverAlert.innerHTML = "GAME  OVER";
		$scope.gameOver = true;
		$scope.box = 3;
	};
	//When a cell is clicked, this function runs with the clicked cell's index passed as a parameter
	$scope.makeMove = function (clickedCellIndex) {
		//If the cells is empty, check win conditions
		//when gameOver = true, no empty box can be clicked
		if ($scope.gameOver == true) {
			console.log ("Stop playing loser the game is over");
		} else if ($scope.cells[clickedCellIndex] == ' ') {
			//sets cell to 1 (pacman) or -1 (ghost) depending on whose turn it is
			$scope.cells[clickedCellIndex] = $scope.isPMTurn?1:-1;
			//win conditions
			//checks for the absolute number (negative or positive version)
			//rows
			if (Math.abs($scope.cells[0] + $scope.cells[1] + $scope.cells[2]) == 3 ||
				Math.abs($scope.cells[3] + $scope.cells[4] + $scope.cells[5]) == 3 ||
				Math.abs($scope.cells[6] + $scope.cells[7] + $scope.cells[8]) == 3) {
				//checks to see if pacman was the last one who clicked
				$scope.gameOverActions();
			//columns
			} else if (Math.abs($scope.cells[0] + $scope.cells[3] + $scope.cells[6]) == 3 ||
				Math.abs($scope.cells[1] + $scope.cells[4] + $scope.cells[7]) == 3 ||
				Math.abs($scope.cells[2] + $scope.cells[5] + $scope.cells[8]) == 3) {
				$scope.gameOverActions();
			
			//diagonals for pacman
			} else if (Math.abs($scope.cells[0] + $scope.cells[4] + $scope.cells[8]) == 3 ||
				Math.abs($scope.cells[2] + $scope.cells[4] + $scope.cells[6]) == 3) {
				$scope.gameOverActions();
				
			//cat's game
			} else if ($scope.cells[0] !== ' ' && $scope.cells[1] !== ' ' && $scope.cells[2] !== ' ' && $scope.cells[3] !== ' ' && $scope.cells[4] !== ' ' && $scope.cells[5] !== ' ' && $scope.cells[6] !== ' ' && $scope.cells[7] !== ' ' && $scope.cells[8]) {
				gameOverAlert.innerHTML = "GAME  OVER";
				winnerAlert.innerHTML = "CAT'S GAME";
				$scope.gameOver = true;
			//changes to other player's turn
			} else {
				$scope.isPMTurn = !$scope.isPMTurn; 
			}; 
		//if cell is not empty, unclickable
		} else {
			console.log("you can't choose this");
		};
	};
});