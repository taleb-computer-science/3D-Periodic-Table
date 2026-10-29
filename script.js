
const symbols = `
H He Li Be B C N O F Ne
Na Mg Al Si P S Cl Ar
K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr
Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe
Cs Ba La Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn
Fr Ra Ac Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og
`.trim().split(/\s+/);

const names = `
Hydrogen Helium Lithium Beryllium Boron Carbon Nitrogen Oxygen Fluorine Neon
Sodium Magnesium Aluminium Silicon Phosphorus Sulfur Chlorine Argon
Potassium Calcium Scandium Titanium Vanadium Chromium Manganese Iron Cobalt Nickel Copper Zinc Gallium Germanium Arsenic Selenium Bromine Krypton
Rubidium Strontium Yttrium Zirconium Niobium Molybdenum Technetium Ruthenium Rhodium Palladium Silver Cadmium Indium Tin Antimony Tellurium Iodine Xenon
Caesium Barium Lanthanum Hafnium Tantalum Tungsten Rhenium Osmium Iridium Platinum Gold Mercury Thallium Lead Bismuth Polonium Astatine Radon
Francium Radium Actinium Rutherfordium Dubnium Seaborgium Bohrium Hassium Meitnerium Darmstadtium Roentgenium Copernicium Nihonium Flerovium Moscovium Livermorium Tennessine Oganesson
`.trim().split(/\s+/);

// Add the two inner rows.
const extraSymbols = `
Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu
Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr
`.trim().split(/\s+/);

const extraNames = `
Cerium Praseodymium Neodymium Promethium Samarium Europium Gadolinium Terbium Dysprosium Holmium Erbium Thulium Ytterbium Lutetium
Thorium Protactinium Uranium Neptunium Plutonium Americium Curium Berkelium Californium Einsteinium Fermium Mendelevium Nobelium Lawrencium
`.trim().split(/\s+/);

const allSymbols = [...symbols, ...extraSymbols];
const allNames = [...names, ...extraNames];

// Category colors
function category(n, s) {
  if ([2,10,18,36,54,86,118].includes(n)) return "noble";
  if ([9,17,35,53,85,117].includes(n)) return "halogen";
  if ([3,11,19,37,55,87].includes(n)) return "alkali";
  if ([4,12,20,38,56,88].includes(n)) return "alkaline";
  if (n >= 57 && n <= 71 || n >= 89 && n <= 103)
    return n < 89 ? "lanthanide" : "actinide";
  if ([5,14,32,33,51,52].includes(n)) return "metalloid";
  if ([1,6,7,8,15,16,34].includes(n)) return "nonmetal";
  if ([13,31,49,50,81,82,83,84,113,114,115,116].includes(n))
    return "post";
  return "transition";
}

const table = document.getElementById("periodicTable");
const search = document.getElementById("search");
const details = document.getElementById("details");
const wrapper = document.querySelector(".table-wrapper");

const positions = new Map();

function place(symbol, row, col) {
  positions.set(symbol, [row, col]);
}

// Main periodic table layout
const rows = [
  ["H", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "He"],
  ["Li","Be","","","","","","","","","","","B","C","N","O","F","Ne"],
  ["Na","Mg","","","","","","","","","","","Al","Si","P","S","Cl","Ar"],
  ["K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr"],
  ["Rb","Sr","Y","Zr","Nb","Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe"],
  ["Cs","Ba","La","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb","Bi","Po","At","Rn"],
  ["Fr","Ra","Ac","Rf","Db","Sg","Bh","Hs","Mt","Ds","Rg","Cn","Nh","Fl","Mc","Lv","Ts","Og"]
];

rows.forEach((row, r) => {
  row.forEach((symbol, c) => {
    if (symbol) place(symbol, r + 1, c + 1);
  });
});

// Separate lanthanide and actinide rows
extraSymbols.slice(0, 15).forEach((s, i) => place(s, 9, i + 4));
extraSymbols.slice(15).forEach((s, i) => place(s, 10, i + 4));

// Build all 118 element tiles
allSymbols.forEach((symbol, index) => {
  const atomicNumber = index + 1;
  const name = allNames[index];
  const elCategory = category(atomicNumber, symbol);
  const pos = positions.get(symbol);

  if (!pos) return;

  const tile = document.createElement("button");
  tile.className = `element ${elCategory}`;
  tile.style.gridRow = pos[0];
  tile.style.gridColumn = pos[1];
  tile.dataset.name = name.toLowerCase();
  tile.dataset.symbol = symbol.toLowerCase();
  tile.dataset.number = atomicNumber;

  tile.innerHTML = `
    <span class="number">${atomicNumber}</span>
    <span class="symbol">${symbol}</span>
  `;

  tile.addEventListener("click", () => {
    details.innerHTML = `
      <strong>${name} (${symbol})</strong><br>
      Atomic Number: ${atomicNumber}<br>
      Category: ${elCategory}
    `;
  });

  table.appendChild(tile);
});

// Search by name, symbol, or atomic number
search.addEventListener("input", () => {
  const query = search.value.toLowerCase().trim();

  document.querySelectorAll(".element").forEach(tile => {
    const matches =
      tile.dataset.name.includes(query) ||
      tile.dataset.symbol.includes(query) ||
      tile.dataset.number === query;

    tile.style.opacity = matches ? "1" : "0.12";
    tile.style.filter = matches ? "" : "grayscale(1)";
  });
});

// Switch between 3D and flat views
document.getElementById("viewBtn").addEventListener("click", () => {
  table.classList.toggle("flat");

  document.getElementById("viewBtn").textContent =
    table.classList.contains("flat") ? "3D View" : "Flat View";
});

// Reset view
document.getElementById("resetBtn").addEventListener("click", () => {
  table.style.transform = "";
  table.classList.remove("flat");
  search.value = "";

  document.querySelectorAll(".element").forEach(tile => {
    tile.style.opacity = "1";
    tile.style.filter = "";
  });

  document.getElementById("viewBtn").textContent = "Flat View";
});

// Mouse and touch drag to rotate the table
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
  if (!dragging) return;

  rotateY += (e.clientX - startX) * 0.4;
  rotateX -= (e.clientY - startY) * 0.3;

  rotateX = Math.max(-25, Math.min(35, rotateX));

  table.style.transform =
    `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  startX = e.clientX;
  startY = e.clientY;
});

wrapper.addEventListener("pointerup", () => dragging = false);
wrapper.addEventListener("pointercancel", () => dragging = false);

// Wheel zoom
let zoom = 1;

wrapper.addEventListener("wheel", e => {
  e.preventDefault();

  zoom -= e.deltaY * 0.0005;
  zoom = Math.max(0.55, Math.min(1.6, zoom));

  table.style.scale = zoom;
}, { passive: false });
