// Objects
let objects = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube', 'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'],

    // Useful selectors shortened
    $rating = $('.fa-star'),
    $moves = $('.moves'),
    $timer = $('.timer'),
    $restart = $('.restart'),
    $deck = $('.deck'),

    // Set variables to shorten code
    time,
    cardsOpen = [],
    match = 0,
    second = 0,
    moves = 0,
    wait = 420,
    totalCard = objects.length / 2,

    // Scoring system from 1 to 3 stars to shorten code
    stars3 = 15,
    stars2 = 18,
    star1 = 25;

// Shuffle function from http://stackoverflow.com/a/2450976, so no two games have the same card arrangement
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Function to begin game
function init() {

    // When game begins, match equals zero, moves equal zero
    match = 0;
    moves = 0;
    $moves.text('0');

    // The shuffle function for object shortener in array
    let allCards = shuffle(objects);
    $deck.empty();

    // create 16 <li> tags with class of card
    // Add class of fa fa- and name of each object from objects=[] array
    for (let i = 0; i < allCards.length; i++) {
        $deck.append($('<li class="card"><i class="fa fa-' + allCards[i] + '"></i></li>'))
    }
    addCardListener();

    // resets the timer to 0 if the game is restarted
    resetTimer(time);
    second = 0;
    $timer.text(`${second}`)
    initTime();
}

// Function to display star rating
function rating(moves) {
    let rating = 3;
    if (moves > stars3 && moves < stars2) {
        $rating.eq(3).removeClass('fa-star').addClass('fa-star-o');
    } else if (moves > stars2 && moves < star1) {
        $rating.eq(2).removeClass('fa-star').addClass('fa-star-o');
    } else if (moves > star1) {
        $rating.eq(1).removeClass('fa-star').addClass('fa-star-o');
        rating = 1;
    }
    return { score: rating };
}

// Add alert window modal to display the number of moves and star score rating.
function gameOver(moves, score) {
    $('#winnerMessage').text(`You completed the game in a total of ${moves} moves and ${second} seconds with a score of ${score}. Well done!`);
    $('#winnerModal').modal('toggle');
}

// Button click event to allow player to restart the game
$restart.bind('click', function (confirmed) {
    if (confirmed) {
        $rating.removeClass('fa-star-o').addClass('fa-star');
        init();
    }
});

// Validates that card flipped is equal match.
// Flip cards back over if they aren't a match
let addCardListener = function () {

    // With the following, the card that is clicked on is flipped
    $deck.find('.card').bind('click', function () {
        let $this = $(this);

        if ($this.hasClass('show') || $this.hasClass('match')) { return true; }

        let card = $this.context.innerHTML;
        $this.addClass('open show');
        cardsOpen.push(card);

        // Comparing cards to see if they match
        if (cardsOpen.length > 1) {
            if (card === cardsOpen[0]) {
                $deck.find('.open').addClass('match');
                setTimeout(function () {
                    $deck.find('open').removeClass('open show');
                }, wait);
                match++;

                // If not matched, flip back over.
            } else {
                $deck.find('.open').addClass('notmatch');
                setTimeout(function () {
                    $deck.find('.open').removeClass('open show');
                }, wait / 1);
            }

            // Array - all added cards matched
            cardsOpen = [];

            // Increments number of moves by one
            moves++;

            // Pass number of moves through the rating function
            rating(moves);

            // Add number of moves to HTML alert modal
            $moves.html(moves);
        }

        // Finishing the game once all cards have been matched
        if (totalCard === match) {
            rating(moves);
            let score = rating(moves).score;
            setTimeout(function () {
                gameOver(moves, score);
            }, 500);
        }
    });
}

// Initiates the timer when game is loaded
function initTime() {
    nowTime = setInterval(function () {
        $timer.text(`${second}`)
        second = second + 1
    }, 1000);
}

// Resets the timer is game is over or restarted
function resetTimer(timer) {
    if (timer) {
        clearInterval(timer);
    }
}



init();
