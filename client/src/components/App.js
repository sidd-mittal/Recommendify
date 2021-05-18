import React, { useState, useEffect } from 'react';
import '../css/App.css';
import Login from './Login'
import Callback from './Callback'
import Dashboard from './Dashboard'
import {getAccessToken} from '../helperFunctions/spotifyAPIHelperFunctions';
import {Switch, Route, Redirect} from 'react-router-dom';

function App() {
    const [refreshTimer, setRefreshTimer] = useState(null);
    const [accessToken, setAccessToken] = useState(getAccessToken());

    useEffect(() => {
        setRefreshTimer(setInterval(getAccessToken, 1000 * 60 * 55));
    }, [])

    return (
        <Switch>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/callback' component={Callback}/>
            <Route exact path='/dashboard' render={
                (props) => <Dashboard {...props} gettingNewAccessToken={accessToken}/>}
            />
            <Route path='' render={
                (props) => <Dashboard {...props} gettingNewAccessToken={accessToken}/>}
            />
        </Switch>
    );
}

export default App;
