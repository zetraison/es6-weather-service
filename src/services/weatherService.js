import React from 'react';

class ResponseMode {
    static get JSON () {
        return "json";
    }

    static get XML () {
        return "xml";
    }
}

class ResponseDataType {
    static get CURRENT () {
        return "weather";
    }

    static get FORECAST_HOURLY () {
        return "forecast";
    }

    static get FORECAST_DAILY () {
        return "forecast/daily";
    }
}

class ResponseUnits {
    static get FAHRENHEIT () {
        return "imperial";
    }

    static get CELSIUS () {
        return "metric";
    }
}

class WeatherService {

    constructor() {
        this.url = 'https://community-open-weather-map.p.rapidapi.com/';
        this.options = {
            headers: {
                'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
                'x-rapidapi-key': 'a5ea6e5a61msh1e7312a8dc0823bp1c723fjsn32dd8f2c3ee9'
            }
        }
        this.currentLimit = 1;
        this.hourlyLimit = 40;
        this.dailyLimit = 5;
    }
    
    byCityName = async (name, type, limit) => {
        const params = new URLSearchParams({
            q: name,
            cnt: limit || 1,
            mode: ResponseMode.JSON,
            units: ResponseUnits.CELSIUS
        })
        const url = [this.url, type, '?', params].join('')
        return fetch(url, this.options);
    }

    byCityNameCurrent = (name) => {
        return this.byCityName(name, ResponseDataType.CURRENT, this.currentLimit)
    }

    byCityNameHourly = async (name) => {
        return this.byCityName(name, ResponseDataType.FORECAST_HOURLY, this.hourlyLimit)
    }

    byCityNameDaily = async (name) => {
        return this.byCityName(name, ResponseDataType.FORECAST_DAILY, this.dailyLimit)
    }
    
    byGeoCoordinates = async (lat, lon, type, limit) => {
        const params = new URLSearchParams({
            lat: lat,
            lon: lon,
            cnt: limit || 1,
            mode: ResponseMode.JSON,
            units: ResponseUnits.CELSIUS
        })
        const url = [this.url, type, '?', params].join('')
        return fetch(url, this.options);
    }

    byGeoCoordinatesCurrent = async (lat, lon) => {
        return this.byGeoCoordinates(lat, lon, ResponseDataType.CURRENT, this.currentLimit)
    }

    byGeoCoordinatesHourly = async (lat, lon) => {
        return this.byGeoCoordinates(lat, lon, ResponseDataType.FORECAST_HOURLY, this.hourlyLimit)
    }

    byGeoCoordinatesDaily = async (lat, lon) => {
        return this.byGeoCoordinates(lat, lon, ResponseDataType.FORECAST_DAILY, this.dailyLimit)
    }
}

export default WeatherService;

