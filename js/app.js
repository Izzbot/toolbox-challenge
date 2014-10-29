

// Set up the necessary variables
var tiles = [];
var matched = 0;
var misses = 0;
var currentImg;

// Let's start by running after the DOM is ready
$(document).ready(function() {

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

    buildGameboard();

    // Build the game functionality
    $('#game-board img').click(function() {
       var img = $(this);
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
    });


    // Build the timers
    var startTime = _.now();
    var timer = window.setInterval(function() {
        var elapsed = Math.floor((_.now() - startTime) / 1000);
        $('elapsed-seconds').text('Time Elapsed: ' + elapsed);

        // Stop the timer when necessary
        if (matched = 8) {
            window.clearInterval(timer);
        }
    },1000);


});


function buildGameboard() {
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

    matched = 0;
    misses = 0;
    currentImg = 0;
}