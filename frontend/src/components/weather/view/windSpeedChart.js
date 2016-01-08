import React                                from 'react/lib/React';
import Highcharts                           from 'highcharts';
import {timestampToTime, timestampToDate}   from 'util';

class WindSpeedChart extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            id: props.id,
            city: props.city,
            data: props.data
        };
    }
    
    renderChart(){
        
        let chartType = 'spline';
        let title = 'Скорость ветра почасовая, ' + this.state.city;
        let subtitle = 'Источник: Openweathermap.org';
        let unitSuffix = 'м/с';
        let yAxisTitle = 'Скорость ветра (' + unitSuffix + ')';
        let seriesName = 'Скорость ветра';
        
        let data = this.state.data.map(el => el.wind.speed);
        let categories = this.state.data.map(el => timestampToTime(el.dt) + '<br>' + timestampToDate(el.dt));
        
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
            xAxis: [{
                categories: categories,
                crosshair: true
            }],
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
    
            }]
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