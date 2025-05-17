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
                    <Route path="/" component={ Home }></Route> {/* Can't use exact as Home page won't render with exact when calling something esle like /cart*/}
                    <Route component={ NoPageFound }></Route>
                </Switch>
            </BrowserRouter>   
        )
    }
}