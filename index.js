const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const app = express();
const dayjs = require("dayjs")
const utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(timezone)
dayjs.extend(utc)
let json = "";
let lat = "";
let lon = "";
let cityTimezone = "";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("home", { cityName: "-", weatherEjs: "-", tempEjs: "-" });
});

app.post("/", (req, res) => {
  let cityName = req.body.cityName
  let apiKey = "51c6260035c3c1a3e7d8736a3599ff3e";
  let frontUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
  let apiUrl = `${frontUrl}${cityName}&appid=${apiKey}`;
  let oneCallFrontUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=";

  https.get(apiUrl, (response) => {
    let body = "";
    response.on("data", (chunk) => {
      body += chunk;
    });
    response.on("end", () => {
      json = JSON.parse(body);
      console.log(json)
      lat = json.coord.lat;
      lon = json.coord.lon;
    //   console.log(json);
      let OneCallapiUrl = `${oneCallFrontUrl}${lat}&lon=${lon}&exclude=minutely&appid=${apiKey}`;
      https.get(OneCallapiUrl, (response2) => {
        let body2 = "";
        response2.on("data", (chunk) => {
          body2 += chunk;
        });

        response2.on("end", () => {
          let json2 = JSON.parse(body2);
          let cityWeath = json2.current.weather[0].description;
          cityWeath = cityWeath.charAt(0).toUpperCase() + cityWeath.slice(1);
          let temperature = (json2.current.temp - 273.15).toFixed(0);
          let hourlyWeath = [];
          let dailyWeath = [];
          for (let i = 0; i < json2.hourly.length; i++) {
          hourlyWeath.push(json2.hourly[i])
          }
          for (let i = 0; i < json2.daily.length; i++) {
          dailyWeath.push(json2.daily[i])
          }
          let iconUrl = `http://openweathermap.org/img/wn/${json2.current.weather[0].icon}@2x.png`;
          res.render("weather", {
            cityName: cityName,
            weatherEjs: cityWeath,
            tempEjs: temperature,
            iconUrl: iconUrl,
            timezone: cityTimezone,
            hourlyWeath: hourlyWeath,
            dailyWeath: dailyWeath,
            dayjs: dayjs,
            utc: utc,
          });
        });
      });
    });
  });
});

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Website is running on Port ${PORT}`);
});
