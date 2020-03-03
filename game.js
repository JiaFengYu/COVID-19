let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let cotx = canvas.getContext("2d");
let img_virus = document.getElementById("virus");
let img_vaccine = document.getElementById("vaccine");
let img_doctor = document.getElementById("doctor");
let wallpaper = document.getElementById("wallpaper");
let virus_dmg = document.getElementById("virus_dmg");
cotx.drawImage(wallpaper,0,0);

let viruses = []
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
//Global variable for incrementation value
let dx = 3

//generic class
class Entity {
  constructor(x, y, radius = 35){
    this.x = x;
    this.y = y;
    this.hp = 2;
    this.radius = radius;
  }
  move(dx = 3, dy = 0) {
    this.x += dx;
    this.y += dy;
  }
}

//doctor
let doctor = new Entity(640,540,50)

// fills [viruses] array with nine viruses
for (let j = 1; j < 4; j++) {
  for (let i = 1; i < 6; i++){
    let virus = new Entity(80+i*70, 80*j);
    viruses.push(virus);
    console.log(virus.x,virus.y);
  }
}
//Create a bullet
// let projectile = new Bullet(doctor.x - 10, doctor.y - 60, 20, 40);

//This function will be used to draw each individual virus
function drawVirus(virus) {
  if (virus.hp == 1) {
    cotx.drawImage(virus_dmg,virus.x,virus.y);
  }
  // ctx.arc(virus.x, virus.y, virus.radius, 0, 2*Math.PI, false);
  else{
    cotx.drawImage(img_virus,virus.x,virus.y);
  }
}

function drawDoctors(virus) {
  // ctx.arc(virus.x, virus.y, virus.radius, 0, 2*Math.PI, false);
  cotx.drawImage(img_doctor,virus.x,virus.y);
}

function drawBullet(bullet) {
  // ctx.rect(bullet.x, bullet.y, 10, 20);
  cotx.drawImage(img_vaccine,bullet.x,bullet.y);
}
// When projective == null, no projectile on board
let projectile = null;

//Draws all viruses.
function draw_all(iterable){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cotx.drawImage(wallpaper,0,0);
  for (let i = 0; i < iterable.length; i++) {
    drawVirus(iterable[i]);
    drawDoctors(doctor);
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
    if (doctor.x + 2*doctor.radius >= canvas.width){
        doctor.x = canvas.width - 2*doctor.radius;
        }
    }
    else if(leftPressed) {
        doctor.x -= 1;
        if (doctor.x <doctor.radius){
          doctor.x = 0;
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
        projectile = new Entity(doctor.x - 10, doctor.y - 60);
      }
      drawBullet(doctor.x, doctor.y);
      let new_bull = new Entity(doctor.x,doctor.y);
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
