import React                                from 'react';
import ReactDOM                             from 'react/lib/ReactDOM';
import { Router, Route, Link, Redirect }    from 'react-router';
import createBrowserHistory                 from 'history/lib/createBrowserHistory';
import WeatherView                          from 'pages/weatherView';
import DetailWeatherView                    from 'pages/DetailWeatherView';
import {appendBody}                         from 'util/util';
import jQuery                               from 'jquery';
//require('bootstrap/js/transition')($);

const history = createBrowserHistory();

class Search extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            querySearch: props.querySearch
        };
    }
    
    onKeyPress(e) {
        if (e.charCode != 13)
            return;
        
        window.location = '?q=' + e.target.value;
    }
    
    render() {
        return (
            <input type="text" className="form-control navbar-form navbar-right" placeholder="Поиск" defaultValue={this.state.querySearch} onKeyPress={this.onKeyPress.bind(this)} />
        );
    }
}

class Navigation extends React.Component {
    
    constructor(props) {
        super(props);
        this.querySearch = props.querySearch;
    }
    
    onClick(e) {
        $(e.target).parent().addClass('active').siblings().removeClass('active');
    }
    
    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="/">Прогноз погоды</a>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li onClick={this.onClick.bind(this)}><Link to='main'>Главная</Link></li>
                            <li onClick={this.onClick.bind(this)}><Link to='detail'>Подробно</Link></li>
                        </ul>
                        
                        <Search querySearch={this.querySearch} />
                    </div>
                </div>
            </nav>
        );
        
    }
}

class App extends React.Component {
    
    render() {
        let location = this.props.location;
        let querySearch = location.query && location.query.q ? location.query.q : '';
        
        return (
            <div>
                <Navigation querySearch={querySearch} />
                
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        );
        
    }
}

class NoMatch extends React.Component {
    render() {
        return (<div style={{fontSize: '50px'}}>404 Not found</div>);
    }
}

ReactDOM.render((
    <Router history={history}>
        <Route component={App}>
            <Route path="main" component={WeatherView}/>
            <Route path="detail" component={DetailWeatherView}/>
            
            <Redirect from="/" to="main" />
            
            <Route path="/*" component={NoMatch} />
        </Route>
    </Router>
), appendBody());

