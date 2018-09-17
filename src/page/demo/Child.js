import React from 'react'

export default class Child extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            count: 0
        }
    }

    componentWillMount() {
        console.log('Will mount');
    }

    componentDidMount() {
        console.log('Did mount');
    }

    componentWillReceiveProps(newProps) {
        console.log('will props ' + newProps.name)
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        console.log('Should update');
        return true;
    }
    
    componentWillUpdate() {
        console.log('Will update');
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('Did update');
    }
    

    render() {
        return (
            <div>
                <p>这是子组件</p>
                <p>{this.props.name}</p>
            </div>
        )

    }
}