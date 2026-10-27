(function (root) {
  'use strict';
  const validCodes = new Set([0,1,2,3,45,48,51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99]);
  function describe(current) {
    if (!current || !validCodes.has(current.weather_code) || ![0,1].includes(current.is_day) || !Number.isFinite(current.temperature_2m) || !Number.isFinite(current.wind_speed_10m) || current.wind_speed_10m < 0) throw new Error('Incomplete weather data');
    const code = current.weather_code, night = current.is_day === 0;
    let kind = 'clear';
    if (code >= 95) kind = 'storm';
    else if ([71,73,75,77,85,86].includes(code)) kind = 'snow';
    else if (code >= 51) kind = 'rain';
    else if ([45,48].includes(code)) kind = 'fog';
    else if (current.wind_speed_10m >= 30) kind = 'wind';
    else if (code >= 2) kind = 'cloud';
    const labels = {clear:code===1?'Mainly clear':night?'Clear night':'Clear skies',cloud:code===2?'Partly cloudy':'Overcast',wind:'Strong winds',rain:code<=57?'Drizzle':'Rain',storm:'Thunderstorm',snow:'Snowfall',fog:'Fog'};
    // Daylight is independent of precipitation: daytime rain must not show a full moon.
    return {kind, label:labels[kind], theme:night?'midnight':'day', temperature:Math.round(current.temperature_2m), wind:Math.round(current.wind_speed_10m), time:current.time};
  }
  const api = {describe};
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.VoyageWeather = api;
})(typeof window === 'object' ? window : globalThis);
