$(function () {
	displayTopDate();
	setupTimeBlocks();
	loadSchedule();
	setupButtons();
});

function displayTopDate() {
	let top = document.querySelector(".container-lg");
	let h1 = document.createElement("h1");
	h1.textContent = dayjs().format("M/D/YYYY");
	h1.style.textAlign = "center";
	h1.style.paddingBottom = "15px";
	top.appendChild(h1);
}

function setupTimeBlocks() {
	let top = document.querySelector(".container-lg");
	for (let i = 7; i < 20; i++) {
		let iElement = document.createElement("i");
		let timeText = document.createElement("div");
		let textarea = document.createElement("textarea");
		let button = document.createElement("button");
		let container = document.createElement("div");
		
		iElement.className = "fas fa-save";
		iElement["aria-hidden"] = "true";
		button.className = "btn saveBtn col-2 col-md-1";
		button["aria-label"] = "save";
		textarea.className = "col-8 col-md-10 description";
		textarea.rows = "3";
		timeText.className = "col-2 col-md-1 hour text-center py-3";
		container.className = "row time-block";
		container.id = "hour-" + (i + 1);

		let meridiem = "AM";
		if (i > 10 && i < 23) {
			meridiem = "PM";
		}
		timeText.textContent = (i % 12 + 1) + meridiem;

		button.appendChild(iElement);
		container.appendChild(timeText);
		container.appendChild(textarea);
		container.appendChild(button);

		top.appendChild(container);
	}
	updateColors();
}

function updateColors() {
	let timeBlockList = document.querySelectorAll(".time-block");
	for (let i = 0; i < timeBlockList.length; i++) {
		let timeBlock = timeBlockList[i];
		timeBlock.classList.remove("past");
		timeBlock.classList.remove("present");
		timeBlock.classList.remove("future");
		let thisHour = "past";
		if (timeBlock.id.slice(5) == dayjs().hour()) thisHour = "present";
		else if (timeBlock.id.slice(5) > dayjs().hour()) thisHour = "future";
		timeBlock.classList.add(thisHour);
	}
	setTimer();
}

function setTimer() {
	setTimeout(updateColors, (3600 - (dayjs().minute() * 60 + dayjs().second())) * 1000 + 1000);
}

function setupButtons() {
	let buttonList = document.querySelectorAll(".saveBtn");
	for (let i = 0; i < buttonList.length; i++) {
		buttonList[i].onclick = function () {
			saveSchedule(this.parentElement.id, this.parentElement.querySelector("textarea").value);
		}
	}
}

function saveSchedule(id, text) {
	let data = localStorage.getItem("schedules") ? JSON.parse(localStorage.getItem("schedules")) : {};
	data[id] = text;
	localStorage.setItem("schedules", JSON.stringify(data));
}

function loadSchedule() {
	let data = localStorage.getItem("schedules") ? JSON.parse(localStorage.getItem("schedules")) : {};
	let timeBlockList = document.querySelectorAll(".time-block");
	for (let i = 0; i < timeBlockList.length; i++) {
		let timeBlock = timeBlockList[i];
		if (!data[timeBlock.id]) continue;
		let textarea = timeBlock.querySelector("textarea");
		textarea.value = data[timeBlock.id];
	}
}