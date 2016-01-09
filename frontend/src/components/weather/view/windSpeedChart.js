import React                                from 'react/lib/React';
import Highcharts                           from 'highcharts';
require('highcharts/modules/drilldown')(Highcharts);
import {timestampToTime, timestampToDate}   from 'util';

class WindSpeedChart extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            id: props.id,
            city: props.city,
            dataHourly: props.dataHourly,
            dataDaily: props.dataDaily
        };
    }
    
    renderChart(){
        
        let chartType = 'spline';
        let title = 'Скорость ветра, 5 дней, ' + this.state.city;
        let subtitle = 'Источник: Openweathermap.org';
        let unitSuffix = 'м/с';
        let yAxisTitle = 'Скорость ветра (' + unitSuffix + ')';
        let seriesName = 'Скорость ветра';
        
        let data = this.state.dataDaily.map(el => {
            return {
                name: timestampToDate(el.dt),
                y: el.speed,
                drilldown: el.speed.toString()
            };
        });
        let drilldownSeries = this.state.dataDaily.map(el => {
            let dataHourly = this.state.dataHourly.filter(e => new Date(e.dt * 1000).getDate() <= new Date(el.dt * 1000).getDate()).slice(-8);
            
            return {
                id: el.speed.toString(),
                name: seriesName + ', ' + timestampToDate(el.dt),
                data: dataHourly.map(el => [timestampToDate(el.dt) + '<br>' + timestampToTime(el.dt), el.wind.speed])
            };
        });
        
        Highcharts.chart(this.state.id, {
            chart: {
                type: chartType
            },
            title: {
                text: title
            },
            subtitle: {
                text: subtitle
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: yAxisTitle
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
                valueSuffix: ' ' + unitSuffix
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
                name: seriesName,
                data: data
    
            }],
            drilldown: {
                series: drilldownSeries
            }
        });
    }
    
    componentDidMount(){
        this.renderChart();
    }
    
    render(){
        return (
            <div id={this.state.id}></div>
        );
    }
}

export default WindSpeedChart;