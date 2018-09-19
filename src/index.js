import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Admin from './admin';
import Router from './page/router_demo/router3/router';
import registerServiceWorker from './registerServiceWorker';
ReactDOM.render(<Router/>, document.getElementById('root'));
registerServiceWorker();
