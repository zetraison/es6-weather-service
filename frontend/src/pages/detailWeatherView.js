import React                    from 'react/lib/React';
import ForecastChart            from 'components/weather/view/forecastChart';
import ForecastDailyChart       from 'components/weather/view/forecastDailyChart';
import TempCorrelationChart     from 'components/weather/view/tempCorrelationChart';
import TempVariationChart     from 'components/weather/view/tempVariationChart';


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
                        <TempCorrelationChart querySearch={querySearch} />
                        <h3><a href="/by-time">По часам</a></h3>
                        <p>График вариации температуры по часам</p>
                    </div>
                    <div className="col-md-6 portfolio-item">
                        <TempVariationChart querySearch={querySearch} />
                        <h3><a href="/by-time">По часам</a></h3>
                        <p>График вариации температуры по часам</p>
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