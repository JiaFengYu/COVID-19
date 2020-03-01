let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
// let cotx = canvas.getContext("2d");
// let img_virus = document.getElementById('virus');
// let img_vaccine = document.getElementById('vaccine');
// console.log(typeof img_virus);

// let img_virus = new Image()
// img_virus.src = document.getElementById('virus');
// let img_vaccine = new Image()
// img_vaccine.src = document.getElementById('vaccine');
//empty array
let viruses = []
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
//Global variable for incrementation value
let dx = 3

//virus class
class Virus {
  constructor(x, y, radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.hp = 2;
  }
  move(dx = 50, dy = 0) {
    this.x += dx;
    this.y += dy;
  }
}
//shooter class
class Shooter {
  constructor(x,y,radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
}
// bullet class
class Bullet {
  constructor(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
//doctor
let doctor = new Shooter(640,540,20)

// fills [viruses] array with nine viruses
for (let j = 1; j < 4; j++) {
  for (let i = 1; i < 6; i++){
    let virus = new Virus(80+i*70, 80*j, 20);
    viruses.push(virus);
  }
}
//Create a bullet
// let projectile = new Bullet(doctor.x - 10, doctor.y - 60, 20, 40);

//This function will be used to draw each individual virus
function drawVirus(virus, color = "red") {
  ctx.beginPath();
  ctx.arc(virus.x, virus.y, virus.radius, 0, 2*Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawBullet(bullet, color = '#FFFFFF') {
  ctx.beginPath();
  ctx.rect(bullet.x, bullet.y, 10, 20);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}
// When projective == null, no projectile on board
let projectile = null;

//Draws all viruses.
function draw_all(iterable){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < iterable.length; i++) {
    drawVirus(iterable[i]);
    drawVirus(doctor, "green");
  }
  // if (spacePressed == true){
  if (projectile != null) {
    drawBullet(projectile)
  }


}
//Updates the viruses position
function update(iterable){
  for (let i = 0; i < iterable.length; i++) {
    iterable[i].x += dx
    if(rightPressed) {
        doctor.x += 1;
    if (doctor.x + doctor.radius > canvas.width){
        doctor.x = canvas.width - doctor.radius;
        }
    }
    else if(leftPressed) {
        doctor.x -= 1;
        if (doctor.x < doctor.radius){
          doctor.x = doctor.radius;
        }
    }
  }
  if (iterable.some(v => v.x >= canvas.width-v.radius)){
  // if (iterable.some(v => v.x >= canvas.width)) {
    dx = -dx;
  }  else if (iterable.some(v => v.x <= 0 + v.radius)) {
  // } else if (iterable.some(v =>)) {
    dx = -dx
  }
  if (projectile != null) {
    projectile.y -= 5;
    if (projectile.y < 0){
      projectile = null;
      console.log("gone");
    }
  }
  for (let virus of viruses){
    if (projectile != null){
      const hbox = 25;
      let {x: vx, y: vy} = virus;
      let {x: px, y: py} = projectile;
      // if (projectile.x == virus.x && projectile.y == virus.y || projectile.x+10 == virus.x && projectile.y+10 == virus.y){
      if (px >= vx-hbox && px <= vx+hbox && py >= vy-hbox && py <= vy+hbox) {
        virus.hp -= 1;
        projectile = null;
        console.log("landed");
      }
    }
    if (virus.hp == 0){
      // viruses.splice(viruses.indexOf(virus));
      virus.y = 720
      virus.radius = 0
    }
  }
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
// document.addEventListener("keyspace", keySpaceHandler, false);
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if (e.key == "Space" || e.key == " "){
      spacePressed = true;
      console.log("printed");
      if (projectile == null){
        projectile = new Bullet(doctor.x - 10, doctor.y - 60, 10, 40);
      }
      drawBullet(doctor.x, doctor.y, 20, 40);
      let new_bull = new Bullet(doctor.x,doctor.y,20,40);
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if (e.key == "Space" || e.key == " "){
      spacePressed = false;
    }
}
function draw_everything(){
  draw_all(viruses);
  update(viruses);
}
draw_everything();
setInterval(draw_everything, 10)
