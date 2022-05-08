//chama as classes do HTML para o JS
const suaNave = document.getElementById('player-chip')
const restartButton = document.querySelector('.restart-button')
const startButton = document.querySelector('.start-button')
//chama os IDs do HTML para o JS
const playArea = document.querySelector('#main-play-area')
const instrucaoText = document.querySelector('#apresentacao')
const gameOverText = document.querySelector('#restart')
const score = document.querySelector('#pontuacao')
const vida = document.querySelector('#vida')

//Criação de arrays com as imagens dos inimigos
const aliensImg = [
  'img/monster-1.png',
  'img/monster-2.png',
  'img/monster-3.png'
]
//Sons do jogo
var musica = document.getElementById('somBack')
var somExplosao = document.getElementById('somExplosao')
var somLaser = document.getElementById('somLaser')
var somGameOver = document.getElementById('somGameover')
var somLife = document.getElementById('somLife')
//Música em loop
musica.addEventListener(
  'ended',
  function () {
    musica.currentTime = 0
    musica.play()
  },
  false
)
//Função para vida da nave
var vidasPerd = 3
function vidas() {
  switch (vidasPerd) {
    case 3:
      if (vidasPerd === 3) {
        vida.style.background = 'url(./img/3-heart.png) no-repeat'
        vida.style.backgroundSize = '100%'
        vida.style.width = '25%'
        vida.style.height = '25%'
        vidasPerd--
      }
      break
    case 2:
      if (vidasPerd === 2) {
        vida.style.background = 'url(./img/2-heart.png) no-repeat'
        vida.style.backgroundSize = '100%'
        vida.style.width = '25%'
        vida.style.height = '25%'
        somLife.play()
      }
      break
    case 1:
      if (vidasPerd === 1) {
        vida.style.background = 'url(./img/1-heart.png) no-repeat'
        vida.style.backgroundSize = '50%'
        vida.style.width = '25%'
        vida.style.height = '25%'
        somLife.play()
      }
      break
    case 0:
      if (vidasPerd === 0) {
        somLife.play()
        vida.style.background = 'none'
        gameOver()
      }
      break
  }
}

//Função de pontuar
function scorePoint() {
  score.innerHTML = `PONTOS: ${ponto}`
  ponto++
}
//Funções para mover SuaNave
function flyShip(event) {
  do {
    switch ((flyShip = event.keyCode)) {
      case 37: //Esquerda
        moveLeft()
        break
      case 39: //Direita
        moveRight()
        break
      case 32: // Espaço para atirar
        somLaser.play()
        fireLaser()
        break
    }
    if (flyShip == false) {
      //Se flyShip for false ele bloqueia a movimentação
      return
    }
  } while (flyShip == true)
}

function moveLeft() {
  let varX = getComputedStyle(suaNave).getPropertyValue('left')
  if (varX === '0px') {
    //Verifica se nave toca na borda esquerda da main-area
    return
  } else {
    let X = parseInt(varX)
    X -= 50
    suaNave.style.left = `${X}px` //Responsavel por fazer a nave se mover para a esquerda
  }
}

function moveRight() {
  let varX = getComputedStyle(suaNave).getPropertyValue('left')
  if (varX >= '750px') {
    //Verifica se nave toca na borda direita da main-area
    return
  } else {
    let X = parseInt(varX)
    X += 50
    suaNave.style.left = `${X}px` //Responsavel por fazer a nave se mover para a direita
  }
}

//Funcionalidade de Tiro
function fireLaser() {
  let laser = createLaserElement('div')
  playArea.appendChild(laser)
  moveLaser(laser)
}

function createLaserElement() {
  let xPosition = parseInt(
    window.getComputedStyle(suaNave).getPropertyValue('left') // Pega a posição X atual da nave para efetuar o tiro em linha reta
  )
  let yPosition = parseInt(
    window.getComputedStyle(suaNave).getPropertyValue('top') // Pega o tamanho da area para o laser percorrer
  )
  let newLaser = document.createElement('img')
  newLaser.src = 'img/shoot.png'
  newLaser.classList.add('laser') //cria uma classe div chamada laser
  newLaser.style.left = `${xPosition}px` //Ponto central de saida do tiro da nave
  newLaser.style.top = `${yPosition}px` //Ponto final do tiro
  return newLaser
}

