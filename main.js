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
        if(best !== 0 ) this.add.text(6, 6, 'Best: ' + best , { fontFamily: "Avenir",fontSize: '32px', fill: '#000' });
        score = this.add.text(36, 36, 'Dominadas: ' + points , { fontFamily: "Avenir",fontSize: '32px', fill: '#000' });

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
            if(points > best) best = points
            points = 0
            this.scene.restart();
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

const login = document.getElementById('login')
const title = document.getElementById('title')
const name = document.getElementById('name')
document.getElementById('inicio').addEventListener('click', function(){
    login.style = "display: none"
    title.innerHTML = name.value
    start()
})

