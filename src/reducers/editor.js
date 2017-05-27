import { handleActions } from 'redux-actions'
import { findIndexById } from '../functions'

const initialState = {
    'pageData': {
        'id': null,
        'isPublish': false,
        'layout': 'mobile', //页面布局类型 varchar
        'title': '', //页面标题 varchar
        'pathname': '', //页面路径名 varchar
        'pageHeight': 0,
        'background': [],
        'backgroundColor': '#ffffff', //背景颜色 varchar
        'shareImage': '', //微信分享图标地址 varchar
        'shareTitle': '', //微信分享标题 varchar
        'shareDesc': '', //微信分享描述 varchar
        'statistics': '', //百度统计代码 text
        'elements': { // 页面元素
            'links': []
        },
        'html': '',
        tempFiles: []
    },
    'editorState' : {
        'lastSaveTime': 0, //上次保存时间 （秒级时间戳）int
        'unsave': false,
        'currentTool': null,
        'currentElement': {
            'type': null,
            'index': null
        }
    },
    'html': '', //渲染出来的HTML代码 long text
    'errors': {}
}

export default handleActions({

    'updatePageData' (state, action) {

        let editorState = Object.assign({}, state.editorState, {unsave: true})
        let pageData = Object.assign({}, state.pageData, action.payload)

        return Object.assign({}, state, { pageData }, {editorState})

    },

    'updateBackground' (state, action) {

        let editorState = Object.assign({}, state.editorState, {unsave: true})
        let background = [ ...state.pageData.background ]
        let index = findIndexById(background, action.payload.index)
        background[index] = Object.assign({}, background[index], action.payload.data)
        let pageData = Object.assign({}, state.pageData, { background })

        return Object.assign({}, state, { pageData }, {editorState})

    },

    'addBackground' (state, action) {

        let background = [ ...state.pageData.background ]
        background.push(action.payload)
        let pageData = Object.assign({}, state.pageData, { background })

        return Object.assign({}, state, { pageData })

    },

    'removeBackground' (state, action) {

        let editorState = Object.assign({}, state.editorState, {unsave: true})
        let background = [ ...state.pageData.background ]
        let index = findIndexById(background, action.payload)

        background.splice(index, 1)
        let pageData = Object.assign({}, state.pageData, { background })

        return Object.assign({}, state, { pageData }, {editorState})

    },

    'updateEditorState' (state, action) {

        let editorState = Object.assign({}, state.editorState, action.payload)
        return Object.assign({}, state, { editorState })

    },

    'addElement' (state, action) {

        let pageData = Object.assign({}, state.pageData)
        let allElements = Object.assign({}, pageData.elements)
        let elements = [ ...allElements[action.payload.element_type] ]

        elements.push(action.payload.element)
        allElements[action.payload.element_type] = elements
        pageData.elements = allElements

        return Object.assign({}, state, { pageData })

    },

    'selectElement' (state, action) {

        let editorState = Object.assign({}, state.editorState)
        editorState.currentElement = action.payload

        return Object.assign({}, state, { editorState })

    },

    'updateElement' (state, action) {

        let pageData = Object.assign({}, state.pageData)
        let element = pageData.elements[action.payload.element_type][action.payload.index]
        let new_element = Object.assign({}, element, action.payload.data)
        pageData.elements[action.payload.element_type][action.payload.index] = new_element

        return Object.assign({}, state, { pageData })

    },

    'deleteElement' (state, action) {

        let { type, index } = action.payload

        if (type && index !== null) {

            let pageData = Object.assign({}, state.pageData)
            let editorState = Object.assign({}, state.editorState)
            let elements = pageData.elements[type]

            elements && elements.splice(index, 1)
            pageData.elements[type] = elements

            if (editorState.currentElement.type === type && editorState.currentElement.index === index) {
                editorState.currentElement = {
                    type: null,
                    index: null
                }
            }

            return Object.assign({}, state, { pageData, editorState })

        }

    },

    'clearPageData' (state) {

        let pageData = Object.assign({}, initialState.pageData)
        pageData.layout = state.pageData.layout

        return Object.assign({}, initialState, { pageData })

    },

    'addTempFile' (state, action) {

        let tempFiles = [ ...state.pageData.tempFiles ]
        tempFiles.push(action.payload)
        let pageData = Object.assign({}, state.pageData, { tempFiles })

        return Object.assign({}, state, { pageData })

    },

    'toggleError' (state, action) {

        let errors = action.payload ? Object.assign({}, state.errors, action.payload) : {}
        return Object.assign({}, state, { errors })

    },

    'fillHTML' (state, action) {

        let html = action.payload.html
        return Object.assign({}, state, { html })

    }

}, initialState)