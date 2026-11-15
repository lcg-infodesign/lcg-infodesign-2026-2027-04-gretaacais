let data;
let maxRadius = 0;
let totalPeriod = 0;

let backgroundColor = '#F5F5F5';
let transitColor = '#66A9ED';    
let rvColor = '#ED6677';        

let margin = 40;
let topSpace = 135;  
let bottomSpace = 60; 
let gutter = 6;

//variabili per mouse
let hoveredLabel = "";
let hoveredId = null;
let hovered = false;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  // Carica il dataset
  data = await loadTable("assets/exoplanets.csv", ",", "header");

  // Trova il raggio massimo e la somma dei periodi orbitali
  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
    let radius = data.getNum(rowNumber, "radius_earth");
    let period = data.getNum(rowNumber, "orbital_period_days");

    if (radius > maxRadius) {
      maxRadius = radius;
    }

    totalPeriod += period;
  }
}

function draw() {
  background(backgroundColor);

 //parte introduttiva
  fill(0);
  noStroke();
  textSize(22);
  text("Esopianeti confermati", margin, 35);

  fill(80);
  textSize(13);
  text(
    "Gli esopianeti sono pianeti che orbitano attorno a una stella diversa dal nostro Sole.\n" +
    "Ogni rettangolo rappresenta un pianeta: la larghezza indica il periodo orbitale, l'altezza il raggio rispetto alla Terra. Clicca su una barra per i dettagli.",
    margin,
    60
  );

  
  let numberOfGutters = data.getRowCount() - 1;
  let barsWidth = width - 2 * margin - numberOfGutters * gutter;
  let maxBarHeight = height - topSpace - bottomSpace;

  let xPos = margin;
  hovered = false;

  // Disegna una barra per riga
  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
    let currentRadius = data.getNum(rowNumber, "radius_earth");
    let currentPeriod = data.getNum(rowNumber, "orbital_period_days");
    let method = data.getString(rowNumber, "discovery_method");
    let planetName = data.getString(rowNumber, "name");
    let id = data.getString(rowNumber, "planet_id");

    let scaledWidth = map(currentPeriod, 0, totalPeriod, 15, barsWidth);
    let scaledHeight = map(currentRadius, 0, maxRadius, 10, maxBarHeight);

    //colori per metodo di scoperta
    if (method === "Transit") {
      fill(transitColor);
      stroke(transitColor);
    } else {
      fill(rvColor);
      stroke(rvColor);
    }

    rect(xPos, topSpace, scaledWidth, scaledHeight);

    if (
      mouseX >= xPos &&
      mouseX <= xPos + scaledWidth &&
      mouseY >= topSpace &&
      mouseY <= topSpace + scaledHeight
    ) {
      hoveredLabel = planetName;
      hoveredId = id;
      hovered = true;
    }

    xPos += scaledWidth + gutter;
  }

  //legenda
  noStroke();
  textSize(13);

  fill(transitColor);
  rect(margin, height - 35, 15, 15);
  fill(0);
  text("Metodo: Transit", margin + 22, height - 23);

  fill(rvColor);
  rect(margin + 160, height - 35, 15, 15);
  fill(0);
  text("Metodo: Radial Velocity", margin + 182, height - 23);

  if (hovered) {
    cursor(HAND);
    fill(0);
    stroke(backgroundColor);
    text(hoveredLabel, mouseX + 8, mouseY + 16);
  } else {
    cursor(ARROW);
  }
}

function mousePressed() {
 //se sono sopra e clicco allora vado ai dettagli
  if (hovered) {
    let newURL = "detail.html?planet=" + hoveredId;
    window.location.href = newURL;
  }
}