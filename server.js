import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import https from "https";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import config from "./config/config.js";
import { getUtcOffsetString } from "./utils/custom-functions.js"
import cityData from "./data/city-data.js";

const PORT = process.env.PORT || 5000;
const ipStackAccessKey = process.env.IPSTACK_ACCESS_KEY;
const geoDBCitiesAccessKey = process.env.GEODBCITIES_ACCESS_KEY;
const timeZoneDbAccessKey = process.env.TIMEZONEDB_ACCESS_KEY;
const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
const ipStackApi = config.ipStackApi;
const timeZoneDbApi = config.timeZoneDbApi;
const unsplashApi = config.unsplashApi;
const unsplashSearchOptions = unsplashApi.searchOptions;
const __dirname = path.resolve();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
})

app.get("/time-zone", (req, res) => {
  if (req.query.ip) {
    try {
      //Request ipStackApi for city name based on client's ip address
      const ip = req.query.ip;
      var url = `${ipStackApi.ipQueryPath}/${ip}?access_key=${ipStackAccessKey}`;
      http.get(url, ipStackRes => {
        const buffers = [];
        ipStackRes
          .on("data", data => buffers.push(data))
          .on("end", () => {
            const ipStackData = JSON.parse(buffers);
            const ipStackCityLabel = `${ipStackData.city}, ${ipStackData.region_name}, ${ipStackData.country_name}`
            const cityList = Object.values(cityData);
            const cityFoundIndex = cityList.findIndex((city) => city.label.includes(ipStackData.city, ipStackData.country_name) && Math.abs(city.latitude - ipStackData.latitude) < 1 && Math.abs(city.longitude - ipStackData.longitude) < 1);
            const cityItem = cityList[cityFoundIndex];
            //Request timezonedb for timezone and utc offset
            const latitude = ipStackData.latitude;
            const longitude = ipStackData.longitude;
            const url = `${timeZoneDbApi.timeZoneQueryPath}?key=${timeZoneDbAccessKey}&format=json&by=position&lat=${latitude}&lng=${longitude}`
            https.get(url, timeZoneDbRes => {
              const buffers = [];
              timeZoneDbRes
                .on("data", data => buffers.push(data))
                .on("end", () => {
                  try {
                    const timeZoneDbData = JSON.parse(buffers);
                    let timeZoneObj = {};
                    if (cityFoundIndex >= 0) {
                      timeZoneObj = {
                        id: cityItem.id,
                        cityName: cityItem.cityName,
                        countryCode: cityItem.countryCode,
                        countryName: cityItem.countryName,
                        regionName: cityItem.regionName,
                        label: cityItem.label,
                        latitude: cityItem.latitude,
                        longitude: cityItem.longitude,
                        timeZone: timeZoneDbData.zoneName,
                        utcOffset: getUtcOffsetString(timeZoneDbData.gmtOffset)
                      };
                    } else {
                      timeZoneObj = {
                        id: 0,
                        cityName: ipStackData.city,
                        countryCode: ipStackData.country_code,
                        countryName: ipStackData.country_name,
                        regionName: ipStackData.region_name,
                        label: `${ipStackData.city}, ${ipStackData.region_name}, ${ipStackData.country_name}`,
                        latitude: ipStackData.latitude,
                        longitude: ipStackData.longitude,
                        timeZone: timeZoneDbData.zoneName,
                        utcOffset: getUtcOffsetString(timeZoneDbData.gmtOffset)
                      };
                    }
                    res.send(JSON.stringify(timeZoneObj));
                  } catch (e) {
                    console.error(e.stack);
                    res.sendStatus(500);
                  }
                })
            })
          });
      })
    } catch (e) {
      console.error(e.stack);
      res.sendStatus(500);
    }
  } else if (req.query.cityId) {
    const cityId = req.query.cityId;
    const timeZoneObj = cityData[`${cityId}`];
    const latitude = timeZoneObj.latitude;
    const longitude = timeZoneObj.longitude;
    const url = `${timeZoneDbApi.timeZoneQueryPath}?key=${timeZoneDbAccessKey}&format=json&by=position&lat=${latitude}&lng=${longitude}`
    //Request timezonedb for timezone and utc offset
    https.get(url, timeZoneDbRes => {
      const buffers = [];
      timeZoneDbRes
        .on("data", data => buffers.push(data))
        .on("end", () => {
          try {
            const timeZoneDbData = JSON.parse(buffers);
            timeZoneObj.timeZone = timeZoneDbData.zoneName;
            timeZoneObj.utcOffset = getUtcOffsetString(timeZoneDbData.gmtOffset);
            res.send(JSON.stringify(timeZoneObj));
          } catch (e) {
            console.error(e.stack);
            res.sendStatus(500);
          }
        })
    })
  } else {
    res.sendStatus(400);
  }
});

app.get("/utc-offset", (req, res) => {
  if (req.query.latitude && req.query.longitude && req.query.time) {
    try {
      const latitude = req.query.latitude;
      const longitude = req.query.longitude;
      const time = req.query.time;
      const url = `${timeZoneDbApi.timeZoneQueryPath}?key=${timeZoneDbAccessKey}&format=json&by=position&lat=${latitude}&lng=${longitude}&time=${time}`
      https.get(url, apiRes => {
        const buffers = [];
        apiRes
          .on("data", data => buffers.push(data))
          .on("end", () => {
            try {
              const data = JSON.parse(buffers).gmtOffset;
              const offsetObj = {
                utcOffset: getUtcOffsetString(data)
              }
              res.send(JSON.stringify(offsetObj));
            } catch (e) {
              console.error(e.stack);
              res.sendStatus(500);
            }
          })
      })
    } catch (e) {
      console.error(e.stack);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
  }
});

app.get("/city-photo", (req, res) => {
  if (req.query.cityName) {
    try {
      const cityName = req.query.cityName;
      const countryName = req.query.countryName;
      const itemPerPage = unsplashSearchOptions.itemPerPage;
      const orientation = unsplashSearchOptions.orientation;
      const width = unsplashSearchOptions.width;
      const httpsOptions = {
        headers: {
          Authorization: `Client-ID ${unsplashAccessKey}`
        }
      };
      const url = `${config.unsplashApi.queryPath}?per_page=${itemPerPage}&query=${cityName} ${countryName} landmark&orientation=${orientation}`;
      https.get(url, httpsOptions, apiRes => {
        var buffers = []
        apiRes
          .on("data", data => buffers.push(data))
          .on("end", () => {
            try {
              const photoURL = JSON.parse(Buffer.concat(buffers).toString()).results[0].urls.full + `&w=${width}`;
              const photoURLObj = {
                photoURL: photoURL
              };
              res.send(JSON.stringify(photoURLObj));
            } catch (e) {
              console.error(e.stack);
              res.sendStatus(500);
            }
          })
      })
    } catch (e) {
      console.error(e.stack);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
  }
});

app.get("/country-flag", (req, res) => {
  if (req.query.countryCode) {
    try {
      const countryCode = req.query.countryCode.toLowerCase();
      const flagURL = `${config.flagIconCSSCdnjs.queryPath}/${countryCode}.svg`;
      const flagURLObj = {
        flagURL: flagURL
      };
      res.send(JSON.stringify(flagURLObj));
    } catch (e) {
      console.error(e.stack);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
  }
});
