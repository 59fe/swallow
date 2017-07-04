import React from 'react'
import { bindActionCreators } from 'redux'
import * as listActions from '../../actions/list'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Table, Icon, Modal, Pagination, message, Switch } from 'antd'
import style from './style.scss'
import Header from '../../components/Header'
import { formatTime, JSON2URL } from '../../functions'
import * as IO from '../../io'
import * as Config from '../../config.json'

class List extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            error: false,
            inited: false,
            total: 0,
            posters: [],
            filter: {
                page: 0,
                type: 1,
                title: '',
                attention:''
            }
        }
    }

    componentWillMount() {
        this.loadPosters(this.props.location.query)
    }

    //请求列表数据
    loadPosters(props) {

        const page = props.page || 0
        const type = props.type || 1
        const title = props.title || ''
        const attention = props.attention || ''
        const filter = { page, type, title, attention }
        const inited = true
        const loading = false

        this.setState({
            loading: true
        })

        IO.getPosters({
            layout: '',
            index: page,
            title: title,
            type: type,
            attention: attention
        }).then((data) => {
            let posters = data.list
            let total = data.total
            this.setState({ loading, filter, total, posters, inited })
            this.props.actions.cacheListData({
              'items': posters
            })
        }).catch((error) => {
            this.setState({ loading, filter, error })
        })

    }

    //筛选列表数据
    changeFilter(propName, propValue) {

        let filter = { ...this.state.filter }
        filter[propName] = propValue
        this.setState({ filter })
        let obj
        if (propName == 'type') {
          obj = {
            title : '',
            type: propValue,
            page: 0,
            attention: this.state.filter.attention
          }
        }else if(propName == 'attention'){
          obj = {
            title : '',
            type: this.state.filter.type,
            page: 0,
            attention:propValue ? 1 : ''
          }
        }else{
          obj = {
            title : propValue,
            type: '',
            page: 0,
            attention:''
          }
        }
        this.loadPosters(obj)

    }

    //搜索列表数据
    applyFilter() {
        location.hash = 'list?' + JSON2URL(this.state.filter)
    }

    //删除列表确认弹窗
    showConfirm(id) {

      let self = this

      Modal.confirm({
        title: '你确定要删除这条活动信息吗？',
        content: '',
        onOk: function() {

          IO.deletePoster( id ).then((data) => {

            if (data) {
              self.props.actions.deletePoster({
                'id': id
              })
            }

          }).catch((error) => {

          })

        }
      });

    }

    //关注和取消关注状态
    attentionStatus(id,attention) {

        if (attention) {
          attention = 0
        } else {
          attention = 1
        }

        IO.Attention(id, attention).then((data) => {
          if(data){
            this.props.actions.updatePoster({
              'id': id,
              'item': {
                'attention': attention
              }
            })
          }
        }).catch((error) => {
            //
        })
    }

    //分页获取列表数据
    listPages(page, type, attention){

      IO.getPosters({
          layout: '',
          index: page - 1,
          title: '',
          type: type,
          attention: attention
      }).then((data) => {
          this.props.actions.cacheListData({
            'items': data.list
          })
      })

    }

    render() {

        const page = this.state.filter.page || 0
        const type = this.state.filter.type || 1
        const title = this.state.filter.title || ''
        const attention = this.state.filter.attention || ''
        const { posters, loading, error, total } = this.state
        const data = this.props.posters
        const { userinfo } = this.props

        let self = this

        //筛选关注与否的开关
        function onChange(checked){

          if(checked){
            self.changeFilter('attention','1')
          }else{
            self.changeFilter('attention','')
          }

        }

        if (error) {
            return (
                <div className={style.listPage}>
                    <Header pageType="list"/>
                    <div className={style.pageContainer}>
                        <div className={style.listError}></div>
                    </div>
                </div>
            )
        }

        if (loading) {
            return (
                <div className={style.listPage}>
                    <Header pageType="list"/>
                    <div className={style.pageContainer}>
                        <div className={style.listLoading}></div>
                    </div>
                </div>
            )
        }

        return (
            <div className={style.listPage}>
                <Header userinfo={this.props.userinfo} pageType="list"/>
                <div className={style.pageContainer}>
                    <div className={style.listFilter}>
                        <div className={style.listTypes}>
                            <a className={type === 1 && style.active} onClick = { () => this.changeFilter('type', 1) }>海报</a>
                            <a className={type === 2 && style.active} onClick = { () => this.changeFilter('type', 2) }>文章</a>
                        </div>
                        {userinfo && userinfo.uid && <div className={style.attentionType}>关注：<Switch defaultChecked={ attention ? true :false}  onChange={ onChange } /></div>}
                        <div className={style.listSearcher}>
                            <button onClick={(e) => this.applyFilter()} className={style.listSearchBtn}><Icon type="search" /> 搜索</button>
                            <input
                                onKeyDown={(e) => {e.keyCode === 13 && this.changeFilter('title', e.currentTarget.value)}}
                                type="text" className={style.listSearchInput} placeholder="按标题搜索"/>
                            <span onClick={(e) => this.changeFilter('title','')} className={style.btnClearSearchInput}>清空输入框</span>
                        </div>
                    </div>
                    <ul className={style.listItems}>
                        <li className={style.listHead}>
                            {userinfo && userinfo.uid && <span className={style.attention}>关注</span>}
                            <span className={style.itemTitle}>标题</span>
                            <span className={style.itemAuthor}>作者</span>
                            <span className={style.itemType}>类型</span>
                            <span className={style.itemDate}>修改时间</span>
                            {userinfo && userinfo.uid && <span className={style.itemOptBtns}>操作</span>}
                        </li>
                        {data.map((item, index) => {
                            return (
                                <li key={index + 1}>
                                    {userinfo && userinfo.uid && <div className={style.attention} >
                                        <Icon onClick={ () => this.attentionStatus( item.id, item.attention)} type={ item.attention ? 'star' : 'star-o'} />
                                    </div>}
                                    <div className={style.itemTitle} >
                                        <a href={Config.CDNURL  + (item.type === 2 ? 'article' : 'activity') + '/' + item.pathname} target="_blank">{item.title}</a>
                                    </div>
                                    <span className={style.itemAuthor} >
                                        {item.author}
                                    </span>
                                    <span className={style.itemType}>{item.type === 1 ? '海报' : '文章'}</span>
                                    <span className={style.itemDate}>{formatTime(item.updateDate || item.createDate)}</span>
                                    {userinfo && userinfo.uid &&   <div className={style.itemOptBtns}>
                                        <a onClick={ () => this.showConfirm(item.id) }><Icon type="delete" /> 删除</a>
                                    </div>}
                                    {userinfo && userinfo.uid && <div className={style.itemOptBtns}>
                                        <a href={'#/edit/' + item.id} target="_blank"><Icon type="edit" /> 修改</a>
                                    </div>}
                                </li>
                            )
                        })}
                    </ul>
                    <div className={style.page}>
                        { total ? <Pagination onChange={ (current ) => this.listPages(current, this.state.filter.type, this.state.filter.attention) } pageSize={20} total={total} /> : null}
                    </div>
                </div>
            </div>
        )

    }

}

 const mapStateToProps = (state) => {
    return {
      posters: state.list.posters.items,
      userinfo: state.user.userinfo
    }
 }

 const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(listActions, dispatch)}
 }

 export default connect(mapStateToProps, mapDispatchToProps)(List)
