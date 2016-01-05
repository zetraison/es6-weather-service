import React                from 'react/lib/React';
import Highcharts           from 'highcharts';
import {WEATHER_TYPES}      from 'components/weather/service';
import WeatherService       from 'components/weather/service';
import {timestampToDate}    from 'util/util';
import config               from 'config';


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
        
        weatherService.byCityName(cityName, WEATHER_TYPES['FORECAST_DAILY'], limit, response => {
            this.setState({ 
                city: response.city,
                list: response.list,
            });
            callback();
        });
    }
    
    renderChart(){
        
        Highcharts.chart("forecastDailyChart", {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Прогноз погоды на 10 дней в ' + this.state.city.name
            },
            subtitle: {
                text: 'Источник: Openweathermap.org'
            },
            xAxis: [{
                categories: this.state.list.map(el => timestampToDate(el.dt)),
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
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor)// || '#FFFFFF'
            },
            series: [{
                name: 'Влажность',
                type: 'column',
                yAxis: 1,
                data: this.state.list.map(el => el.humidity),
                tooltip: {
                    valueSuffix: ' %'
                }
    
            }, {
                name: 'Температура',
                type: 'spline',
                data: this.state.list.map(el => el.temp.day),
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
            <div id="forecastDailyChart"></div>
        );
    }
}

export default ForecastChart;