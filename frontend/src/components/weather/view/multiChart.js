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
        convertingHpaTommHg,
        getCurrentPosition} from 'util/util';

let weatherService = new WeatherService();

let FORECAST_DAYS_LIMIT = 5;
let TIME_INTERVAL_LIMIT = 8;

let TAB_INDEX = {
    0: 'temp',
    1: 'humidity',
    2: 'pressure',
    3: 'wind',
    4: 'precipitation'
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
                <Tab eventKey={4} title="Осадки"></Tab>
            </Tabs>
        );
    }
}

class DayNavs extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            key: 0,
            list: [],
            cityName: props.querySearch
        };
    }
    
    handleSelect(key) {
        this.setState({key: key});
        this.props.handleSelect(this.state.list[key].dt);
    }
    
    refreshData(){
        
        let limit = FORECAST_DAYS_LIMIT + 1;
        
        if (this.state.cityName) {
            weatherService.byCityName(this.state.cityName, WEATHER_TYPES['FORECAST_DAILY'], limit, response => {
                this.setState({
                    list: response.list.filter(el => new Date(el.dt * 1000).getDate() >= new Date().getDate()),
                    cityName: response.city.name
                });
            });
        } else {
            getCurrentPosition().then((coords) => {
                weatherService.byGeoCoord(coords[0], coords[1], WEATHER_TYPES['FORECAST_DAILY'], limit, response => {
                    this.setState({
                        list: response.list.filter(el => new Date(el.dt * 1000).getDate() >= new Date().getDate()),
                        cityName: response.city.name
                    });
                });
            });
        }
    }
    
    componentWillMount(){
        this.refreshData();
    }
    
    render(){
        let list = this.state.list.slice(0, FORECAST_DAYS_LIMIT);
        
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
            list: [],
            cityName: props.querySearch,
            sys: null
        };
    }
    
    refreshData(callback){
        
        let limit = TIME_INTERVAL_LIMIT * FORECAST_DAYS_LIMIT;
        
        if (this.state.cityName) {
            weatherService.byCityName(this.state.cityName, WEATHER_TYPES['FORECAST'], limit, response => {
                this.setState({
                    cityName: response.city.name,
                    list: response.list
                });
                
                weatherService.byCityName(this.state.cityName, WEATHER_TYPES['CURRENT'], null, response => {
                    this.setState({
                        sys: response.sys
                    });
                    callback();
                });
            
            });
        } else {
            getCurrentPosition().then((coords) => {
                weatherService.byGeoCoord(coords[0], coords[1], WEATHER_TYPES['FORECAST'], limit, response => {
                    this.setState({
                        cityName: response.city.name,
                        list: response.list
                    });
                    
                    weatherService.byGeoCoord(coords[0], coords[1], WEATHER_TYPES['CURRENT'], null, response => {
                        this.setState({
                            sys: response.sys
                        });
                        callback();
                    });
                });
            });
        }
    }
    
    calcSunCoord(dt) {
        let d = new Date(dt * 1000);
        return (d.getHours() + d.getMinutes() / 60) * 8 / 24 - 0.5;
    }
    
    renderChart(unit, dt){
        
        unit = unit || 'temp';
        
        let c = new Date().getDate();
        let t = new Date(dt * 1000).getDate() || c;
        
        let list = this.state.list.filter(el => {
            
            let d = new Date(el.dt * 1000).getDate();
            
            return d <= (t == c ? c + 1 : t);
        });
        
        list = t == c ? list.slice(0, TIME_INTERVAL_LIMIT) : list.slice(-TIME_INTERVAL_LIMIT);
        
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
                label: 'Влажность (%)', 
                valueSuffix: "%", 
                type: "spline", 
                data: list.map(el => el.main.humidity)
            },
            'pressure': {
                label: 'Давление (мм рт.ст.)', 
                valueSuffix: " мм рт.ст.", 
                type: "spline", 
                data: list.map(el => convertingHpaTommHg(el.main.pressure))
            },
            'wind': {
                label: 'Ветер (м/с)', 
                valueSuffix: " м/с", 
                type: "spline", 
                data: list.map(el => el.wind.speed)
            },
            'precipitation': {
                label: 'Осадки (мм)', 
                valueSuffix: " мм", 
                type: "areaspline", 
                data: list.map(el => el.snow['3h'] * 1000)
            }
        };
        
        let categories = list.map(el => timestampToTime(el.dt) + '<br>' + timestampToDate(el.dt));
        let data = units[unit].data;
        let label = units[unit].label;
        let type = units[unit].type;
        let valueSuffix = units[unit].valueSuffix;
        
        let startDay = c == t ? -0.5 : 0;
        let endDay = c == t ? 7.5 : 0;
        
        let sunrise = c == t ? this.calcSunCoord(this.state.sys.sunrise) : startDay;
        let sunset = c == t ? this.calcSunCoord(this.state.sys.sunset) : endDay;
        
        let nowDt = new Date().getTime() / 1000;
        let current1 = c == t ? this.calcSunCoord(nowDt) : 0;
        let current2 = c == t ? this.calcSunCoord(nowDt) + 0.01 : 0;
        
        Highcharts.chart(this.props.id, {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Почасовой прогноз погоды на ' + (dt ? timestampToDate(dt) : timestampToDate(new Date().getTime() / 1000)) + ', ' +  this.state.cityName
            },
            subtitle: {
                text: 'Источник: Openweathermap.org'
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
                        text: 'Сейчас <br>' + timestampToTime(new Date().getTime() / 1000),
                        style: {
                            color: '#606060'
                        }
                    }
                }],
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