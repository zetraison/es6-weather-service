import React                    from 'react';
import CurrentWeather           from 'components/weather/view/currentWeather';
import MultiChart               from 'components/weather/view/multiChart';


class WeatherView extends React.Component {
    
    render(){
        
        let location = this.props.location;
        let querySearch = location.query && location.query.q ? location.query.q : '';
        
        return (
            <div>
                <div className="row">
                    <CurrentWeather querySearch={querySearch} />
                </div>
                <div className="row">
                    <div className="col-md-12 portfolio-item">
                        <MultiChart querySearch={querySearch} />
                    </div>
                </div>
            </div>
        );
    }
}

export default WeatherView;