import React                from 'react/lib/React';
import Highcharts           from 'highcharts';
require('highcharts/highcharts-more')(Highcharts);
import {WEATHER_TYPES}      from 'components/weather/service';
import WeatherService       from 'components/weather/service';
import config               from 'config';
import {timestampToTime, 
        timestampToDate, 
        getCurrentPosition} from 'util/util';

let weatherService = new WeatherService();

class PrecipitationChart extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            cityName: props.querySearch,
            list: []
        };
    }
    
    refreshData(callback){
        
        let limit = 8;
        
        if (this.state.cityName) {
            weatherService.byCityName(this.state.cityName, WEATHER_TYPES['FORECAST'], limit, response => {
                this.setState({
                    list: response.list,
                    cityName: response.city.name
                });
                callback();
            });
        } else {
            getCurrentPosition().then((coords) => {
                weatherService.byGeoCoord(coords[0], coords[1], WEATHER_TYPES['FORECAST'], limit, response => {
                    this.setState({
                        list: response.list,
                        cityName: response.city.name
                    });
                    callback();
                });
            });
        }
    }
    
    renderChart(){
        
        let data = this.state.list.map(el => el.snow['3h'] * 1000);
        let categories = this.state.list.map(el => timestampToTime(el.dt) + '<br>' + timestampToDate(el.dt));
        
        Highcharts.chart(this.props.id, {
            chart: {
                type: 'areaspline'
            },
            title: {
                text: 'Осадки, ' + this.state.cityName
            },
            subtitle: {
                text: 'Источник: Openweathermap.org'
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: 'Осадки (мм)'
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' мм'
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: [{
                name: 'Осадки',
                data: data
            }]
        });
    }
    
    componentDidMount(){
        this.refreshData(this.renderChart.bind(this));
    }
    
    render(){
        return (
            <div id={this.props.id}></div>
        );
    }
}

export default PrecipitationChart;