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

class tempVariationSplineChart extends React.Component {
    
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
        
        let ranges = this.state.list.map(el => [el.main.temp_min, el.main.temp_max]);
        let average = this.state.list.map(el => parseFloat(((el.main.temp_min + el.main.temp_max) / 2).toFixed(2)));
        
        Highcharts.chart(this.props.id, {
            title: {
                text: 'Вариация температуры почасовая, ' + this.state.cityName
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
            <div id={this.props.id}></div>
        );
    }
}

export default tempVariationSplineChart;