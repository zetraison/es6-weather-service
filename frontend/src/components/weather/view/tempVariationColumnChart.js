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
            data: props.data
        };
    }
    
    renderChart(){
        
        let chartType = 'columnrange';
        let title = 'Вариация температуры почасовая, ' + this.state.city;
        let subtitle = 'Источник: Openweathermap.org';
        let unitSuffix = '°C';
        let yAxisTitle = 'Температура (' + unitSuffix + ')';
        let seriesName = 'Температура';
        
        let data = this.state.data.map(el => [roundTo(el.main.temp_min, 1), roundTo(el.main.temp_max, 1)]);
        let categories = this.state.data.map(el => timestampToTime(el.dt) + '<br>' + timestampToDate(el.dt));
        
        Highcharts.chart(this.state.id, {
            chart: {
                type: chartType,
                inverted: true
            },
            title: {
                text: title
            },
            subtitle: {
                text: subtitle
            },
            xAxis: {
                categories: categories,
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
            legend: {
                enabled: true
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

export default TempVariationColumnChart;