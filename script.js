'use strict';
const preGame = {
    choseColor: false,
    player: null,
    hero: null,
    game: null,
    preGameOver: false,

    init(game) {
        this.game = game;
        this.render();
        this.renderCards();
        this.renderStatus();
        document.addEventListener('click', (event) => this.containerClickHandler(event));
    },

    render() {
        document.body.insertAdjacentHTML("beforeend", `<div class="topGamers">
                                                    <div class="player firstGamer"></div>
                                                    <div class="player secondGamer"></div>
                                                    <div class="player thirdGamer"></div>
                                                </div>
                                                <div class="gameField">
                                                </div>
                                                <div class="bottomGamers">
                                                    <div class="player fourthGamer"></div>
                                                    <div class="player fifthGamer"></div>
                                                    <div class="player sixthGamer"></div>
                                                </div>`);
    },

    renderCards() {
        for (let el of document.querySelectorAll('.player')) {
            el.insertAdjacentHTML("beforeend", `<div class="card">
                                                    <img class="myImg cookie" src="src/cookie.jpg" alt="cookie">
                                                </div>
                                                <div class="card">
                                                    <img class="myImg water" src="src/water.jpg" alt="water">
                                                </div>
                                                <div class="card">
                                                    <img class="myImg sr" src="src/sr.jpg" alt="sr">
                                                </div>
                                                <div class="card">
                                                    <img class="myImg thirtySeven" src="src/thirtySeven.jpg" alt="37">
                                                </div>
                                                <div class="card">
                                                    <img class="myImg cats" src="src/cats.jpg" alt="cats">
                                                </div>
                                                <div class="card">
                                                    <img class="myImg sin" src="src/sin.jpg" alt="sin">
                                                </div>
                                                <div class="card">
                                                    <img class="myImg field bannedCard" src="src/field.jpg" alt="field">
                                                </div>
                                                <div class="card">
                                                    <img class="myImg sword bannedCard" src="src/sword.jpg" alt="sword">
                                                </div>
                                                <div class="card">
                                                    <img class="myImg shield bannedCard" src="src/shield.jpg" alt="shield">
                                                </div>`);
        }
    },

    renderStatus() {
        const gameField = document.querySelector('.gameField');
        if (this.hero != null) {
            return this.clearStatus(gameField);
        } else {
            if (this.choseColor) {
                gameField.querySelector('.statusLine').remove();
                gameField.insertAdjacentHTML("beforeend", `<div class = "statusLine">Choose your hero!</div>`);
            } else {
                gameField.insertAdjacentHTML("beforeend", `<div class = "statusLine">Choose your color!</div>`);
            }
        }
        this.confirmButton(gameField);
    },

    confirmButton(block) {
        if (block.querySelector('.myBtn')) {
            return;
        }
        block.insertAdjacentHTML("beforeend", `<button class='myBtn'>Confirm</button>`);
    },

    containerClickHandler(event) {
        if (!this.preGameOver) {
            if (event.target.tagName != 'BUTTON' && !this.choseColor) {
                if (event.target.closest('.player')) {
                    this.choosePlayer(event.target.closest('.player'));
                }
            }
            if (event.target.tagName == 'BUTTON' && this.player != null) {
                this.choseColor = true;
                this.blockPlayer();
                this.renderStatus();
            }
            if (event.target.closest('.player') == this.player && this.choseColor && this.hero == null) {
                if (event.target.tagName == 'IMG') {
                    if (event.target.classList.contains('bannedCard')) {
                        return;
                    }
                    if (this.player.querySelectorAll('.wrong').length) {
                        this.player.querySelectorAll('.wrong')[0].classList.remove('wrong');
                    }
                    event.target.classList.add('wrong');
                }

            }
            if (event.target.tagName == 'BUTTON' && this.choseColor) {
                if (this.player.querySelectorAll('.wrong').length) {
                    this.blockHero(this.player.querySelectorAll('.wrong')[0]);
                    this.startGame();
                }
            }
        }
    },

    choosePlayer(player) {
        this.player = player;
        if (document.body.querySelectorAll('.chosePlayer').length) {
            document.body.querySelectorAll('.chosePlayer')[0].classList.remove('chosePlayer');
        }
        this.player.classList.add('chosePlayer');
    },

    blockHero(hero) {
        this.hero = hero;
        this.hero.classList.add('choseHero');
        this.hero.classList.remove('wrong');
    },

    blockPlayer() {
        this.player.classList.add('blockPlayer');
        this.choseColor = true;
    },


    startGame() {
        const activatePlayer = Array.from(document.querySelectorAll('.player'));
        for (let el of activatePlayer) {
            el.classList.add('playerUnselected');
        }
        const unbannedItems = Array.from(document.querySelectorAll('.bannedCard'));
        for (let el of unbannedItems) {
            el.classList.remove('bannedCard');
        }
        this.hero.classList.add('bannedCard');
        this.renderStatus();
        this.preGameOver = true;
        this.game.preGame(true);
    },

    clearStatus(block) {
        block.querySelector('.statusLine').remove();
        block.querySelector('.myBtn').remove();
    }
}

