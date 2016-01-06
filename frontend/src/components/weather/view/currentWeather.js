import React                from 'react/lib/React';
import Highcharts           from 'highcharts';
import {WEATHER_TYPES}      from 'components/weather/service';
import WeatherService       from 'components/weather/service';
import config               from 'config';
import {timestampToTime, 
        timestampToDate, 
        getCurrentPosition} from 'util/util';

let weatherService = new WeatherService();

class CurrentWeatherChart extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            cityName: props.querySearch,
            main: null,
            weather: [],
            wind: null,
            sys: null,
            visibility: 0
        };
    }
    
    refreshData(){
        
        if (this.state.cityName) {
            weatherService.byCityName(this.state.cityName, WEATHER_TYPES['CURRENT'], null, response => {
                this.setState({
                    cityName: response.name,
                    main: response.main,
                    weather: response.weather[0],
                    wind: response.wind,
                    sys: response.sys,
                    visibility: response.visibility
                });
            });
        } else {
            getCurrentPosition().then((coords) => {
                weatherService.byGeoCoord(coords[0], coords[1], WEATHER_TYPES['CURRENT'], null, response => {
                    this.setState({
                        cityName: response.name,
                        main: response.main,
                        weather: response.weather[0],
                        wind: response.wind,
                        sys: response.sys,
                        visibility: response.visibility
                    });
                });
            });
        }
    }
    
    componentDidMount(){
        this.refreshData();
    }
    
    render(){
        
        let temp = this.state.main ? Math.round(this.state.main.temp) : 0;
        let temp_min = this.state.main ? Math.round(this.state.main.temp_min) : 0;
        let temp_max = this.state.main ? Math.round(this.state.main.temp_max) : 0;
        let humidity = this.state.main ? this.state.main.humidity : 0;
        let pressure = this.state.main ? Math.round(config.hpaTommHgCoeff * this.state.main.pressure) : 0;
        let windSpeed = this.state.wind ? this.state.wind.speed : 0;
        let iconSrc = this.state.weather.icon ? (config.openWeatherMap.imgUrl + this.state.weather.icon + '.png') : '';
        let sunrise = this.state.sys ? timestampToTime(this.state.sys.sunrise) : 0;
        let sunset = this.state.sys ? timestampToTime(this.state.sys.sunset) : 0;
        let visibility = this.state.visibility ? (<h4>Видимость: {this.state.visibility / 1000} км</h4>) : '';
        
        return (
            <div className="jumbotron">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7 portfolio-item">
                            <h2>Погода, {this.state.cityName}</h2>
                            <h1>{temp}°C <img className="weather-icon" src={iconSrc} /></h1>
                            <h3>{temp_min}°C / {temp_max}°C</h3>
                        </div>
                        <div className="col-md-5">
                            <h4>Влажность: {windSpeed}%</h4>
                            <h4>Ветер: {windSpeed} м/с</h4>
                            <h4>Давление: {pressure} мм рт.ст.</h4>
                            {visibility}
                            <hr />
                            <h4>Восход солнца: {sunrise}</h4>
                            <h4>Закат солнца: {sunset}</h4>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CurrentWeatherChart;