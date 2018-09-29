import axios from 'axios';
import Jsonp from 'jsonp';
import { Modal} from 'antd';
import Utils from './../utils/utils';

export default class Axios{

    static requestListPost(_this, url, params, isMock) {

        let data = {
            params,
            isMock
        }
        this.ajax({
            url,
            data
        }).then((res) => {
            if(res && res.result) {
                if(res.code === 0) {
                    let list = res.result.item_list.map((item, index) => {
                        item.key = index;
                        return item;
                    })
                    _this.setState({ 
                        list,
                        pagination: Utils.pagination(res, (current)=> {
                            _this.params.page = current
                            _this.requestList();
                        })
                    })
                }
            }
        })
    }



    static requestListGet(_this, url, params, isMock) {

        let data = {
            params,
            isMock
        }
        this.get({
            url,
            data
        }).then((res) => {
            if(res && res.result) {
                if(res.code === 0) {
                    let list = res.result.item_list.map((item, index) => {
                        item.key = index;
                        return item;
                    })
                    _this.setState({ 
                        list,
                        pagination: Utils.pagination(res, (current)=> {
                            _this.params.page = current
                            _this.requestList();
                        })
                    })
                }
            }
        })
    }

    static jsonpData(options) {
        return new Promise((resolve, reject) => {
            Jsonp(options.url, {
                param: 'callback'
            }, (err, response) => {
                if(response.status === 'success') {
                    resolve(response);
                } else {
                    reject(response.message);
                }
            })
        });
    }


    static ajax(options) {
        let loading;
        if(options.data && options.data.isShowLoading !== false) {
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }

        let baseUrl = 'https://www.easy-mock.com/mock/5ba3971c00424530fc9db8ae/mockApi';
        if(options.data.isMock) {
            baseUrl = 'https://www.easy-mock.com/mock/5ba3971c00424530fc9db8ae/mockApi';
        } else {

        }

        return new Promise((resolve, reject) => {
            axios({
                url: options.url,
                method: 'post',
                baseURL: baseUrl,
                timeout: 15000,
                params: (options.data && options.data.params) || ''
            }).then((res) => {
                if(options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if(res.status === 200) {
                    if(res.data.code === 0  || res.data.code === '0') {
                        resolve(res.data)
                    } else {
                        Modal.info({
                            title: '提示',
                            content: res.data.msg
                        })
                    }
                } else {
                    reject(res.data)
                }
            }).catch((err) => {
                if(options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                console.error(err)
            })
        })
    }

    static get(options) {
        let loading;
        if(options.data && options.data.isShowLoading !== false) {
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }

        let baseUrl = 'https://www.easy-mock.com/mock/5a7278e28d0c633b9c4adbd7/api';
        if(options.data.isMock) {
            baseUrl = 'https://www.easy-mock.com/mock/5a7278e28d0c633b9c4adbd7/api';
        } else {

        }
        
        return new Promise((resolve, reject) => {
            axios({
                url: options.url,
                method: 'get',
                baseURL: baseUrl,
                timeout: 15000,
                params: (options.data && options.data.params) || ''
            }).then((res) => {
                if(options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if(res.status === 200) {
                    if(res.data.code === '0' || res.data.code === 0) {
                        resolve(res.data)
                    } else {
                        Modal.info({
                            title: '提示',
                            content: res.data.msg
                        })
                    }
                } else {
                    reject(res.data)
                }
            }).catch((err) => {
                if(options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                console.error(err)
            })
        })
    }
}