function moveLaser(laser) {
  let laseInterval = setInterval(() => {
    let xPosition = parseInt(laser.style.top)
    let aliens = document.querySelectorAll('.alien')
    aliens.forEach(alien => {
      //Comparando se o alien foi atigindo pelo tiro
      if (checkLaserCollision(laser, alien)) {
        somExplosao.play()
        alien.classList.add('dead-alien')
        alien.src = 'img/explosao.gif'
        alien.classList.remove('alien')
      }
    })
    if (xPosition <= 20) {
      //Verifica se laser chegou no top final
      laser.remove() //Apaga o tiro quando chega no top final
    } else {
      laser.style.top = `${xPosition - 3}px` //movimentar laser para cima
    }
  }, 10)
}
//Função para criar inimigos aleatorios
function createAliens() {
  let newAlien = document.createElement('img')
  //Sorteio de Inimigos
  let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]

  newAlien.src = alienSprite
  newAlien.classList.add('alien')
  newAlien.classList.add('alien-transition')
  newAlien.style.top = '30px' //ponto de partida do inimigo criado do topo
  newAlien.style.left = `${Math.floor(Math.random() * 700) + 10}px` //Area de criação aleatorios dos inimigos
  playArea.appendChild(newAlien) //Criar os inimgos dentro da area pelo newAlien.style.left
  moveAlien(newAlien)
}

//Função para movimentar aliens
function moveAlien(alien) {
  let moveAlienInterval = setInterval(() => {
    let xPosition = parseInt(
      window.getComputedStyle(alien).getPropertyValue('top')
    )
    if (xPosition > 640) {
      //Ponto final para dar Game Over
      if (Array.from(alien.classList).includes('dead-alien')) {
        alien.remove()
      } else {
        somExplosao.play()
        alien.classList.add('dead-alien')
        alien.src = 'img/explosao.gif'
        vidas()
        vidasPerd--
        alien.classList.remove('alien')

        if (vidasPerd === -1) {
          ponto == 0
          gameOver()
        }
      }
    } else {
      alien.style.top = `${xPosition + 4}px`
    }
  }, 30)
}
//Função para colisões
function checkLaserCollision(laser, alien) {
  let laserTop = laser.getBoundingClientRect().top
  let laserLeft = laser.getBoundingClientRect().left
  let laserBottom = laser.getBoundingClientRect().bottom

  let alienTop = alien.getBoundingClientRect().top
  let alienLeft = alien.getBoundingClientRect().left
  let alienBottom = alien.getBoundingClientRect().bottom
  //O método Element.getBoundingClientRect() retorna o tamanho de um elemento e sua posição relativa ao viewport.

  if (laserLeft != 700 && laserLeft + 20 >= alienLeft) {
    if (laserTop <= alienBottom || alienBottom >= laserTop) {
      scorePoint()
      somExplosao.play()
      laser.remove()
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}
//Pre Incio do jogo
suaNave.style.top = '750px' //posiciona a nave na area baixa do main-area
suaNave.style.left = '350px' //posiciona a nave no centro da main-area
let alienInterval //O tempo de intervalo para criação de aliens em zero
score.style.display = 'none' //Esconde o pontução do jogador
suaNave.style.display = 'none' //ja começa com a nave escondida
gameOverText.style.display = 'none' //Esconde a tela do game over
let tempo = 1200 //Tempo de criação dos aliens

//Função de reiniciar o jogo
function restart() {
  gameOverText.style.display = 'none'
  suaNave.style.left = '250px' //reposiciona a nave no ponto origem
  instrucaoText.style.display = 'flex' //mostra o painel de começar o jogo
  somGameOver.pause() //Pausa o som do game over
  startButton.addEventListener('click', event => {
    //Quando o botão start for pressionado ela chama a função playGame() para dar inicio ao jogo
    playGame()
  })
}
function playGame() {
  clearInterval(alienInterval)
  ponto = 0
  scorePoint(ponto)
  musica.play()
  vidasPerd = 3
  score.style.display = 'block'
  suaNave.style.display = 'block' //Faz aparecer a nave depois do start
  gameOverText.style.display = 'none'
  instrucaoText.style.display = 'none' //Esconde o painel de apresentação do jogo
  vidas()
  alienInterval = setInterval(() => {
    createAliens()
  }, tempo) //Quando houver start começa a criação de aliens aleatorios com delays de 2s
  window.document.addEventListener('keydown', flyShip) //Libera a Função de movimentar SuaNave
  flyShip = true //Libera a Função de movimentar SuaNave
}
///Função Game Over
function gameOver() {
  musica.pause() //Pausa a musica principal
  somGameOver.play() //Toca o som game over
  score.innerHTML = `HIGH SCORE: ${ponto}` //Mostra o HighScore do jogador
  clearInterval(alienInterval) //Faz parar a função de criação de movimentos e dos aliens
  let aliens = document.querySelectorAll('.alien')
  aliens.forEach(alien => alien.remove()) //Apaga todos os aliens presente na tela quando houver gamer over
  let lasers = document.querySelectorAll('.laser')
  lasers.forEach(laser => laser.remove()) //Faz parar a função do laser
  suaNave.style.display = 'none' //apaga a nave quando perder
  gameOverText.style.display = 'flex' //Mostra a tela game over
  flyShip = false //Faz para a movitação da nave quando houver gameOver
}
