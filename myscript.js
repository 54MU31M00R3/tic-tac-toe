const gameBoard = (function () {
    let spaces = [
        new Array(3).fill(null),
        new Array(3).fill(null),
        new Array(3).fill(null)
    ];

    function refreshSpaces() {
        spaces = [
            new Array(3).fill(null),
            new Array(3).fill(null),
            new Array(3).fill(null)
        ];
    }

    function viewSpaces () {
        for (let i = 0; i < spaces.length; i++) {
            row = "";
            for (let j = 0; j < spaces[i].length; j++){
                if ( j === spaces[i].length - 1) {
                    if (spaces[i][j] === null){
                        row = row + " ";
                    } else {
                        row = row + spaces[i][j];
                    };
                } else {
                    if (spaces[i][j] === null){
                        row = row + " " + "|";
                    } else {
                        row = row + spaces[i][j] + "|";
                    };
                };
            };
            console.log(row);
            if ( i !== spaces.length - 1){
                console.log("_ _ _");
            }
        };
    };

    function fillSpace(position, playerSymbol){
        let x, y;
        stringCoordinates = position.split(" ");

        switch (stringCoordinates[0]) {
            case "left":
                x = 0;
                break;
            case "middle":
                x = 1;
                break;
            case "right":
                x = 2;
                break;
        };

        switch (stringCoordinates[1]) {
            case "top":
                y = 0;
                break;
            case "middle":
                y = 1;
                break;
            case "bottom":
                y = 2;
                break;
        };

        if (spaces[y][x] === null){
            spaces[y][x] = playerSymbol;
            return { x, y, isValid: true};
        } else {
            console.log("that position is taken.");
            return { x, y, isValid: false};
        };
        
    };

    return {viewSpaces, fillSpace, spaces, refreshSpaces}
})();

const match = (function () {
    let player1, player2;
    let turn = 0;
    let activePlayer;
    const header = document.querySelector("h1")
 
 
    function setPlayers(players){
        if (players.length > 2){
            throw Error("too many players.");
        }
 
 
        player1 = players[0];
        player2 = players[1];
        player1.symbol = "./gameboard-assets/alpha-x.svg";
        player2.symbol = "./gameboard-assets/alpha-o.svg";
 
 
        activePlayer = player1;
    };
 
 
    function swapActivePlayer(){
        if (player1 === activePlayer) {
            activePlayer = player2;
        } else {
            activePlayer = player1;
        };
    };
 
 
    function beginMatch(){
 
        gameBoard.refreshSpaces();
        turn = 0;

        const symbolSpaces = document.querySelectorAll(".symbol")
        symbolSpaces.forEach((space) => {
            space.remove();
        })

        const spaces = document.querySelectorAll(".space");
        spaces.forEach((space) => {
            space.addEventListener("click", processTurn, { once: true})
        });

        header.textContent = `It's ${activePlayer.name}'s turn`;
    };
 
    function processTurn() {
        const validMove = activePlayer.takeTurn(this.textContent);
                
        if (validMove) {
            const symbolSpace = document.createElement("img")
            symbolSpace.src = activePlayer.symbol;
            symbolSpace.className = "symbol";
            this.appendChild(symbolSpace);
            turn++;
            const gameFinished = checkWinner();
            
            if (!gameFinished){
                swapActivePlayer();
                header.textContent = `It's ${activePlayer.name}'s turn`;

            };
        }
    }
 
    function checkWinner() {
 
 
        for (const value in activePlayer.xSpacesHeld) {
            if (activePlayer.xSpacesHeld[value] === 3) {
                return endGame("win");
            };
        }
 
 
        for (const value in activePlayer.ySpacesHeld) {
            if (activePlayer.ySpacesHeld[value] === 3) {
                return endGame("win");;
            };
        }
 
 
        if ((gameBoard.spaces[1][1] === activePlayer.symbol) &&
        (gameBoard.spaces[0][0] === activePlayer.symbol ||  gameBoard.spaces[0][2] === activePlayer.symbol) &&
        (gameBoard.spaces[2][0] === activePlayer.symbol || gameBoard.spaces[2][2] === activePlayer.symbol)){
            return endGame("win");
        }
 
 
        if (turn === 9) {
            return endGame("draw");
        }

        return false;
    };
 
 
    function endGame (outcome) {
        
        const spaces = document.querySelectorAll(".space");
        spaces.forEach((space) => {
            space.removeEventListener("click", processTurn, { once: true})
        })

        if (outcome === "win"){
            header.textContent = `Congratulations! ${activePlayer.name} has won the game.`;

        } else if (outcome === "draw") {
            header.textContent = "DRAW";
        }

        return true;
    };
    return {setPlayers, beginMatch}
})();

function createPlayer (name) {
    const xSpacesHeld = {};
    const ySpacesHeld = {};
    const spacesHeld = [];
    let symbol;
 
 
    function takeTurn (desiredSpace) {
        
        const {x, y, isValid} = gameBoard.fillSpace(desiredSpace, this.symbol)

        if (isValid){
            console.log("this free space has now been taken.")

            if (xSpacesHeld[`${x}`] !== undefined){
                xSpacesHeld[`${x}`] += 1
            } else {
                xSpacesHeld[`${x}`] = 1
            }

            if (ySpacesHeld[`${y}`] !== undefined){
                ySpacesHeld[`${y}`] += 1
            } else {
                ySpacesHeld[`${y}`] = 1
            }

            spacesHeld.push([x,y]);
        } else {
            console.log("this space is not available")
        }

        return isValid;
    }
    return {name, symbol, takeTurn, xSpacesHeld, ySpacesHeld, spacesHeld}
};
 
const startButton = document.querySelector(".start-button")

startButton.addEventListener("click", () => {
    const players = [];
    const player1 = document.querySelector("#p-name-1");
    const player2 = document.querySelector("#p-name-2");

    players.push(createPlayer(player1.value), createPlayer(player2.value));
    match.setPlayers(players);

    match.beginMatch();

    startButton.innerHTML = "Restart";
})