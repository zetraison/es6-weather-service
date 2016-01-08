import React from 'react/lib/React';
import {timestampToTime, buildIconUrl, convertingHpaTommHg}  from 'util';

class CurrentWeatherChart extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            data: props.data,
            city: props.city
        };
    }
    
    render(){
        
        let data = this.state.data;
        
        let temp = Math.round(data.main.temp);
        let temp_min = Math.round(data.main.temp_min);
        let temp_max = Math.round(data.main.temp_max);
        
        let humidity = data.main.humidity;
        let pressure = convertingHpaTommHg(data.main.pressure);
        let windSpeed = data.wind.speed ;
        
        let iconSrc = buildIconUrl(data.weather[0].icon);
        let sunrise = timestampToTime(data.sys.sunrise);
        let sunset = timestampToTime(data.sys.sunset);
        let visibility = data.visibility ? (<h4>Видимость: {data.visibility / 1000} км</h4>) : '';
        
        return (
            <div className="jumbotron">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7 portfolio-item">
                            <h2>Погода, {this.state.city}</h2>
                            <h1>{temp}°C <img className="weather-icon" src={iconSrc} /></h1>
                            <h3>{temp_min}°C / {temp_max}°C</h3>
                        </div>
                        
                        <div className="col-md-5">
                            <h4>Влажность: {humidity}%</h4>
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