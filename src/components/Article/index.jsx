import React from 'react'
import style from './style.scss'
import LzEditor from 'react-lz-editor'

const uploadConfig = {
    QINIU_URL: "http://up.qiniu.com", //上传地址，现在暂只支持七牛上传
    QINIU_IMG_TOKEN_URL: "/api/qiniu_token", //请求图片的token
    QINIU_PFOP: {
        url: "/api/qiniu_files" //七牛持久保存请求地址
    },
    QINIU_VIDEO_TOKEN_URL: "/api/qiniu_token", //请求媒体资源的token
    QINIU_FILE_TOKEN_URL: "/api/qiniu_token", //其他资源的token的获取
    QINIU_IMG_DOMAIN_URL: "http://fecdn.qeebike.com/", //图片文件地址的前缀
    QINIU_DOMAIN_VIDEO_URL: "http://fecdn.qeebike.com/", //视频文件地址的前缀
    QINIU_DOMAIN_FILE_URL: "http://fecdn.qeebike.com/" //其他文件地址前缀
}

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
                content: this.props.initialContent.split('<!--EDITOR_CONTENT-->')[1] || ''
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
                        <input value={title} onChange={::this.inputTitle} type="text" maxLength={50} placeholder="在此输入活动标题"/>
                        <span>提示：活动标题将显示在APP或者微信的顶栏</span>
                    </div>
                    <LzEditor
                        active={true}
                        importContent={this.state.content}
                        cbReceiver={::this.receiveHtml}
                        fullScreen={false}
                        image={true}
                        audio={true}
                        video={true}
                        uploadConfig={uploadConfig}
                        convertFormat="html"
                    />
                </div>
            </div>
        )
    }

}