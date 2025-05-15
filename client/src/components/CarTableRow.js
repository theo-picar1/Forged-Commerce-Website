import React, {Component} from "react"


export default class CarTableRow extends Component 
{    
    render() 
    {
        return (
            <tr>
                <td>{this.props.car.model}</td>
                <td>{this.props.car.colour}</td>
                <td>{this.props.car.year}</td>
                <td>{this.props.car.price}</td>
            </tr>
        )
    }
}