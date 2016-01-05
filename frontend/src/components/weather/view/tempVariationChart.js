import React                from 'react/lib/React';
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
        let categories = this.state.list.map(el => timestampToTime(el.dt) + '<br>' + timestampToDate(el.dt));
        
        Highcharts.chart("TempVariationChart", {
            chart: {
                type: 'columnrange',
                inverted: true
            },
    
            title: {
                text: 'Вариация температуры почасовая, ' + this.state.city.name
            },
    
            subtitle: {
                text: 'Источник: Openweathermap.org'
            },
    
            xAxis: {
                categories: categories,
            },
    
            yAxis: {
                title: {
                    text: 'Температура ( °C )'
                }
            },
    
            tooltip: {
                valueSuffix: '°C'
            },
    
            plotOptions: {
                columnrange: {
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return this.y + '°C';
                        }
                    }
                }
            },
    
            legend: {
                enabled: false
            },
    
            series: [{
                name: 'Температура',
                data: ranges
            }]
        });
    }
    
    componentDidMount(){
        this.refreshData(this.renderChart.bind(this));
    }
    
    render(){
        return (
            <div id="TempVariationChart"></div>
        );
    }
}

export default ForecastChart;