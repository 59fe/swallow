import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Icon, Modal, notification, message } from 'antd'
import { Link } from 'react-router'
import { validatePageData, buildTemplate, formatTime } from '../../functions'
import * as IO from '../../io'
import * as config from '../../config.json'
import Previewer from '../Previewer'
import style from './style.scss'

const showNotification = (msg, type = "error") => {

    let msgs = {
        'error': '错误',
        'success': '提醒'
    }

    notification[type]({
        message: msgs[type] || '提醒',
        description: msg
    })

}

const copyPosterUrl = () => {

    document.getElementById('poster-url-field').select()
    if (document.execCommand('Copy', false, null)) {
        message.success('复制成功！')
    } else {
        message.error('复制失败，请手动复制')
    }

}

const showPubModal = (pathname, title = "发布成功") => {

    let now = new Date().getTime()

    Modal.success({
        'title': title,
        'width': 620,
        'content': (
            <div className={style.copierBox}>
                <input className={style.publicUrl} id="poster-url-field" defaultValue={config.CDNURL + "/" + pathname + '?t=' + now} />
                <a className={style.btnCopyUrl} onClick={() => copyPosterUrl()} href="javascript:void(0);" id="btn-copy-url">复制地址</a>
                <a className={style.btnViewUrl} href={config.CDNURL + "/" + pathname + '?t=' + now} target="_blank">立即查看</a>
            </div>
        ),
        'okText': '好的'
    })

}

export default class Header extends Component {

    render() {

        let { pageData, editorState, userinfo, type } = this.props
        type = type || 'editor'

        if (type === 'editor') {

            return (
                <header className={style.appHeader}>
                    <div className={style.logo}></div>
                    <div className={style.headerBtns}>
                        <a className={style.btnNormal} href="./"><Icon type="left" /> 返回列表</a>
                        <button className={style.btnClear} onClick={() => this.__clear()}><Icon type="reload" /> 清空</button>
                        <button className={style.btnSave} onClick={() => this.__save()}><Icon type="save" /> 保存</button>
                        <button className={style.btnPreview} onClick={() => this.__preview()}><Icon type="eye-o" /> 预览</button>
                        <button className={style.btnLiveview + ' ' + (!pageData.isPublish && style.disabled)} onClick={() => this.__liveview()}><Icon type="caret-circle-o-right" /> 在线查看</button>
                        <button className={style.btnPublish} onClick={() => this.__publish()}><Icon type="check" /> 发布</button>
                    </div>
                    <div className={style.caption}>
                        <h5>{(pageData.title ? pageData.title : '未命名项目')}</h5>
                        <h6>{pageData.lastSaveTime ? '上次保存于' + formatTime(pageData.lastSaveTime, 'hh:mm:ss') : '当前项目未保存'}</h6>
                    </div>
                </header>
            )

        } else {

            return (
                <header className={style.appHeader}>
                    <div className={style.logo}></div>
                    {(userinfo && userinfo.uid) ?
                    <div className={style.headerBtns}>      
                        <span className={style.welcome}>欢迎您，{userinfo.uname}</span>
                        <a className={style.btnLogout} onClick = {() => this.__logout()}><Icon type="logout" />  &nbsp; 退出</a>
                        <a className={style.btnPublish} href="#/edit/new"><Icon type="plus" /> 新建海报</a>
                    </div> :
                    <div className={style.headerBtns}>      
                        <a className={style.btnPublish} href="//tms.dbike.me/#/login?referer=swallow"><Icon type="user" /> 登录</a>
                    </div>
                    }
                    <div className={style.caption}>
                        <h5>Swallow</h5>
                        <h6>海报活动页生成工具</h6>
                    </div>
                </header>
            )

        }

    }

    __save() {

        let actions = this.props.actions

        let data = JSON.parse(JSON.stringify(this.props.pageData))
        let result = validatePageData(data)
        let updatedBackground = []

        data.html = buildTemplate(data, data.layout, true)

        if (result === true) {

            let now = new Date().getTime()

            if (data.id) {

                console.log('更新海报')

                data = { ...data }
                data.elements = JSON.stringify(data.elements)
                updatedBackground = data.background.map((item) => {
                    return { ...item, url: item.releaseUrl }
                })
                data.background = JSON.stringify(updatedBackground)

                IO.updatePoster(data.id, data).then((res) => {
                    actions.updatePageData({
                        background: updatedBackground,
                        lastSaveTime: now,
                        tempFiles: []
                    })
                    showNotification('更新成功！', 'success')
                }).catch((e) => {
                    showNotification(e.msg || e.message || '发生错误', 'error')
                    console.error(e)
                })

            } else {

                console.log('保存海报')

                data = { ...data }
                data.elements = JSON.stringify(data.elements)
                updatedBackground = data.background.map((item) => {
                    return { ...item, url: item.releaseUrl }
                })
                data.background = JSON.stringify(updatedBackground)

                IO.savePoster(data).then((res) => {
                    actions.updatePageData({
                        id: res.id,
                        background: updatedBackground,
                        lastSaveTime: now,
                        tempFiles: []
                    })
                    showNotification('保存成功！', 'success')
                }).catch((e) => {
                    showNotification(e.msg || e.message || '发生错误', 'error')
                    console.error(e)
                })

            }

            actions.toggleError(false)

        } else {
            showNotification('请完善必填字段')
            actions.toggleError(result)
        }

    }

    __publish() {

        let actions = this.props.actions

        let now = new Date().getTime()
        let data = JSON.parse(JSON.stringify(this.props.pageData))
        let result = validatePageData(data)
        let updatedBackground = []

        data.html = buildTemplate(data, data.layout, true)

        if (!data.id) {
            showNotification('发布前请先保存！')
            return false
        }

        if (result !== true) {
            showNotification('请完善必填字段')
            actions.toggleError(result)
            return false
        }

        actions.toggleError(false)

        data = { ...data }
        data.elements = JSON.stringify(data.elements)
        updatedBackground = data.background.map((item) => {
            return { ...item, url: item.releaseUrl }
        })
        data.background = JSON.stringify(updatedBackground)

        let pathname = data.pathname

        console.log(JSON.parse(data.background))

        IO.publishPoster(data.id, data).then((res) => {
            actions.updatePageData({
                background: updatedBackground,
                lastSaveTime: now,
                tempFiles: []
            })
            showPubModal(pathname)
        })

    }

    __liveview() {

        let { pageData } = this.props
        showPubModal(pageData.pathname, '活动页网址:')

    }

    __preview() {

        let deviceTtype = this.props.pageData.layout
        let html = buildTemplate(this.props.pageData, deviceTtype)
        //this.props.actions.fillHTML(html)

        if (deviceTtype === 'mobile') {
            ReactDOM.render(<Previewer html={html}/>, document.getElementById('mobilePreview'))
        } else {

            if (!window.__previewWindow__ || window.__previewWindow__.closed) {
                window.__previewWindow__ = window.open()
            }

            window.__previewWindow__.focus()
            window.__previewWindow__.document.write(html)

        }

    }

    __logout() {

      Modal.confirm({
        title: '你确定要退出吗？',
        content: '',
        onOk: function() {
          IO.goLogout().then(() => {
            location.reload()
          })
        }
      })

    }

    __clear() {

        if (confirm('确认清空画布么?')) {
            this.props.actions.clearPageData()
        }

    }

}
