import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
require('highcharts/modules/drilldown')(Highcharts);
import HC_more from 'highcharts/highcharts-more';
HC_more(Highcharts);
import {timestampToTime, timestampToDate} from '../../util';

const PrecipitationChart = (props) => {
    const {id, city, dataHourly, dataDaily} = props;

    const chartType = 'areaspline';
    const title = 'Осадки, 5 дней, ' + city;
    const subtitle = 'Источник: openWeatherMap.org';
    const unitSuffix = 'мм';
    const yAxisTitle = 'Осадки (' + unitSuffix + ')';
    const seriesName = 'Осадки';
    
    useEffect(() => {    
        const data = dataDaily.list
            .map(el => {
                return {
                    name: timestampToDate(el.dt),
                    y: el.snow ? el.snow : el.rain ? el.rain : null,
                    drilldown: (el.snow ? el.snow : el.rain ? el.rain : '').toString()
                };
            });
        const drilldownSeries = dataDaily.list.
            map(el => {    
                return {
                    id: (el.snow ? el.snow : el.rain ? el.rain : '').toString(),
                    name: seriesName + ', ' + timestampToDate(el.dt),
                    data: dataHourly.list
                        .filter(e => new Date(e.dt * 1000).getDate() <= new Date(el.dt * 1000).getDate())
                        .slice(-8)
                        .map(el => [timestampToDate(el.dt) + '<br>' + timestampToTime(el.dt), el.snow ? el.snow['3h'] : el.rain ? el.rain['3h'] : null])
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
        });
    })
    
    return (
        <div id={id}></div>
    );
}

export default PrecipitationChart;