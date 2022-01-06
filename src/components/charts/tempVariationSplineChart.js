import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
HC_more(Highcharts);
import { timestampToTime, timestampToDate, roundTo } from '../../util';

const TempVariationSplineChart = (props) => {
    const {id, city, dataHourly, dataDaily} = props;

    const title = 'Вариация температуры, 5 дней, ' + city;
    const subtitle = 'Источник: OpenWeatherMap.org';
    const unitSuffix = '°C';
    const yAxisTitle = 'Температура (' + unitSuffix + ')';
    const seriesName1 = 'Средняя температура';
    const seriesName2 = 'Диапазон температур';
    
    useEffect(() => {
        const data = dataDaily.list
            .map(el => [timestampToDate(el.dt), roundTo(el.temp.min, 1), roundTo(el.temp.max, 1)]);
        const average = dataDaily.list
            .map(el => {
                return {
                    name: timestampToDate(el.dt),
                    y: roundTo((roundTo(el.temp.min, 1) + roundTo(el.temp.max, 1)) / 2, 1),
                    drilldown: el.temp.day.toString()
                };
            });
        const drilldownSeries = dataDaily.list
            .map(el => {
                return {
                    id: el.temp.day.toString(),
                    name: seriesName1 + ', ' + timestampToDate(el.dt),
                    data: dataHourly.list
                        .filter(e => new Date(e.dt * 1000).getDate() <= new Date(el.dt * 1000).getDate())
                        .slice(-8)
                        .map(el => [timestampToDate(el.dt) + '<br>' + timestampToTime(el.dt), (roundTo(el.main.temp_min, 1) + roundTo(el.main.temp_max, 1)) / 2])
                };
            });
        
        Highcharts.chart(id, {
            chart: {
                inverted: true
            },
            title: {
                text: title
            },
            subtitle: {
                text: subtitle
            },
            xAxis: [{
                type: 'category'
            }],
            yAxis: {
                title: {
                    text: yAxisTitle
                }
            },
            tooltip: {
                valueSuffix: unitSuffix
            },
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
                type: 'arearange',
                lineWidth: 0,
                linkedTo: ':previous',
                color: Highcharts.getOptions().colors[0],
                fillOpacity: 0.3,
                zIndex: 0
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

export default TempVariationSplineChart;