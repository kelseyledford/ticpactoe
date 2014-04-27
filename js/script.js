//set game over and play again to pop up after
//set timeout on gif XXX
//create audio for pacman win XXX
//create audio for ghost win XXX
//create click audio?
//deploy on firebase
//clean up code and comment things out

var tptApp = angular.module ('tptApp', ["firebase"]);
tptApp.controller('TptController', function ($scope, $timeout, $firebase) { 
	var ticTacRef = new Firebase("https://mrs-pac-man.firebaseio.com/games");
	var playerNum;
	var lastGame;
	var	startSound = document.getElementById("startSound");
	var ghostDiesSound = document.getElementById("ghostDiesSound");
	var pacmanDiesSound = document.getElementById("pacmanDiesSound");

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
				lastGame.set ( {gifDone: true, ghostGifSource: ' ', pacmanGifSource: ' ', box: 2, waiting: false, gameOver: false, isPMTurn: true, cells: [' ',' ',' ',' ',' ',' ',' ',' ',' '] } );
				playerNum = 2;
				startSound.play();
			} else {
				//you want to play but there's no one there. waiting is false.
				lastGame = ticTacRef.push({box: 1, waiting: true});
				playerNum = 1;
				startSound.play();
			}
		//we have no game
		} else {
			//This is like when someone opened the page and wanted to start playing
			lastGame = ticTacRef.push({box: 1, waiting:true});
			playerNum = 1;
			startSound.play();
		}
		$scope.game = $firebase(lastGame);
	});

	//When a cell is clicked, this function runs with the clicked cell's index passed as a parameter
	$scope.makeMove = function(clickedCellIndex) {
		//when gameOver = true, no empty box can be clicked
		if ($scope.gameOver == true) {
			console.log ("Stop playing loser the game is over");
		//If the cells is empty, check win conditions
		} else if ($scope.game.cells[clickedCellIndex] == ' ') {
			if ($scope.game.isPMTurn == true && playerNum == 1) {
				$scope.game.cells[clickedCellIndex] = 1;
				$scope.game.$save();
				$scope.checkWinConditions();
			} else if ($scope.game.isPMTurn == false && playerNum == 2) {
				$scope.game.cells[clickedCellIndex] = -1;
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
		if (Math.abs($scope.game.cells[0] + $scope.game.cells[1]+ $scope.game.cells[2]) == 3 ||
			Math.abs($scope.game.cells[3] + $scope.game.cells[4]+ $scope.game.cells[5]) == 3 ||
			Math.abs($scope.game.cells[6]+ $scope.game.cells[7] + $scope.game.cells[8]) == 3) {
			$scope.gameOverActions();
		//columns
		} else if (Math.abs($scope.game.cells[0]+ $scope.game.cells[3] + $scope.game.cells[6]) == 3 ||
			Math.abs($scope.game.cells[1] + $scope.game.cells[4] + $scope.game.cells[7]) == 3 ||
			Math.abs($scope.game.cells[2]+ $scope.game.cells[5]+ $scope.game.cells[8]) == 3) {
			$scope.gameOverActions();
		//diagonals
		} else if (Math.abs($scope.game.cells[0] + $scope.game.cells[4] + $scope.game.cells[8]) == 3 ||
			Math.abs($scope.game.cells[2] + $scope.game.cells[4] + $scope.game.cells[6]) == 3) {
			$scope.gameOverActions();
		//cat's game
		} else if ($scope.game.cells[0] !== ' ' && $scope.game.cells[1] !== ' ' && $scope.game.cells[2] !== ' ' &&
		 $scope.game.cells[3] !== ' ' && $scope.game.cells[4] !== ' ' && $scope.game.cells[5] !== ' ' &&
		 $scope.game.cells[6] !== ' ' && $scope.game.cells[7] !== ' ' && $scope.game.cells[8]) {
			$scope.game.box = 5;
			$scope.game.$save();
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
			ghostDiesSound.play();
			$scope.game.pacmanGifSource = "images/newpacmanwinner.gif";
			//FIGURE OUT TIMEOUT-- GET GIF TO DISAPPEAR!
			$timeout(function() {$scope.game.pacmanGifSource=" "; $scope.game.$save();}, 4000);
		//checks if ghost was the last one who played
		} else {
			$scope.game.box = 4;
			pacmanDiesSound.play();
			$timeout(function() {$scope.game.ghostGifSource=" "; $scope.game.$save();}, 4000);
			$scope.game.ghostGifSource = "images/testghostwinner.gif";
		}
		//actions that should be taken either way
		$scope.gameOver = true;
		$scope.game.$save();
	};

	$scope.restart = function () {
		$scope.game.cells = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
		$scope.game.box = 2;
		$scope.gameOver = false;
		$scope.game.$save();
		startSound.play();
	};

});