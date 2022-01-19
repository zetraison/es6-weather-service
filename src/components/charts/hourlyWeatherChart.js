import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import NavTabs from '../navTabs';
import DayTabs from '../dayTabs';
import {
    timestampToTime, 
    timestampToDate, 
    buildIconUrl, 
    convertingHpaTomHg
} from '../../util';

const HourlyWeatherChart = (props) => {
    const {id, city, dataCurrent, dataHourly, dataDaily} = props;

    const [unitTabIndex, setUnitTabIndex] = useState(0);
    const [timestamp, setTimestamp] = useState(new Date().getTime() / 1000);
    
    const timeIntervalLimit = 8;

    const calcSunCoordinates = (dt) => {
        const d = new Date(dt * 1000);
        return (d.getHours() + d.getMinutes() / 60) * 8 / 24 - 0.5;
    }

    const tabs = ['Температура', 'Влажность', 'Давление', 'Ветер'];
    
    useEffect(() => {
        const today = new Date().getDate();
        const currentDay = new Date(timestamp * 1000).getDate();
        const isToday = today == currentDay;
    
        const title = 'Почасовой прогноз погоды на ' + timestampToDate(timestamp) + ', ' + city;
        const subtitle = 'Источник: OpenWeatherMap.org';
    
        const list = dataHourly.list
            .filter(el => new Date(el.dt * 1000).getDate() <= (isToday ? today + 1 : currentDay))
            .slice((isToday ? [0, timeIntervalLimit] : -timeIntervalLimit));
    
        const categories = list.map(el => timestampToTime(el.dt) + '<br>' + timestampToDate(el.dt));
        const units = [
            {
                name: 'Температура',
                label: 'Температура', 
                valueSuffix: "°C", 
                type: "spline", 
                data: list.map(el => {
                    return {
                        y: el.main.temp, 
                        marker: {
                            symbol: 'url(' + buildIconUrl(el.weather[0].icon) + ')'
                        }
                    };
                })
            },
            {
                name: 'Влажность',
                label: 'Влажность (%)', 
                valueSuffix: "%", 
                type: "spline", 
                data: list.map(el => el.main.humidity)
            },
            {
                name: 'Давление',
                label: 'Давление (мм рт.ст.)', 
                valueSuffix: " мм рт.ст.", 
                type: "spline", 
                data: list.map(el => convertingHpaTomHg(el.main.pressure))
            },
            {
                name: 'Ветер',
                label: 'Ветер (м/с)', 
                valueSuffix: " м/с", 
                type: "spline", 
                data: list.map(el => el.wind.speed)
            }
        ];
        const data = units[unitTabIndex].data;
        const label = units[unitTabIndex].label;
        const chartType = units[unitTabIndex].type;
        const unitSuffix = units[unitTabIndex].valueSuffix;
    
        const startDay = isToday ? -0.5 : 0;
        const endDay = isToday ? 7.5 : 0;
    
        const sunrise = isToday ? calcSunCoordinates(dataCurrent.sys.sunrise) : startDay;
        const sunset = isToday ? calcSunCoordinates(dataCurrent.sys.sunset) : endDay;
    
        const nowDt = new Date().getTime() / 1000;
        const current1 = isToday ? calcSunCoordinates(nowDt) : 0;
        const current2 = isToday ? calcSunCoordinates(nowDt) + 0.01 : 0;    

        Highcharts.chart(id, {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: title
            },
            subtitle: {
                text: subtitle
            },
            xAxis: [{
                categories: categories,
                plotBands: [{
                    from: startDay,
                    to: sunrise,
                    color: 'rgba(68, 170, 213, .1)',
                    label: {
                        text: 'Ночь',
                        style: {
                            color: '#606060'
                        }
                    }
                }, {
                    from: sunrise,
                    to: sunset,
                    color: 'rgba(255, 255, 20, .3)',
                    label: {
                        text: 'День',
                        style: {
                            color: '#606060'
                        }
                    }
                }, {
                    from: sunset,
                    to: endDay,
                    color: 'rgba(68, 170, 213, .1)',
                    label: {
                        text: 'Ночь',
                        style: {
                            color: '#606060'
                        }
                    }
                }, {
                    from: current1,
                    to: current2,
                    color: 'rgba(0, 0, 255, .8)',
                    label: {
                        text: '<br>Сейчас <br>' + timestampToTime(new Date().getTime() / 1000),
                        style: {
                            color: '#6060ff'
                        }
                    }
                }],
                crossHair: true
            }],
            yAxis: [{
                labels: {
                    format: '{value}' + unitSuffix,
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: label,
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }],
            tooltip: {
                shared: false
            },
            legend: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: [{
                name: label,
                type: chartType,
                data: data,
                tooltip: {
                    valueSuffix: unitSuffix
                }
            }]
        });
    })
    
    return (
        <div>
            <NavTabs 
                tabs={tabs} 
                onTabChange={setUnitTabIndex} 
            />
            <div id={id}></div>
            <DayTabs 
                data={dataDaily} 
                onTabChange={setTimestamp} 
            />
        </div>
    );
}

export default HourlyWeatherChart;
