const hoursNumbers = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
);
const multiplesOf5 = Array.from({ length: 12 }, (_, i) =>
    String(i * 5).padStart(2, "0")
);

function placeNumbers(container, numbers, size, fontDivisor = 15) {
    container.innerHTML = "";
    const radius = size / 2 - 25;
    numbers.forEach((num, i) => {
        const angle = (360 / numbers.length) * i;
        const rad = (angle * Math.PI) / 180;
        const x = radius * Math.cos(rad);
        const y = radius * Math.sin(rad);

        const numDiv = document.createElement("div");
        numDiv.className = "number";
        numDiv.style.fontSize = size / fontDivisor + "px";
        numDiv.dataset.x = x;
        numDiv.dataset.y = y;
        numDiv.dataset.angle = angle;
        numDiv.textContent = num;
        container.appendChild(numDiv);
    });
}

function placeTicks(container, totalDivisions, size) {
    const radius = size / 2 - 10;
    for (let i = 0; i < totalDivisions; i++) {
        const angle = (360 / totalDivisions) * i;
        const rad = (angle * Math.PI) / 180;
        const x = radius * Math.cos(rad);
        const y = radius * Math.sin(rad);

        const tick = document.createElement("div");
        tick.className =
            "tick " + (i % 5 === 0 ? "large-tick" : "small-tick");

        tick.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%) rotate(${angle + 90
            }deg)`;
        container.appendChild(tick);
    }
}

function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12 || 12;

    const secondRotate = -seconds * 6;
    const minuteRotate = -minutes * 6;
    const hourRotate = -((hours - 1) * 30);

    const outerWrapper = document.getElementById("outer-wrapper");
    const middleWrapper = document.getElementById("middle-wrapper");
    const innerWrapper = document.getElementById("inner-wrapper");

    outerWrapper.style.transform = `translate(-50%, -50%) rotate(${secondRotate}deg)`;
    middleWrapper.style.transform = `translate(-50%, -50%) rotate(${minuteRotate}deg)`;
    innerWrapper.style.transform = `translate(-50%, -50%) rotate(${hourRotate}deg)`;

    [...outerWrapper.querySelectorAll(".number")].forEach((num) => {
        const x = num.dataset.x;
        const y = num.dataset.y;
        num.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${-secondRotate}deg)`;
    });

    [...middleWrapper.querySelectorAll(".number")].forEach((num) => {
        const x = num.dataset.x;
        const y = num.dataset.y;
        num.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${-minuteRotate}deg)`;
    });

    [...innerWrapper.querySelectorAll(".number")].forEach((num) => {
        const x = num.dataset.x;
        const y = num.dataset.y;
        num.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${-hourRotate}deg)`;
    });

    highlightCurrent(outerWrapper, seconds, 60, secondRotate);
    highlightCurrent(middleWrapper, minutes, 60, minuteRotate);
    highlightCurrent(innerWrapper, hours, 12, hourRotate);

    const colonId = "time-colon";
    let colon = document.getElementById(colonId);
    if (!colon) {
        colon = document.createElement("div");
        colon.id = colonId;
        colon.className = "number highlight colon";
        colon.textContent = ":";
        document.getElementById("clock-container").appendChild(colon);
    }

    // Position colon between inner (hours) and middle (minutes)
    colon.style.position = "absolute";
    colon.style.top = "49.5%";
    colon.style.left = "78%";
    colon.style.fontSize = "25px";
    colon.style.transform = "translate(-50%, -50%)"; // center

    // Day + Date element
const dayDateId = "day-date";
let dayDate = document.getElementById(dayDateId);
if (!dayDate) {
    dayDate = document.createElement("div");
    dayDate.id = dayDateId;
    dayDate.className = "number highlight day-date";
    document.getElementById("clock-container").appendChild(dayDate);
}

const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "June",
                "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

const dayName = days[now.getDay()];
const dateNum = now.getDate();
const monthName = months[now.getMonth()];

dayDate.innerHTML = `${dayName}<br><br>${dateNum} ${monthName}`;

// Position: right half, middle vertically, just left of hour ring
dayDate.style.position = "absolute";
dayDate.style.top = "50%";
dayDate.style.left = "57%"; // adjust this percentage to fine‑tune placement
dayDate.style.transform = "translate(-50%, -50%)";

}

function highlightCurrent(ringWrapper, currentValue, totalValues, rotation) {
    const dynamic = ringWrapper.querySelector(".dynamic-number");
    if (dynamic) dynamic.remove();

    let found = false;
    ringWrapper.querySelectorAll(".number").forEach((num) => {
        if (parseInt(num.textContent, 10) === currentValue) {
            num.classList.add("highlight");
            found = true;

            // 🔑 Force consistent box size for multiples of 5
            if (ringWrapper.id === "middle-wrapper") {
                num.style.fontSize = "25px";
                num.style.padding = "4px 6px";
            } else if (ringWrapper.id === "outer-wrapper") {
                num.style.fontSize = "25px";
                num.style.padding = "4px 6px";
            } else {
                num.style.fontSize = "30px";
                num.style.padding = "6px 10px";
            }
        } else {
            num.classList.remove("highlight");
            // Reset style so non-highlighted numbers go back to normal
            num.style.fontSize = "";
            num.style.padding = "";
        }
    });

    if (!found) {
        const ringSize = ringWrapper.offsetWidth;
        const radius = ringSize / 2 - 25;
        const angle = (360 / totalValues) * currentValue;
        const rad = (angle * Math.PI) / 180;
        const x = radius * Math.cos(rad);
        const y = radius * Math.sin(rad);

        const numDiv = document.createElement("div");
        numDiv.className = "number highlight dynamic-number";
        numDiv.textContent = currentValue.toString().padStart(2, "0");

        if (ringWrapper.id === "middle-wrapper") {
            numDiv.style.fontSize = "25px";
            numDiv.style.padding = "4px 6px";
        } else if (ringWrapper.id === "outer-wrapper") {
            numDiv.style.fontSize = "25px";
            numDiv.style.padding = "4px 6px";
        } else {
            numDiv.style.fontSize = "30px";
            numDiv.style.padding = "6px 10px";
        }

        numDiv.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${-rotation}deg)`;
        ringWrapper.appendChild(numDiv);
    }
}


// Place ticks
placeTicks(document.getElementById("outer-wrapper"), 60, 610); // Seconds
placeTicks(document.getElementById("middle-wrapper"), 60, 490); // Minutes

// Place numbers
placeNumbers(
    document.getElementById("outer-ring"),
    multiplesOf5,
    600,
    40
);
placeNumbers(
    document.getElementById("middle-ring"),
    multiplesOf5,
    480,
    30
);
placeNumbers(
    document.getElementById("inner-ring"),
    hoursNumbers,
    320,
    10
);

// Start clock
setInterval(updateClock, 1000);
updateClock();