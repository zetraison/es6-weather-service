import React, { useState } from 'react';
import { 
    BrowserRouter as Router, 
    Route,
    Switch
} from 'react-router-dom';
import Navigation from './components/navigation';
import MainPage from './pages/mainPage';
import DetailsPage from './pages/detailsPage';
import NotFoundPage from './pages/notFoundPage';

const App = () => {
    const [city, setCity] = useState('Москва');

    return (
        <div>
            <Navigation onInputSubmit={setCity} />

            <Switch>
                <Route exact path="/">
                    <MainPage city={city} />
                </Route>
                <Route exact path="/detail">
                    <DetailsPage city={city} />
                </Route>
                <Route>
                    <NotFoundPage />
                </Route>
            </Switch>
        </div>
    );
}

export default function AppRouter() {
    return (
        <Router>
            <App />
        </Router>
    );
}