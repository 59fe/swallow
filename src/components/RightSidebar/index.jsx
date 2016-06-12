import React from 'react'
import { Icon } from 'antd'
import classNames from 'classnames'
import style from './style.scss'
import createStore from '../../store'

const store = createStore()

export default class RightSidebar extends React.Component{

    constructor(props) {

        super(props)

        this.state = {
            pageBackgroundImage: null
        }

    }

    render() {

        let pageData = this.props.pageData

        return (
            <div className={style.rightSidebar}>
                <div className={style.optionGroup}>
                    <h5 className={style.optionCaption}>全局参数</h5>
                    <div className={style.optionBody}>
                        <label className={style.opitonLabel}>页面类型</label>
                        <div className={style.optionPageType}>
                            <button><Icon type="mobile" /> 移动端</button>
                            <button><Icon type="laptop" /> 桌面端</button>
                        </div>
                        <div className={style.groupLine}></div>
                        <label className={style.opitonLabel}>页面标题</label>
                        <input type="text" onChange={(e) => this.__updatePageData('title', e.currentTarget.value)} defaultValue={pageData.title} className={style.textOption}/>
                        <label className={style.opitonLabel}>页面别名(英文和数字的组合)</label>
                        <input type="text" onChange={(e) => this.__updatePageData('slug', e.currentTarget.value)} defaultValue={pageData.slug} className={style.textOption}/>
                        <div className={style.groupLine}></div>
                        <label className={style.opitonLabel}>背景图片</label>
                        <div className={style.fileOptionWrap}>
                            <button onClick={() => this.__clearBackgroundImage()} className={style.clearFile}><Icon type="delete" /></button>
                            <input onChange={(e) => this.__convertImage(e)} type="file"/>
                            <span className={style.selectedFileName}><Icon type="picture" /> {pageData.backgroundImageName || '选择图片'}</span>
                        </div>
                        <label className={style.opitonLabel}>背景颜色</label>
                        <input type="color" defaultValue={pageData.backgroundColor} onChange={(e) => this.__updatePageData('backgroundColor', e.currentTarget.value)} className={style.textOption}/>
                        <div className={style.groupLine}></div>
                        <label className={style.opitonLabel}>微信分享图标</label>
                        <input type="text" defaultValue={pageData.wxImage} onChange={(e) => this.__updatePageData('wxImage', e.currentTarget.value)} className={style.textOption}/>
                        <label className={style.opitonLabel}>微信分享标题</label>
                        <input type="text" defaultValue={pageData.wxTitle} onChange={(e) => this.__updatePageData('wxTitle', e.currentTarget.value)} className={style.textOption}/>
                        <label className={style.opitonLabel}>微信分享描述</label>
                        <textarea defaultValue={pageData.wxDesc} onChange={(e) => this.__updatePageData('wxDesc', e.currentTarget.value)} className={classNames(style.textOption, style.textarea)}></textarea>
                        <label className={style.opitonLabel}>百度统计代码</label>
                        <textarea defaultValue={pageData.baiduStatistics} onChange={(e) => this.__updatePageData('baiduStatistics', e.currentTarget.value)} className={classNames(style.textOption, style.textarea)}></textarea>
                    </div>
                </div>
            </div>
        )

    }

    __updatePageData(name, value) {

        var tempData = {}
        tempData[name] = value
        this.props.actions.updatePageData(tempData)

    }

    __clearBackgroundImage() {

        this.__updatePageData('backgroundImageData', '')
        this.__updatePageData('backgroundImageName', '')

    }

    __convertImage(e) {

        var file = e.currentTarget.files[0];
        var imageType = /image.*/;

        if (file && file.type.match(imageType)) {

            var reader = new FileReader();
            reader.onload = (e) => {
                this.__updatePageData('backgroundImageData', reader.result)
            }
            this.__updatePageData('backgroundImageName', file.name)
            reader.readAsDataURL(file); 

        } else {
            console.log('文件格式不支持')
        }

    } 

}