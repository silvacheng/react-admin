import React from 'react';

export default class Info extends React.Component {
    
    render() {
        return ( 
            <div>
                这是设置动态路由
                 {this.props.match.params.mainId}
                 <br/>
                 {JSON.stringify(this.props.match)}
                 <br/>
                 {JSON.stringify(this.props)}
            </div>
        )
    }
}