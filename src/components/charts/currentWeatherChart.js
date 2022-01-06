import React, { useEffect, useState } from 'react';
import {timestampToTime, buildIconUrl, convertingHpaTomHg} from '../../util';

const CurrentWeatherChart = (props) => {
    const {city, data} = props;
    
    const temp = Math.round(data.main.temp);
    const temp_min = Math.round(data.main.temp_min);
    const temp_max = Math.round(data.main.temp_max);
    const humidity = data.main.humidity;
    const pressure = convertingHpaTomHg(data.main.pressure);
    const windSpeed = data.wind.speed ;
    const iconSrc = buildIconUrl(data.weather[0].icon);
    const sunrise = timestampToTime(data.sys.sunrise);
    const sunset = timestampToTime(data.sys.sunset);
    
    return (
        <div className="jumbotron">
            <div className="row">
                <div className="col-md-7 portfolio-item">
                    <h2>Погода, {city}</h2>
                    <h1>{temp}°C <img className="weather-icon" src={iconSrc} /></h1>
                    <h3>{temp_min}°C / {temp_max}°C</h3>
                </div>
                
                <div className="col-md-5">
                    <h4>Влажность: {humidity}%</h4>
                    <h4>Ветер: {windSpeed} м/с</h4>
                    <h4>Давление: {pressure} мм рт.ст.</h4>
                    <h4>Видимость: {data.visibility} м</h4>
                    <hr />
                    <h4>Восход солнца: {sunrise}</h4>
                    <h4>Закат солнца: {sunset}</h4>
                </div>
            </div>
        </div>
    );
}

export default CurrentWeatherChart;
