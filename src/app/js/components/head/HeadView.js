/**
 * HeadView
 *
 * Renders the tabs at the top
 *
 * @property {Number} activeTab
 * @property {Object} connections all connections
 * @property {Function} addConnection
 * @property {Function} closeTab
 * @property {Function} setActiveTab
 * @property {Function} setTabOrder
 */

import React, { Component } from 'react'

import RemoveIcon from '../../icons/Remove'

import { createNewConnection, removeConnection } from '../../socketManager'

class Head extends Component {

    constructor (props) {
        super(props)

        this.state = {
            dragging: null
        }

        if ( !props.connections.length ) {
            const newId = new Date().getTime()
            props.addConnection(newId)
            createNewConnection(newId)
            this.props.setActiveTab(newId)
        }

        this.addConnection = this.addConnection.bind(this)
        this.setThisTabActive = this.setThisTabActive.bind(this)
        this.closeThisTab = this.closeThisTab.bind(this)
        this.dragStart = this.dragStart.bind(this)
        this.dragOverHandler = this.dragOverHandler.bind(this)
        this.dragEndHandler = this.dragEndHandler.bind(this)
    }

    componentDidMount() {
        document.addEventListener('dragover', this.dragOverHandler)
        document.addEventListener('dragend', this.dragEndHandler)
    }

    componentWillUnmount() {
        document.removeEventListener('dragover', this.dragOverHandler)
        document.removeEventListener('dragend', this.dragEndHandler)
    }

    /**
     * Keeps track of where the dragged tab is currently being held over and updates the tab order
     */
    dragOverHandler (event) {
        const targetOrder = parseInt(event.target.style.order, 10)
        const targetParentClass = event.target.parentElement.classList
        const targetId = event.target.id
        if ( !this.state.dragging )
            return
        const dragId = this.state.dragging.toString()
        if ( targetId !== dragId && targetOrder && targetParentClass.length === 1 && targetParentClass[0] === 'header' ) {
            const connections = this.props.connections
            const currentOrder = connections.list[connections.connections[dragId].index].order
            let newOrder
            if ( targetOrder > currentOrder )
                newOrder = targetOrder - 1
            else
                newOrder = targetOrder
            if ( newOrder !== currentOrder ) {
                this.props.setTabOrder(parseInt(dragId, 10), newOrder)
            }
        }
    }

    /**
     * Sets 'dragging' to null
     */
    dragEndHandler () {
        this.setState({
            dragging: null
        })
    }

    /**
     * Sets 'dragging' to id of tab that's being dragged
     * 
     * @param {Object} tab
     */
    dragStart (tab) {
        setTimeout(() =>
            this.setState({
                dragging: tab.id
            })
        , 1)
    }

    /**
     * Add a new connection to the store, also creates a new tab and sets it as the active tab
     */
    addConnection () {
        const newId = new Date().getTime()
        createNewConnection(newId)
        this.props.addConnection(newId)
        this.props.setActiveTab(newId)
    }

    /**
     * Sets a new tab as the active tab
     * 
     * @param {Number} id
     */
    setThisTabActive (id) {
        if ( id !== this.props.activeTab )
            this.props.setActiveTab(id)
    }

    /**
     * Removes a tab and it's connection
     * 
     * @param {Number} id
     */
    closeThisTab (id) {
        this.props.closeTab(id)
        removeConnection(id)
        if ( id === this.props.activeTab )
            this.setPreviousTabActive()
    }

    /**
     * Sets the previous tab in the list as the active tab
     */
/* eslint-disable complexity */
    setPreviousTabActive () {
        const id = this.props.activeTab
        const list = this.props.connections.list

        const filteredList = list.filter( tab => !tab.disabled )

        if ( !filteredList.length )
            return this.addConnection()

        let index
        let thisTab
        list.find((tab, i) => {
            thisTab = tab.id === id
            if ( thisTab ) index = i
            return thisTab
        })

        let newId = false

        while (!newId) {
            index--
            if ( index < 0 )
                newId = true
            else if ( !list[index].disabled )
                newId = list[index].id
        }

        if ( newId === true )
            newId = false

        const listLength = list.length
        while (!newId) {
            index++
            if ( index > listLength )
                newId = true
            else if ( !list[index].disabled )
                newId = list[index].id
        }

        if ( newId )
            this.props.setActiveTab(newId)
        else
            throw new Error("Unexpectedly ran out of tabs")
    }
/* eslint-enable complexity */

    /**
     * Returns true if the tab with this id is currently being dragged
     * 
     * @param  {Number} id
     * 
     * @return {Boolean}
     */
    amIBeingDragged (id) {
        return this.state.dragging === id
    }

    render () {
        const tabs = this.props.connections.list.filter(c => !c.disabled)
        let activeTab = this.props.activeTab
        if ( activeTab === -1 && tabs.length )
            activeTab = tabs.slice(-1)[0].id
        return (
            <div className="header">
                {tabs.map((tab, i) =>
                    <Tab
                        key={i}
                        tab={tab}
                        active={activeTab === tab.id}
                        setThisTabActive={this.setThisTabActive}
                        closeThisTab={this.closeThisTab}
                        dragStart={this.dragStart}
                        order={tab.order}
                        imBeingDragged={this.amIBeingDragged(tab.id)}
                    />
                )}
                <AddButton addConnection={this.addConnection} order={this.props.connections.list.length + 1} />
            </div>
        )
    }
}

export default Head

const Tab = ({tab, active, setThisTabActive, closeThisTab, dragStart, order, imBeingDragged}) =>
    <div
        id={tab.id}
        style={{order}}
        draggable={true}
        onDragStart={e => dragStart(tab)}
        className={`header-tab ${ active ? 'header-tab-active' : '' } ${imBeingDragged ? 'header-tab-fade' : ''}`}
        onClick={e => setThisTabActive(tab.id)}
    >
        <span className="header-tab-title">{shrinkUrl(tab.url)||'New tab'}</span>
        <span className="header-tab-close" onClick={e => {e.stopPropagation(); closeThisTab(tab.id)} }>
            <RemoveIcon size={12} color={active ? "#e6e6e6" : "#7a54a8"}/>
        </span>
    </div>

const AddButton = ({addConnection, order}) =>
    <div
        id="add-button"
        className="header-button-plus"
        onClick={addConnection}
        style={{order}}
    >
        <span>+</span>
    </div>

function shrinkUrl (url) {
    let result = url
    if ( url.length > 18 )
        result = `${url.slice(0, 16)}...`
    return result
}
