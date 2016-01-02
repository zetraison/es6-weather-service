import React                from 'react';
import Highcharts           from 'highcharts';
import {WEATHER_TYPES}      from 'components/weather/service';
import WeatherService       from 'components/weather/service';
import config               from 'config';
import {timestampToTime, timestampToDate} from 'util/util';

let weatherService = new WeatherService();

class CurrentWeatherChart extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            cityName: null,
            main: null,
            weather: [],
            wind: null
        };
    }
    
    refreshData(){
        
        let cityName = this.props.querySearch ? this.props.querySearch : config.defaultCity;
        
        weatherService.byCityName(cityName, WEATHER_TYPES['CURRENT'], response => {
            this.setState({
                cityName: response.name,
                main: response.main,
                weather: response.weather[0],
                wind: response.wind
            });
        });
    }
    
    componentDidMount(){
        this.refreshData();
    }
    
    render(){
        
        let temp = this.state.main ? Math.round(this.state.main.temp) : 0;
        let humidity = this.state.main ? this.state.main.humidity : 0;
        let pressure = this.state.main ? Math.round(config.hpaTommHgCoeff * this.state.main.pressure) : 0;
        let windSpeed = this.state.wind ? this.state.wind.speed : 0;
        let iconSrc = this.state.weather.icon ? (config.openWeatherMap.imgUrl + this.state.weather.icon + '.png') : '';
        
        return (
            <div className="jumbotron">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 portfolio-item">
                            <h2>Погода, {this.state.cityName}</h2>
                            <h1>{temp}°C <img className="weather-icon" src={iconSrc} /></h1>
                        </div>
                        <div className="col-md-4 portfolio-item">
                            <h3>Давление: {pressure} мм рт.ст.</h3>
                            <h3>Влажность: {windSpeed}%</h3>
                            <h3>Ветер: {windSpeed} м/с</h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CurrentWeatherChart;