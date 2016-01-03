import React                from 'react';
import Highcharts           from 'highcharts';
require('highcharts/highcharts-more')(Highcharts);
import {WEATHER_TYPES}      from 'components/weather/service';
import WeatherService       from 'components/weather/service';
import config               from 'config';
import {timestampToTime, timestampToDate} from 'util/util';

let weatherService = new WeatherService();

class ForecastChart extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            city: null,
            list: []
        };
    }
    
    refreshData(callback){
        
        let cityName = this.props.querySearch ? this.props.querySearch : config.defaultCity;
        let limit = 8;
        
        weatherService.byCityName(cityName, WEATHER_TYPES['FORECAST'], limit, response => {
            this.setState({ 
                city: response.city,
                list: response.list,
            });
            callback();
        });
    }
    
    renderChart(){
        
        let ranges = this.state.list.map(el => [el.main.temp_min, el.main.temp_max]);
        let average = this.state.list.map(el => parseFloat(((el.main.temp_min + el.main.temp_max) / 2).toFixed(2)));
        
        Highcharts.chart("TempCorrelationChart", {
            title: {
                text: 'Прогноз погоды почасовой в ' + this.state.city.name
            },
            
            subtitle: {
                text: 'Источник: Openweathermap.org'
            },
            
            xAxis: [{
                categories: this.state.list.map(el => timestampToTime(el.dt) + '<br>' + timestampToDate(el.dt)),
                crosshair: true
            }],
    
            yAxis: {
                title: {
                    text: null
                }
            },
    
            tooltip: {
                crosshairs: true,
                shared: true,
                valueSuffix: '°C'
            },
    
            series: [{
                name: 'Средняя температура',
                data: average,
                zIndex: 1,
                marker: {
                    fillColor: 'white',
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[0]
                }
            }, {
                name: 'Интервал',
                data: ranges,
                type: 'arearange',
                lineWidth: 0,
                linkedTo: ':previous',
                color: Highcharts.getOptions().colors[0],
                fillOpacity: 0.3,
                zIndex: 0
            }]
        });
    }
    
    componentDidMount(){
        this.refreshData(this.renderChart.bind(this));
    }
    
    render(){
        return (
            <div id="TempCorrelationChart"></div>
        );
    }
}

export default ForecastChart;