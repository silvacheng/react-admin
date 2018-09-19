import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Admin from './admin';
import Home from './page/router_demo/router1/Home';
import registerServiceWorker from './registerServiceWorker';
ReactDOM.render(<Home/>, document.getElementById('root'));
registerServiceWorker();
