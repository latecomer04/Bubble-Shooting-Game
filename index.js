//------------------- basic stuff -------------
//--------------------import music
const introSound = new Audio('introSong.mp3')
const gameOverSound = new Audio('music_gameOver.mp3')
const heavyWeaponSound = new Audio('music_heavyWeapon.mp3')
const hugeWeaponSound = new Audio('music_hugeWeapon.mp3')
const killEnemySound = new Audio('music_killEnemy.mp3')
const ShootingSound = new Audio("music_shoooting.mp3")



const canvas = document.createElement('canvas')
document.querySelector('.mygame').appendChild(canvas);
canvas.width=innerWidth;
canvas.height=innerHeight;
const context=canvas.getContext('2d')
const lightWeightWeapon =10;
const heavyWeightWeapon=18;
const hugeWeightWeapon=30;




const weapons=[];
const enemies=[];
const particles=[];
const hugeWeapons=[];
let playerScore=0;
const scorecard=document.querySelector('.scoreboard');
//console.log(scorecard.innerHTML);
//---------------------- player position obj ----------------------
playerPosition={
    x:canvas.width/2,
    y:canvas.height/2
};


introSound.play();
//----------------------------- taking reference of form and scoreboard.------------
let difficulty=2;
const form=document.querySelector('form');
const scoreboard= document.querySelector('.scoreboard');



// --------------------------- adding event listener for user difficulty level -------
document.querySelector('input').addEventListener('click',(e)=>{
    e.preventDefault();
    form.style.display="none";
    scoreboard.style.display="block";


    const userlevel=document.getElementById('difficulty').value;

    if(userlevel==='easy'){
        setInterval(spawnEnemy,2500);
        return difficulty=3;
    }

    if(userlevel==='medium'){
        setInterval(spawnEnemy,2000);
        return difficulty=5;
    }

    if(userlevel==='hard'){
        setInterval(spawnEnemy,1500);
        return difficulty=6;
    }

    if(userlevel==='insane'){
        setInterval(spawnEnemy,1000);
        return difficulty=8;
    }
})



//------------------creating player class------------.
class player{

    constructor(x,y,radius,color){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
    }

    draw(){
        context.beginPath();
        context.arc(
            this.x,
            this.y,
            this.radius,
            (Math.PI/180)*0,
            (Math.PI/180)*360,
            true
        );
        context.fillStyle=this.color;
        context.fill();
    };

    
    

}


//----------- weapon class------------------

class weapon{

    constructor(x,y,radius,color,velocity,damage){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
        this.damage=damage;
    }

    draw(){
        context.beginPath();
        context.arc(
            this.x,
            this.y,
            this.radius,
            (Math.PI/180)*0,
            (Math.PI/180)*360,
            true
        );
        context.fillStyle=this.color;
        context.fill();
    };

    update(){
        this.draw();
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
    }

    
}

//--------------------creating class of huge weapon------------
class hugeWeapon{

    constructor(x,y,color,damage){
        this.x=x;
        this.y=y;
        this.color=color;
        this.damage=damage;
    }

    draw(){
        context.beginPath();
        context.fillStyle=this.color;
        context.fillRect(this.x,this.y,50,canvas.height)
        context.fill();
    };

    update(){
        this.draw();
        this.x+=15;
    }

    
}

// -------------------- enemy class --------------------

class enemy{

    constructor(x,y,radius,color,velocity){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
    }

    draw(){
        context.beginPath();
        context.arc(
            this.x,
            this.y,
            this.radius,
            (Math.PI/180)*0,
            (Math.PI/180)*360,
            true
        );
        context.fillStyle=this.color;
        context.fill();
    };

    update(){
        this.draw();
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
        
    }

    
}

//-------------- creating particle class-----------------------

class particle{

    constructor(x,y,radius,color,velocity){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
        this.alpha=1;
        this.friction=0.99;
    }

    draw(){
        context.save();
        context.beginPath();
        context.globalAlpha=this.alpha;
        context.arc(
            this.x,
            this.y,
            this.radius,
            (Math.PI/180)*0,
            (Math.PI/180)*360,
            true
        );
        context.fillStyle=this.color;
        context.fill();
        context.restore()
    };

    update(){
        this.draw();
        this.velocity.x*=this.friction;
        this.velocity.y*=this.friction;
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
        this.alpha-=.005;
    }

    
}


//--------------------- game over screen----------------

