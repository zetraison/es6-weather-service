import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
require('highcharts/modules/drilldown')(Highcharts);
import {
    timestampToTime, 
    timestampToDate, 
    convertingHpaTomHg
} from '../../util';

const PrecipitationChart = (props) => {
    const {id, city, dataHourly, dataDaily} = props;

    const chartType = 'spline';
    const title = 'Давление, 5 дней, ' + city;
    const subtitle = 'Источник: OpenWeatherMap.org';
    const unitSuffix = 'мм рт.ст.';
    const yAxisTitle = 'Давление (' + unitSuffix + ')';
    const seriesName = 'Давление';
    
    useEffect(() => {        
        const data = dataDaily.list
            .map(el => {
                return {
                    name: timestampToDate(el.dt),
                    y: convertingHpaTomHg(el.pressure),
                    drillDown: el.pressure.toString()
                };
            });
        const drillDownSeries = dataDaily.list
            .map(el => {            
                return {
                    id: el.pressure.toString(),
                    name: seriesName + ', ' + timestampToDate(el.dt),
                    data: dataHourly.list
                        .filter(e => new Date(e.dt * 1000).getDate() <= new Date(el.dt * 1000).getDate())
                        .slice(-8)
                        .map(el => [timestampToDate(el.dt) + '<br>' + timestampToTime(el.dt), convertingHpaTomHg(el.main.pressure)])
                };
            });
        
        Highcharts.chart(id, {
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
    })
    
    return (
        <div id={id}></div>
    );
}

export default PrecipitationChart;