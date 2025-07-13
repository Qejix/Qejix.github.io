const elemFormNouveauCycle = document.getElementsByTagName("form")[0];
const elemChampDateDebut = document.getElementById("start-date");
const elemChampDateFin = document.getElementById("end-date");
const conteneurCyclesAnterieurs = document.getElementById("past-periods");

// On ajoute une clé de stockage comme une constante
// globale de l'application
const CLE_STOCKAGE = "period-tracker";

// On écoute l'évènement pour l'envoi du formulaire.
elemFormNouveauCycle.addEventListener("submit", (event) => {
  event.preventDefault();
  const dateDebut = elemChampDateDebut.value;
  const dateFin = elemChampDateFin.value;
  if (verifierDatesInvalides(dateDebut, dateFin)) {
    return;
  }
  enregistrerNouveauCycle(dateDebut, dateFin);
  afficherCyclesAnterieurs();
  elemFormNouveauCycle.reset();
});

function verifierDatesInvalides(dateDebut, dateFin) {
  if (!dateDebut || !dateFin || dateDebut > dateFin) {
    elemFormNouveauCycle.reset();
    return true;
  }
  return false;
}

function enregistrerNouveauCycle(dateDebut, dateFin) {
  const cycles = recupererCyclesEnregistres();
  cycles.push({ dateDebut, dateFin });
  cycles.sort((a, b) => {
    return new Date(b.dateDebut) - new Date(a.dateDebut);
  });
  window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(cycles));
}

function recupererCyclesEnregistres() {
  const data = window.localStorage.getItem(CLE_STOCKAGE);
  const cycles = data ? JSON.parse(data) : [];
  console.dir(cycles);
  console.log(cycles);
  return cycles;
}

function afficherCyclesAnterieurs() {
  const titreCyclesAnterieurs = document.createElement("h2");
  const listeCyclesPasses = document.createElement("ul");
  const cycles = recupererCyclesEnregistres();
  if (cycles.length === 0) {
    return;
  }
  conteneurCyclesAnterieurs.innerHTML = "";
  titreCyclesAnterieurs.textContent = "Past cycles";
  cycles.forEach((cycle) => {
    const elementCycle = document.createElement("li");
    elementCycle.textContent = `From ${formaterDate(
      cycle.dateDebut
    )} to ${formaterDate(cycle.dateFin)}`;
    listeCyclesPasses.appendChild(elementCycle);
  });

  conteneurCyclesAnterieurs.appendChild(titreCyclesAnterieurs);
  conteneurCyclesAnterieurs.appendChild(listeCyclesPasses);
}

function formaterDate(chaineDate) {
  const date = new Date(chaineDate);
  return date.toLocaleDateString("fr", { timeZone: "UTC" });
}

afficherCyclesAnterieurs();
