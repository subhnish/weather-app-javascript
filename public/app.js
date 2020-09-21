let forecastMode = document.querySelector(".daily-heading")
let dailyCards = document.querySelector(".daily-cards")
let hourlyCards = document.querySelector(".hourly-cards")
let daily = document.querySelector(".daily-btn")
let hourly = document.querySelector(".hourly-btn")
let forecastModeclick = "";


forecastMode.addEventListener("click", (e) => {
    console.log(e.target.textContent)
    forecastModeclick = e.target.textContent

if(forecastModeclick === "HOURLY") {
    dailyCards.classList.remove("hidden");
    hourlyCards.classList.remove("hidden");
    daily.classList.remove("focus")
    hourly.classList.remove("focus")
    hourly.classList.add("focus")
    dailyCards.classList.add("hidden");

    } 
    else if (forecastModeclick === "DAILY") {
    dailyCards.classList.remove("hidden");
    hourlyCards.classList.remove("hidden");
    daily.classList.remove("focus")
    hourly.classList.remove("focus")
    daily.classList.add("focus")
    hourlyCards.classList.add("hidden");
    }
});

let dateToday = document.querySelector(".date-today")
let time = document.querySelector(".time")
dateToday.innerText = dayjs().format('DD MMMM YYYY');
time.innerText = dayjs().format('h:mm A')