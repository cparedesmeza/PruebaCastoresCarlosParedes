import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from 'sweetalert2';


class Login extends Component {

    state = {
        usuario : {},
        status: 'null'
    }
    nombreRef = React.createRef();
    contraseñaRef = React.createRef();
    changeState = () =>{
        this.setState({
            usuario: {
                nombre : this.nombreRef.current.value,
                contraseña : this.contraseñaRef.current.value
            }
        })
    }

    sendForm = async (e) =>{

        e.preventDefault(); 
        this.changeState();
    
        const requestOptions = {
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json' 
            }
        };

        try {
            const response = await axios.post('http://localhost:4000/login', this.state.usuario, requestOptions);
            if (response.data.message === 'success') {
                this.setState({
                    usuario : response.data.results[0],
                    status: response.data.message
                })
                Swal.fire({
                    title: "Bienvenido",
                    text: "Sesion iniciada",
                    icon: "success"
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
            
    render() {
        if(this.state.status === 'success'){
            return (
                <React.Fragment>
                    <Redirect to={'/home/' + this.state.usuario.id_usuario}></Redirect>
                    
                </React.Fragment>
            );
        }
        return (
            
            <div className="big-form">

                <div className="item center">
                    <div className="img-wrap">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUj0vUiHdpHrDX5xPu2-kMtzomw6EswVc5SQ&s" alt="castores logo"/>
                    </div>
                </div>

                <div className="subitem flexBox-column">

                    <h3 className="title">Bienvenidos</h3>

                    <form className="form flexBox-column" id="was-validated" onSubmit={this.sendForm} onChange={this.changeState}>

                        <div className="item">
                            <label htmlFor="uname" className="form-label">Usuario:</label>
                            <input type="text" className="form-control" id="uname" placeholder="Usuario" name="uname"
                            ref={this.nombreRef} required/>
                        </div>
                        <div className="item">
                            <label htmlFor="pwd" class="form-label">Contraseña:</label>
                            <input type="password" className="form-control" id="pwd" placeholder="***" name="pswd"
                            ref={this.contraseñaRef} required/>
                        </div>
                        <div className="item center">
                            <button className="btn" type="submit">Enviar</button>
                        </div>

                    </form>
                </div>
            </div>
        );
    }
}
export default Login;