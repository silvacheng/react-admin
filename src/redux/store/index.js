/**
 * 引入createStore
 */

// 引入createStore创建store，引入applyMiddleware 来使用中间件
import { createStore } from 'redux';
// 引入所有的reducer
import reducer from './../reducer';
// 安装redux-devtools-extension的可视化工具。
import { composeWithDevTools } from 'redux-devtools-extension';

// const initialState = {
//     menuName:'首页'
// }
const configureStore = () => createStore(reducer, composeWithDevTools());
// const configureStore = (prevState) => createStore(reducer, prevState);

export default configureStore;
