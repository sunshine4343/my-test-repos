import React, { Component } from 'react';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {
    state = {
        editorState: EditorState.createEmpty(),
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    getRichText = () => {
        const { editorState } = this.state;
        return draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }

    setRichText = (html) => {
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({ editorState });
        }

    }

    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    //   wrapperClassName="demo-wrapper"
                    //   editorClassName="demo-editor"
                    editorStyle={{ border: '1px solid black', paddingLeft: '10px', lineHeight: '10px', minHeight: '200px' }}
                    onEditorStateChange={this.onEditorStateChange}
                />
                {/* <textarea
                    disabled
                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                /> */}
            </div>
        );
    }
}