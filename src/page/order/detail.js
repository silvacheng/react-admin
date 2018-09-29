import React from 'react';
import { Card } from 'antd';
import axios from '../../axios/index';
import './detail.less';

export default class OrderDetail extends React.Component {

    state = {}

    componentDidMount () {
        let orderId = this.props.match.params.orderId;
        if(orderId) {
            this.requestOrderDetail(orderId);
        }
    }
    requestOrderDetail = (orderId) => {
        axios.get({
            url: '/order/detail',
            data: {
                params: {
                    orderId: orderId,
                    isMock: true
                }
            }
        }).then(res => {
            if (res.code === '0') {
                this.setState({
                    orderInfo : res.result
                })
                this.renderMap(res.result);
            }
        })
    }

    // 初始化地图
    renderMap = (result) => {
        this.map = new window.BMap.Map('orderDetailMap',{enableMapClick: false});
        // 调用绘制用户的行驶路线方法
        this.addMapControl();
        this.drawBikeRoute(result.position_list);
        this.drawServiceArea(result.area);
    }

    // 添加地图控件
    addMapControl = () => {
        let map = this.map;
        map.addControl(new window.BMap.NavigationControl({anchor: window.BMAP_ANCHOR_TOP_RIGHT}));
        map.addControl(new window.BMap.ScaleControl({anchor: window.BMAP_ANCHOR_TOP_RIGHT})); 
    }

    // 绘制用户的行驶路线
    drawBikeRoute = (positionList) => {
        let map = this.map;
        let startPoint = '', endPoint = '';
        let len = positionList.length;
        if (len > 0) {

            let first = positionList[0];
            let last = positionList[len - 1];
            // 初始图标绘制
            startPoint = new window.BMap.Point(first.lon, first.lat);
            let startIcon = new window.BMap.Icon('/assets/start_point.png',new window.BMap.Size(36, 42),{
                imageSize:new window.BMap.Size(36, 42),
                anchor: new window.BMap.Size(18, 42)
            })
            let startMarker = new window.BMap.Marker(startPoint, { icon: startIcon});

            // 结束图标绘制
            endPoint = new window.BMap.Point(last.lon, last.lat);
            let endIcon = new window.BMap.Icon('/assets/end_point.png',new window.BMap.Size(36, 42),{
                imageSize:new window.BMap.Size(36, 42),
                anchor: new window.BMap.Size(18, 42)
            })
            let endMarker = new window.BMap.Marker(endPoint, { icon: endIcon});
            
            // 添加图标到地图上
            map.addOverlay(startMarker);
            map.addOverlay(endMarker);

            // 绘制路线图
            let trackPoint = [];
            for (let i = 0; i < len; i++) {
                let point = positionList[i];
                let mapPoint = new window.BMap.Point(point.lon, point.lat)
                trackPoint.push(mapPoint);
            }
            let polyLine = new window.BMap.Polyline(trackPoint, {
                strokeColor:'#1869AD',
                strokeWeight:3,
                strokeOpacity:1
            })

            map.addOverlay(polyLine);
            map.centerAndZoom(endPoint,11);
        }
    }

    // 绘制服务区
    drawServiceArea = (positionList) => {
        let map = this.map;
        let len = positionList.length;
        if(len > 0) {
            // 绘制路线图
            let trackPoint = [];
            for (let i = 0; i < len; i++) {
                let point = positionList[i];
                let mapPoint = new window.BMap.Point(point.lon, point.lat)
                trackPoint.push(mapPoint);
            }
            let polygon = new window.BMap.Polygon(trackPoint, {
                strokeColor: '#CE0000',
                strokeWeight: 4,
                strokeOpacity: 1,
                fillColor: '#ff8605',
                fillOpacity:0.4
            })
            map.addOverlay(polygon);
        }
    }

    render() {
        const info = this.state.orderInfo || {};
        return (
            <div>
                <Card label="">
                    <div id="orderDetailMap" className="order-map"></div>
                    <div className="detail-items">
                        <div className="item-title">基础信息</div>
                        <ul className="detail-form">
                            <li>
                                <div className="detail-form-left">用车模式</div>
                                <div className="detail-form-content">{info.mode === 1 ? '服务区' : '停车点'}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">订单编号</div>
                                <div className="detail-form-content">{info.order_sn}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">车辆编号</div>
                                <div className="detail-form-content">{info.bike_sn}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">用户姓名</div>
                                <div className="detail-form-content">{info.user_name}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">手机号码</div>
                                <div className="detail-form-content">{info.mobile}</div>
                            </li>
                        </ul>
                    </div>
                    <div className="detail-items">
                        <div className="item-title">行驶轨迹</div>
                        <ul className="detail-form">
                            <li>
                                <div className="detail-form-left">行驶起点</div>
                                <div className="detail-form-content">{info.start_location}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">行驶终点</div>
                                <div className="detail-form-content">{info.end_location}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">行驶里程</div>
                                <div className="detail-form-content">{info.distance/1000}公里</div>
                            </li>
                        </ul>
                    </div>
                </Card>

            </div>
        )
    }
}