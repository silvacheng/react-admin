import React from 'react';
import {Input, Select, Button, Form, Checkbox, DatePicker} from 'antd';
import Utils from '../../utils/utils';
import locale from 'antd/lib/date-picker/locale/zh_CN';
const FormItem = Form.Item;

class FilterForm extends React.Component {

    handleFilterSubmit = () => {
        let fieldsValue = this.props.form.getFieldsValue();
        // console.log(fieldsValue.start_time);
        // console.log(fieldsValue.end_time._d.toDateString());
        this.props.filterSubmit(fieldsValue);
    }

    reset = () => {
        this.props.form.resetFields();
    }

    initFormList = () => {
        const { getFieldDecorator } = this.props.form;
        const formList  = this.props.formList;
        const formItemList = [];
        if(formList && formList.length > 0) {
            formList.forEach((item, index) => {
                let label = item.label;
                let field = item.field;
                let initalValue = item.initalValue || '';
                let placeholder = item.placeholder;
                let width = item.width;
                if(item.type === 'INPUT') {
                    const INPUT = <FormItem label={label} key={field}>
                    {
                        getFieldDecorator(field, {
                            initalValue: initalValue
                        })(
                            <Input type="text" placeholder={placeholder}/>
                        )
                    }
                    </FormItem>;
                    formItemList.push(INPUT);
                }
                else if(item.type === 'CHECKBOX') {
                    const CHECKBOX = <FormItem label={label} key={field}>
                    {
                        getFieldDecorator(field, {
                            valuePropName: 'checked',
                            initalValue: initalValue // true || false
                        })(
                            <Checkbox>
                                {label}
                            </Checkbox>
                        )
                    }
                    </FormItem>;
                    formItemList.push(CHECKBOX);
                }
                else if(item.type === 'SELECT') {
                    const SELECT = <FormItem label={label} key={field}>
                    {
                        getFieldDecorator(field, {
                            initalValue: initalValue
                        })(
                            <Select
                                style={{width: width}}
                                placeholder={placeholder}
                            >
                                {Utils.getOptionList(item.list)}
                            </Select>
                        )
                    }
                    </FormItem>;
                    formItemList.push(SELECT);
                }
                else if(item.type === 'DATEPICKER') {
                    const BEGIN_TIME = <FormItem label="订单时间" key='start_time'>
                        {
                            getFieldDecorator('start_time')(
                                <DatePicker style={{width: width}} locale={locale} showTime={true} format="YYYY-MM-DD HH:mm:ss" placeholder="选择开始时间"></DatePicker>
                            )
                        }
                    </FormItem>
                    formItemList.push(BEGIN_TIME);
                    const END_TIME = <FormItem label='~' key='end_time' colon={false}>
                        {
                            getFieldDecorator('end_time')(
                                <DatePicker style={{width: width}} locale={locale} showTime={true} format="YYYY-MM-DD HH:mm:ss" placeholder="选择结束时间"></DatePicker>
                            )
                        }
                    </FormItem>
                    formItemList.push(END_TIME);
                }
                else if(item.type === 'DATE') {
                    const DATE = <FormItem label={label} key='date'>
                        {
                            getFieldDecorator('date')(
                                <DatePicker locale={locale} format="YYYY-MM-DD" placeholder={placeholder}></DatePicker>
                            )
                        }
                    </FormItem>
                    formItemList.push(DATE);
                }
            })
        }
        return formItemList;
    }

    render() {
        return (
            <Form layout="inline">
                { this.initFormList() }
                <FormItem>
                    <Button type="primary" style={{margin:'0 20px'}} onClick={this.handleFilterSubmit}>查询</Button>
                    <Button onClick={this.reset}>重置</Button>
                </FormItem>
            </Form>
        )
    }

}

export default Form.create({})(FilterForm);
