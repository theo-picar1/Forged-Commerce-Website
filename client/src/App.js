import React, {Component} from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"

import "bootstrap/dist/css/bootstrap.css"
import "./css/styles.css"

import Home from "./components/Home"
import NoPageFound from "./components/NoPageFound"

    
export default class App extends Component 
{
    render() 
    {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={ Home }></Route>
                    <Route component={ NoPageFound }></Route>
                </Switch>
            </BrowserRouter>   
        )
    }
}