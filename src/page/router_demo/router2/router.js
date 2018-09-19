import React from 'react';
import { HashRouter as Router, Route, Link} from 'react-router-dom';
import Main from './Main';
import About from './../router1/about';
import Topics from './../router1/topic';
import Home from './home'
export default class IRouter extends React.Component{

    render() {
        return (
            <Router>
                <Home>
                    <Route path="/main" render={() => 
                        <Main>
                            <Route path="/main/about" component={About}></Route>
                        </Main>
                    }></Route>
                    <Route path="/about" component={About}></Route>
                    <Route path="/topics" component={Topics}></Route>
                </Home>
            </Router>
        );
    }
}