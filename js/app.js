

// Set up the necessary variables
var tiles = [];
var matches = 0;
var misses = 0;
var currentImg;

// Let's start by running after the DOM is ready
$(document).ready(function() {

    var i;
    var startTime = _.now();

    // Load up the tile array
    for (i = 1; i <= 32; i++) {
        tiles.push({
           num: i,
           src: 'img/tile' + i + '.jpg',
           flipped: false,
           matched: false
        });
    }
	
	// Make the game board!
    buildGameboard();

    // Build the game functionality
    $('#game-board img').click(function() {
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

//  NEED TO ADD A DELAY OF 1000ms HERE

					flipImage(img);
					flipImage(currentImg);					
					misses++;
	   			}
	   			
				currentImg = 0;

	   		// Otherwise, set it up as the first selected image	
	   		} else {
	   			currentImg = img;		
	   		}        
       }        

        console.log(elapsed);
    });


    // Build the timers
    var timer = window.setInterval(function() {
		var elapsed = 20;
//		var elapsed = moment().diff(startTime, 'seconds');
//        var elapsed = Math.floor(_.now() - startTime / 1000);
        $('elapsed').text('Time Elapsed: ' + elapsed);
        $('matches').text('Matches: ' + matches);
        $('remaining').text('Remaining: ' + (8 - matches));
        $('misses').text('Misses: ' + misses);

        // Stop the timer when necessary
        if (matches == 8) {
            window.clearInterval(timer);
            winGame();
        }
    },1000);


	// Set up the new game button
	$('#newGameButton').click(function() {
		buildGameboard();
	});
});


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
 * Display Victory
 */
function winGame() {
	console.log('YOU HAVE WON THE GAME');
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