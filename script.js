const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.1,
  1000
);

camera.position.z = 7;

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

document.getElementById("scene").appendChild(renderer.domElement);


// ================= ELEMENTS =================

const elements = [
"H","He",
"Li","Be","B","C","N","O","F","Ne",
"Na","Mg","Al","Si","P","S","Cl","Ar",
"K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr",
"Rb","Sr","Y","Zr","Nb","Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe",
"Cs","Ba","La","Ce","Pr","Nd","Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu",
"Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb","Bi","Po","At","Rn",
"Fr","Ra","Ac","Th","Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm","Md","No","Lr",
"Rf","Db","Sg","Bh","Hs","Mt","Ds","Rg","Cn","Nh","Fl","Mc","Lv","Ts","Og"
];


// ================= PERIODIC TABLE POSITIONS =================

const positions = {

H:[1,1], He:[18,1],

Li:[1,2], Be:[2,2],
B:[13,2], C:[14,2], N:[15,2], O:[16,2], F:[17,2], Ne:[18,2],

Na:[1,3], Mg:[2,3],
Al:[13,3], Si:[14,3], P:[15,3], S:[16,3], Cl:[17,3], Ar:[18,3],

K:[1,4], Ca:[2,4], Sc:[3,4], Ti:[4,4], V:[5,4],
Cr:[6,4], Mn:[7,4], Fe:[8,4], Co:[9,4], Ni:[10,4],
Cu:[11,4], Zn:[12,4], Ga:[13,4], Ge:[14,4], As:[15,4],
Se:[16,4], Br:[17,4], Kr:[18,4],

Rb:[1,5], Sr:[2,5], Y:[3,5], Zr:[4,5], Nb:[5,5],
Mo:[6,5], Tc:[7,5], Ru:[8,5], Rh:[9,5], Pd:[10,5],
Ag:[11,5], Cd:[12,5], In:[13,5], Sn:[14,5], Sb:[15,5],
Te:[16,5], I:[17,5], Xe:[18,5],

Cs:[1,6], Ba:[2,6], La:[3,6], Hf:[4,6], Ta:[5,6],
W:[6,6], Re:[7,6], Os:[8,6], Ir:[9,6], Pt:[10,6],
Au:[11,6], Hg:[12,6], Tl:[13,6], Pb:[14,6], Bi:[15,6],
Po:[16,6], At:[17,6], Rn:[18,6],

Fr:[1,7], Ra:[2,7], Ac:[3,7], Rf:[4,7], Db:[5,7],
Sg:[6,7], Bh:[7,7], Hs:[8,7], Mt:[9,7], Ds:[10,7],
Rg:[11,7], Cn:[12,7], Nh:[13,7], Fl:[14,7], Mc:[15,7],
Lv:[16,7], Ts:[17,7], Og:[18,7]
};


// ================= CREATE ELEMENT =================

const globe = new THREE.Group();

scene.add(globe);

const cards = [];

function createCard(symbol) {

  const canvas = document.createElement("canvas");

  canvas.width = 128;
  canvas.height = 128;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#00272a";
  ctx.fillRect(5,5,118,118);

  ctx.strokeStyle = "#00ffff";
  ctx.lineWidth = 3;
  ctx.strokeRect(5,5,118,118);

  ctx.fillStyle = "#8fffff";
  ctx.font = "bold 42px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.shadowColor = "#00ffff";
  ctx.shadowBlur = 12;

  ctx.fillText(symbol,64,64);

  const texture = new THREE.CanvasTexture(canvas);

  const material = new THREE.MeshBasicMaterial({
    map:texture,
    transparent:true,
    side:THREE.DoubleSide
  });

  const geometry = new THREE.PlaneGeometry(.38,.38);

  return new THREE.Mesh(geometry,material);
}


// ================= CREATE ALL ELEMENTS =================

