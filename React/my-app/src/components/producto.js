import React, { Component } from 'react';

class Producto extends Component {

    componentDidMount = () =>{
       let algo = this.props.Producto;
       console.log(algo);
    }
    marcar = () =>{
        this.props.marcarItem(this.props.producto)
    }
    render(){
     
        return(
            <p>hola</p>
        )
    }
}
export default Producto;

/*             */