module.exports =function solveSudoku(matrixFirst) {
    let standardSet = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    let matrix = JSON.parse(JSON.stringify(matrixFirst));


    function fillSetRow(i) {
        let setRow = [];
        for (let j = 0; j < 9; j++) {
            if (matrix[i][j] === 0) {
                continue;
            }
            setRow[setRow.length] = matrix[i][j];
        }

        return setRow;
    }

    function fillSetCol(j) {
        let setCol = [];
        for (let i = 0; i < 9; i++) {
            if (matrix[i][j] === 0) {
                continue;
            }
            setCol[setCol.length] = matrix[i][j];
        }


        return setCol;
    }

    function fillSection(i, j) {
        let setSection = [];
        j = Math.floor(j / 3) * 3;
        i = Math.floor(i / 3) * 3;
        for (let l = 0; l < 3; l++) {
            for (let m = 0; m < 3; m++) {
                if (matrix[i + l][j + m][0]) {

                }
                setSection[setSection.length] = matrix[i + l][j + m];
            }
        }

        return setSection;
    }

    function fillStateMatrix() {

        let stateMatrix = [];
        for (let i = 0; i < 9; i++) {
            stateMatrix[i] = [];
            for (let j = 0; j < 9; j++) {
                if (matrix[i][j] === 0) {
                    let set1 = new Set(standardSet),
                        set2 = new Set(fillSetRow(i)),
                        set3 = new Set(fillSetCol(j)),
                        set4 = new Set(fillSection(i, j));


                    let difference1 = set1.difference(set2);
                    let difference2 = difference1.difference(set3);
                    let difference3 = difference2.difference(set4);
                    stateMatrix[i][j] = [...difference3];
                    continue;

                }
                stateMatrix[i][j] = matrix[i][j];
            }

        }


        return stateMatrix;
    }


    Set.prototype.difference = function (setB) {
        let difference = new Set(this);
        for (let elem of setB) {
            difference.delete(elem);
        }
        return difference
    };





    function findOnes() {
        let matrixState = fillStateMatrix();
        let solvedSells = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if ((typeof matrixState[i][j] === 'object') && (matrixState[i][j].length === 1)) {

                    let solvedCoord = [];
                    solvedCoord.push(i);
                    solvedCoord.push(j);
                    solvedCoord.push(matrixState[i][j][0]);
                    solvedSells.push(solvedCoord);

                } else if (matrixState[i][j].length > 1) {
                      for (let y = 0; y < matrixState[i][j].length; y++) {

                        let counterH = 0;
                        let counterV = 0;
                        let counterS = 0;
                        for (let z = 0; z < 9; z++) {
                            if (typeof matrixState[i][z] !== 'object') {

                            } else if (Array.from(matrixState[i][z]).indexOf(matrixState[i][j][y]) !== -1) {
                                counterH++;
                            }
                            if (typeof matrixState[z][j] !== 'object') {

                            } else if (Array.from(matrixState[z][j]).indexOf(matrixState[i][j][y]) !== -1) {

                                counterV++;

                            }

                        }

                        let it = Math.floor(i / 3) * 3;
                        let jt = Math.floor(j / 3) * 3;
                        for (let l = 0; l < 3; l++) {
                            for (let m = 0; m < 3; m++) {
                                if (typeof matrixState[it + l][jt + m] !== 'object') continue;
                                if (Array.from(matrixState[it + l][jt + m]).indexOf(matrixState[i][j][y]) !== -1) {

                                    counterS++;

                                }
                            }
                        }
                        if (counterV === 1 || counterH === 1 || counterS === 1) {
                            let solvedCoord = [];
                            solvedCoord.push(i);
                            solvedCoord.push(j);
                            solvedCoord.push(matrixState[i][j][y]);
                            solvedSells.push(solvedCoord);
                            counterH = 0;
                            counterV = 0;
                            counterS = 0;
                        } else {
                            counterH = 0;
                            counterV = 0;
                            counterS = 0;
                        }
                    }
                }
            }
        }

        return solvedSells;

    }

    function solveSudokeIterable() {
        let solveSellsOne = findOnes();
        //console.log('solveSellsOne  ' + solveSellsOne);
        if (solveSellsOne.length !== 0) {
            for (let k = 0; k < solveSellsOne.length; k++) {
                let i = solveSellsOne[k][0];
                let j = solveSellsOne[k][1];
                let l = solveSellsOne[k][2];

                matrix[i].splice(j, 1, l);

            }

            return solveSudokeIterable();
        } else {
            if (isSolvedSudoku()) {

                return matrix;
            } else {



                return bulldozer();
            }
        }
    }

    function bulldozer() {
        let matrixWork = JSON.parse(JSON.stringify(matrix));

        function checkSell(num, row, col) {
            for (let i = 0; i < 9; i++) {
                let b_index = ((Math.floor(row / 3) * 3) + Math.floor(i / 3)) * 9 + (Math.floor(col / 3) * 3) + (i % 3);
                if (num === matrixWork[(row * 9) + i] ||
                    num === matrixWork[col + (i * 9)] ||
                    num === matrixWork[b_index]) {
                    return false;
                }
            }
            return true;
        }


        function checkAndSetSell(index) {
            if (index >= matrixWork.length) {
                return true;
            } else if (matrixWork[index] !== 0) {
                return checkAndSetSell(index + 1);
            }

            for (let i = 1; i <= 9; i++) {
                if (checkSell(i, Math.floor(index / 9), index % 9)) {
                    matrixWork[index] = i;
                    if (checkAndSetSell(index + 1)) {
                        return true;
                    }
                }
            }

            matrixWork[index] = 0;
            return false;
        }

        function formatSquare(arr) {
            let result = [];
            for (let i = 0; i < arr.length; i += 9) {
                result.push(arr.slice(i, i + 9));
            }
            console.log(result);
            return result;
        }

     let   mainStart = function (puzzle) {
            matrixWork = puzzle.reduce(function (a, b) {
                return a.concat(b);
            });

            return !checkAndSetSell(0) ? matrixWork : formatSquare(matrixWork);
        };
        return mainStart(matrix);
    }



    function isSolvedSudoku() {
        let sudoku = JSON.parse(JSON.stringify(matrix));
        for (let i = 0; i < 9; i++) {
            let [r, c] = [Math.floor(i / 3) * 3, (i % 3) * 3];
            if (
                (sudoku[i].reduce((s, v) => s.add(v), new Set()).size !== 9) ||
                (sudoku.reduce((s, v) => s.add(v[i]), new Set()).size !== 9) ||
                (sudoku.slice(r, r + 3).reduce((s, v) => v.slice(c, c + 3).reduce((s, v) => s.add(v), s), new Set()).size !== 9)
            ) return false;
        }
        return matrixFirst.every((row, rowIndex) => {
            return row.every((num, colIndex) => {
                return num === 0 || sudoku[rowIndex][colIndex] === num;
            });
        });
    }

    return solveSudokeIterable();
}


