import React from 'react'
import style from './style.scss'
import LzEditor from 'react-lz-editor'

export default class Article extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            contentInitialed: false,
            content: ''
        }
    }

    componentDidMount () {

        if (!this.state.contentInitialed) {
            this.setState({
                content: this.props.initialContent
            })
        }

    }

    inputTitle (e) {
        let title = e.currentTarget.value
        this.props.actions.updatePageData({ title })
    }

    receiveHtml (html) {
        this.props.actions.updatePageData({ html })
    }

    render () {
        let { title } = this.props.pageData
        return (
            <div className={style.article}>
                <div className={style.container}>
                    <div className={style.title}>
                        <input value={title} onChange={::this.inputTitle} type="text" maxLength={50} placeholder="在此输入标题"/>
                    </div>
                    <LzEditor
                        active={true}
                        importContent={this.state.content}
                        cbReceiver={::this.receiveHtml}
                        fullScreen={false}
                        image={false}
                        video={false}
                        convertFormat="html"
                    />
                </div>
            </div>
        )
    }

}