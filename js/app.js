"use strict"

// Set up the global variables
var tiles = [];
var matches = 0;
var misses = 0;
var currentImg;
var startTime;
var rulesShown;

// Let's start by running after the DOM is ready
$(document).ready(function() {

	// Starting variables
    var i;

    // Load up the tile array
    for (i = 1; i <= 32; i++) {
        tiles.push({
           num: i,
           src: 'img/tile' + i + '.jpg',
           flipped: false,
           matched: false
        });
    }
	
	// Start up the game!
	startGame();
});

/*
 * Starts a game
 */
function startGame() {

	// Make the game board!
    buildGameboard();

    // Build the game functionality
    $('#game-board img').click(function() {

		// Set up the needed starting variables
       var img = $(this);
       var tile = img.data('tile');
		
		// Check to see if it's a legal choice
       if (!tile.flipped) {
	
			// Flip the image
			flipImage(img);

			// See if this is the second image selected
	   		if (!currentImg == 0) {
	   		
	   			// Check for a match
	   			if (tile.num == currentImg.data('tile').num) {
	   				tile.matched = true;
	   				currentImg.data('tile').matched = true;
					matches++;   			

	   			// No match
	   			} else {
					misses++;
					matchFail(img, currentImg);
	   			}

				// Set up for the next initial click
				$('#game-board img').css('cursor', 'pointer');	   			
				currentImg = 0;

	   		// Otherwise, set it up as the first selected image	
	   		} else {
	   			currentImg = img;
				$('#game-board img').css('cursor', 'crosshair');
		
	   		}        
       }        
    });

    // Start a timer
	newTimer();
	
	// Set up the new game button
	$('#newGameButton').click(function() {
    	startGame();
	});
	
	// Set up the Instructions button
	$('#instructionsButton').click(function() {
		if (rulesShown) {
			$('#message').empty();
			rulesShown = false;
		} else {
			$('#message').html('To complete your aptitude test, select two tiles to see if they match.  If they do not match, they will be flipped face down and you will have to select again.  Continue attempting to match tiles until all are face up.  You will be timed.  If you wish to reset the board, click the Reset button.');
			rulesShown = true;
		}
	});
	
}



/* 
 * Start a new timer
 */
function newTimer() {
    	startTime = _.now();
    var timer = window.setInterval(function() {
		var elapsed = moment().diff(startTime, 'seconds');
        $('#elapsed').text('Time Elapsed: ' + elapsed + 's');
        $('#matches').text('Matches: ' + matches);
        $('#remaining').text('Remaining: ' + (8 - matches));
        $('#misses').text('Misses: ' + misses);

        // Stop the timer when necessary
        if (matches == 8) {
            window.clearInterval(timer);
            winGame();
        }
    },1000);
	
}


/*
 * Flips the selected image/tile
 */
function flipImage(img) {
		var tile = img.data('tile');

        img.fadeOut(100, function() {
            if (tile.flipped) {
                img.attr('src', 'img/tile-back.png');
            } else {
                img.attr('src', tile.src);
            }
            tile.flipped = !tile.flipped;
            img.fadeIn(100);       	
        });
}

/*
 * Flips the two tiles back down after a failed match
 */
function matchFail(img1, img2) {
		var tile1 = img1.data('tile');
		var tile2 = img2.data('tile');
		
		_.delay(function() {
	        img1.fadeOut(100, function() {
	            img1.attr('src', 'img/tile-back.png');
	            tile1.flipped = !tile1.flipped;
	            img1.fadeIn(100);
	        });
	        img2.fadeOut(100, function() {
	            img2.attr('src', 'img/tile-back.png');
	            tile2.flipped = !tile2.flipped;
	            img2.fadeIn(100);
	        });
		}, 1000);
	
}

/*
 * Display Victory
 */
function winGame() {
	
	// Fade the board out
	$('#game-board img').fadeOut(3000);

	// Show the victory 
	_.delay(function() {
		$('#message').html('<img src="img/congrats.jpg">');	

		// Note, this was needed because sometimes a single img would get caught
		// still un-hidden in the DOM
		$('#game-board img').hide();
	}, 3000);

	// Start a new game
	_.delay(function() {
		$('#message').empty();
		startGame();
	}, 6000);
}

/*
 * Builds a new Game
 */
function buildGameboard() {
	// Clear the existing board
	$('#game-board').empty();

    // Shuffle up choose eight of them
    var selectedTiles = _.shuffle(tiles).slice(0,8);

    // Clone our set tiles to pair them up
    var tilePairs = [];
    _.forEach(selectedTiles, function(tile) {
        tilePairs.push(_.clone(tile));
        tilePairs.push(_.clone(tile));
    });

    // Shuffle it up
    var gameTiles = _.shuffle(tilePairs);

    // Build our game board
    var board = $('#game-board');
    var row = $(document.createElement('div'));
    var img;
    
    _.forEach(gameTiles, function(tile, elemIndex) {
        if (elemIndex > 0 && 0 == elemIndex % 4) {
            board.append(row);
            row = $(document.createElement('div'));
        }

        img = $(document.createElement('img'));
        img.attr({
            src: 'img/tile-back.png',
            alt: 'Image ' + tile.num
        });

        img.data('tile', tile);
        row.append(img);
    });
    board.append(row);

    matches = 0;
    misses = 0;
    currentImg = 0;
}