import React                from 'react';
import Highcharts           from 'highcharts';
import {WEATHER_TYPES}      from 'components/weather/service';
import WeatherService       from 'components/weather/service';
import config               from 'config';
import {timestampToTime, timestampToDate} from 'util/util';

let weatherService = new WeatherService();
let FORECAST_DAYS_LIMIT = 5;
let TIME_INTERVAL_LIMIT = 8;

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

class Pagination extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            list: []
        };
    }
    
    refreshData(){
        
        let cityName = this.props.querySearch ? this.props.querySearch : config.defaultCity;
        let limit = FORECAST_DAYS_LIMIT;
        
        weatherService.byCityName(cityName, WEATHER_TYPES['FORECAST_DAILY'], limit, response => {
            this.setState({
                list: response.list
            });
        });
    }
    
    componentWillMount(){
        this.refreshData();
    }
    
    render(){
        
        let list = this.state.list.slice(0, FORECAST_DAYS_LIMIT);
        
        list[0] ? list[0].isFirst = true : null;
        
        let navs = list.map(el => {
            
            let src = (config.openWeatherMap.imgUrl + el.weather[0].icon + '.png');
            let pressure = Math.round(config.hpaTommHgCoeff * el.pressure);
            
            return (
                <li key={el.dt} data-dt={el.dt - 9 * 60 * 60} className={el.isFirst ? "active" : ""}><a href="#" onClick={this.props.onClick.bind(this)}> 
                    <p><img src={src} /></p>
                    <p>{timestampToDate(el.dt)}</p>
                    <p>{Math.round(el.temp.day)}° <span className="min-temp">{Math.round(el.temp.night)}°</span></p>
                    <p>{el.humidity}%</p>
                    <p>{pressure} мм рт.ст.</p>
                </a></li>
            );
        });
        
        return (
            <nav className="daily-weather">
                <ul className="pagination">{navs}</ul>
            </nav>
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
        let limit = TIME_INTERVAL_LIMIT * FORECAST_DAYS_LIMIT;
        
        weatherService.byCityName(cityName, WEATHER_TYPES['FORECAST'], limit, response => {
            this.setState({ 
                city: response.city,
                list: response.list,
            });
            callback();
        });
    }
    
    renderChart(unit, dt){
        
        unit = unit || 'temp';
        
        let c = new Date().getDate();
        let t = new Date(dt * 1000).getDate();
        t = !t || t == c ? c + 1 : t;
        
        let list = this.state.list.filter(el => {
            
            let d = new Date(el.dt * 1000).getDate();
            
            return d <= t;
        }).slice(-8);
        
        let units = {
            'temp': {
                label: 'Температура', 
                valueSuffix: "°C", 
                type: "spline", data: 
                list.map(el => el.main.temp)
            },
            'humidity': {
                label: 'Влажность', 
                valueSuffix: "%", 
                type: "column", 
                data: list.map(el => el.main.humidity)
            },
            'pressure': {
                label: 'Давление', 
                valueSuffix: " мм рт.ст.", 
                type: "spline", 
                data: list.map(el =>  Math.round(config.hpaTommHgCoeff * el.main.pressure))
            },
            'wind': {
                label: 'Ветер', 
                valueSuffix: " м/с", 
                type: "column", 
                data: list.map(el => el.wind.speed)
            }
        };
        
        let cityName = this.state.city.name;
        let categories = list.map(el => timestampToTime(el.dt) + '<br>' + timestampToDate(el.dt));
        let data = units[unit].data;
        let label = units[unit].label;
        let type = units[unit].type;
        let valueSuffix = units[unit].valueSuffix;
        
        Highcharts.chart("multiChart", {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Почасовой прогноз погоды, ' + cityName
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
        $(e.target).parent().addClass('active').siblings().removeClass('active');
        
        let index = e.target.getAttribute('data-type');
        let date = $('.daily-weather li.active').attr('data-dt');
        this.renderChart(index, date);
    }
    
    onPaginationChange(e) {
        $(e.target).closest("li").addClass('active').siblings().removeClass('active');
        
        let index = $('.nav-tabs li.active a').attr('data-type');
        let date = $(e.target).closest("li").attr('data-dt');
        this.renderChart(index, date);
    }
    
    componentDidMount(){
        this.refreshData(this.renderChart.bind(this));
    }
    
    render(){
        return (
            <div>
                <Navs onClick={this.onNavTabChange.bind(this)} />
                <div id="multiChart"></div>
                <Pagination onClick={this.onPaginationChange.bind(this)} />
            </div>
        );
    }
}

export default ForecastChart;