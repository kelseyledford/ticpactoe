//make an array with hardcoded cell indexes (8 arrays inside of array that are possible win conditions)
//run a for loop through the array to check for win conditions
//prevent from choosing the same box twice
//add turn counter and count up to 9 for cat's game
var tptApp = angular.module ('tptApp', []);
tptApp.controller('TptController', function ($scope) { 
	//Creates a 2D array
	$scope.cells = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
	$scope.gameOver = false;
	$scope.isXTurn = true;
	$scope.makeMove = function (clickedCellIndex) {
		if ($scope.cells[clickedCellIndex] == ' ') {
			console.log("you can choose this");
			//sets cell to 1 (pacman) or -1 (ghost)
			$scope.cells[clickedCellIndex] = $scope.isXTurn?1:-1;
			//win conditions
			//row for pacman
			if ($scope.cells[0] + $scope.cells[1] + $scope.cells[2] == 3 ||
				$scope.cells[3] + $scope.cells[4] + $scope.cells[5] == 3 ||
				$scope.cells[6] + $scope.cells[7] + $scope.cells[8] == 3) {
				console.log("Pacman wins!");
				$scope.gameOver = true;
				$scope.restart = function () {
					$scope.cells = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
					$scope.gameOver = false;
				};
			//row for ghost
			} else if ($scope.cells[0] + $scope.cells[1] + $scope.cells[2] == -3 ||
				$scope.cells[3] + $scope.cells[4] + $scope.cells[5] == -3 ||
				$scope.cells[6] + $scope.cells[7] + $scope.cells[8] == -3) {
				console.log("Ghost wins!");
				$scope.gameOver = true;
				$scope.restart = function () {
					$scope.cells = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
					$scope.gameOver = false;
				};
			//column for pacman
			} else if ($scope.cells[0] + $scope.cells[3] + $scope.cells[6] == 3 ||
				$scope.cells[1] + $scope.cells[4] + $scope.cells[7] == 3 ||
				$scope.cells[2] + $scope.cells[5] + $scope.cells[8] == 3) {
				console.log("Pacman wins!");
				$scope.gameOver = true;
				$scope.restart = function () {
					$scope.cells = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
					$scope.gameOver = false;
				};
			//column for ghost
			} else if ($scope.cells[0] + $scope.cells[3] + $scope.cells[6] == -3 ||
				$scope.cells[1] + $scope.cells[4] + $scope.cells[7] == -3 ||
				$scope.cells[2] + $scope.cells[5] + $scope.cells[8] == -3) {
				console.log("Ghost wins!");
				$scope.gameOver = true;
				$scope.restart = function () {
					$scope.cells = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
					$scope.gameOver = false;
				};
			//diagonals for pacman
			} else if ($scope.cells[0] + $scope.cells[4] + $scope.cells[8] == 3 ||
				$scope.cells[2] + $scope.cells[4] + $scope.cells[6] == 3) {
				console.log("Pacman wins!");
				$scope.gameOver = true;
				$scope.restart = function () {
					$scope.cells = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
					$scope.gameOver = false;
				};
			//diagonals for ghost
			} else if ($scope.cells[0] + $scope.cells[4] + $scope.cells[8] == -3 ||
				$scope.cells[2] + $scope.cells[4] + $scope.cells[6] == -3) {
				console.log("Ghost wins!");
				$scope.gameOver = true;
				$scope.restart = function () {
					$scope.cells = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
					$scope.gameOver = false;
				};
			//cat's game
			} else if ($scope.cells[0] !== ' ' && $scope.cells[1] !== ' ' && $scope.cells[2] !== ' ' && $scope.cells[3] !== ' ' && $scope.cells[4] !== ' ' && $scope.cells[5] !== ' ' && $scope.cells[6] !== ' ' && $scope.cells[7] !== ' ' && $scope.cells[8]) {
				console.log("Cat's Game");
				$scope.gameOver = true;
				$scope.restart = function () {
					$scope.cells = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
					$scope.gameOver = false;
				};
			//changes to other player's turn
			} else {
				$scope.isXTurn = !$scope.isXTurn; 
			}; 
		} else {
			console.log("you can't choose this");
		};
	};
});


//when clicking on cell, ifXTurn is true, puts X, if false, puts O
//changes ifXTurn to be the opposite of current state (true or false)
//Each player is assigned to either player1 or player2 X
//Create a variable currentPlayer = player1
//Create game board with 9 divs, each div has property player = null;
//Div is clicked
	//If div is empty (chosen = false)
		//If currentPlayer = player1
			//push X to that spot in the cells array
			//player = 1;
			//Check win conditions
				//If row (cells w/ indexes 0,1,2 OR 3,4,5 OR 6,7,8's property player = 1)
					//declare player1 winner
				//else if diagonal (cells w/ indexes 0,4,8 or 2,4,6's property player = 1)
					//declare player1 winner
				//else if column (cells w/ indexes 0,3,6 OR 1,4,7 OR 3,5,8's property player = 1)
					//declare player1 winner
				//if no div has the property player = null
					//declare cat's game
				//else
					//currentPlayer = player2
		//Else
			//push O to that spot in the cells array
			//player = 2;
			//Check win conditions
				//If row (cells w/ indexes 0,1,2 OR 3,4,5 OR 6,7,8's property player = 2)
					//declare player2 winner
				//else if diagonal (cells w/ indexes 0,4,8 or 2,4,6's property player = 2)
					//declare player2 winner
				//else if column (cells w/ indexes 0,3,6 OR 1,4,7 OR 3,5,8's property player = 2)
					//declare player2 winner
				//if no divs have the property player = null;
					//declare cat's game
				//else
					//currentPlayer = player2
			//currentPlayer = player1