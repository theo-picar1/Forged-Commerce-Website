import React, {Component} from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { ACCESS_LEVEL_GUEST } from "./config/global_constants.ts"

import "bootstrap/dist/css/bootstrap.css"
import "./css/styles.css"

import Home from "./components/Home.tsx"
import NoPageFound from "./components/NoPageFound.tsx"
import Login from "./components/Login.tsx"
import Register from "./components/Register.tsx"
import ForgotPassword from "./components/ForgotPassword.tsx"

if(typeof localStorage.accessLevel === "undefined" || typeof localStorage.accessLevel === undefined) {
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
    localStorage.token = null
    localStorage.id = undefined
    localStorage.cartId = undefined
}

export default class App extends Component 
{
    render() 
    {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/login" component={ Login }></Route>
                    <Route exact path="/register" component={ Register }></Route>
                    <Route exact path="/forgot-password" component={ ForgotPassword }></Route>
                    
                    <Route path="/" component={ Home }></Route> {/* Can't use exact as Home page won't render with exact when calling something esle like /cart*/}
                    <Route component={ NoPageFound }></Route>
                </Switch>
            </BrowserRouter>   
        )
    }
}