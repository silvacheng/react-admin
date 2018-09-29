import React from 'react';
import { Card } from 'antd';
import axios from '../../axios/index';
import BaseForm from '../../component/BaseForm/index';

export default class BikeMap extends React.Component {

    state = {};

    formList = [
        {
            type: 'SELECT',
            label: '城市',
            field: 'city_id',
            placeholder: '全部',
            initalValue: '1',
            width: 80,
            list:[{id: '0', name: '全部'},{id: '1', name: '北京'},{id: '2', name: '上海'},{id: '3', name: '杭州'},{id: '4', name: '深圳'}]
        },
        {
            type: 'DATEPICKER',
            width: 180,
        },
        {
            type: 'SELECT',
            label: '订单状态',
            field: 'order_status',
            placeholder: '全部',
            initalValue: '1',
            width: 80,
            list:[{id: '0', name: '全部'},{id: '1', name: '进行中'},{id: '2', name: '行程结束'}]
        }
    ]

    params = {
        page: 1
    }

    componentDidMount = () => {
      this.requestList();
    }
    
    handleFilter = (params) => {
        this.params = params;
        this.requestList();
    }

    requestList = () => {
        axios.get({
            url: '/map/bike_list',
            data: {
                params: this.params
            }
        }).then(res => {
            if(res.code === 0) {
                this.setState({
                    total_count: res.result.total_count
                });
                this.renderMap(res.result);
            }
        })        
    }

    renderMap = (data) => {
        this.map = new window.BMap.Map('box',{enableMapClick: false});
        // 绘制起始点以及确定地图中心点
        this.drawStartEnd(data.route_list);
        // 绘制服务区域
        this.drawServiceArea(data.service_list);
        // 绘制bikeICon
        this.drawBikeIcon(data.bike_list);
        // 添加地图控件
        this.addMapControl();

    }

    // 绘制起始点以及确定地图中心点
    drawStartEnd = (list) => {
        let map = this.map;
        let start = list[0].split(',');
        let end = list[list.length -1].split(',')
        let startPoint = new window.BMap.Point(start[0], start[1]);
        let endPoint = new window.BMap.Point(end[0], end[1]);

        // 绘制中心店以及比例
        map.centerAndZoom(endPoint, 11);

        // 初始图标绘制
        let startIcon = new window.BMap.Icon('/assets/start_point.png',new window.BMap.Size(36, 42),{
            imageSize:new window.BMap.Size(36, 42),
            anchor: new window.BMap.Size(18, 42)
        })
        let startMarker = new window.BMap.Marker(startPoint, { icon: startIcon});

        // 结束图标绘制
        let endIcon = new window.BMap.Icon('/assets/end_point.png',new window.BMap.Size(36, 42),{
            imageSize:new window.BMap.Size(36, 42),
            anchor: new window.BMap.Size(18, 42)
        })
        let endMarker = new window.BMap.Marker(endPoint, { icon: endIcon});
        
        // 添加图标到地图上
        map.addOverlay(startMarker);
        map.addOverlay(endMarker);
        
        // 骑行路线
        let trackPoint = [];
        list.forEach((item) => {
            let point = item.split(',');
            let mapPoint = new window.BMap.Point(point[0], point[1]);
            trackPoint.push(mapPoint);
        });

        let polyLine = new window.BMap.Polyline(trackPoint, {
            strokeColor:'#1869AD',
            strokeWeight:3,
            strokeOpacity:1
        })
        map.addOverlay(polyLine);
    }
    // 绘制服务区域
    drawServiceArea = (list) => {

        let servicePoint = [];
        list.forEach((item) => {
            let mapPoint = new window.BMap.Point(item.lon, item.lat);
            servicePoint.push(mapPoint);
        });

        let polyLine = new window.BMap.Polyline(servicePoint, {
            strokeColor:'#ef4136',
            strokeWeight:3,
            strokeOpacity:1
        })
        this.map.addOverlay(polyLine);
    }

    drawBikeIcon = (list) => {
        // 初始图标绘制
        let bikeIcon = new window.BMap.Icon('/assets/bike.jpg',new window.BMap.Size(36, 42),{
            imageSize:new window.BMap.Size(36, 42),
            anchor: new window.BMap.Size(18, 42)
        })
        list.forEach((item) => {
            let point = item.split(',');
            let mapPoint = new window.BMap.Point(point[0], point[1]);
            let marker = new window.BMap.Marker(mapPoint, { icon: bikeIcon});
            this.map.addOverlay(marker);
        })
    }

    addMapControl = () => {
        let map = this.map;
        map.addControl(new window.BMap.NavigationControl({anchor: window.BMAP_ANCHOR_TOP_RIGHT}));
        map.addControl(new window.BMap.ScaleControl({anchor: window.BMAP_ANCHOR_TOP_RIGHT})); 
    }

    render() {
        return (
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
                </Card>
                <Card style={{marginTop: 10}}>
                    <div>共{this.state.total_count}辆车</div>
                    <br/>
                    <div id="box" style={{height: 500}}></div>
                </Card>
            </div>
        );
    }
}