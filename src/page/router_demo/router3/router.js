import React from 'react';
import { HashRouter as Router, Route, Switch} from 'react-router-dom';
import Main from './Main';
import About from './../router1/about';
import Topics from './../router1/topic';
import Info from './info';
import Home from './home';
import NoMatch from './noMatch';
export default class IRouter extends React.Component{

    render() {
        return (
            <Router>
                <Home>
                    <Switch>
                        <Route path="/main" render={() => 
                            <Main>
                                <Route path="/main/:mainId" component={Info}></Route>
                            </Main>
                        }></Route>
                        <Route path="/about" component={About}></Route>
                        <Route path="/topics" component={Topics}></Route>
                        <Route component={NoMatch}></Route>
                    </Switch>
                </Home>
            </Router>
        );
    }
}