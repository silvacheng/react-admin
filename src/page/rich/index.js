import React from 'react';
import { Card, Button, Modal } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftjs from 'draftjs-to-html';
export default class RichText extends React.Component{

    state = {
        editorState: '',
        contentState: '',
        isShowRichText: false
    }

    // 编辑器状态发生变化存储状态
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState
        })
    }

    // 编辑器内容发生变化存储内容
    onContentStateChange = (contentState) => {
        this.setState({
            contentState
        })
    }

    // 清空内容
    handleClearContent = () => {
        this.setState({
            editorState: ''
        })
    }

    // 获取HTML
    handleGetText = () => {
        this.setState({
            isShowRichText: true
        })
    }
    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Card style={{marginTop: 10}}>
                    <Button type="primary" onClick={this.handleClearContent} style={{marginRight: 20}}>清空</Button>
                    <Button type="primary" onClick={this.handleGetText}>获取HTML内容</Button>
                </Card>
                <Card title="富文本编辑器" style={{marginTop: 10}}>
                    <Editor
                        editorState={editorState}
                        onEditorStateChange={this.onEditorStateChange}
                        onContentStateChange={this.onContentStateChange}
                    />
                </Card>
                <Modal
                    title="富文本"
                    visible={this.state.isShowRichText}
                    onCancel={() => {
                        this.setState({
                            isShowRichText: false
                        })
                    }}
                    footer={null}
                >
                    {draftjs(this.state.contentState)}
                </Modal>
            </div>
        );
    }
}