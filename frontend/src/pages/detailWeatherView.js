import React                    from 'react/lib/React';
import WeatherService           from 'components/weather/service';
import {WEATHER_TYPES}          from 'components/weather/service';
import TempVariationColumnChart from 'components/weather/view/tempVariationColumnChart';
import TempVariationSplineChart from 'components/weather/view/tempVariationSplineChart';
import WindSpeedChart           from 'components/weather/view/windSpeedChart';
import PrecipitationChart       from 'components/weather/view/precipitationChart';
import PressureChart            from 'components/weather/view/pressureChart';
import HumidityChart            from 'components/weather/view/humidityChart';
import Throbber                 from 'components/common/throbber';
import {getCurrentPosition}     from 'util';

let weatherService = new WeatherService();

class DetailWeatherView extends React.Component {
    
    constructor(props){
        super(props);
        let location = props.location;
        
        this.state = {
            city: location.query && location.query.q ? location.query.q : null,
            dataHourly: [],
            dataDaily: []
        };
    }
    
    refreshData(){
        
        let city = this.state.city;
        let limitDaily = 5;
        let limitHourly = 40;
        
        if (city) {
            weatherService.byCityName(city, WEATHER_TYPES['FORECAST_HOURLY'], limitHourly, response => {
                this.setState({
                    dataHourly: response.list,
                    city: response.city.name
                });
                
                weatherService.byCityName(city, WEATHER_TYPES['FORECAST_DAILY'], limitDaily, response => {
                    this.setState({
                        dataDaily: response.list
                    });
                });
            });
        } else {
            getCurrentPosition().then((Coordinates) => {
                weatherService.byGeoCoordinates(Coordinates[0], Coordinates[1], WEATHER_TYPES['FORECAST_HOURLY'], limitHourly, response => {
                    this.setState({
                        dataHourly: response.list,
                        city: response.city.name
                    });
                    
                    weatherService.byGeoCoordinates(Coordinates[0], Coordinates[1], WEATHER_TYPES['FORECAST_DAILY'], limitDaily, response => {
                        this.setState({
                            dataDaily: response.list
                        });
                    });
                });
            });
        }
    }
    
    componentDidMount(){
        this.refreshData();
    }
    
    render(){
            
        let city = this.state.city;
        let dataHourly = this.state.dataHourly;
        let dataDaily = this.state.dataDaily;
        
        if (dataHourly.length && dataDaily.length) {
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
}

export default DetailWeatherView;