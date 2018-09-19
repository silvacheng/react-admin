import React from 'react'
import './index.less'

export default class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            date: new Date()
        }
    }

    componentDidMount () {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        )
    }
    
    componentWillUnmount () {
        // 组件销毁时  清除定时器
        clearInterval(this.timerID)
    }
    
    tick() {
        this.setState({
            date: new Date()
        })
    }

    render() {
        return (
            <div className="home-wrap">
                现在是 {this.state.date.toLocaleTimeString()}
                {/* <BasicExample/> */}
            </div>
        )
    }

}