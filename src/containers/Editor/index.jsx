import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import BlankPage from '../../components/BlankPage'
import Header from '../../components/Header'
import LeftSidebar from '../../components/LeftSidebar'
import Canvas from '../../components/Canvas'
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

        let id = this.props.params.id

        if (id && id !== 'new') {

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

        if (this.state.loading) {

            return <BlankPage type="loading" message="加载中，请稍候..."/>

        } else if (this.state.error) {

            return <BlankPage type="error" message="数据加载出错"/>

        } else {

            return (
                <div className={style.editPage}>
                    <Header pageData={this.props.pageData} editorState={this.props.editorState} actions={this.props.actions}/>
                    <LeftSidebar actions={this.props.actions}/>
                    <Canvas pageData={this.props.pageData} editorState={this.props.editorState} actions={this.props.actions}/>
                    <RightSidebar errors={this.props.errors} pageData={this.props.pageData} editorState={this.props.editorState} actions={this.props.actions}/>
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
