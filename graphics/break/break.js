"use strict";

// Replicant
const schedule = nodecg.Replicant("schedule");

// Generate the HTML element for the given run information
const generateRun = (game, info, first) => {
	const i = document.createElement("div");
	i.classList.add("run-info"); i.textContent = info;

	const t = document.createElement("div");
	t.classList.add("run-game"); t.textContent = game;

	const run = document.createElement("div");
	run.classList.add("run");
	if (first)
		run.classList.add("first");
	run.append(t, i);
	return run;
};

// Create and update the run information on screen
const updateRuns = (runs, n) => {
	const next = document.getElementById("next-run");
	const later = document.getElementById("later-runs");

	next.innerHTML = null;
	later.innerHTML = null;

	for (let i = 0; i < 4; i++) {
		const index = i + n;
		const info = runs[index].category + " by " + runs[index].formattedNames;
		if (!info) 
			return;

		if (i == 0) {
			next.append(generateRun(runs[index].game, info, true));
		} else {
			later.append(generateRun(runs[index].game, info, false));
		}
	}
};

schedule.on("change", (newVal, oldVal) => {
	updateRuns(newVal.entries, newVal.current + 1);
});


// Helper functions
const randFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
const randInt = (min, max) => anime.random(min, max);
const plusOrMinus = () => Math.random() < 0.5 ? -1 : 1;
const deviation = (min, max) => randInt(min, max) * plusOrMinus();

// Generate random background elements, add them to the document and return
// an array of the elements
const generateBG = () => {
	const bgClasses = ["cross", "rectangle", "oval", "triangle", "dot"];

	const maxWidth = 1920;
	const maxHeight = 982;
	const offset = 50;

	const bgElemRows = 6;
	const bgElemCols = 9;

	const frag = document.createDocumentFragment();
	const elementArr = new Array();

	const xSpacing = Math.round(maxWidth / bgElemCols);
	const ySpacing = Math.round(maxHeight / bgElemRows);

	for (let x = 0; x < bgElemCols; x++) {
		for (let y = 0; y < bgElemRows; y++) {
			const e = document.createElement("div");
			e.classList.add("floaty", bgClasses[randInt(0, bgClasses.length - 1)]);
			e.style.left = (xSpacing * x) + offset + deviation(10, 100) + "px";
			e.style.top = (ySpacing * y) + offset + deviation(10, 60) + "px";
			frag.appendChild(e);
			elementArr.push(e);
		}
	}

	document.getElementById("background-elements").appendChild(frag);
	return elementArr;
};

// Animation function for a given background element
const animateBG = (element) => {
	anime({
		targets: element,
		translateY: deviation(10, 200),
		translateX: [deviation(0, 10), deviation(0, 10)],
		scale: [randFloat(0.5, 1.1), randFloat(0.5, 1.1)],
		opacity: [randFloat(0.2, 0.6), randFloat(0.2, 0.6)],
		duration: 15000,
		direction: "alternate",
		offset: randInt(0, 10000),
		loop: true,
		easing: "easeInOutSine",
	});
};

// Run the generate function and then apply the animation for each element
generateBG().forEach(animateBG);