const gameoverLoader = () => {
    // Creating endscreen div and play again button and high score element
    const gameOverBanner = document.createElement("div");
    const gameOverBtn = document.createElement("button");
    const highScore = document.createElement("div");
  
    
    highScore.innerHTML=`HighScore : ${
        localStorage.getItem("highScore")? localStorage.getItem('highScore'):playerScore
    }`
    const oldHighScore=localStorage.getItem('highScore');
    if(oldHighScore<playerScore){
        localStorage.setItem('highScore',playerScore);
        highScore.innerHTML=`HighScore : ${playerScore}`
    }
    // adding text to playagain button
    gameOverBtn.innerText = "Play Again";
  
    gameOverBanner.appendChild(highScore);
  
    gameOverBanner.appendChild(gameOverBtn);
  
    // Making reload on clicking playAgain button
    gameOverBtn.onclick = () => {
      window.location.reload();
    };
  
    gameOverBanner.classList.add("gameover");
  
    document.querySelector("body").appendChild(gameOverBanner);
  };
  

//-------------- creating a new player -------------------------
const nig=new player(
    playerPosition.x,
    playerPosition.y,
    15,
    //`rgb(${Math.random()*250},${Math.random()*250},${Math.random()*250})`
    "white"
    );
nig.draw();

//------------ creating (Spawning the new enimies)-----------

const spawnEnemy= () =>{

    // ------- generating random color of enemy-*-----------------
    const enemyColor=`hsl(${Math.floor(Math.random()*360 )},100%,50%)`;
    // ----------- generating random size of enemy --------------------
    const enemySize= Math.random()*(40-5)+5;

    //----------------- deciding from which side enemy will spawn either from outside of screen from left or right------------------
    let random;
    if(Math.random()<0.5){
        random={
            x:Math.random()<0.5? canvas.width+enemySize:0-enemySize,
            y:canvas.height*Math.random()
        };
    }
    else{
        //----------------- deciding from which side enemy will spawn either from outside of screen from top or bottom------------------
        random={
            x:canvas.width*Math.random(),
            y:Math.random()<0.5? canvas.height+enemySize:0-enemySize,
            
        }
    }

    //--------------- taking advantage of trigonometry.--------
    const angle = Math.atan2(canvas.height/2-random.y, canvas.width/2-random.x);
    //--------------- velocity obj---------------------
    const velocity={
        x:Math.cos(angle)*difficulty,
        y:Math.sin(angle)*difficulty
    }
    //------------ creating new enemy---------------------------
    const temp=new enemy(random.x,random.y,enemySize,enemyColor,velocity);
    
    // ------------- push new enemy in the enemies array-------------
    enemies.push(temp);
}


//--------------- adding an event listener for bullets. usnig left click ----------------------------
canvas.addEventListener('click',(e)=>{

    ShootingSound.play();
    //-----------finding angle between enemy and player----------
    const angle=Math.atan2(e.clientY-canvas.height/2,e.clientX-canvas.width/2);


    //velocity for bullets----------------
    const vel={
        x:Math.cos(angle)*7,
        y:Math.sin(angle)*7
    };

    //-------------- creating new weapon-----------------------
    const temp=new weapon(canvas.width/2,canvas.height/2,3,"white",vel,lightWeightWeapon);
    // ------------- push new weapon in the weapons array-------------
    weapons.push(temp);
});


//--------------------adding event listener for huge weapon---------
canvas.addEventListener('contextmenu',(e)=>{

    e.preventDefault();
    if(playerScore<2){
        return;
    }
    hugeWeaponSound.play();
    playerScore-=2;
    scorecard.innerHTML=`Score : ${playerScore}`
    //-----------finding angle between enemy and player----------
    const angle=Math.atan2(e.clientY-canvas.height/2,e.clientX-canvas.width/2);


    //velocity for bullets----------------
    const vel={
        x:Math.cos(angle)*3,
        y:Math.sin(angle)*3
    };

    //-------------- creating new weapon-----------------------
    const temp=new weapon(canvas.width/2,canvas.height/2,7,"yellow",vel,heavyWeightWeapon);
    // ------------- push new weapon in the weapons array-------------
    weapons.push(temp);
});

// ---------------------- adding event listener for mega weapon------
addEventListener("keypress",(e)=>{
    
    if(e.key==" "){
        if(playerScore<20){
            return;
        }
        heavyWeaponSound.play();
        playerScore-=20;
        scorecard.innerHTML=`Score : ${playerScore}`
        const temp=new  hugeWeapon(0,0,"blue",hugeWeightWeapon);
    // ------------- push new weapon in the weapons array-------------
    hugeWeapons.push(temp);
    }
})


