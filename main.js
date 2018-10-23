//variables
let game
let ball
let points = 0
let score
let best = 0
//assets

//class
class playGame extends Phaser.Scene{

    constructor(){
        super("PlayGame")
        this.isMoving = false
    }

    preload(){
        this.load.image('bg', 'assets/bg.png')
        this.load.image('ball', 'assets/ball.png')
    }
    create(){
        //creas el fondo
        const bg = this.add.image(0,0, 'bg')
        bg.setOrigin(0,0)
        //creas el balon
        //le das cuerpo
        ball = this.physics.add.sprite(config.width/2,config.height/2, 'ball')
        ball.setSize(1,1)
        ball.setInteractive();
        //score
        //if(best !== 0 ) this.add.text(6, 6, 'Best: ' + best , { fontFamily: "Avenir",fontSize: '32px', fill: '#000' });
        score = this.add.text(36, 36, 'Dominadas: ' + points , { fontFamily: "Avenir",fontSize: '32px', fill: '#000' });

        getScore(this)

        ball.on('pointerdown', (pointer) =>{
            console.log("clicastes")
            ball.body.setVelocityY(-1200)
            if(!this.isMoving) ball.body.setGravityY(3000)
            this.isMoving = true
            points++
            score.setText("Dominadas: " + points)

        });

        

    }
    update(){
       


        // if(cursor.space.isDown) {
        //     console.log("Pushing")
        //     ball.body.setVelocityY(-800)
        // }
        if(ball.y > config.height + 100) {
            //ball.y = -240
            this.isMoving = false
            if(points > best) {
                best = points
                //salvamos el score
                FBInstant
                    .getLeaderboardAsync('Dominadas board.' + FBInstant.context.getID())
                    .then(leaderboard => {
                        console.log(leaderboard.getName());
                        return leaderboard.setScoreAsync(best, '{player: "BlisS"}');
                    })
                    .then(() => {
                        console.log('Score saved')
                        postBoard()
                        //to let the score update
                        this.scene.restart();
                    })
                    .catch(error => console.error(error));

            }
            points = 0
            
        }
        
    }
}
//config
const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 480,
    scene:[playGame],
    physics:{
        default: 'arcade',
        arcade: {
            gravity: {y:0}
        }
    }
}

//game instance
function start(){
    game = new Phaser.Game(config)
}

function resize(){
     const w = window.innerWidth;
     const h = window.innerHeight;
     const wr = w/h
     const r = config.width / config.height
     console.log(r)
     console.log(wr)
     const canvas = document.querySelector('canvas')
     if(wr < r){
        canvas.style.width = w + "px"
        canvas.style.height = (h / r) + "px"
     }else{
         canvas.style.width = (h / r ) + "px"
         canvas.style.height = h + "px"
     }
     
}

// const login = document.getElementById('login')
// const title = document.getElementById('title')
// const name = document.getElementById('name')
// document.getElementById('inicio').addEventListener('click', function(){
//     login.style = "display: none"
//     title.innerHTML = name.value
//     start()
// })

FBInstant.initializeAsync()
  .then(function() {  
        start()      
    FBInstant.startGameAsync()
    .then(function() {
        resize()
    })
  });

// window.onload = function(){
//     start()
//     resize()
// }

function postBoard(){
    FBInstant.updateAsync({
        action: 'LEADERBOARD',
        name: 'Dominadas board.' + FBInstant.context.getID()
      })
        .then(() => console.log('Update Posted'))
        .catch(error => console.error(error));
}

function getScore(self){
    FBInstant
    .getLeaderboardAsync('Dominadas board.' + FBInstant.context.getID())
    .then(leaderboard => leaderboard.getEntriesAsync(10, 0))
    .then(entries => {
      for (var i = 0; i < entries.length; i++) {
          const rank =  entries[i].getRank() 
          const name = entries[i].getPlayer().getName()
          const score = entries[i].getScore()
        self.add.text(6, 6, `${rank}. ${name} : ${score} ` , { fontFamily: "Avenir",fontSize: '32px', fill: '#000' });
        console.log(
          entries[i].getRank() + '. ' +
          entries[i].getPlayer().getName() + ': ' +
          entries[i].getScore()
        );
      }
    }).catch(error => console.error(error));
}
