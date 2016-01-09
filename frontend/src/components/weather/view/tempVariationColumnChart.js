import React                                        from 'react/lib/React';
import Highcharts                                   from 'highcharts';
import {timestampToTime, timestampToDate, roundTo}  from 'util';
require('highcharts/highcharts-more')(Highcharts);

class TempVariationColumnChart extends React.Component {
    
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
        
        let title = 'Вариация температуры, 5 дней, ' + this.state.city;
        let subtitle = 'Источник: Openweathermap.org';
        let unitSuffix = '°C';
        let yAxisTitle = 'Температура (' + unitSuffix + ')';
        let seriesName1 = 'Средняя температура';
        let seriesName2 = 'Диапазон температур';
        
        let data = this.state.dataDaily.map(el => [timestampToDate(el.dt), roundTo(el.temp.min, 1), roundTo(el.temp.max, 1)]);
        let average = this.state.dataDaily.map(el => {
            return {
                name: timestampToDate(el.dt),
                y: roundTo((roundTo(el.temp.min, 1) + roundTo(el.temp.max, 1)) / 2, 1),
                drilldown: el.temp.day.toString()
            };
        });
        let drilldownSeries = this.state.dataDaily.map(el => {
            let dataHourly = this.state.dataHourly.filter(e => new Date(e.dt * 1000).getDate() <= new Date(el.dt * 1000).getDate()).slice(-8);
            
            return {
                id: el.temp.day.toString(),
                name: seriesName1 + ', ' + timestampToDate(el.dt),
                plotOptions: {
                    spline: {
                        dataLabels: {
                            enabled: true,
                            formatter: function () {
                                return this.y + unitSuffix;
                            }
                        }
                    }
                },
                data: dataHourly.map(el => [timestampToDate(el.dt) + '<br>' + timestampToTime(el.dt), roundTo(el.main.temp_min, 1), roundTo(el.main.temp_max, 1)])
            };
        });
        
        Highcharts.chart(this.state.id, {
            chart: {
                inverted: true
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
                }
            },
            tooltip: {
                valueSuffix: unitSuffix
            },
            plotOptions: {
                columnrange: {
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return this.y + unitSuffix;
                        }
                    }
                }
            },
            series: [{
                name: seriesName1,
                data: average,
                type: 'spline',
                zIndex: 1,
                marker: {
                    fillColor: 'white',
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[0]
                }
            }, {
                name: seriesName2,
                data: data,
                type: 'columnrange',
                color: Highcharts.getOptions().colors[0],
                zIndex: 0
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

export default TempVariationColumnChart;