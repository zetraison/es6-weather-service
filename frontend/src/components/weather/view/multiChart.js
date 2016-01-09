import React                from 'react/lib/React';
import Nav                  from 'react-bootstrap/lib/Nav';
import NavItem              from 'react-bootstrap/lib/NavItem';
import Highcharts           from 'highcharts';
import config               from 'config';
import {timestampToTime, 
        timestampToDate, 
        buildIconUrl, 
        convertingHpaTommHg} from 'util';

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
            <Nav bsStyle="tabs" activeKey={this.state.key} onSelect={this.handleSelect.bind(this)}>
                <NavItem eventKey={0}>Температура</NavItem>
                <NavItem eventKey={1}>Влажность</NavItem>
                <NavItem eventKey={2}>Давление</NavItem>
                <NavItem eventKey={3}>Ветер</NavItem>
                <NavItem eventKey={4}>Осадки</NavItem>
            </Nav>
        );
    }
}

class DayNavs extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            key: 0,
            data: props.data
        };
    }
    
    handleSelect(key) {
        this.setState({key: key});
        this.props.handleSelect(this.state.data[key].dt);
    }
    
    render(){
        let data = this.state.data.slice(0, FORECAST_DAYS_LIMIT);
        
        let navs = data.map((el, index) => {
            
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

class MultiChart extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            id: props.id,
            city: props.city,
            dataCurrent: props.dataCurrent,
            dataHourly: props.dataHourly,
            dataDaily: props.dataDaily
        };
    }
    
    calcSunCoord(dt) {
        let d = new Date(dt * 1000);
        return (d.getHours() + d.getMinutes() / 60) * 8 / 24 - 0.5;
    }
    
    renderChart(unit, dt){
        
        let dataHourly = this.state.dataHourly;
        let dataCurrent = this.state.dataCurrent;
        
        unit = unit || 'temp';
        
        let c = new Date().getDate();
        let t = new Date(dt * 1000).getDate() || c;
        
        let list = dataHourly.filter(el => {
            
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
        
        let title = 'Почасовой прогноз погоды на ' + (dt ? timestampToDate(dt) : timestampToDate(new Date().getTime() / 1000)) + ', ' + this.state.city;
        let subtitle = 'Источник: Openweathermap.org';
        
        let categories = list.map(el => timestampToTime(el.dt) + '<br>' + timestampToDate(el.dt));
        let data = units[unit].data;
        let label = units[unit].label;
        let chartType = units[unit].type;
        let unitSuffix = units[unit].valueSuffix;
        
        let startDay = c == t ? -0.5 : 0;
        let endDay = c == t ? 7.5 : 0;
        
        let sunrise = c == t ? this.calcSunCoord(dataCurrent.sys.sunrise) : startDay;
        let sunset = c == t ? this.calcSunCoord(dataCurrent.sys.sunset) : endDay;
        
        let nowDt = new Date().getTime() / 1000;
        let current1 = c == t ? this.calcSunCoord(nowDt) : 0;
        let current2 = c == t ? this.calcSunCoord(nowDt) + 0.01 : 0;
        
        Highcharts.chart(this.props.id, {
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
                crosshair: true
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
    }
    
    handleSelectUnits(key){
        let index = this.refs["DayNavs"].state.key;
        let date = this.refs["DayNavs"].state.data[index].dt;
        this.renderChart(TAB_INDEX[key], date);
    }
    
    handleSelectDays(date) {
        let key = this.refs["TabsUnits"].state.key;
        this.renderChart(TAB_INDEX[key], date);
    }
    
    componentDidMount(){
        this.renderChart();
    }
    
    render(){
        return (
            <div>
                <UnitTabs ref="TabsUnits" handleSelect={this.handleSelectUnits.bind(this)} />
                <div id={this.state.id}></div>
                <DayNavs ref="DayNavs" data={this.state.dataDaily} handleSelect={this.handleSelectDays.bind(this)} />
            </div>
        );
    }
}

export default MultiChart;