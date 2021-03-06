import React                    from 'react/lib/React';
import Highcharts               from 'highcharts';
require('highcharts/modules/drilldown')(Highcharts);
import {timestampToTime, 
        timestampToDate, 
        convertingHpaTomHg}   from 'util';

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
        let title = 'Давление, 5 дней, ' + this.state.city;
        let subtitle = 'Источник: OpenWeatherMap.org';
        let unitSuffix = 'мм рт.ст.';
        let yAxisTitle = 'Давление (' + unitSuffix + ')';
        let seriesName = 'Давление';
        
        let data = this.state.dataDaily.map(el => {
            return {
                name: timestampToDate(el.dt),
                y: convertingHpaTomHg(el.pressure),
                drillDown: el.pressure.toString()
            };
        });
        let drillDownSeries = this.state.dataDaily.map(el => {
            
            let dataHourly = this.state.dataHourly.filter(e => new Date(e.dt * 1000).getDate() <= new Date(el.dt * 1000).getDate()).slice(-8);
            
            return {
                id: el.pressure.toString(),
                name: seriesName + ', ' + timestampToDate(el.dt),
                data: dataHourly.map(el => [timestampToDate(el.dt) + '<br>' + timestampToTime(el.dt), convertingHpaTomHg(el.main.pressure)])
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
            drillDown: {
                series: drillDownSeries
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