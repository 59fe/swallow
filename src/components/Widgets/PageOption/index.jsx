import React from 'react'
import { Icon, Switch, Select, notification } from 'antd'
import { guid, configJson } from '../../../functions'
import { uploadFile } from '../../../io'
// import * as config from '../../../config.json'
import style from '../../RightSidebar/style.scss'

const Option = Select.Option

const showError = (error) => {
    notification.error({
        message: '警告',
        description: '图片上传失败'
    })
}

export default class LinkOption extends React.Component{

    constructor(props) {

        super(props)
        this.state = {
            'show': true
        }

    }

    render() {

        let toggleIcon = !this.state.show ? <Icon type="up" /> : <Icon type="down" />
        let pageData = this.props.pageData
        let widgetClassNames = [style.widget]
        let addBackgroundBtn = <button onClick={() => this.__addBackground()} className={style.fullWidthBtn}><Icon type="picture" /> 增加背景图片</button>

        let errors = this.props.errors || {}

        !this.state.show && widgetClassNames.push(style.hideWidget)

        const createBackgroundSelector = (item, key) => {

            let index = item.id
            let rightBtn
            let classNames = [style.fileOptionWrap]

            if (item.uploading === 1) {
                classNames.push(style.unclickable)
                rightBtn = <button className={style.clearFile}><Icon type="loading" /></button>
            } else {
                rightBtn = <button onClick={() => this.__removeBackground(index)} className={style.clearFile}><Icon type="delete" /></button>
            }

            if (item.uploading === 2) {
                classNames.push(style.uploadError)
            }

            return (
                <div key={key} className={classNames.join(' ')}>
                    {rightBtn}
                    <input onChange={(e) => this.__changeBackground(e, index)} type="file"/>
                    <span className={style.selectedFileName}><Icon type="picture" /> {item.name || '选择图片'}</span>
                </div>
            )

        }

        return (
            <div className={widgetClassNames.join(' ')} data-show={this.state.show}>
                <h5 onClick={() => this.__toggleWidget()} className={style.widgetCaption}>页面属性<span className={style.toggleWidget}>{toggleIcon}</span></h5>
                <div className={style.widgetBody}>
                    <label className={style.opitonLabel}>页面类型</label>
                    <Select className={style.selectOption} size="large" onChange={(value) => this.__updatePageData('layout', value)} defaultValue="mobile" value={pageData.layout}>
                        <Option key="0" value="mobile"><Icon type="mobile" /> 移动端</Option>
                        <Option key="1" value="pc"><Icon type="laptop" /> 桌面端</Option>
                    </Select>
                    <div className={style.groupLine}></div>
                    <label className={style.opitonLabel}><span className={style.bgRed}>*</span>页面标题</label>
                    <input data-error={errors.title} type="text" onChange={(e) => this.__updatePageData('title', e.currentTarget.value)} defaultValue={pageData.title} className={style.textOption}/>
                    <div className={style.groupLine}></div>
                    <label className={style.opitonLabel}>背景图片</label>
                    {pageData.background.map(createBackgroundSelector)}
                    {addBackgroundBtn}
                    <div className={style.groupLine}></div>
                    <label className={style.opitonLabel}>背景颜色</label>
                    <input type="text" value={pageData.backgroundColor} onChange={(e) => this.__updatePageData('backgroundColor', e.currentTarget.value)} style={{fontWeight: 'bold'}} className={style.textOption}/>
                    <input type="color" value={pageData.backgroundColor} onChange={(e) => this.__updatePageData('backgroundColor', e.currentTarget.value)} className={style.textOption}/>
                    <div className={style.groupLine}></div>
                    <label data-if-layout="mobile" className={style.opitonLabel}>分享图标</label>
                    <input data-if-layout="mobile" type="text" defaultValue={pageData.shareImage} onChange={(e) => this.__updatePageData('shareImage', e.currentTarget.value)} className={style.textOption}/>
                    <label data-if-layout="mobile" className={style.opitonLabel}>分享标题</label>
                    <input data-if-layout="mobile" type="text" defaultValue={pageData.shareTitle} onChange={(e) => this.__updatePageData('shareTitle', e.currentTarget.value)} className={style.textOption}/>
                    <label data-if-layout="mobile" className={style.opitonLabel}>分享描述</label>
                    <textarea data-if-layout="mobile" defaultValue={pageData.shareDesc} onChange={(e) => this.__updatePageData('shareDesc', e.currentTarget.value)} className={[style.textOption, style.textarea].join(' ')}></textarea>
                    <label className={style.opitonLabel}>启用访问统计</label>
                    <Switch defaultChecked={pageData.statistics === '1'} onChange={(checked) => this.__updatePageData('statistics', checked ? '1' : '0')} />
                </div>
            </div>
        )

    }

    __toggleWidget() {

        this.setState({
            show: !this.state.show
        })

    }

    __updatePageData(name, value) {

        var tempData = {}
        tempData[name] = value
        this.props.actions.updatePageData(tempData)

    }

    __removeBackground(index) {
        this.props.actions.removeBackground(index)
    }

    __addBackground() {

        this.props.actions.addBackground({
            'id': guid(),
            'name': null,
            'data': null,
            'height': 0,
            'url': null
        })

    }

    __changeBackground(e, index) {

        var file = e.currentTarget.files[0];
        var imageType = /image.*/;

        if (file && file.type.match(imageType)) {

            var reader = new FileReader();
            reader.onload = (e) => {
                this.props.actions.updateBackground({ index, data: {
                    uploading: 1,
                    name: '[' + Math.round(file.size/1024) + 'KB]' + file.name,
                    data: reader.result
                }})
            }

            reader.readAsDataURL(file);

            uploadFile(file, {

                onupload: (data) => {

                    if (!data) {
                        return false
                    }

                    this.props.actions.updateBackground({ index, data: {
                        data: null,
                        url:  configJson().APIURL + '/api' + data.tempUrl,
                        releaseUrl: data.releaseUrl,
                        uploading: 0
                    }})

                    let tempFile = {}
                    tempFile[data.tempUrl] = data.releaseUrl
                    this.props.actions.addTempFile(tempFile)

                },

                onerror: (e) => {
                    showError('图片上传失败')
                    this.props.actions.updateBackground({ index, data: {
                        data: null,
                        url: null,
                        releaseUrl: null,
                        uploading: 2
                    }})
                }

            })

        } else if(file.size > 1024 * 1000 * 2) {
            console.log('文件尺寸不能超过2M')
        } else {
            console.log('文件格式不支持')
        }

    }

}
