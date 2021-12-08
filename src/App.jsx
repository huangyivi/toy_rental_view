import React, { Component } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './view/Home'
import Login from './view/Login'
import router from './utils/router'
import Assistant from "./view/Assistant"
export default class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' exact={true} element={<Login />}></Route>
          <Route path='/home' element={<Home />}>
            {router.map((item, key) => (
              <Route
                path={item.path}
                element={item.component}
                exact={item.exact ? true : null}
                key={item.key}
              ></Route>
            ))}
            <Route
                path="assistant"
                element={<Assistant/>}
                exact={true}
                key="assistant"
              ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    )
  }
}
