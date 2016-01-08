import React                                from 'react/lib/React';
import Highcharts                           from 'highcharts';
import {timestampToTime, timestampToDate}   from 'util';

class PrecipitationChart extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            id: props.id,
            city: props.city,
            data: props.data
        };
    }
    
    renderChart(){
        
        let chartType = 'areaspline';
        let title = 'Осадки, ' + this.state.city;
        let subtitle = 'Источник: Openweathermap.org';
        let unitSuffix = 'мм';
        let yAxisTitle = 'Осадки (' + unitSuffix + ')';
        let seriesName = 'Осадки';
        
        let data = this.state.data.map(el => el.snow ? el.snow['3h'] : el.rain ? el.rain['3h'] : null);
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
            xAxis: {
                categories: categories
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
                areaspline: {
                    fillOpacity: 0.5
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

export default PrecipitationChart;