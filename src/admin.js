import React from 'react'
import { Row, Col } from 'antd'
import Header from './component/Header'
import Footer from './component/Footer'
import NavLeft from './component/NavLeft'
import './style/common.css'
export default class Admin extends React.Component{

    render() {
        return (
            <Row className="container">
                <Col span="4" className="nav-left">
                    <NavLeft></NavLeft>
                </Col>
                <Col span="20" className="main">
                    <Header/>
                    <Row className="content">
                        1111
                    </Row>
                    <Footer/>
                </Col>
            </Row>
        )
    }
}