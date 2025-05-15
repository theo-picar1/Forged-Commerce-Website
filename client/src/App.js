import React, {Component} from "react"

import "bootstrap/dist/css/bootstrap.css"
import "./css/styles.css"

import DisplayAllCars from "./components/DisplayAllCars"

    
export default class App extends Component 
{
    render() 
    {
        return (

            <DisplayAllCars/>
            
        )
    }
}