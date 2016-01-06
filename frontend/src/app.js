import React                        from 'react/lib/React';
import ReactDOM                     from 'react/lib/ReactDOM';
import Router                       from 'react-router/lib/Router';
import Route                        from 'react-router/lib/Route';
import Redirect                     from 'react-router/lib/Redirect';
import Link                         from 'react-router/lib/Link';
import RouteContext                 from 'react-router/lib/RouteContext';
import ReactMixin                   from 'react-mixin';
import Nav                          from 'react-bootstrap/lib/Nav';
import NavItem                      from 'react-bootstrap/lib/NavItem';
import Navbar                       from 'react-bootstrap/lib/Navbar';
import Input                        from 'react-bootstrap/lib/Input';
import Button                       from 'react-bootstrap/lib/Button';
import createBrowserHistory         from 'history/lib/createBrowserHistory';
import WeatherView                  from 'pages/weatherView';
import DetailWeatherView            from 'pages/detailWeatherView';
import {appendBody}                 from 'util/util';

const history = createBrowserHistory();

class NavigationView extends React.Component {

    constructor(props, context){
        super(props);
        this.state = {
            key: 0
        };
    }
    
    onSearchInputKeyPress(e) {
        if (e.charCode != 13)
            return;
        
        window.location = '?q=' + e.target.value;
    }
    
    onSearchButClick(e) {
        window.location = '?q=' + $('input.form-control')[0].value;
    }
    
    handleClick(key) {
        this.setState({key: key});
    }
    
    className(key) {
        console.log(this.props.querySearch);
        return this.state.key == key ? 'active' : '';
    }
    
    render() {
        return (
            <Navbar inverse fixedTop>
                <Navbar.Header>
                    <Navbar.Brand>Прогноз погоды</Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <li onClick={this.handleClick.bind(this, 0)} className={this.className(0)}><Link to="main">Главная</Link></li>
                        <li onClick={this.handleClick.bind(this, 1)} className={this.className(1)}><Link to="detail">Подробно</Link></li>
                    </Nav>
                    <Nav pullRight>
                        <Navbar.Form>
                            <Input type="text" placeholder="Поиск" defaultValue={this.props.querySearch} onKeyPress={this.onSearchInputKeyPress.bind(this)} />{' '}
                            <Button type="submit" onClick={this.onSearchButClick.bind(this)}>Поиск</Button>
                        </Navbar.Form>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

//ReactMixin(NavigationView.prototype, RouteContext);

class App extends React.Component {
    
    render() {
        let location = this.props.location;
        let querySearch = location.query && location.query.q ? location.query.q : '';
        
        return (
            <div>
                <NavigationView querySearch={querySearch} />
                
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

