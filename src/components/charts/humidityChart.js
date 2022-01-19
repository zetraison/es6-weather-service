import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
require('highcharts/modules/drilldown')(Highcharts);
import {timestampToTime, timestampToDate} from '../../util';

const HumidityChart = (props) => {
    const {id, city, dataHourly, dataDaily} = props;

    const chartType = 'spline';
    const title = 'Влажность, 5 дней, ' + city;
    const subtitle = 'Источник: OpenWeatherMap.org';
    const unitSuffix = '%';
    const yAxisTitle = 'Влажность (' + unitSuffix + ')';
    const seriesName = 'Влажность';

    useEffect(() => {
        const data = dataDaily.list
            .map(el => {
                return {
                    name: timestampToDate(el.dt),
                    y: el.humidity,
                    drilldown: el.humidity.toString()
                };
            });
        const drilldownSeries = dataDaily.list
            .map(el => {
                return {
                    id: el.humidity.toString(),
                    name: seriesName + ', ' + timestampToDate(el.dt),
                    data: dataHourly.list
                        .filter(e => new Date(e.dt * 1000).getDate() <= new Date(el.dt * 1000).getDate())
                        .slice(-8)
                        .map(el => [timestampToDate(el.dt) + '<br>' + timestampToTime(el.dt), el.main.humidity])
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
            drilldown: {
                series: drilldownSeries
            }
        })
    })
    
    return (
        <div id={id}></div>
    );
}

export default HumidityChart;