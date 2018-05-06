import React    from 'react/lib/React';
import Service  from 'service';
import config   from 'config';

export const WEATHER_RESPONSE_MODES = {
    JSON:   'json',
    XML:    'xml'
};

export const WEATHER_TYPES = {
    CURRENT:            'weather',
    FORECAST_HOURLY:    'forecast',
    FORECAST_DAILY:     'forecast/daily'
};

export const WEATHER_UNITS = {
    FAHRENHEIT: 'imperial',
    CELSIUS:    'metric'
};

class WeatherService extends Service {
    
    constructor(props) {
        super(props);
    
        this.url = config.openWeatherMap.apiUrl;
        this.appId = config.openWeatherMap.apiKey;
        
        this.mode = props && props.mode 
            ? props.mode
            : WEATHER_RESPONSE_MODES['JSON'];
            
        this.units = props && props.units
            ? props.units
            : WEATHER_UNITS['CELSIUS'];
    }
    
    byCityName(name, type, limit, callback) {
        
        this.request(this.url + type, {
            data: {
                q: name,
                cnt: limit || 10,
                mode: this.mode,
                units: this.units,
                appId: this.appId
            },
            success: callback
        });
    }
    
    byCityId(id, type, limit, callback) {
        
        this.request(this.url + type, {
            data: {
                id: id,
                cnt: limit || 10,
                mode: this.mode,
                units: this.units,
                appId: this.appId
            },
            success: callback
        });
    }
    
    byGeoCoordinates(lat, lon, type, limit, callback) {
        
        this.request(this.url + type, {
            data: {
                lat: lat,
                lon: lon,
                cnt: limit || 10,
                mode: this.mode,
                units: this.units,
                appId: this.appId
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

