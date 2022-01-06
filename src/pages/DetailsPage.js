import React, {useEffect, useState} from 'react';
import WeatherService from '../services/weatherService';
import {getCurrentPosition} from '../services/navigatorService';
import TempVariationColumnChart from '../components/charts/tempVariationColumnChart';
import TempVariationSplineChart from '../components/charts/tempVariationSplineChart';
import WindSpeedChart from '../components/charts/windSpeedChart';
import PrecipitationChart from '../components/charts/precipitationChart';
import PressureChart from '../components/charts/pressureChart';
import HumidityChart from '../components/charts/humidityChart';
import Throbber from '../components/throbber/throbber';
import ErrorMessage from '../components/errorMessage';

const DetailsPage = (props) => {
    const {city} = props;
    const [dataHourly, setDataHourly] = useState(null);
    const [dataDaily, setDataDaily] = useState(null);
    const [error, setError] = useState(null);
    const weatherService = new WeatherService();

    const getDataByCityName = async (city) => {
        const [hourlyResponse, dailyResponse] = await Promise.all([
            weatherService.byCityNameHourly(city),
            weatherService.byCityNameDaily(city)
        ]);
        if (!hourlyResponse.ok) 
            setError(await hourlyResponse.json());
        if (!dailyResponse.ok) 
            setError(await dailyResponse.json());
        return await Promise.all([hourlyResponse.json(), dailyResponse.json()]);
    }

    const getDataByGeoCoordinates = async () => {
        const [lat, lon] = await getCurrentPosition();
        const [hourlyResponse, dailyResponse] = await Promise.all([
            weatherService.byGeoCoordinatesHourly(lat, lon),
            weatherService.byGeoCoordinatesDaily(lat, lon)
        ]);
        if (!hourlyResponse.ok) 
            setError(await hourlyResponse.json());
        if (!dailyResponse.ok) 
            setError(await dailyResponse.json());
        return await Promise.all([hourlyResponse.json(), dailyResponse.json()]);
    }

    useEffect(() => {
        (async function() {
            const [hourly, daily] = city ? await getDataByCityName(city) : await getDataByGeoCoordinates();
            setDataHourly(hourly);
            setDataDaily(daily);
        })()
    }, [city])

    if (error) {
        return <ErrorMessage message={error.message} />
    }

    if (dataHourly && dataDaily) {
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <h1>Детальный прогноз</h1>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-6">
                        <TempVariationSplineChart city={city} dataHourly={dataHourly} dataDaily={dataDaily} id="tempVariationSplineChart" />
                    </div>
                    <div className="col-md-6">
                        <TempVariationColumnChart city={city} dataHourly={dataHourly} dataDaily={dataDaily} id="tempVariationColumnChart" />
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-6">
                        <WindSpeedChart city={city} dataHourly={dataHourly} dataDaily={dataDaily} id="windSpeedChart" />
                    </div>
                    <div className="col-md-6">
                        <PrecipitationChart city={city} dataHourly={dataHourly} dataDaily={dataDaily} id="precipitationChart" />
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-6">
                        <PressureChart city={city} dataHourly={dataHourly} dataDaily={dataDaily} id="pressureChart" />
                    </div>
                    <div className="col-md-6">
                        <HumidityChart city={city} dataHourly={dataHourly} dataDaily={dataDaily} id="humidityChart" />
                    </div>
                </div>
            </div>
        );
    }
    
    return <Throbber />;
}

export default DetailsPage;