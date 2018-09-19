import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import App from './App';
import Login from './page/login';
import Admin from './admin';
import Buttons from './page/ui/buttons';
import Modals from './page/ui/modals';
import Loadings from './page/ui/loadings';
import Notice from './page/ui/notice';
import Messages from './page/ui/messages';
import Carousel from './page/ui/carousel';
import Gallery from './page/ui/gallery';
import Tabs from './page/ui/tabs';
import NoMatch from './page/nomatch';
export default class IRouter extends React.Component{

    render() {
        return (
            <HashRouter>
                <App>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/admin" component={() => 
                        <Admin>
                            <Switch>
                                <Route path="/admin/ui/buttons" component={Buttons}></Route>    
                                <Route path="/admin/ui/modals" component={Modals}></Route>    
                                <Route path="/admin/ui/loadings" component={Loadings}></Route>    
                                <Route path="/admin/ui/notification" component={Notice}></Route>    
                                <Route path="/admin/ui/messages" component={Messages}></Route>    
                                <Route path="/admin/ui/gallery" component={Gallery}></Route>    
                                <Route path="/admin/ui/carousel" component={Carousel}></Route>    
                                <Route path="/admin/ui/tabs" component={Tabs}></Route>    
                                <Route component={NoMatch}></Route>
                            </Switch>
                        </Admin>
                    }></Route>
                    <Route path="/order/detail" component={Login}></Route>
                </App>
            </HashRouter>
        )
    }
}