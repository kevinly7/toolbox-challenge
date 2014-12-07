"use strict"

$(document).ready(function() {


    createBoard();

    $('#start').click(function() {
        var matches = 0;
        var missed = 0;
        var remaining = 8;
        var clickedTiles = [];
        var clickable = true;

        $('#game-board img').click(function() {
            var startTime = _.now();
            var timer = window.setInterval(function() {
                var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
                $('#elapsed-seconds').text(elapsedSeconds);

                if (win) {
                    window.clearInterval(timer);
                }
            }, 1000);
            if(clickable) {
                var img = $(this);
                var tile = img.data('tile');

                if(img.attr('src') == 'img/tile-back.png') {
                    if (clickedTiles.length < 2) {
                        clickedTiles.push(tile);
                    }
                    flipImage(img, tile);
                    if (clickedTiles.length == 2) {
                        clickable = !clickable;
                        if (clickedTiles[0].tileNum == clickedTiles[1].tileNum) {
                            matches++;
                            remaining--;
                            $('#matches').text('Matches: ' + matches);
                            $('#remaining').text('Remaining ' + remaining);
                            if (matches == 8) {
                                window.clearInterval(timer);
                                //$('#winner').show();
                            }
                        } else {
                            missed++;
                            $('#misses').text('Missed: ' + missed);
                            flipImage(clickedTiles[0]);
                            flipImage(clickedTiles[1]);
                        }
                        clickedTiles = [];
                        //clickedIMGs = [];
                        clickable = !clickable;
                    }
                }
            }
        }); //on click of gameboard images
    });
}); //jQuery Ready Function

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
    //img.fadeOut(100, function () {
    //    img.attr('src', source);
    //    img.fadeIn(100);
    //}); //after fadeOut
}