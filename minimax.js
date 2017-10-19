const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
const humanPlayer = "O"
const computerPlayer = "X"
var origboard

document.querySelector('button').addEventListener('click', startGame)
var cells = document.querySelectorAll('.cell')
startGame()

function startGame(){
    document.querySelector('.endgame').style.display = "none"
    origboard = Array.from(Array(9).keys())
    for(let i = 0; i < 9; i++){
        cells[i].innerText = ""
        cells[i].style.removeProperty('background-color')
        cells[i].addEventListener('click', turnClick)
    }
}

function turnClick(event){
    let position = event.target.id
    if(typeof origboard[position] === "number"){
        turnSquare(position, humanPlayer)
    }
    if(!checkWin(origboard,humanPlayer)){
        if(!checkTie()){
            turnSquare(computerStep(),computerPlayer)
        }
   }
}

function turnSquare(positionId, player){
    document.getElementById(positionId).innerText = player
    origboard[positionId] = player
    let winner = checkWin(origboard, player)
    if(winner){
        gameover(winner)
    } 
}

function checkWin(newBoard, player){
    let check = newBoard.reduce((a,elem,index) => elem === player ? a.concat(index) : a,[])
    let winData = null
    //
    for(let [index,win] of winCombos.entries()){
        if(win.every(elem => check.indexOf(elem) > -1)) {
            winData = {
                index,
                player
            }
            break
        }
    }
    return winData
}

function gameover(winner){
    for(let value of winCombos[winner.index]){
        cells[value].style.backgroundColor = winner.player == humanPlayer ? "blue" : "red"
    }

    showWinner(winner.player == humanPlayer ? "You Win!" : "Computer Wins!")
}

function showWinner(winner){
    document.querySelector('.endgame').style.display = "block"
    document.querySelector(".endgame .text").innerText = winner
}

function emptyPos(){
   return origboard.filter(elem => typeof elem == "number")
}

function checkTie(){
    if(emptyPos().length === 0){
        for( var i = 0; i < 9; i++){
            cells[i].removeEventListener('click',turnClick,false)
            cells[i].style.backgroundColor = "green"
        }
        showWinner("Tie Game!")
        return true
    }
    return false
}
function computerStep(){
    // let empty = emptyPos()
    // let emptyLength = empty.length
    // let coin = Math.floor(Math.random() * 10)
    // if(coin < emptyLength){
    //     return empty[coin]
    // }
    // return empty[0]
    return minimax(origboard,computerPlayer).index
}

function minimax(newBoard, player){
    var availPos = emptyPos()

    if(checkWin(newBoard, humanPlayer)){
        return {score: -10}
    } else if(checkWin(newBoard, computerPlayer)){
        return {score: 10}
    } else if(availPos.length === 0){
        return {score: 0}
    }

    var moves = []

    for(var i = 0; i< availPos.length; i++){
        var move = {}
        move.index = newBoard[availPos[i]]
        newBoard[availPos[i]] = player
        if(player == computerPlayer){
            var result = minimax(newBoard,humanPlayer)
            move.score = result.score
        } else {
            var result = minimax(newBoard,computerPlayer)
            move.score = result.score
        }
        
        //reset board
        newBoard[availPos[i]] = move.index

        moves.push(move)
    }

    var bestmove

    if(player === computerPlayer) {
        var bestScore = -Infinity
        for(var i = 0; i < moves.length; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score
                bestMove = i
            }
        }
    } else {
        var bestScore = Infinity
        for(var i = 0; i < moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score
                bestMove = i
            }
        }
    }

    return moves[bestMove]
}