elements.forEach((symbol,i)=>{

  const card = createCard(symbol);

  card.userData.symbol = symbol;

  globe.add(card);

  cards.push(card);

});


// ================= SPHERE POSITION =================

function spherePosition(i) {

  const radius = 2.4;

  const phi =
    Math.acos(-1 + (2 * i) / elements.length);

  const theta =
    Math.sqrt(elements.length * Math.PI) * phi;

  return new THREE.Vector3(
    radius * Math.cos(theta) * Math.sin(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(phi)
  );
}


// ================= TABLE POSITION =================

function tablePosition(symbol) {

  const p = positions[symbol];

  if (!p) return new THREE.Vector3();

  const x = (p[0] - 9.5) * .43;
  const y = (4 - p[1]) * .43;

  return new THREE.Vector3(x,y,0);
}


// ================= SQUARE POSITION =================

function squarePosition(i) {

  const columns = 12;

  const x =
    (i % columns - 5.5) * .52;

  const y =
    (Math.floor(i / columns) - 4.5) * .52;

  return new THREE.Vector3(x,y,0);
}


// ================= CHANGE MODE =================

let currentMode = "sphere";

function setMode(mode) {

  currentMode = mode;

  cards.forEach((card,i)=>{

    let target;

    if(mode === "sphere")
      target = spherePosition(i);

    if(mode === "table")
      target = tablePosition(card.userData.symbol);

    if(mode === "square")
      target = squarePosition(i);

    card.userData.target = target;

  });

}


// Start sphere

setMode("sphere");


// ================= MOUSE MOVEMENT =================

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove",e=>{

  mouseX =
    (e.clientX / innerWidth - .5) * 2;

  mouseY =
    (e.clientY / innerHeight - .5) * 2;

});


// ================= DRAG ROTATION =================

let dragging = false;
let oldX = 0;
let oldY = 0;

renderer.domElement.addEventListener(
  "mousedown",
  e=>{

    dragging = true;

    oldX = e.clientX;
    oldY = e.clientY;

  }
);

document.addEventListener(
  "mouseup",
  ()=>{

    dragging = false;

  }
);

document.addEventListener(
  "mousemove",
  e=>{

    if(!dragging) return;

    globe.rotation.y +=
      (e.clientX-oldX)*.006;

    globe.rotation.x +=
      (e.clientY-oldY)*.006;

    oldX = e.clientX;
    oldY = e.clientY;

  }
);


// ================= ZOOM =================

document.addEventListener(
  "wheel",
  e=>{

    camera.position.z +=
      e.deltaY * .002;

    camera.position.z =
      Math.max(
        4,
        Math.min(12,camera.position.z)
      );

  }
);


// ================= RESET =================

function resetView(){

  camera.position.z = 7;

  globe.rotation.x = 0;
  globe.rotation.y = 0;

  setMode("sphere");

}


// ================= ANIMATION =================

function animate(){

  requestAnimationFrame(animate);

  cards.forEach(card=>{

    if(!card.userData.target) return;

    card.position.lerp(
      card.userData.target,
      .08
    );

    // Face the camera
    if(currentMode !== "sphere"){
      card.rotation.x = 0;
      card.rotation.y = 0;
      card.rotation.z = 0;
    }
    else {

      card.lookAt(
        card.position.clone().multiplyScalar(2)
      );

    }

  });


  // Cursor-controlled movement

  if(!dragging){

    globe.rotation.y +=
      (mouseX * .25 - globe.rotation.y) * .01;

    globe.rotation.x +=
      (mouseY * .15 - globe.rotation.x) * .01;

  }


  // Slow sphere rotation

  if(currentMode === "sphere" && !dragging){

    globe.rotation.y += .002;

  }


  renderer.render(
    scene,
    camera
  );

}

animate();


// ================= RESIZE =================

window.addEventListener(
  "resize",
  ()=>{

    camera.aspect =
      innerWidth / innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      innerWidth,
      innerHeight
    );

  }
);