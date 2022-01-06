import React, { useEffect, useState } from 'react';
import WeatherService from '../services/weatherService';
import {getCurrentPosition} from '../services/navigatorService';
import CurrentWeatherChart from '../components/charts/currentWeatherChart';
import HourlyWeatherChart from '../components/charts/hourlyWeatherChart';
import Throbber from '../components/throbber/throbber';
import ErrorMessage from '../components/errorMessage';

const MainPage = (props) => {
    const {city} = props;
    const [dataCurrent, setDataCurrent] = useState(null);
    const [dataHourly, setDataHourly] = useState(null);
    const [dataDaily, setDataDaily] = useState(null);
    const [error, setError] = useState(null);

    const weatherService = new WeatherService();

    const getDataByCityName = async (city) => {
        const [currentResponse, hourlyResponse, dailyResponse] = await Promise.all([
            weatherService.byCityNameCurrent(city),
            weatherService.byCityNameHourly(city),
            weatherService.byCityNameDaily(city)
        ]);
        if (!currentResponse.ok) 
            setError(await currentResponse.json());
        if (!hourlyResponse.ok) 
            setError(await hourlyResponse.json());
        if (!dailyResponse.ok) 
            setError(await dailyResponse.json());
        return await Promise.all([
            currentResponse.json(), hourlyResponse.json(), dailyResponse.json()]);
    }

    const getDataByGeoCoordinates = async () => {
        const [lat, lon] = await getCurrentPosition();
        const [currentResponse, hourlyResponse, dailyResponse] = await Promise.all([
            weatherService.byGeoCoordinatesCurrent(lat, lon),
            weatherService.byGeoCoordinatesHourly(lat, lon),
            weatherService.byGeoCoordinatesDaily(lat, lon)
        ]);
        if (!currentResponse.ok) 
            setError(await currentResponse.json());
        if (!hourlyResponse.ok) 
            setError(await hourlyResponse.json());
        if (!dailyResponse.ok) 
            setError(await dailyResponse.json());
        return await Promise.all([
            currentResponse.json(), hourlyResponse.json(), dailyResponse.json()]);
    }

    useEffect(() => {
        (async function() {
            const [current, hourly, daily] = city ? await getDataByCityName(city) : await getDataByGeoCoordinates();
            setDataCurrent(current);
            setDataHourly(hourly);
            setDataDaily(daily);
        })()
    }, [city])

    if (error) {
        return <ErrorMessage message={error.message} />
    }

    if (dataCurrent && dataHourly && dataDaily) {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <CurrentWeatherChart 
                            city={city} 
                            data={dataCurrent} 
                        />
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-12">
                        <HourlyWeatherChart 
                            id="multiChart"
                            city={city} 
                            dataCurrent={dataCurrent} 
                            dataDaily={dataDaily} 
                            dataHourly={dataHourly} 
                        />
                    </div>
                </div>
            </div>
        );
    }
    
    return <Throbber />;
}

export default MainPage;