//----------------- animation function ---------------------------------
let animationId;
function animation(){
    animationId=requestAnimationFrame(animation);
    // -------------- clearing canvas so that bullet fires seems bit more real---------------
    context.fillStyle="rgba(25,9,9,0.2)";
    context.fillRect(0,0,canvas.width,canvas.height);
    
    //------------- drawing player--------------
    nig.draw();
    

    //-----------------
    particles.forEach((particle,particleIndex)=>{
        if(particle.alpha<=0){
            particles.splice(particleIndex,1);
        }
        else{
            particle.update();
        }
        
        
    })
    
    // ------------------for each weapon , update its location , based on its velocity.--------
    weapons.forEach((weapon,weaponIndex)=>{
       
        weapon.update();
        //removing weapon if that is off screen
        if(
            weapon.radius+weapon.x<=0 ||
            weapon.radius-weapon.x>=canvas.width ||
            weapon.radius+weapon.y<=0 ||
            weapon.radius-weapon.y>=canvas.height
        ){
            weapons.splice(weaponIndex,1);
        }
        

    })


    //------------ huge weapons updation --------------------------

    hugeWeapons.forEach((weapon,weaponIndex)=>{
        if(weapon.x>canvas.width){
            hugeWeapons.splice(weaponIndex,1);
        }
        else{
            weapon.update();
        }
        
    })
    
    
    //----------------- for every enemy , update its location based on its velocity------------
    
    enemies.forEach((enemy,enemyIndex)=>{
        
         enemy.update();
  
        //distance between player and enemy
        const distanceBetweenPlayerAndEnemy=Math.hypot(
            nig.x-enemy.x,
            nig.y-enemy.y
        )
        //console.log(distanceBetweenPlayerAndEnemy);
        if(distanceBetweenPlayerAndEnemy-nig.radius-enemy.radius<=0){
            //stop game if the enemy touches player
            gameOverSound.play()
            killEnemySound.pause();
            hugeWeaponSound.pause();
            ShootingSound.pause();
            heavyWeaponSound.pause();
            cancelAnimationFrame(animationId);
            return gameoverLoader();
        }

        hugeWeapons.forEach((hugeWeapon)=>{
            const distanceBetweenEnemyAndHugeWeapon=enemy.x-hugeWeapon.x;
            if(distanceBetweenEnemyAndHugeWeapon<=100 && distanceBetweenEnemyAndHugeWeapon>=-100){
                playerScore+=10;
                scorecard.innerHTML=`Score : ${playerScore}`
                setTimeout(() => {
                    killEnemySound.play();
                    enemies.splice(enemyIndex);
                }, 0);
                
            }
        })
        weapons.forEach((weapon, weaponIndex)=>{
            //distance between enemy and weapon
            const distanceBetweenEnemyAndWeapon=Math.hypot(
                weapon.x-enemy.x,
                weapon.y-enemy.y
                );
            
            // console.log(enemy.radius);
            //console.log(distanceBetweenEnemyAndWeapon);
            if(distanceBetweenEnemyAndWeapon-weapon.radius-enemy.radius<1){
                
                

                if(enemy.radius>weapon.damage+3){
                    //using gsap 
                    //syntax => gsap.to(object_on which operation is going to happen,{
                    //    property: code
                    //})
                    //reducing size of enemy on hit.
                    gsap.to(enemy,{
                        radius: enemy.radius-weapon.damage
                    })
                    //removing enemy.
                    setTimeout(() => {
                        
                        weapons.splice(weaponIndex,1);
                    }, 0);
                    
                }
                else{
                    //removing both enemy and weapon
                    playerScore+=10;
                    scorecard.innerHTML=`Score : ${playerScore}`
                    for (let i = 0; i < enemy.radius*3; i++) {
                        particles.push(new particle(
                            weapon.x,weapon.y,Math.random()*2,enemy.color,
                            {x:(Math.random()-0.5)*(Math.random()*5),y:(Math.random()-0.5)*(Math.random()*5)}
                        ))
                        
                    }
                    setTimeout(() => {
                        killEnemySound.play();
                        enemies.splice(enemyIndex,1);
                        weapons.splice(weaponIndex,1);
                    }, 0);
                    
                }
            }
        });
    });
    //console.log(playerScore);
   
};

addEventListener('contextmenu',(e)=>{
    e.preventDefault();
})
addEventListener("resize",()=>{
    window.location.reload();
    introSound.play();
})
animation()




