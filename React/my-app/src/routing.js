import React, {Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from './components/login';
import Home from './components/home';

class Routing extends Component{
    render (){
        return(
            <BrowserRouter>
                <Switch>
                    <Route exact path='/home/:id' component={Home}/>
                    <Route exact path='/' component={Login}/>
                    <Route exact path='/login' component={Login}/>
                </Switch>
            </BrowserRouter>
        );
    }
}
export default Routing;