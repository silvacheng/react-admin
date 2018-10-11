import React from 'react'
import { Row, Col, Modal } from 'antd'
import './index.less'
import Util from '../../utils/utils'
import axios from '../../axios'
import { connect } from 'react-redux';
class Header extends React.Component {

    state = {
        isShowModal: false
    }

    componentWillMount () {
        this.setState({
            userName: 'Silva'
        })
        setInterval(() => {
            const sysTime = Util.formatDate(new Date().getTime())
            this.setState({
                sysTime: sysTime
            })            
        }, 1000)
        // this.getWeatherAPIData();
    }

    handleQuit = () => {
        this.setState({
            isShowModal: true
        })
    }

    handleConfirm = () => {
        this.setState({
            isShowModal: false 
        })
        window.location.href = '/#/login';
    }

    getWeatherAPIData() {
        let city = '深圳'
        axios.jsonpData({
            url: 'http://api.map.baidu.com/telematics/v3/weather?location=' + encodeURIComponent(city) + '&output=json&ak=3p49MVra6urFRGOT9s8UBWr2&timeStamp=' + new Date().getTime()
        }).then((res) => {
            if(res.status === 'success') {
                let data = res.results[0].weather_data[0]
                this.setState({
                    dayPictureUrl: data.dayPictureUrl,
                    weather: data.weather
                })
            }
        })
    }
    render() {
        const { menuType, menuName } = this.props;
        return(
            <div className="header">
                <Row className="header-top">
                    {
                        menuType ? 
                            <Col span="6" className="logo">
                                <img src="/assets/logo-ant.svg" alt=""/>
                                <span>通用管理系统</span>
                            </Col>                            
                        : ''
                    }    
                    <Col span={menuType?18:24}>
                        <span>欢迎，{this.state.userName}</span>
                        <a onClick={this.handleQuit}>退出</a>
                    </Col>
                </Row>
                {
                    menuType ? '': 
                    <Row className="breadcrumb">
                        <Col span="4" className="breadcrumb-title">
                            { menuName || '首页' }
                        </Col>
                        <Col span="20" className="weather">
                            <span className="date">{this.state.sysTime}</span>
                            <span className="weather-img">
                                <img src={this.state.dayPictureUrl} alt=""/>
                            </span>
                            <span className="weather-detail">{this.state.weather}</span>
                        </Col>
                    </Row>
                }
                <Modal
                    title="提示"
                    visible={this.state.isShowModal}
                    okText="确定"
                    cancelText="取消"
                    onOk={this.handleConfirm}
                    onCancel={()=> {
                        this.setState({
                            isShowModal: false
                        })
                    }}
                >
                    <p>确定退出吗，亲？</p>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        menuName: state.menuName
    }
}
export default connect(mapStateToProps)(Header);