const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const app = express();
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

let lat = "";
let lon = "";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home", {message: "Enter the City name",
cityName: "-" });
});

app.post("/", (req, res) => {
  let cityName = req.body.cityName;
  const apiKey = "You API KEY"
  let frontUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
  let apiUrl = `${frontUrl}${cityName}&appid=${apiKey}`;
  let oneCallFrontUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=";

  https.get(apiUrl, (response) => {
    let body = "";
    response.on("data", (chunk) => {
      body += chunk;
    });
    response.on("end", () => {
      let json = JSON.parse(body);
      // console.log(json);
    if (json.cod === "404") {
      res.render("home", { message: json.message });
    }
      else {
        lat = json.coord.lat;
        lon = json.coord.lon;
      }

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
            hourlyWeath.push(json2.hourly[i]);
          }
          for (let i = 0; i < json2.daily.length; i++) {
            dailyWeath.push(json2.daily[i]);
          }
          let iconUrl = `http://openweathermap.org/img/wn/${json2.current.weather[0].icon}@2x.png`;
          res.render("weather", {
            cityName: cityName,
            weatherEjs: cityWeath,
            tempEjs: temperature,
            iconUrl: iconUrl,
            hourlyWeath: hourlyWeath,
            dailyWeath: dailyWeath,
            dayjs: dayjs,
            utc: utc,
          });

          res.on("error", () => {
                  res.render("home", { message: "Something went Wrong, Enter the City again" });
              })
        });
      });
    });
  });
});

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Website is running on Port ${PORT}`);
});
