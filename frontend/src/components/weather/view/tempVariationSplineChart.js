import React                                        from 'react/lib/React';
import Highcharts                                   from 'highcharts';
import {timestampToTime, timestampToDate, roundTo}  from 'util';

class TempVariationSplineChart extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            id: props.id,
            city: props.city,
            data: props.data
        };
    }
    
    renderChart(){
        
        let chartType = 'arearange';
        let title = 'Вариация температуры почасовая, ' + this.state.city;
        let subtitle = 'Источник: Openweathermap.org';
        let unitSuffix = '°C';
        let yAxisTitle = 'Температура (' + unitSuffix + ')';
        let seriesName1 = 'Средняя температура';
        let seriesName2 = 'Интервал температуры';
        
        let data = this.state.data.map(el => [roundTo(el.main.temp_min, 1), roundTo(el.main.temp_max, 1)]);
        let average = this.state.data.map(el => (roundTo(el.main.temp_min, 1) + roundTo(el.main.temp_max, 1)) / 2);
        let categories = this.state.data.map(el => timestampToTime(el.dt) + '<br>' + timestampToDate(el.dt));
        
        Highcharts.chart(this.state.id, {
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
                    text: null
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true,
                valueSuffix: unitSuffix
            },
            series: [{
                name: seriesName1,
                data: average,
                zIndex: 1,
                marker: {
                    fillColor: 'white',
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[0]
                }
            }, {
                name: seriesName2,
                data: data,
                type: chartType,
                lineWidth: 0,
                linkedTo: ':previous',
                color: Highcharts.getOptions().colors[0],
                fillOpacity: 0.3,
                zIndex: 0
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

export default TempVariationSplineChart;