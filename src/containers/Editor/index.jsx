import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import BlankPage from '../../components/BlankPage'
import Header from '../../components/Header'
import LeftSidebar from '../../components/LeftSidebar'
import Canvas from '../../components/Canvas'
import Article from '../../components/Article'
import RightSidebar from '../../components/RightSidebar'
import { getPoster } from '../../io'
import * as editorActions from '../../actions/editor'
import style from './style.scss'

class Editor extends React.Component{

    constructor(props) {

        super(props)

        this.state = {
            loading: false,
            error: false
        }

    }

    componentWillMount() {

        let { id } = this.props.params

        if (id && id !== 'newposter' && id !== 'newarticle') {

            this.setState({
                loading: true
            })

            getPoster(id).then((data) => {
                data.elements = JSON.parse(data.elements)
                data.background = JSON.parse(data.background)
                this.props.actions.updatePageData(data)
                this.setState({
                    loading: false
                })
            })

        }

    }

    render() {

        if (!this.props.userinfo) {
          return null
        }

        let { id } = this.props.params
        let { type } = this.props.pageData

        if (this.state.loading) {
            return <BlankPage type="loading" message="加载中，请稍候..."/>
        } else if (this.state.error) {
            return <BlankPage type="error" message="数据加载出错"/>
        }

        if (id === 'newposter' || type === 1) {
            return (
                <div className={style.editPage}>
                    <Header type={1} pageType="editor" pageData={this.props.pageData} editorState={this.props.editorState} actions={this.props.actions}/>
                    <LeftSidebar actions={this.props.actions}/>
                    <Canvas pageData={this.props.pageData} editorState={this.props.editorState} actions={this.props.actions}/>
                    <RightSidebar errors={this.props.errors} pageData={this.props.pageData} editorState={this.props.editorState} actions={this.props.actions}/>
                </div>
            )
        } else if (id === 'newarticle' || type === 2) {
            return (
                <div className={style.editPage}>
                    <Header type={2} pageType="editor" pageData={this.props.pageData} editorState={this.props.editorState} actions={this.props.actions}/>
                    <Article initialContent={this.props.pageData.html} pageData={this.props.pageData} actions={this.props.actions}/>
                </div>
            ) 
        }

    }

}

const mapStateToProps = (state) => {

  return {
      pageData: state.editor.pageData,
      editorState: state.editor.editorState,
      userinfo: state.user.userinfo,
      errors: state.editor.errors
  }

}

const mapDispatchToProps = (dispatch) => {

    return {
        actions: bindActionCreators(editorActions, dispatch)
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
