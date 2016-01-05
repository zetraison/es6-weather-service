import React                from 'react/lib/React';
import Tab                  from 'react-bootstrap/lib/Tab';
import Tabs                 from 'react-bootstrap/lib/Tabs';
import Nav                  from 'react-bootstrap/lib/Nav';
import NavItem              from 'react-bootstrap/lib/NavItem';
import Highcharts           from 'highcharts';
import {WEATHER_TYPES}      from 'components/weather/service';
import WeatherService       from 'components/weather/service';
import config               from 'config';
import {timestampToTime, 
        timestampToDate, 
        buildIconUrl, 
        convertingHpaTommHg} from 'util/util';

let weatherService = new WeatherService();

let FORECAST_DAYS_LIMIT = 5;
let TIME_INTERVAL_LIMIT = 8;

let TAB_INDEX = {
    0: 'temp',
    1: 'humidity',
    2: 'pressure',
    3: 'wind'
};

class UnitTabs extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            key: 0
        };
    }
    
    handleSelect(key) {
        this.setState({key});
        this.props.handleSelect(key);
    }
    
    render(){
        return (
            <Tabs activeKey={this.state.key} onSelect={this.handleSelect.bind(this)}>
                <Tab eventKey={0} title="Температура"></Tab>
                <Tab eventKey={1} title="Влажность"></Tab>
                <Tab eventKey={2} title="Давление"></Tab>
                <Tab eventKey={3} title="Ветер"></Tab>
            </Tabs>
        );
    }
}

class DayNavs extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            key: 0,
            list: []
        };
    }
    
    handleSelect(key) {
        this.setState({key: key});
        this.props.handleSelect(this.state.list[key].dt);
    }
    
    refreshData(){
        
        let cityName = this.props.querySearch ? this.props.querySearch : config.defaultCity;
        let limit = FORECAST_DAYS_LIMIT + 1;
        
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
        let list = this.state.list.filter(el => new Date(el.dt * 1000).getDate() >= new Date().getDate()).slice(0, FORECAST_DAYS_LIMIT);
        
        let navs = list.map((el, index) => {
            
            let src = buildIconUrl(el.weather[0].icon);
            let day = timestampToDate(el.dt);
            let temp = (<p>{Math.round(el.temp.day)}° <span className="min-temp">{Math.round(el.temp.night)}°</span></p>);
            let pressure = convertingHpaTommHg(el.pressure);
            
            return (
                <NavItem eventKey={index} key={index}>
                    <p><img src={src} /></p>
                    <p>{day}</p>
                    {temp}
                    <p>{el.humidity}%</p>
                    <p>{pressure} мм рт.ст.</p>
                </NavItem>
            );
        });
        
        return (
            <Nav bsStyle="pills" activeKey={this.state.key} onSelect={this.handleSelect.bind(this)}>
                {navs}
            </Nav>
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
        
        let list = this.state.list.filter(el => {
            
            let d = new Date(el.dt * 1000).getDate();
            
            return d <= (!t || t == c ? c + 1 : t);
        });
        
        list = !t || t == c ? list.slice(0, TIME_INTERVAL_LIMIT) : list.slice(-TIME_INTERVAL_LIMIT);
        
        let units = {
            'temp': {
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
                data: list.map(el => convertingHpaTommHg(el.main.pressure))
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
        
        Highcharts.chart(this.props.id, {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Почасовой прогноз погоды, ' + cityName
            },
            subtitle: {
                text: 'Источник: Openweathermap.org'
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
    
    handleSelectUnits(key){
        let index = this.refs["DayNavs"].state.key;
        let date = this.refs["DayNavs"].state.list[index].dt;
        this.renderChart(TAB_INDEX[key], date);
    }
    
    handleSelectDays(date) {
        let key = this.refs["TabsUnits"].state.key;
        this.renderChart(TAB_INDEX[key], date);
    }
    
    componentDidMount(){
        this.refreshData(this.renderChart.bind(this));
    }
    
    render(){
        return (
            <div>
                <UnitTabs ref="TabsUnits" handleSelect={this.handleSelectUnits.bind(this)} />
                <div id={this.props.id}></div>
                <DayNavs ref="DayNavs" handleSelect={this.handleSelectDays.bind(this)} />
            </div>
        );
    }
}

export default ForecastChart;