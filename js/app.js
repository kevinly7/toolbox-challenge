"use strict"


$(document).ready(function() {
    var timer;
    createBoard();
    $('#how-to').click(function() {
        displayHowMessage();
    });
    $('#start').click(function() {
        window.clearInterval(timer);
        resetGame()
        var matches = 0;
        var missed = 0;
        var remaining = 8;
        var clickedTiles = [];
        var clickedImg = [];
        var clickable = true;
        var startTime = _.now();
        timer = window.setInterval(function() {
            var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
            $('#elapsed-seconds').text("Time Elapsed: " + elapsedSeconds);
        }, 1000);
        $('#game-board img').click(function() {
            if(clickable) {
                var img = $(this);
                var tile = img.data('tile');

                if(img.attr('src') == 'img/tile-back.png') {
                    if (clickedTiles.length < 2) {
                        clickedTiles.push(tile);
                        clickedImg.push(img);
                    }
                    flipImage(img, tile);
                    if (clickedTiles.length == 2) {
                        clickable = !clickable;
                        window.setTimeout(function() {
                            if (clickedTiles[0].tileNum == clickedTiles[1].tileNum) {
                                matches++;
                                remaining--;
                                $('#matches').text('Matches: ' + matches);
                                $('#remaining').text('Remaining: ' + remaining);
                                if (matches == 8) {
                                    window.clearInterval(timer);
                                    displayWinMessage();
                                }
                            } else {
                                missed++;
                                $('#misses').text('Missed: ' + missed);
                                flipImage(clickedImg[0], clickedTiles[0]);
                                flipImage(clickedImg[1], clickedTiles[1]);
                            }
                            clickedTiles = [];
                            clickedImg = [];
                            clickable = !clickable;
                        }, 1000);
                    } //if two tiles are clicked
                } //if clicked on an unflipped tile
            } //if image is clickable
        }); //on click of gameboard images
    }); //on click of start button
}); //jQuery Ready Function


// shuffles the images and builds the gameboard
function createBoard() {
    var tiles = [];
    var idx;
    for (idx = 1; idx <= 32; ++idx) {
        tiles.push({
            tileNum: idx,
            src: 'img/tile' + idx + '.jpg'
        });
    }

    console.log(tiles);
    var shuffledTiles = _.shuffle(tiles);
    console.log(shuffledTiles);

    var selectedTiles = shuffledTiles.slice(0,8);
    console.log(selectedTiles);

    var tilePairs = [];
    _.forEach(selectedTiles, function(tile) {
        tilePairs.push(_.clone(tile));
        tilePairs.push(_.clone(tile));
    });
    tilePairs = _.shuffle(tilePairs);

    console.log(tilePairs);

    var gameBoard = $('#game-board');
    var row = $(document.createElement('div'));
    var img;
    _.forEach(tilePairs, function(tile, elemIndex) {
        if (elemIndex > 0 && 0 == elemIndex % 4){
            gameBoard.append(row);
            row = $(document.createElement('div'));
        }

        img = $(document.createElement('img'));
        img.attr({
            src: 'img/tile-back.png',
            alt: 'image of tile ' + tile.tileNum
        });
        img.data('tile', tile);
        row.append(img);
    });
    gameBoard.append(row);
}

// flips the images
function flipImage(img, tile) {
    img.fadeOut(100, function () {
        if (tile.flipped) {
            img.attr('src', 'img/tile-back.png')
        }
        else {
            img.attr('src', tile.src);
        }
        img.fadeIn(100);
        tile.flipped = !tile.flipped;
    });
}

// displays the win message
function displayWinMessage() {
    $('#win').css("display", "block");
    $('main').css("opacity", "0.4");
    $('#win').click(function() {
        resetGame();
    });
}

// resets the game to play again
function resetGame() {
    $('main').css("opacity", "1");
    $('#win').css("display", "none");
    $('#game-board').empty();
    createBoard();
    $('#elapsed-seconds').text("Time Elapsed: " + 0);
    $('#matches').text('Matches: ' + 0);
    $('#remaining').text('Remaining: ' + 8);
    $('#misses').text('Missed: ' + 0);
}

function displayHowMessage() {
    $('#instructions').css("display", "block");
    $('main').css("opacity", "0.4");
    $('#close-icon').click(function () {
        $('main').css("opacity", "1");
        $('#instructions').css("display", "none");
    });
}