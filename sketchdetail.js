let backgroundColor = '#F5F5F5';
let accentColor = '#66A9ED';

let data;

let selectedPlanetId;

async function setup() {
  data = await loadTable("assets/exoplanets.csv", ",", "header");

  let params = getURLParams();

  selectedPlanetId = params.planet;
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(backgroundColor);

  let planetRow = data.findRow(selectedPlanetId, "planet_id");

  if (planetRow) {
    let name = planetRow.get("name");
    let year = planetRow.get("discovery_year");
    let mass = float(planetRow.get("mass_earth"));

    // nome pianeta
    fill(0);
    noStroke();
    textSize(22);
    text(name + " (scoperto nel " + year + ")", 20, 35);

    // legenda
    fill(accentColor);
    circle(27, 65, 15);
    fill(0);
    textSize(14);
    text("Legenda: 1 pallino = 1 massa terrestre (Totale: " + mass + ")", 45, 70);

    let numPallini = mass;

    let diametro = 15;
    let padding = 5;

    let posX = 27;
    let posY = 110;

    for (let i = 0; i < numPallini; i++) {
      fill(accentColor);
      stroke(accentColor);
      circle(posX, posY, diametro);

      posX += diametro + padding;

      if (posX + diametro > width - 20) {
        posX = 27;
        posY += diametro + padding;
      }
    }

    noStroke();
    fill(100);
    textSize(13);
    text("Clicca sullo schermo per tornare alla panoramica", 20, height - 20);
  }
}

function mousePressed() {
  window.location.href = "index.html";
}