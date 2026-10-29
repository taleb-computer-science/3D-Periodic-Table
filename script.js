
const raw = `
H|Hydrogen
He|Helium
Li|Lithium
Be|Beryllium
B|Boron
C|Carbon
N|Nitrogen
O|Oxygen
F|Fluorine
Ne|Neon
Na|Sodium
Mg|Magnesium
Al|Aluminium
Si|Silicon
P|Phosphorus
S|Sulfur
Cl|Chlorine
Ar|Argon
K|Potassium
Ca|Calcium
Sc|Scandium
Ti|Titanium
V|Vanadium
Cr|Chromium
Mn|Manganese
Fe|Iron
Co|Cobalt
Ni|Nickel
Cu|Copper
Zn|Zinc
Ga|Gallium
Ge|Germanium
As|Arsenic
Se|Selenium
Br|Bromine
Kr|Krypton
Rb|Rubidium
Sr|Strontium
Y|Yttrium
Zr|Zirconium
Nb|Niobium
Mo|Molybdenum
Tc|Technetium
Ru|Ruthenium
Rh|Rhodium
Pd|Palladium
Ag|Silver
Cd|Cadmium
In|Indium
Sn|Tin
Sb|Antimony
Te|Tellurium
I|Iodine
Xe|Xenon
Cs|Caesium
Ba|Barium
La|Lanthanum
Ce|Cerium
Pr|Praseodymium
Nd|Neodymium
Pm|Promethium
Sm|Samarium
Eu|Europium
Gd|Gadolinium
Tb|Terbium
Dy|Dysprosium
Ho|Holmium
Er|Erbium
Tm|Thulium
Yb|Ytterbium
Lu|Lutetium
Hf|Hafnium
Ta|Tantalum
W|Tungsten
Re|Rhenium
Os|Osmium
Ir|Iridium
Pt|Platinum
Au|Gold
Hg|Mercury
Tl|Thallium
Pb|Lead
Bi|Bismuth
Po|Polonium
At|Astatine
Rn|Radon
Fr|Francium
Ra|Radium
Ac|Actinium
Th|Thorium
Pa|Protactinium
U|Uranium
Np|Neptunium
Pu|Plutonium
Am|Americium
Cm|Curium
Bk|Berkelium
Cf|Californium
Es|Einsteinium
Fm|Fermium
Md|Mendelevium
No|Nobelium
Lr|Lawrencium
Rf|Rutherfordium
Db|Dubnium
Sg|Seaborgium
Bh|Bohrium
Hs|Hassium
Mt|Meitnerium
Ds|Darmstadtium
Rg|Roentgenium
Cn|Copernicium
Nh|Nihonium
Fl|Flerovium
Mc|Moscovium
Lv|Livermorium
Ts|Tennessine
Og|Oganesson
`.trim().split("\n").map(line => {
  const [symbol, name] = line.split("|");
  return { symbol, name };
});

const positions = {};

const rows = [
  ["H","","","","","","","","","","","","","","","","","He"],
  ["Li","Be","","","","","","","","","","","B","C","N","O","F","Ne"],
  ["Na","Mg","","","","","","","","","","","Al","Si","P","S","Cl","Ar"],
  ["K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr"],
  ["Rb","Sr","Y","Zr","Nb","Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe"],
  ["Cs","Ba","La","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb","Bi","Po","At","Rn"],
  ["Fr","Ra","Ac","Rf","Db","Sg","Bh","Hs","Mt","Ds","Rg","Cn","Nh","Fl","Mc","Lv","Ts","Og"]
];

// Main table positions
rows.forEach((row, r) => {
  row.forEach((symbol, c) => {
    if (symbol) {
      positions[symbol] = [r + 1, c + 1];
    }
  });
});

// Lanthanides
"Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu"
  .split(" ")
  .forEach((symbol, i) => {
    positions[symbol] = [9, i + 4];
  });

// Actinides
"Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr"
  .split(" ")
  .forEach((symbol, i) => {
    positions[symbol] = [10, i + 4];
  });

