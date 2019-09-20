// Author: Hoang Tran (https://www.facebook.com/profile.php?id=100004848287494)
// Github verson (1 file .html): https://github.com/HoangTran0410/3DCarousel/blob/master/index.html


// You can change global variables here:
var radius = 240; // how big of the radius
var autoRotate = true; // auto rotate or not
var rotateSpeed = -60; // unit: seconds/360 degrees
var imgWidth = 120; // width of images (unit: px)
var imgHeight = 170; // height of images (unit: px)

// Link of background music - set 'null' if you dont want to play background music
var bgMusicURL = 'https://api.soundcloud.com/tracks/143041228/stream?client_id=587aa2d384f7333a886010d5f52f302a';
var bgMusicControls = true; // Show UI music control

/*
     NOTE:
       + imgWidth, imgHeight will work for video
       + if imgWidth, imgHeight too small, play/pause button in <video> will be hidden
       + Music link are taken from: https://hoangtran0410.github.io/Visualyze-design-your-own-/?theme=HauMaster&playlist=1&song=1&background=28
       + Custom from code in tiktok video  https://www.facebook.com/J2TEAM.ManhTuan/videos/1353367338135935/
*/


// ===================== start =======================
// animation start after 1000 milis
setTimeout(init, 1000);

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid]; // combine 2 arrays

// Size of images
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

// Size of ground - depend on radius
var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

function applyTranform(obj) {
  // Constrain the angle of camera (between 0 and 180)
  if(tY > 180) tY = 180;
  if(tY < 0) tY = 0;

  // Apply the angle
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = (yes?'running':'paused');
}

var sX, sY, nX, nY, desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;

// auto spin
if (autoRotate) {
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

// add background music
if (bgMusicURL) {
  document.getElementById('music-container').innerHTML += `
<audio src="${bgMusicURL}" ${bgMusicControls? 'controls': ''} autoplay loop>    
<p>If you are reading this, it is because your browser does not support the audio element.</p>
</audio>
`;
}

// setup events
document.onpointerdown = function (e) {
  clearInterval(odrag.timer);
  e = e || window.event;
  var sX = e.clientX,
      sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    var nX = e.clientX,
        nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function (e) {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

document.onmousewheel = function(e) {
  e = e || window.event;
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};
var heart = [];
var links = ['https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678087-heart-512.png',
           'https://images.vexels.com/media/users/3/144097/isolated/preview/3dedcd235214cdde6b4e171fdbf66c9d-heart-icon-by-vexels.png',
            'https://png.icons8.com/cotton/2x/novel.png'];

var images = [];

function preload(){
  for(var i = 0; i < links.length; i++){
    images[i] = loadImage(links[i]);
  }
}

function setup(){
  createCanvas(windowWidth, windowHeight).position(0, 0);
  
  for(var i = 0; i < 15; i++){
    var sizeHeart = random(30, 70);
    heart[i] = new Thing(random(width), random(height), sizeHeart, sizeHeart, floor(random(links.length)));
  }
}

function draw(){
  clear();
  for(var h of heart){
    showThing(h);
    updateThing(h);
  }
}

function mouseDragged() {
}

function Thing(x, y, w, h, imgIndex){
  this.img = imgIndex;
  this.pos = createVector(x, y);
  this.size = createVector(w, h);
  this.vel = createVector(0, 0);
}

function updateThing(t){
  t.pos.add(t.vel);

  if(mouseIsPressed){
    noFill();
    stroke(30);
    ellipse(mouseX, mouseY, width / 10, width / 10);

    var d = p5.Vector.dist(createVector(mouseX, mouseY), t.pos);
    if(d < width / 20 + t.size.x){
      t.pos = createVector(mouseX, mouseY);
    } else {
      t.vel.add(random(-.5, .5), random(-.1, 0));
    }
  } else {
      t.vel.add(random(-.5, .5), random(-.1, 0));
  }
  
  if(t.pos.y < 0){
    t.pos.y = height + t.size.y;
    t.pos.x = width / 2;
    t.vel = createVector(0, 0);
  } 
  if(t.pos.x > width || t.pos.x < 0){
    t.vel.x *= -0.5;
    t.vel.y *= -0.1
    if(t.pos.x > width) t.pos.x = width;
    else t.pos.x = 0;
  } 
}

function showThing(t){
  if(images[t.img]){
    push();
    translate(t.pos.x, t.pos.y);
    image(images[t.img], -t.size.x / 2, -t.size.y / 2, t.size.x, t.size.y); 
    pop();
  }
}

function windowResized(){ 
  resizeCanvas(windowWidth, windowHeight, true);
}