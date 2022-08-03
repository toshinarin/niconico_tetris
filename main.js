const board = [];
for (let y = -1; y < 21; y++) {
    board[y] = [];
    for (let x = -1; x < 11; x++) {
        if (y === 20 || x < 0 || x >= 10) {
            board[y][x] = 1;
        } else {
            board[y][x] = 0;
        }
    }
}

const showBoard = () => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
    for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
            const v = board[y][x];
            let edgeColor, bgColor;
            if (v === 0) {
                edgeColor = "#888";
                bgColor = "#ccc";
            } else {
                edgeColor = `hsl(${((v - 1) / 7) * 360}deg, 100%, 50%)`;
                bgColor = `hsl(${((v - 1) / 7) * 360}deg, 100%, 70%)`;
            }
            const div = document.createElement("div");
            div.style.position = "absolute";
            div.style.left = `${x * 24}px`;
            div.style.top = `${y * 24}px`;
            div.style.width = `24px`;
            div.style.height = `24px`;
            div.style.boxSizing = `border-box`;
            div.style.border = `4px ridge ${edgeColor}`;
            div.style.backgroundColor = bgColor;
            document.body.appendChild(div);
        }
    }
};

const blockShapes = [
    [0, []],
    [2, [-1, 0], [1, 0], [2, 0]], // tetris
    [2, [-1, 0], [0, 1], [1, 1]], // key 1
    [2, [-1, 0], [0, -1], [1, -1]], // key 2
    [1, [0, 1], [1, 0], [1, 1]], // square
    [4, [-1, 0], [1, 0], [1, 1]], // L1
    [4, [-1, 0], [1, 0], [1, -1]], // L1
    [4, [-1, 0], [0, 1], [0, -1]] // T
];

const putBlock = (blockIndex, x, y, rotation, remove, action) => {
    const blockShape = [...blockShapes[blockIndex]];
    const rotateMax = blockShape.shift();
    blockShape.unshift([0, 0]);
    for (let [dy, dx] of blockShape) {
        for (let i = 0; i < rotation % rotateMax; i++) {
            [dx, dy] = [dy, -dx];
        }
        if (remove) {
            board[y + dy][x + dx] = 0;
        } else {
            if (board[y + dy][x + dx]) {
                return false;
            }
            if (action) {
                board[y + dy][x + dx] = blockIndex;
            }
        }
    }
    if (!action) {
        putBlock(blockIndex, x, y, rotation, remove, true);
    }
    return true;
};

let cx = 4,
    cy = 0,
    cr = 0,
    ci = 5,
    gameover = false;

const move = (dx, dy, dr) => {
    putBlock(ci, cx, cy, cr, true);
    if (putBlock(ci, cx + dx, cy + dy, cr + dr)) {
        cx += dx;
        cy += dy;
        cr += dr;
        showBoard();
        return true;
    } else {
        putBlock(ci, cx, cy, cr);
        return false;
    }
};

const createNewBlock = () => {
    clearLine();
    ci = Math.trunc(Math.random() * 7 + 1);
    cr = Math.trunc(Math.random() * 4);
    cx = 4;
    cy = 0;
    if (!putBlock(ci, cx, cy, cr)) {
        gameover = true;
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 10; x++) {
                if (board[y][x]) {
                    board[y][x] = 1;
                }
            }
        }
        showBoard();
    }
};

document.onkeydown = (e) => {
    if (gameover) return;
    switch (e.key) {
        case "ArrowLeft":
            move(-1, 0, 0);
            break;
        case "ArrowRight":
            move(1, 0, 0);
            break;
        case "ArrowUp":
            move(0, 0, 1);
            break;
        case "ArrowDown":
            if (!move(0, 1, 0)) {
                createNewBlock();
            }
            break;
        default:
            return;
    }
    e.preventDefault();
};

const clearLine = () => {
    for (let y = 0; y < 20; y++) {
        let removable = true;
        for (let x = 0; x < 10; x++) {
            if (board[y][x] === 0) {
                removable = false;
                break;
            }
        }
        if (removable) {
            for (let j = y; j >= -1; j--) {
                for (let x = 0; x < 10; x++) {
                    board[j][x] = j === -1 ? 0 : board[j - 1][x];
                }
                y--;
            }
        }
    }
};

window.onload = () => {
    createNewBlock();

    setInterval(() => {
        if (gameover) {
            return;
        }
        if (!move(0, 1, 0)) {
            createNewBlock();
        }
    }, 100);

    showBoard();
};