// Element category colors
function category(n) {
  if ([3,11,19,37,55,87].includes(n)) return "alkali";
  if ([4,12,20,38,56,88].includes(n)) return "alkaline";
  if ([2,10,18,36,54,86,118].includes(n)) return "noble";
  if ([9,17,35,53,85,117].includes(n)) return "halogen";

  if ([5,14,32,33,51,52].includes(n)) return "metalloid";

  if ([1,6,7,8,15,16,34].includes(n)) return "nonmetal";

  if ([13,31,49,50,81,82,83,84,113,114,115,116].includes(n))
    return "post";

  if (n >= 57 && n <= 71) return "lanthanide";
  if (n >= 89 && n <= 103) return "actinide";

  return "transition";
}

const table = document.getElementById("table");
const details = document.getElementById("details");
const search = document.getElementById("search");
const wrapper = document.getElementById("wrapper");

// Create element cubes
raw.forEach((el, i) => {
  const atomicNumber = i + 1;
  const pos = positions[el.symbol];

  if (!pos) return;

  const tile = document.createElement("button");

  tile.className = "element " + category(atomicNumber);
  tile.style.gridRow = pos[0];
  tile.style.gridColumn = pos[1];

  tile.dataset.search =
    `${el.name} ${el.symbol} ${atomicNumber}`.toLowerCase();

  tile.innerHTML = `
    <span class="num">${atomicNumber}</span>
    <span class="sym">${el.symbol}</span>
  `;

  tile.addEventListener("click", () => {
    details.innerHTML = `
      <strong>${el.name} (${el.symbol})</strong><br>
      Atomic Number: ${atomicNumber}<br>
      Category: ${category(atomicNumber)}
    `;
  });

  table.appendChild(tile);
});

// Search by name, symbol or atomic number
search.addEventListener("input", () => {
  const query = search.value.toLowerCase().trim();

  document.querySelectorAll(".element").forEach(tile => {
    const match = tile.dataset.search.includes(query);

    tile.style.opacity = match ? "1" : "0.12";
    tile.style.filter = match ? "" : "grayscale(1)";
  });
});

// Switch between 3D and flat views
let flat = false;

document.getElementById("view").addEventListener("click", () => {
  flat = !flat;

  table.style.transform = flat
    ? "none"
    : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  document.getElementById("view").textContent =
    flat ? "3D View" : "Flat View";
});

// Reset everything
document.getElementById("reset").addEventListener("click", () => {
  search.value = "";
  flat = false;
  rotateX = 12;
  rotateY = -4;
  zoom = 1;

  table.style.transform = "";
  table.style.scale = "1";

  document.querySelectorAll(".element").forEach(tile => {
    tile.style.opacity = "1";
    tile.style.filter = "";
  });

  document.getElementById("view").textContent = "Flat View";
  details.textContent = "Select an element to see its details.";
});

// Mouse and touch drag to rotate
let dragging = false;
let startX = 0;
let startY = 0;
let rotateX = 12;
let rotateY = -4;

wrapper.addEventListener("pointerdown", e => {
  if (e.target.closest(".element")) return;

  dragging = true;
  startX = e.clientX;
  startY = e.clientY;

  wrapper.setPointerCapture(e.pointerId);
});

wrapper.addEventListener("pointermove", e => {
  if (!dragging || flat) return;

  rotateY += (e.clientX - startX) * 0.4;
  rotateX -= (e.clientY - startY) * 0.3;

  rotateX = Math.max(-25, Math.min(35, rotateX));

  table.style.transform =
    `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  startX = e.clientX;
  startY = e.clientY;
});

wrapper.addEventListener("pointerup", () => {
  dragging = false;
});

wrapper.addEventListener("pointercancel", () => {
  dragging = false;
});

// Zoom using the mouse wheel
let zoom = 1;

wrapper.addEventListener("wheel", e => {
  e.preventDefault();

  zoom = Math.max(
    0.6,
    Math.min(1.5, zoom - e.deltaY * 0.0005)
  );

  table.style.scale = zoom;
}, { passive: false });
