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

class WindSpeedChart extends React.Component {
    
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
        
        let data = this.state.list.map(el => el.wind.speed);
        let categories = this.state.list.map(el => timestampToTime(el.dt) + '<br>' + timestampToDate(el.dt));
        
        Highcharts.chart(this.props.id, {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'Скорость ветра почасовая, ' + this.state.cityName
            },
            subtitle: {
                text: 'Источник: Openweathermap.org'
            },
            xAxis: [{
                categories: categories,
                crosshair: true
            }],
            yAxis: {
                title: {
                    text: 'Скорость ветра (м/с)'
                },
                minorGridLineWidth: 0,
                gridLineWidth: 0,
                alternateGridColor: null,
                plotBands: [{
                    from: 0.3,
                    to: 1.5,
                    color: 'rgba(68, 170, 213, 0.1)',
                    label: {
                        text: 'Тихий ветер',
                        style: {
                            color: '#606060'
                        }
                    }
                }, {
                    from: 1.5,
                    to: 3.3,
                    color: 'rgba(0, 0, 0, 0)',
                    label: {
                        text: 'Легкий ветер',
                        style: {
                            color: '#606060'
                        }
                    }
                }, {
                    from: 3.3,
                    to: 5.5,
                    color: 'rgba(68, 170, 213, 0.1)',
                    label: {
                        text: 'Слабый ветер',
                        style: {
                            color: '#606060'
                        }
                    }
                }, {
                    from: 5.5,
                    to: 8,
                    color: 'rgba(0, 0, 0, 0)',
                    label: {
                        text: 'Умеренный ветер',
                        style: {
                            color: '#606060'
                        }
                    }
                }, {
                    from: 8,
                    to: 11,
                    color: 'rgba(68, 170, 213, 0.1)',
                    label: {
                        text: 'Свежий ветер',
                        style: {
                            color: '#606060'
                        }
                    }
                }, {
                    from: 11,
                    to: 14,
                    color: 'rgba(0, 0, 0, 0)',
                    label: {
                        text: 'Сильный ветер',
                        style: {
                            color: '#606060'
                        }
                    }
                }, {
                    from: 14,
                    to: 15,
                    color: 'rgba(68, 170, 213, 0.1)',
                    label: {
                        text: 'Крепкий ветер',
                        style: {
                            color: '#606060'
                        }
                    }
                }]
            },
            tooltip: {
                valueSuffix: ' м/с'
            },
            plotOptions: {
                spline: {
                    lineWidth: 4,
                    states: {
                        hover: {
                            lineWidth: 5
                        }
                    },
                    marker: {
                        enabled: true
                    }
                }
            },
            series: [{
                name: 'Скорость ветра',
                data: data
    
            }],
            navigation: {
                menuItemStyle: {
                    fontSize: '10px'
                }
            }
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

export default WindSpeedChart;