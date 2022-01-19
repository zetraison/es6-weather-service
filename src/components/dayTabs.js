import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import {
    timestampToDate, 
    buildIconUrl, 
    convertingHpaTomHg
} from '../util';

const DayTabs = (props) => {
    const {data, onTabChange} = props;
    const [key, setKey] = useState(0);
    
    const handleSelect = (key) => {
        setKey(key);
        onTabChange(data.list[key].dt);
    }

    const forecastDaysLimit = 5;
    
    const navs = data.list
        .filter(el => new Date(el.dt * 1000).getDate() >= new Date().getDate())
        .slice(0, forecastDaysLimit)
        .map((el, index) => {
            const src = buildIconUrl(el.weather[0].icon);
            const day = timestampToDate(el.dt);
            const temp = (<p>{Math.round(el.temp.day)}° <span className="min-temp">{Math.round(el.temp.night)}°</span></p>);
            const pressure = convertingHpaTomHg(el.pressure);
        
            return (
                <Nav.Item key={index}>
                    <Nav.Link eventKey={index}>
                        <p><img src={src} /></p>
                        <p>{day}</p>
                        {temp}
                        <p>{el.humidity}%</p>
                        <p>{pressure} мм рт.ст.</p>
                    </Nav.Link>
                </Nav.Item>
            );
        });
    
    return (
        <Nav justify variant="pills" activeKey={key} onSelect={handleSelect}>
            {navs}
        </Nav>
    );
}

export default DayTabs;
