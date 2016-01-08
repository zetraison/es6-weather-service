import React                    from 'react/lib/React';
import WeatherService           from 'components/weather/service';
import {WEATHER_TYPES}          from 'components/weather/service';
import TempVariationColumnChart from 'components/weather/view/tempVariationColumnChart';
import TempVariationSplineChart from 'components/weather/view/tempVariationSplineChart';
import WindSpeedChart           from 'components/weather/view/windSpeedChart';
import PrecipitationChart       from 'components/weather/view/precipitationChart';
import Throbber                 from 'components/common/throbber';
import {getCurrentPosition}     from 'util';

let weatherService = new WeatherService();

class DetailWeatherView extends React.Component {
    
    constructor(props){
        super(props);
        let location = props.location;
        
        this.state = {
            city: location.query && location.query.q ? location.query.q : null,
            data: []
        };
    }
    
    refreshData(){
        
        let city = this.state.city;
        let type = WEATHER_TYPES['FORECAST_HOURLY'];
        let limit = 8;
        
        if (city) {
            weatherService.byCityName(city, type, limit, response => {
                this.setState({
                    data: response.list,
                    city: response.city.name
                });
            });
        } else {
            getCurrentPosition().then((coords) => {
                weatherService.byGeoCoord(coords[0], coords[1], type, limit, response => {
                    this.setState({
                        data: response.list,
                        city: response.city.name
                    });
                });
            });
        }
    }
    
    componentDidMount(){
        this.refreshData();
    }
    
    render(){
            
        let data = this.state.data;
        let city = this.state.city;
        
        if (data.length) {
            return (
                <div>
                    <div className="row">
                        <div className="col-lg-12">
                            <h2>Подробный прогноз</h2>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <TempVariationSplineChart city={city} data={data} id="tempVariationSplineChart" />
                        </div>
                        <div className="col-md-6">
                            <TempVariationColumnChart city={city} data={data} id="tempVariationColumnChart" />
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <WindSpeedChart city={city} data={data} id="windSpeedChart" />
                        </div>
                        <div className="col-md-6">
                            <PrecipitationChart city={city} data={data} id="precipitationChart" />
                        </div>
                    </div>
                </div>
            );
        }
        
        return <Throbber />;
    }
}

export default DetailWeatherView;