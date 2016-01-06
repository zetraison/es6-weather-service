import React                    from 'react/lib/React';
import ForecastChart            from 'components/weather/view/forecastChart';
import ForecastDailyChart       from 'components/weather/view/forecastDailyChart';
import TempVariationColumnChart from 'components/weather/view/tempVariationColumnChart';
import TempVariationSplineChart from 'components/weather/view/tempVariationSplineChart';
import WindSpeedChart           from 'components/weather/view/windSpeedChart';
import PrecipitationChart       from 'components/weather/view/precipitationChart';


class DetailWeatherView extends React.Component {
    
    render(){
        
        let location = this.props.location;
        let querySearch = location.query && location.query.q ? location.query.q : '';
        
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="page-header">Погода</h1>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-6 portfolio-item">
                        <TempVariationSplineChart id="tempVariationSplineChart" querySearch={querySearch} />
                    </div>
                    <div className="col-md-6 portfolio-item">
                        <TempVariationColumnChart id="tempVariationColumnChart" querySearch={querySearch} />
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-6 portfolio-item">
                        <WindSpeedChart id="windSpeedChart" querySearch={querySearch} />
                    </div>
                    <div className="col-md-6 portfolio-item">
                        <PrecipitationChart id="precipitationChart" querySearch={querySearch} />
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-6 portfolio-item">
                        <ForecastChart querySearch={querySearch} />
                        <h3><a href="/by-time">По часам</a></h3>
                        <p>График температуры и влажности с интервалом 3 часа</p>
                    </div>
                    <div className="col-md-6 portfolio-item">
                        <ForecastDailyChart querySearch={querySearch} />
                        <h3><a href="/by-days">По дням</a></h3>
                        <p>График температуры и влажности на ближайшие 10 дней</p>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default DetailWeatherView;