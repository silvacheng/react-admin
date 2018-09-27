export default {
    formatDate(time) {
        if (!time) {
            return ''
        }
        let date = new Date(time);
        let year = date.getFullYear();
        let month = date.getMonth() + 1 > 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
        let day = date.getDate() > 10 ? date.getDate() : '0' + date.getDate();
        let hour = date.getHours() > 10 ? date.getHours() : '0' + date.getHours();
        let min = date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes();
        let sec = date.getSeconds() > 10 ? date.getSeconds() : '0' + date.getSeconds();
        return year + '-' + month + '-' + day + '  ' + hour + ':' + min + ':' + sec;
    },
    pagination(data,callback) {
        let page = {
            onChange: (current) => {
                callback(current)
            },
            current: data.result.page,
            pageSize: data.result.page_size,
            total: data.result.total_count,
            showTotal: () => {
                return `共${data.result.total_count}条`
            },
            showQuickJumper: true
        }
        return page
    },
    // 隐藏手机号中间4位
    formatPhone(phone) {
        phone += '';
        return phone.replace(/(\d{3})\d*(\d{4})/g, '$1****$2')
    }
}