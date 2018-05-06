import React                    from 'react/lib/React';
import WeatherService           from 'components/weather/service';
import {WEATHER_TYPES}          from 'components/weather/service';
import CurrentWeather           from 'components/weather/view/currentWeather';
import MultiChart               from 'components/weather/view/multiChart';
import Throbber                 from 'components/common/throbber';
import {getCurrentPosition}     from 'util';

let weatherService = new WeatherService();

class WeatherView extends React.Component {
    
    constructor(props){
        super(props);
        let location = props.location;
        
        this.state = {
            city: location.query && location.query.q ? location.query.q : null,
            dataHourly: [],
            dataDaily: [],
            dataCurrent: []
        };
    }
    
    refreshData(){
        
        let city = this.state.city;
        let limitCurrent = 1;
        let limitHourly = 40;
        let limitDaily = 6;
        
        if (city) {
            weatherService.byCityName(city, WEATHER_TYPES['CURRENT'], limitCurrent, response => {
                this.setState({
                    dataCurrent: response,
                    city: response.name
                });
                
                weatherService.byCityName(city, WEATHER_TYPES['FORECAST_HOURLY'], limitHourly, response => {
                    this.setState({
                        dataHourly: response.list
                    });
                    
                    weatherService.byCityName(city, WEATHER_TYPES['FORECAST_DAILY'], limitDaily, response => {
                        this.setState({
                            dataDaily: response.list.filter(el => new Date(el.dt * 1000).getDate() >= new Date().getDate())
                        });
                    });
                });
            });
        } else {
            getCurrentPosition().then((Coordinates) => {
                weatherService.byGeoCoordinates(Coordinates[0], Coordinates[1], WEATHER_TYPES['CURRENT'], limitCurrent, response => {
                    this.setState({
                        dataCurrent: response,
                        city: response.name
                    });
                    
                    weatherService.byGeoCoordinates(Coordinates[0], Coordinates[1], WEATHER_TYPES['FORECAST_HOURLY'], limitHourly, response => {
                        this.setState({
                            dataHourly: response.list
                        });
                        
                        weatherService.byGeoCoordinates(Coordinates[0], Coordinates[1], WEATHER_TYPES['FORECAST_DAILY'], limitDaily, response => {
                            this.setState({
                                dataDaily: response.list.filter(el => new Date(el.dt * 1000).getDate() >= new Date().getDate())
                            });
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
        let dataCurrent = this.state.dataCurrent;
        let dataHourly = this.state.dataHourly;
        let dataDaily = this.state.dataDaily;
        
        if (dataCurrent && dataHourly.length && dataDaily.length) {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-12">
                            <CurrentWeather city={city} data={dataCurrent} />
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-12">
                            <MultiChart city={city} dataCurrent={dataCurrent} dataDaily={dataDaily} dataHourly={dataHourly} id="multiChart" />
                        </div>
                    </div>
                </div>
            );
        }
        
        return <Throbber />;
    }
}

export default WeatherView;