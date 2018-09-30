import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import App from './App';
import Login from './page/login';
import Admin from './admin';
// UI
import Buttons from './page/ui/buttons';
import Modals from './page/ui/modals';
import Loadings from './page/ui/loadings';
import Notice from './page/ui/notice';
import Messages from './page/ui/messages';
import Carousel from './page/ui/carousel';
// import Gallery from './page/ui/gallery';
import FormLogin from './page/form/login';
// Form
import FormRegister from './page/form/register';
import Tabs from './page/ui/tabs';
// BasicTable
import BasicTable from './page/table/basicTable';
import HightTable from './page/table/highTable';
// City
import City from './page/city/index';
// Order 
import Order from './page/order/index';
// NoMatch
import NoMatch from './page/nomatch';

// 通用组件
import Common from './common';
// 订单详情
import OrderDetail from './page/order/detail';
// 员工操作
import User from './page/user/index';
// 车辆地图
import BikeMap from './page/map/bikeMap';
// echart
import Bar from './page/echarts/bar/index';
import Line from './page/echarts/line/index';
import Pie from './page/echarts/pie/index';
// richText 
import RichText from './page/rich/index';
// PermissionUser
import PermissionUser from './page/permission/index';
export default class IRouter extends React.Component{

    render() {
        return (
            <HashRouter>
                <App>
                    <Switch>
                        <Route path="/login" component={Login}></Route>
                        <Route path="/common" render={() => 
                            <Common>
                                <Route path="/common/order/detail/:orderId" component={OrderDetail}/>
                            </Common>
                        }>
                        </Route>
                        <Route path="/" render={() => 
                            <Admin>
                                <Switch>
                                    <Route path="/ui/buttons" component={Buttons}></Route>    
                                    <Route path="/ui/modals" component={Modals}></Route>    
                                    <Route path="/ui/loadings" component={Loadings}></Route>    
                                    <Route path="/ui/notification" component={Notice}></Route>    
                                    <Route path="/ui/messages" component={Messages}></Route>    
                                    {/* <Route path="/ui/gallery" component={Gallery}></Route>     */}
                                    <Route path="/ui/carousel" component={Carousel}></Route>    
                                    <Route path="/ui/tabs" component={Tabs}></Route>        
                                    <Route path="/form/login" component={FormLogin}></Route> 
                                    <Route path="/form/register" component={FormRegister}></Route> 
                                    <Route path="/table/basic" component={BasicTable}></Route>  
                                    <Route path="/table/high" component={HightTable}></Route>   
                                    <Route path="/city" component={City}></Route>   
                                    <Route path="/order" component={Order}></Route> 
                                    <Route path="/user" component={User}></Route>    
                                    <Route path="/bikeMap" component={BikeMap}></Route>    
                                    <Route path="/charts/bar" component={Bar}></Route>    
                                    <Route path="/charts/line" component={Line}></Route>    
                                    <Route path="/charts/pie" component={Pie}></Route>    
                                    <Route path="/rich" component={RichText}></Route>    
                                    <Route path="/permission" component={PermissionUser}></Route>    
                                    <Route component={NoMatch}></Route>
                                </Switch>
                            </Admin>
                        }>
                        </Route>
                    </Switch>
                </App>
            </HashRouter>
        )
    }
}