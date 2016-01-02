import React                from 'react';
import Highcharts           from 'highcharts';
import {WEATHER_TYPES}      from 'components/weather/service';
import WeatherService       from 'components/weather/service';
import config               from 'config';
import {timestampToTime, timestampToDate} from 'util/util';

let weatherService = new WeatherService();

class Navs extends React.Component {
    
    render(){
        return (
            <ul className="nav nav-tabs">
                <li className="active"><a href="#" data-type="temp" onClick={this.props.onClick}>Температура</a></li>
                <li><a href="#" data-type="humidity" onClick={this.props.onClick}>Влажность</a></li>
                <li><a href="#" data-type="pressure" onClick={this.props.onClick}>Давление</a></li>
                <li><a href="#" data-type="wind" onClick={this.props.onClick}>Ветер</a></li>
            </ul>
        );
    }
}

class ForecastChart extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            city: null,
            list: []
        };
    }
    
    refreshData(callback){
        
        let cityName = this.props.querySearch ? this.props.querySearch : config.defaultCity;
        
        weatherService.byCityName(cityName, WEATHER_TYPES['FORECAST'], response => {
            this.setState({ 
                city: response.city,
                list: response.list,
            });
            callback();
        });
    }
    
    renderChart(index){
        
        index = index || 'temp';
        
        let indexes = {
            'temp': {
                label: 'Температура', 
                valueSuffix: "°C", 
                type: "spline", data: 
                this.state.list.map(el => el.main.temp)
            },
            'humidity': {
                label: 'Влажность', 
                valueSuffix: "%", 
                type: "column", 
                data: this.state.list.map(el => el.main.humidity)
            },
            'pressure': {
                label: 'Давление', 
                valueSuffix: " мм рт.ст.", 
                type: "spline", 
                data: this.state.list.map(el =>  Math.round(config.hpaTommHgCoeff * el.main.pressure))
            },
            'wind': {
                label: 'Ветер', 
                valueSuffix: " м/с", 
                type: "column", 
                data: this.state.list.map(el => el.wind.speed)
            }
        };
        
        let cityName = this.state.city.name;
        let categories = this.state.list.map(el => timestampToTime(el.dt) + '<br>' + timestampToDate(el.dt));
        let data = indexes[index].data;
        let label = indexes[index].label;
        let type = indexes[index].type;
        let valueSuffix = indexes[index].valueSuffix;
        
        Highcharts.chart("multiChart", {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Прогноз погоды почасовой в ' + cityName
            },
            subtitle: {
                text: 'Source: Openweathermap.org'
            },
            xAxis: [{
                categories: categories,
                crosshair: true
            }],
            yAxis: [{
                labels: {
                    format: '{value}' + valueSuffix,
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
                type: type,
                data: data,
                tooltip: {
                    valueSuffix: valueSuffix
                }
            }]
        });
    }
    
    onNavTabChange(e){
        let index = e.target.getAttribute('data-type');
        $(e.target).parent().addClass('active').siblings().removeClass('active');
        
        this.renderChart(index);
    }
    
    componentDidMount(){
        this.refreshData(this.renderChart.bind(this));
    }
    
    render(){
        return (
            <div>
                <Navs onClick={this.onNavTabChange.bind(this)} />
                <div id="multiChart"></div>
            </div>
        );
    }
}

export default ForecastChart;