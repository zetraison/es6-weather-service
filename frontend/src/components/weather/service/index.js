import React    from 'react';
import Service  from 'service';
import config   from 'config';

export const WEATHER_RESPONSE_MODES = {
    JSON:   'json',
    XML:    'xml'
};

export const WEATHER_TYPES = {
    CURRENT:        'weather',
    FORECAST:       'forecast',
    FORECAST_DAILY: 'forecast/daily'
};

export const WEATHER_UNITS = {
    FAHRENHEIT: 'imperial',
    CELSIUS:    'metric'
};

class WeatherService extends Service {
    
    constructor(props) {
        super(props);
    
        this.url = config.openWeatherMap.apiUrl;
        this.appid = config.openWeatherMap.apikey;
        
        this.mode = props && props.mode 
            ? props.mode
            : WEATHER_RESPONSE_MODES['JSON'];
            
        this.units = props && props.units
            ? props.units
            : WEATHER_UNITS['CELSIUS'];
            
        cnt: this.cnt = props && props.cnt ? props.cnt : 10;
    }
    
    byCityName(name, type, callback) {
        
        this.request(this.url + type, {
            data: {
                q: name,
                cnt: this.cnt,
                mode: this.mode,
                units: this.units,
                appid: this.appid
            },
            success: callback
        });
    }
    
    byCityId(id, type, callback) {
        
        this.request(this.url + type, {
            data: {
                id: id,
                cnt: this.cnt,
                mode: this.mode,
                units: this.units,
                appid: this.appid
            },
            success: callback
        });
    }
    
    byGeoCoord(lat, lon, type, callback) {
        
        this.request(this.url + type, {
            data: {
                lat: lat,
                lon: lon,
                cnt: this.cnt,
                mode: this.mode,
                units: this.units,
                appid: this.appid
            },
            success: callback
        });
    }
}

WeatherService.defaultProps = { mode: WEATHER_RESPONSE_MODES['CURRENT'], type: WEATHER_TYPES['JSON'] };
WeatherService.propTypes = { 
    mode: React.PropTypes.string, 
    type: React.PropTypes.string
};

export default WeatherService;

