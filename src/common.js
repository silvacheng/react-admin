import React from 'react';
import { Row } from 'antd';
import Header from './component/Header';
import './style/common.less';
export default class Admin extends React.Component{

    render() {
        return (
            <div>
                <Row className="simple-page">
                    <Header menuType="second"></Header>
                </Row>
                <Row className="content">
                    {this.props.children}
                </Row>
            </div>
        )
    }
}