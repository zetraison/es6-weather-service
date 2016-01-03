import React                from 'react';
import Highcharts           from 'highcharts';
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
        
        Highcharts.chart("forecastChart", {
            chart: {
                zoomType: 'xy'
            },
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
            yAxis: [{
                labels: {
                    format: '{value}°C',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Температура',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, {
                title: {
                    text: 'Влажность',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value} %',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            legend: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: [{
                name: 'Влажность',
                type: 'column',
                yAxis: 1,
                data: this.state.list.map(el => el.main.humidity),
                tooltip: {
                    valueSuffix: ' %'
                }
    
            }, {
                name: 'Температура',
                type: 'spline',
                data: this.state.list.map(el => el.main.temp),
                tooltip: {
                    valueSuffix: '°C'
                }
            }]
        });
    }
    
    componentDidMount(){
        this.refreshData(this.renderChart.bind(this));
    }
    
    render(){
        return (
            <div id="forecastChart"></div>
        );
    }
}

export default ForecastChart;