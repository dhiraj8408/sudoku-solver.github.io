var board = [];
var reason = 0;
function isValidEntry(input) {
    return (1 <= input && input <= 9);
}

function getRow(val) {
    var row = val / 9;
    var rounded = Math.floor(row);
    if (rounded === row) {
        row = rounded - 1;
    }
    else {
        row = rounded;
    }
    return rounded;
}

function getCol(val) {
    var col = val % 9;
    if (col !== 0) {
        col = col - 1;
    }
    else {
        col = 8;
    }
}

function clearColors() {
    for (var i = 1; i <= 81; i++) {
        $("#" + i).removeClass("hovered");
    }
}

function getBoard() {
    board = [];
    var row = [];
    for (var i = 1; i <= 81; i++) {
        var text = $("#" + i).text();
        if (text === "") {
            row.push(".");
        } else {
            row.push(text);
        }
        if (i % 9 === 0) {
            board.push(row);
            row = [];
        }
    }
}

function isValid(board, row, col, val) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] == val) {
            return false;
        }
    }
    for (let i = 0; i < 9; i++) {
        if (board[i][col] == val) {
            return false;
        }
    }
    const subgridRowStart = Math.floor(row / 3) * 3;
    const subgridColStart = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[subgridRowStart + i][subgridColStart + j] == val) {
                return false;
            }
        }
    }
    return true;
}

function validsubmatrix(board, lr, hr, lc, hc) {
    var freq = new Array(9).fill(0);
    for (var i = lr; i <= hr; i++) {
        for (var j = lc; j <= hc; j++) {
            if (board[i][j] != '.') {
                var num = board[i][j] - '1';
                freq[num]++;
                if (freq[num] > 1) {
                    return i * 9 + j + 1;
                }
            }
        }
    }
    return -1;
}

function isValidBoard(board) {
    for (var i = 0; i < 9; i++) {
        var freq = new Array(9).fill(0);
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != '.') {
                var num = board[i][j] - '1';
                freq[num]++;
                if (freq[num] > 1) {
                    return i * 9 + j + 1;
                }
            }
        }
    }
    reason++;
    for (var i = 0; i < 9; i++) {
        var freq = new Array(9).fill(0);
        for (var j = 0; j < 9; j++) {
            if (board[j][i] != '.') {
                var num = board[j][i] - '1';
                freq[num]++;
                if (freq[num] > 1) {
                    return j * 9 + i + 1;
                }
            }
        }
    }
    reason++;
    for (var lr = 0; lr < 9; lr += 3) {
        for (var lc = 0; lc < 9; lc += 3) {
            var id = validsubmatrix(board, lr, lr + 2, lc, lc + 2);
            if (id != -1) {
                return id;
            }
        }
    }
    return -1;
}

function solveBoard(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] == '.') {
                for (let val = 1; val <= 9; val++) {
                    if (isValid(board, i, j, String(val))) {
                        board[i][j] = String(val);
                        if (solveBoard(board)) {
                            return true;
                        } else {
                            board[i][j] = '.';
                        }
                    }
                }
                return false;
            }
        }
    }
    return true;
}
function isBoardEmpty(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != ".") {
                return false;
            }
        }
    }
    return true;
}
$(document).ready(function () {
    $("#sudoku-board").on("keyup", function (event) {
        clearColors();
        var targetElement = event.target;
        var text = targetElement.innerText;
        var idOfElement = targetElement.getAttribute("id");
        if (isValidEntry(text)) {
            $("#" + idOfElement).addClass("value-entered");
        }
        else {
            $("#" + idOfElement).removeClass("value-entered").addClass("out-of-range");
            $("#" + idOfElement).text(" ");
            setTimeout(function () {
                $("#" + idOfElement).removeClass("out-of-range");
            }, 200);
        }
    });

    $("#sudoku-board").on("mouseover", function (event) {
        clearColors();
        var idOfHoveredElement = event.target.getAttribute("id");
        $("#" + idOfHoveredElement).addClass("hovered");
    });

    $("#solvebutton").click(function () {
        clearColors();
        getBoard();
        var isEmpty = isBoardEmpty(board);
        var id = isValidBoard(board);
        if (isEmpty) {
            alert("Empty board");
        }
        else {
            if (id !== -1) {
                $("#" + id).addClass("invalid-cell");
                alertInvalidBoard(id);
            }
            else {
                var solved = solveBoard(board);
                console.log(board);
                if (solved) {
                    for (let i = 0; i < 9; i++) {
                        for (let j = 0; j < 9; j++) {
                            var cellId = i * 9 + j + 1;
                            $("#" + cellId).text(board[i][j]).addClass("solved-cell");
                        }
                    }
                }
            }
        }
    });

    $("#clearbutton").click(function () {
        for (var i = 1; i <= 81; i++) {
            $("#" + i).text("").removeClass("value-entered").removeClass("invalid-cell").removeClass("solved-cell").removeClass("error");
        }
        board = [];
        reason = 0;
    });

    function alertInvalidBoard(id) {
        $("body").addClass("invalid-board");
        setTimeout(function () {
            $("body").removeClass("invalid-board");
        }, 100);
    }
});
