import React                                from 'react/lib/React';
import Highcharts                           from 'highcharts';
require('highcharts/modules/drilldown')(Highcharts);
import {timestampToTime, timestampToDate}   from 'util';

class PrecipitationChart extends React.Component {
    
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
        let title = 'Влажность, 5 дней, ' + this.state.city;
        let subtitle = 'Источник: OpenWeatherMap.org';
        let unitSuffix = '%';
        let yAxisTitle = 'Влажность (' + unitSuffix + ')';
        let seriesName = 'Влажность';
        
        let data = this.state.dataDaily.map(el => {
            return {
                name: timestampToDate(el.dt),
                y: el.humidity,
                drilldown: el.humidity.toString()
            };
        });
        let drilldownSeries = this.state.dataDaily.map(el => {
            
            let dataHourly = this.state.dataHourly.filter(e => new Date(e.dt * 1000).getDate() <= new Date(el.dt * 1000).getDate()).slice(-8);
            
            return {
                id: el.humidity.toString(),
                name: seriesName + ', ' + timestampToDate(el.dt),
                data: dataHourly.map(el => [timestampToDate(el.dt) + '<br>' + timestampToTime(el.dt), el.main.humidity])
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
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' ' + unitSuffix
            },
            credits: {
                enabled: true
            },
            plotOptions: {
                areaSpline: {
                    fillOpacity: 0.5
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

export default PrecipitationChart;