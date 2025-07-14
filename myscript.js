const gameBoard = (function () {
    const spaces = [
        new Array(3).fill(null),
        new Array(3).fill(null),
        new Array(3).fill(null)
    ];

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

    return {viewSpaces, fillSpace, spaces}
})();