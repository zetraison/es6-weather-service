import React                from 'react/lib/React';
import ReactDOM             from 'react/lib/ReactDOM';
import Router               from 'react-router/lib/Router';
import Route                from 'react-router/lib/Route';
import Redirect             from 'react-router/lib/Redirect';
import Link                 from 'react-router/lib/Link';
import Nav                  from 'react-bootstrap/lib/Nav';
import NavItem              from 'react-bootstrap/lib/NavItem';
import Navbar               from 'react-bootstrap/lib/Navbar';
import Input                from 'react-bootstrap/lib/Input';
import Button               from 'react-bootstrap/lib/Button';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import SetWeatherView       from 'pages/setWeatherView';
import DetailWeatherView    from 'pages/detailWeatherView';
import NotFound             from 'pages/notFound';
import {appendBody}         from 'util';

const history = createBrowserHistory();

class NavigationView extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            pathname: props.location ? props.location.pathname : null,
            querySearch: props.querySearch
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
    
    handleClick(pathname) {
        this.setState({pathname: pathname});
    }
    
    className(pathname) {
        return this.state.pathname == pathname ? 'active' : '';
    }
    render() {
        
        let params = '?q=' + this.state.querySearch;
        
        return (
            <Navbar inverse fixedTop>
                <Navbar.Header>
                    <Navbar.Brand>Прогноз погоды</Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <li onClick={this.handleClick.bind(this, "/main")} className={this.className("/main")}><Link to={"/main" + params}>Главная</Link></li>
                        <li onClick={this.handleClick.bind(this, "/detail")} className={this.className("/detail")}><Link to={"/detail" + params}>Подробно</Link></li>
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

class App extends React.Component {
    
    render() {
        let location = this.props.location;
        let querySearch = location.query && location.query.q ? location.query.q : '';
        
        return (
            <div>
                <div className="container">
                    <NavigationView location={location} querySearch={querySearch} />
                    {this.props.children}
                </div>
            </div>
        );
        
    }
}

ReactDOM.render((
    <Router history={history}>
        <Route component={App}>
            <Route path="main" component={SetWeatherView}/>
            <Route path="detail" component={DetailWeatherView}/>
            
            <Redirect from="/" to="main" />
            
            <Route path="/*" component={NotFound} />
        </Route>
    </Router>
), appendBody());

