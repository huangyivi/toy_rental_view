import React, { Component } from 'react'
import { HashRouter } from 'react-router-dom'
import './App.css'
import Home from './view/Home'
export default class App extends Component {
  render () {
    return (
      <HashRouter>
        <Home />
      </HashRouter>
    )
  }
}
