import axios from 'axios';
import Jsonp from 'jsonp';
import { Modal} from 'antd';

export default class Axios{
    static jsonp(options) {
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

        const baseUrl = 'https://www.easy-mock.com/mock/5ba3971c00424530fc9db8ae/mockApi';

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
                    if(res.data.code === 0) {
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