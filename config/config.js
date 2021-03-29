const config = {
  ipStackApi: {
    ipQueryPath: "http://api.ipstack.com"
  },
  geoDBCitiesApi: {
    cityQueryPath: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities"
  },
  timeZoneDbApi: {
    timeZoneQueryPath: "https://api.timezonedb.com/v2.1/get-time-zone"
  },
  unsplashApi: {
    queryPath: "https://api.unsplash.com/search/photos",
    searchOptions: {
      itemPerPage: 1,
      orientation: "landscape",
      width: 600 //pixels
    }
  },
  flagIconCSSCdnjs: {
    queryPath: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3"
  },
}

export default config;