const game = {
    isGame: false,
    gameField: null,
    turn: 0,
    heroes: [
        {
            hero: 'cookie',
            player: null
        },
        {
            hero: 'water',
            player: null
        },
        {
            hero: 'sr',
            player: null
        },
        {
            hero: 'thirtySeven',
            player: null
        },
        {
            hero: 'cats',
            player: null
        },
        {
            hero: 'sin',
            player: null
        },
    ]
    ,


    init() {
        this.gameField = document.querySelector('.gameField');
        document.addEventListener('click', (event) => this.containerClickHandler(event));
        this.render();
    },

    render() {
        this.gameField.insertAdjacentHTML("beforeend", `<button class='myBtn'>Start</button>`);
    },
    containerClickHandler(event) {
        if (event.target.tagName == 'BUTTON') {
            const btn = document.querySelector('.myBtn');
            this.startGame(btn);
        }

        if (this.isGame == true) {
            if (event.target.tagName !== 'IMG' || event.target.classList.contains('bannedCard')) {
                return;
            };
            if (this.turn < 7) {
                this.choseImage(event.target);
            };
        }
    },

    preGame(bool) {
        if (bool == true) {
            this.guessHero(preGame.hero);
            this.init();
        }
    },
    startGame(button) {
        if (!this.isGame) {
            this.isGame = true;
            this.nextTurnBtn(button);
        }
        this.currentTurn(button);
    },

    nextTurnBtn(button) {
        button.remove();
        this.gameField.insertAdjacentHTML("beforeend", `<button class='myBtn'>Next turn</button>`);
        const newButton = document.querySelector('.myBtn');
        this.disableBtn(newButton);
    },

    currentTurn(button) {
        const playersTurnStatus = document.querySelector('.statusLine');
        if (playersTurnStatus) {
            playersTurnStatus.remove();
        };
        if (this.turn < 6) {
            this.gameField.insertAdjacentHTML("afterbegin", `<div class='statusLine'>Current turn: ${this.turn += 1}</div>`);
            this.disableBtn(button);
            this.borderAppear();
        } else {
            this.turn += 1;
            this.gameField.insertAdjacentHTML("afterbegin", `<div class='statusLine'>Turns over! Make your decision!</div>`);
            this.newGameButton(button);
        };
        this.lockCards();
        this.tryGuess();

    },

    newGameButton(button) {
        button.remove();
        this.gameField.insertAdjacentHTML("beforeend", `<a href="#" onclick="location.reload()">
                                                            <button class='myBtn gameOverButton'>New Game</button>
                                                        </a>`);
    },


    choseImage(clickImg) {
        const btn = document.querySelector('.myBtn');
        const currentPlayer = clickImg.closest('.player');
        this.checkClickImg(currentPlayer);
        clickImg.classList.add('wrong');
        this.borderDisappear(currentPlayer);
        this.btnIsActive(btn);
    },

    checkClickImg(player) {
        const playerCards = player.getElementsByClassName('wrong');
        if (playerCards.length) {
            playerCards[0].classList.remove('wrong');
            return;
        }
        return;
    },

    lockCards() {
        const justChose = document.getElementsByClassName(('wrong'));
        if (justChose.length) {
            for (let el of justChose) {
                el.classList.add('bannedCard');
            };
        };
    },

    borderDisappear(player) {
        if (!player.classList.contains('turnComplete')) {
            player.classList.add('turnComplete');
        };
    },

    borderAppear() {
        const wthTag = Array.from(document.getElementsByClassName('turnComplete'));
        for (let el of wthTag) {
            el.classList.remove('turnComplete');
        };
    },

    btnIsActive(button) {
        if (this.checkCompleteTurn()) {
            this.activateBtn(button);
        }
    },

    activateBtn(button) {
        button.disabled = false;
    },

    disableBtn(button) {
        button.setAttribute('disabled', true);

    },

    checkCompleteTurn() {
        if (document.querySelectorAll('.turnComplete').length == 6) {
            return true;
        }
        return false;
    },

    tryGuess() {
        this.tryGuessCookie();
        this.tryGuessWater();
        this.tryGuessSr();
        this.tryGuessThirtySeven();
        this.tryGuessCats();
        this.tryGuessSin();
        this.checkClasses();
    },

    tryGuessCookie() {
        if (this.heroes[0].player == null) {
            const cookies = Array.from(document.body.getElementsByClassName('cookie'));
            const canBeCookie = [];
            for (let el of cookies) {
                if (!el.classList.contains('bannedCard') && !el.classList.contains('dontChose')) {
                    canBeCookie.push(el);
                }
            }
            if (canBeCookie.length == 1) {
                canBeCookie[0].classList.add('thatHero');
                this.guessHero(canBeCookie[0]);
            } else if (canBeCookie.length <= 2) {
                for (let el of canBeCookie) {
                    el.classList.add('canBeIt');
                }
            }
        }
    },

    tryGuessWater() {
        if (this.heroes[1].player == null) {
            const water = Array.from(document.body.getElementsByClassName('water'));
            const canBeWater = [];
            for (let el of water) {
                if (!el.classList.contains('bannedCard') && !el.classList.contains('dontChose')) {
                    canBeWater.push(el);
                }
            }
            if (canBeWater.length == 1) {
                canBeWater[0].classList.add('thatHero');
                this.guessHero(canBeWater[0]);
            } else if (canBeWater.length <= 2) {
                for (let el of canBeWater) {
                    el.classList.add('canBeIt');
                }
            }
        }
    },

    tryGuessSr() {
        if (this.heroes[2].player == null) {
            const sres = Array.from(document.body.getElementsByClassName('sr'));
            const canBeSr = [];
            for (let el of sres) {
                if (!el.classList.contains('bannedCard') && !el.classList.contains('dontChose')) {
                    canBeSr.push(el);
                }
            }
            if (canBeSr.length == 1) {
                canBeSr[0].classList.add('thatHero');
                this.guessHero(canBeSr[0]);
            } else if (canBeSr.length <= 2) {
                for (let el of canBeSr) {
                    el.classList.add('canBeIt');
                }
            }
        }
    },

    tryGuessThirtySeven() {
        if (this.heroes[3].player == null) {
            const thirtySevens = Array.from(document.body.getElementsByClassName('thirtySeven'));
            const canBeThirtySevens = [];
            for (let el of thirtySevens) {
                if (!el.classList.contains('bannedCard') && !el.classList.contains('dontChose')) {
                    canBeThirtySevens.push(el);
                }
            }
            if (canBeThirtySevens.length == 1) {
                canBeThirtySevens[0].classList.add('thatHero');
                this.guessHero(canBeThirtySevens[0]);
            } else if (canBeThirtySevens.length <= 2) {
                for (let el of canBeThirtySevens) {
                    el.classList.add('canBeIt');
                }
            }
        }
    },

    tryGuessCats() {
        if (this.heroes[4].player == null) {
            const cats = Array.from(document.body.getElementsByClassName('cats'));
            const canBeCats = [];
            for (let el of cats) {
                if (!el.classList.contains('bannedCard') && !el.classList.contains('dontChose')) {
                    canBeCats.push(el);
                }
            }
            if (canBeCats.length == 1) {
                canBeCats[0].classList.add('thatHero');
                this.guessHero(canBeCats[0]);
            } else if (canBeCats.length <= 2) {
                for (let el of canBeCats) {
                    el.classList.add('canBeIt');
                }
            }
        }
    },

    tryGuessSin() {
        if (this.heroes[5].player == null) {
            const sin = Array.from(document.body.getElementsByClassName('sin'));
            const canBeSin = [];
            for (let el of sin) {
                if (!el.classList.contains('bannedCard') && !el.classList.contains('dontChose')) {
                    canBeSin.push(el);
                }
            }
            if (canBeSin.length == 1) {
                canBeSin[0].classList.add('thatHero');
                this.guessHero(canBeSin[0]);
            } else if (canBeSin.length <= 2) {
                for (let el of canBeSin) {
                    el.classList.add('canBeIt');
                }
            }
        }
    },

    guessHero(hero) {
        for (let el of this.heroes) {
            if (hero.classList[1] == el.hero) {
                el.player = hero.closest('.player').classList[1];
                break;
            }
        }
        console.log(this.heroes);
    },

    checkClasses() {
        const players = Array.from(document.getElementsByClassName('player'));
        for (let el of players) {
            const thisPlayer = el.getElementsByClassName('thatHero');
            if (thisPlayer.length) {
                const canBeHero = el.getElementsByClassName('canBeIt');
                if (canBeHero.length) {
                    for (let elem of Array.from(canBeHero)) {
                        elem.classList.remove('canBeIt');
                        elem.classList.add('dontChose');
                    }
                }
            }
        }
        this.tryGuess();
    }
};
preGame.init(game);
