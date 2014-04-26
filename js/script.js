var tptApp = angular.module ('tptApp', ["firebase"]);
tptApp.controller('TptController', function ($scope, $firebase) { 
	var ticTacRef = new Firebase("https://mrs-pac-man.firebaseio.com/games");
	var waitingMessage = document.getElementById("waitingMessage");
	var startSound = document.getElementById("startSound");
	var winnerAlert = document.getElementById("winnerAlert");
	var gameOverAlert = document.getElementById("gameOverAlert");
	var waitingMessage = document.getElementById("waitingMessage");
	var playerNum;
	var lastGame;

	ticTacRef.once("value", function(data){
		var games = data.val();//Get the real objects out of angularified blob
		if (games != null) {
			var keys = Object.keys(games); //Get all the screwy text keys
			var lastKey = keys[keys.length-1]; //Find the last key
			lastGame = games[lastKey]; //Use the last key to get the last game object
			//someone is already in the room waiting for you
			if (lastGame.waiting==true) {
				//Find the Angular version of this game
				lastGame = ticTacRef.child(lastKey);
				lastGame.set ( {box: 2, waiting: false, winner: null, gameOver: false, isPMTurn: true, cells: [{value:' '},{value:' '},{value:' '},{value:' '},{value:' '},{value:' '},{value:' '},{value:' '},{value:' '}] } );
				playerNum = 2;
			} else {
				//you want to play but there's no one there. waiting is false.
				lastGame = ticTacRef.push({box: 1, waiting: true});
				playerNum = 1;
				waitingMessage.innerHTML="GET READY!";
			}
		//we have no game
		} else {
			//This is like when someone opened the page and wanted to start playing
			lastGame = ticTacRef.push({box: 1, waiting:true});
			playerNum = 1;
			waitingMessage.innerHTML="GET READY!";
		}
		$scope.game = $firebase(lastGame);
	});

	//clicking the box makes a new one appear
	// $scope.clickTheBox = function () {
	// 	//increments the box# first, then if it reaches 4 (which doesn't exist)
	// 	if (++$scope.box == 4) {
	// 		//cycles back to the first div
	// 		$scope.box = 1;
	// 	};
	// }; 

	//When a cell is clicked, this function runs with the clicked cell's index passed as a parameter
	$scope.makeMove = function(clickedCellIndex) {
		//when gameOver = true, no empty box can be clicked
		if ($scope.gameOver == true) {
			console.log ("Stop playing loser the game is over");
		//If the cells is empty, check win conditions
		} else if ($scope.game.cells[clickedCellIndex].value == ' ') {
			if ($scope.game.isPMTurn == true && playerNum == 1) {
				$scope.game.cells[clickedCellIndex].value = 1;
				$scope.game.$save();
				$scope.checkWinConditions();
			} else if ($scope.game.isPMTurn == false && playerNum == 2) {
				$scope.game.cells[clickedCellIndex].value = -1;
				$scope.game.$save();
				$scope.checkWinConditions();
			} else {
				console.log ("Not your turn!")
			}
		//if cell is not empty, unclickable
		} else {
			console.log("It's taken!");
		};
	};

	$scope.checkWinConditions = function() {
		//rows
		if (Math.abs($scope.game.cells[0].value + $scope.game.cells[1].value + $scope.game.cells[2].value) == 3 ||
			Math.abs($scope.game.cells[3].value + $scope.game.cells[4].value + $scope.game.cells[5].value) == 3 ||
			Math.abs($scope.game.cells[6].value + $scope.game.cells[7].value + $scope.game.cells[8].value) == 3) {
			$scope.gameOverActions();
		//columns
		} else if (Math.abs($scope.game.cells[0].value + $scope.game.cells[3].value + $scope.game.cells[6].value) == 3 ||
			Math.abs($scope.game.cells[1].value + $scope.game.cells[4].value + $scope.game.cells[7].value) == 3 ||
			Math.abs($scope.game.cells[2].value + $scope.game.cells[5].value + $scope.game.cells[8].value) == 3) {
			$scope.gameOverActions();
		//diagonals
		} else if (Math.abs($scope.game.cells[0].value + $scope.game.cells[4].value + $scope.game.cells[8].value) == 3 ||
			Math.abs($scope.game.cells[2].value + $scope.game.cells[4].value + $scope.game.cells[6].value) == 3) {
			$scope.gameOverActions();
		//cat's game
		} else if ($scope.game.cells[0].value !== ' ' && $scope.game.cells[1].value !== ' ' && $scope.game.cells[2].value !== ' ' &&
		 $scope.game.cells[3].value !== ' ' && $scope.game.cells[4].value !== ' ' && $scope.game.cells[5].value !== ' ' &&
		 $scope.game.cells[6].value !== ' ' && $scope.game.cells[7].value !== ' ' && $scope.game.cells[8].value) {
			$scope.game.box = 5;
			gameOverAlert.innerHTML = "GAME  OVER";
			winnerAlert.innerHTML = "CAT'S GAME";
		//changes to other player's turn
		} else {
			$scope.game.isPMTurn = !$scope.game.isPMTurn; 
			$scope.game.$save();
		}; 
	};

	$scope.gameOverActions = function() {
		console.log($scope.game.box);
		if ($scope.game.isPMTurn == true) {
			$scope.game.box = 3;
			console.log($scope.game.box);
			// $scope.ghostDiesSound();
			// document.getElementById("gif").src="..images/pacman_winner.gif";
			winnerAlert.innerHTML = "PACMAN WINS!";
			$scope.winner = "pacman";
		//checks if ghost was the last one who played
		} else {
			$scope.game.box = 4;
			console.log($scope.game.box);
			// $scope.pacmanDiesSound();
			// document.getElementById("gif").src="..images/ghost_winner.gif";
			winnerAlert.innerHTML = "GHOST WINS!";
			$scope.winner = "ghost";
		}
		//actions that should be taken either way
		gameOverAlert.innerHTML = "GAME  OVER";
		$scope.gameOver = true;
		$scope.game.$save();
	};

	$scope.restart = function () {
		$scope.game.cells = [{value:' '},{value:' '},{value:' '},{value:' '},{value:' '},{value:' '},{value:' '},{value:' '},{value:' '}];
		$scope.gameOver = false;
		$scope.winner = null;
		gameOverAlert.innerHTML = " ";
		winnerAlert.innerHTML = " ";
		startSound.play();
	};

		// $scope.ghostDiesSound = function() {
	// 	ghostDiesSound = document.getElementById("ghostDiesSound");
	// 	ghostDiesSound.play();
	// };
	// $scope.pacmanDiesSound = function() {
	// 	pacmanDiesSound = document.getElementById("pacmanDiesSound");
	// 	pacmanDiesSound.play();
	// };
});