var stop = false;
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

const arena = createMatrix(12, 20);
const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    color: '',
    score: 0,
};

const colors = [
    'red',
    'blue',
    'violet',
    'green',
    'purple',
    'orange',
    'pink'
];

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill({ value: 0, color: '' }));
    }
    return matrix;
}

function createPiece(type) {
    if (type === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
    } else if (type === 'O') {
        return [
            [2, 2],
            [2, 2],
        ];
    } else if (type === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    } else if (type === 'J') {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];
    } else if (type === 'I') {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    }
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell.value !== 0) {
                context.fillStyle = cell.color;
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function drawPlayerMatrix(matrix, offset, color) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = color;
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, { x: 0, y: 0 });
    drawPlayerMatrix(player.matrix, player.pos, player.color);
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = {
                    value: value,
                    color: player.color
                };
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    const piece = pieces[pieces.length * Math.random() | 0];
    player.matrix = createPiece(piece);
    player.color = colors[pieces.indexOf(piece)];
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        document.getElementById('stop').click();
        document.getElementById('modal_game_over').style.display = 'flex';
    }
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                    matrix[y][x],
                    matrix[x][y],
                ];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] &&
                    arena[y + o.y][x + o.x] &&
                    arena[y + o.y][x + o.x].value) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x].value === 0) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].map(_ => ({ value: 0, color: '' }));
        arena.unshift(row);
        ++y;
        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

function updateScore() {
    document.getElementById('score').innerText = player.score;
}

let dropCounter = 0;
let dropInterval = 360;

let lastTime = 0;
function update(time = 0) {
    if (stop) return;
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 81) {
        playerRotate(-1);
    } else if (event.keyCode === 87) {
        playerRotate(1);
    }
});

document.getElementById('restart').addEventListener('click', () => {
    document.getElementById('modal_game_over').style.display = 'none';
    arena.forEach(row => row.fill({ value: 0, color: '' }));
    player.score = 0;
    updateScore();
    document.getElementById('stop').click();
});

document.getElementById('left').addEventListener('click', () => playerMove(-1));
document.getElementById('right').addEventListener('click', () => playerMove(1));
document.getElementById('down').addEventListener('click', () => playerDrop());
document.getElementById('rotate').addEventListener('click', () => playerRotate(-1));
document.getElementById('stop').addEventListener('click', () => {
    if (!stop) {
        document.getElementById('stop').innerText = 'Play';
    } else {
        document.getElementById('stop').innerText = 'Stop';
    };
    stop = !stop;
    update();
});


document.getElementById("cuentaRegresiva").style.display = "none";
document.getElementById("start").addEventListener("click", () => {
    document.getElementById("start").style.display = "none";
    document.getElementById("cuentaRegresiva").style.display = "flex";
    setTimeout(() => {
        playerReset();
        updateScore();
        update();
    }, 3000)
    
    
    let tiempoRestante = 3;
    
    const intervalo = setInterval(() => {
        tiempoRestante--;
        document.getElementById("cuentaRegresiva").textContent = tiempoRestante;
    
        if (tiempoRestante === 0) {
            clearInterval(intervalo);
            document.getElementById("cuentaRegresiva").style.display = "none";
            document.getElementById("modal_start").style.display = "none";
        }
    }, 1000);
})

