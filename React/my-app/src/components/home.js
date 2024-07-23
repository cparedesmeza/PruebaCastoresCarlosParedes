import React, { Component } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';


class Home extends Component {

    state = {
        usuario: {},
        productos1: {},
        productos2: {},
        producto: {},
        productoBD: {},
        historial: {},
        historialBd: {},
        historialBdS: {},
        rol: {},
        status: 'null',
        selectedOption: '',
        flag: false,
        request: {
            estatus: 'activo',
        },
        busqueda: {
            modulo: 'Entrada',
        }
    }

    idProductoRef = React.createRef();
    nombreRef = React.createRef();
    cantidadRef = React.createRef();
    estatusRef = React.createRef();
    busquedaRef = React.createRef();

    changeState = () => {
        const { selectedOption } = this.state;
        let producto = {};
        let historial = {};
        let busqueda = {};

        if (selectedOption === 'aumentar') {
            producto = {
                id_producto: this.idProductoRef.current.value,
                cantidad: this.cantidadRef.current.value,
            };
            historial = {
                nombre: this.state.usuario.nombre,
                tarea: 'Entrada de producto en almacén',
                id_producto: this.idProductoRef.current.value,
                movimiento: this.cantidadRef.current.value,
                modulo: 'Entrada'
            };
        } else if (selectedOption === 'editar') {
            producto = {
                id_producto: this.idProductoRef.current.value,
                estatus: this.estatusRef.current.value,
            };
            historial = {
                nombre: this.state.usuario.nombre,
                tarea: 'Edición de estatus',
                id_producto: this.idProductoRef.current.value,
                movimiento: this.estatusRef.current.value,
                modulo: 'Entrada'
            };
        } else if (selectedOption === 'nuevo') {
            producto = {
                nombre: this.nombreRef.current.value,
            };
            historial = {
                nombre: this.state.usuario.nombre,
                tarea: 'Creación de nuevo producto',
                //Aqui va el valor del id que me regresa la base de datos
                movimiento: this.nombreRef.current.value,
                modulo: 'Entrada'
            };
        } else if (selectedOption === 'disminuir') {
            producto = {
                id_producto: this.idProductoRef.current.value,
                cantidad: this.cantidadRef.current.value,
            };
            historial = {
                nombre: this.state.usuario.nombre,
                tarea: 'Salida de producto en almacén',
                id_producto: this.idProductoRef.current.value,
                movimiento: this.cantidadRef.current.value,
                modulo: 'Salida'
            };
        }


        this.setState({ producto, historial });
    }

    componentDidMount = () => {
        this.getProducts();
        this.getInactiveProducts();
        this.getHistory();
        let id = this.props.match.params.id
        this.getUser(id);

    }

    getUser = async (id) => {
        try {
            const response = await axios.get('http://localhost:4000/special/' + id);

            if (response.data.message === 'success') {
                this.setState({
                    usuario: response.data.results[0],
                    status: response.data.message
                })
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    getRol = async () => {

        let id = this.state.usuario.id_rol;

        try {
            const response = await axios.get('http://localhost:4000/rol/' + id);
            if (response.data.message === 'success') {
                this.setState({
                    rol: response.data.results[0],
                    status: response.data.message
                })
                console.log(response.data.results[0])
                if (response.data.results[0]) { }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    getProducts = async () => {

        try {
            const response = await axios.get('http://localhost:4000/productos');

            if (response.data.message === 'success') {
                this.setState({
                    productos1: response.data.results,
                    status: response.data.message
                })
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    getInactiveProducts = async () => {

        try {
            const response = await axios.get('http://localhost:4000/productosIn/' + 'Activo');

            if (response.data.message === 'success') {

                this.setState({
                    productos2: response.data.results,
                    status: response.data.message
                })
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    getProduct = async () => {

        try {
            const response = await axios.get('http://localhost:4000/productos/' + this.state.producto.id_producto);

            if (response.data.message === 'success') {

                this.setState({
                    productoBD: response.data.results,
                    status: response.data.message
                })
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    handleChange = (event) => {
        this.setState({ selectedOption: event.target.value });

    };

    /* HISTORIAL */
    sendHistory = async () => {
        const { historial } = this.state;
        const Options = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        try {
            const response = await axios.post('http://localhost:4000/historial', historial, Options)
            if (response.data.message === 'success') {

                this.setState({
                    status: response.data.message
                })
            }
        } catch (error) {
            console.log('Error con la petición:' + error);
        }
    }
    change = () => {
        let busqueda;
        busqueda = {
            modulo: this.busquedaRef.current.value
        }
        this.setState({ busqueda });
        console.log(busqueda)
    }
    getHistory = async (e) => {

        const { busqueda } = this.state;

        try {
            const response = await axios.get('http://localhost:4000/historial/' + busqueda.modulo);

            if (response.data.message === 'success') {
                console.log(response)
                if (busqueda.modulo === 'Entrada' || busqueda.modulo === 'Entradas') {
                    this.setState({
                        historialBd: response.data.results,
                        permiso: true
                    })
                }
                if (busqueda.modulo === 'Salida' || busqueda.modulo === 'Salidas') {
                    console.log(response)
                    this.setState({
                        historialBdS: response.data.results,
                        permiso1: true
                    })
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    /* REGLAS */
    disminuirError = () => {
        if (this.state.productoBD.cantidad === undefined) {
            this.state.flag = true;

        }
        else if (this.state.producto.cantidad < this.state.productoBD.cantidad) {
            this.state.flag = true;

        }
        else if (this.state.producto.cantidad >= this.state.productoBD.cantidad) {
            this.state.flag = false;

        }

    }
    aumentarError = () => {

        if (this.state.productoBD.cantidad === undefined) {
            this.state.flag = true;
        }
        if (this.state.producto.cantidad > this.state.productoBD.cantidad) {
            this.state.flag = true;
        }
        if (this.state.producto.cantidad <= this.state.productoBD.cantidad) {
            this.state.flag = false;
        }
    }
    /* ENVIA A BD */
    sendForm = async (e) => {
        e.preventDefault();
        this.getProduct();
        this.disminuirError();
        this.changeState();
        const { selectedOption } = this.state;
        const Options = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        if (selectedOption === 'nuevo') {

            Swal.fire({
                title: "Producto Agregado",
                text: "Nuevo producto en inventario",
                icon: "success"
            });
            const { producto } = this.state;
            let url = 'http://localhost:4000/producto/' + producto.nombre
            console.log(url)
            try {
                const response = await axios.get(url);
                if (response.data.message === 'success') {
                    this.setState({
                        productoBD: response.data.results,
                        status: response.data.message
                    })
                }
            } catch (error) {
                console.error('Error:', error);
            }

        }
        else if (selectedOption === 'editar') {
            Swal.fire({
                title: "Estatus Actualizado",
                text: "Estatus de producto remplazado",
                icon: "success"
            });
            try {
                const response = await axios.put('http://localhost:4000/productos/' + this.state.producto.id_producto, this.state.producto, Options);

                if (response.data.message === 'success') {
                    console.log(response.data.message)
                    this.setState({
                        producto: response.data.results[0],
                        status: response.data.message
                    })

                }
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else if (selectedOption === 'aumentar') {

            if (this.state.flag === true) {
                Swal.fire({
                    title: "Inventario No Actualizado",
                    text: "Cantidad de producto menor a la actual",
                    icon: "error"
                });
            } else {
                Swal.fire({
                    title: "Inventario Actualizado",
                    text: "Cantidad de producto modificada",
                    icon: "success"
                });
                try {
                    const response = await axios.put('http://localhost:4000/producto/' + this.state.producto.id_producto, this.state.producto, Options);

                    if (response.data.message === 'success') {

                        this.setState({
                            producto: response.data.results[0],
                            status: response.data.message
                        })

                    }
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } catch (error) {
                    console.error('Error:', error);
                }
            }

        }
        this.sendHistory();
    }

    sendForm2 = async (e) => {
        e.preventDefault();
        this.getProduct();
        this.aumentarError();
        this.changeState();
        const Options = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        const { selectedOption } = this.state;
        if (selectedOption === 'disminuir') {
            if (this.state.flag === true) {
                Swal.fire({
                    title: "Inventario No Actualizado",
                    text: "Valor mayor al inventario actual",
                    icon: "error"
                });
            } else {
                Swal.fire({
                    title: "Inventario Actualizado",
                    text: "Cantidad de producto modificada",
                    icon: "success"
                });
                try {
                    const response = await axios.put('http://localhost:4000/producto/' + this.state.producto.id_producto, this.state.producto, Options);

                    if (response.data.message === 'success') {

                        this.setState({
                            producto: response.data.results[0],
                            status: response.data.message
                        })

                    }
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }
        this.sendHistory();
    }

    sendForm3 = (e) => {
        e.preventDefault();
        this.getHistory();
    }

    logOut = () => {
        this.setState({logout: true})
    }






    render() {

        if(this.state.logout === true){
            return <Redirect to={'/login'}></Redirect>
        }
        const { selectedOption, busqueda } = this.state;

        let listProducts
        let typeUser;
        let history;
        if (this.state.status === 'success') {

            if (this.state.usuario.rol === 'Administrador') {

                listProducts = this.state.productos1.map((producto, i) => {
                    return (
                        <tr>
                            <td>{producto.id_producto}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.cantidad}</td>
                            <td>{producto.estatus}</td>
                        </tr>
                    )
                });
                typeUser = true;
                if (busqueda.modulo === 'Entrada' && this.state.permiso === true) {
                    console.log(this.state.historialBd)
                    history = this.state.historialBd.map((register, i) => {
                        return (
                            <tr key={i}>
                                <td>{register.id_historial}</td>
                                <td>{register.nombre}</td>
                                <td>{register.tarea}</td>
                                <td>{register.id_producto}</td>
                                <td>{register.movimiento}</td>
                                <td>{register.fecha_hora}</td>
                                <td>{register.modulo}</td>
                            </tr>
                        );
                    });
                } else if (busqueda.modulo === 'Salida' && this.state.permiso1 === true) {
                    history = this.state.historialBdS.map((register, i) => {
                        return (
                            <tr key={i}>
                                <td>{register.id_historial}</td>
                                <td>{register.nombre}</td>
                                <td>{register.tarea}</td>
                                <td>{register.id_producto}</td>
                                <td>{register.movimiento}</td>
                                <td>{register.fecha_hora}</td>
                                <td>{register.modulo}</td>
                            </tr>
                        );
                    });
                }

            }
            if (this.state.usuario.rol === 'Almacenista') {

                listProducts = this.state.productos2.map((producto, i) => {
                    return (
                        <tr>
                            <td>{producto.id_producto}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.cantidad}</td>
                            <td>{producto.estatus}</td>
                        </tr>
                    )
                })
            }
        }
        return (

            <div className="container flexBox-column center">

                <div className="item">
                    {/* HEADER */}
                    <div className="subitem flexBox-row">
                        <div className="subitem flexBox-column center">
                            <span className="title"> Bienvenido: {this.state.usuario.nombre}</span>
                            <span>Estado del usuario:{this.state.usuario.estatus}</span>
                            <span>Nivel del usuario:{this.state.usuario.rol}</span>
                        </div>
                        <div className="subitem">
                            <button className="btn" onClick={this.logOut}>Log out</button>
                        </div>


                    </div>
                    {/* ACCIONES */}
                    {typeUser === true ?
                        (
                            <div className="item flexBox-column center">
                                <select onChange={this.handleChange} value={selectedOption}>
                                    <option value="">Seleccione una opción</option>
                                    <option value="aumentar">Aumentar Inventario</option>
                                    <option value="editar">Editar Estatus</option>
                                    <option value="nuevo">Producto Nuevo</option>
                                </select>

                                {selectedOption === 'aumentar' && (
                                    <form className="form flexBox-column" onSubmit={this.sendForm} onChange={this.changeState}>
                                        <div className="subitem flexBox-column center">
                                            <label htmlFor="idProducto">ID:</label>
                                            <input
                                                type="number"
                                                id="idProducto"
                                                placeholder='Ingrese el ID'
                                                min={0}
                                                step={1}
                                                ref={this.idProductoRef}
                                                required
                                            />
                                            <label htmlFor="cantidadProducto">Cantidad:</label>
                                            <input
                                                type="number"
                                                id="cantidadProducto"
                                                placeholder='Ingrese la cantidad'
                                                min={0}
                                                step={1}
                                                ref={this.cantidadRef}
                                                required
                                            />
                                            <div className="item center">
                                                <button className="btn" type="submit">Guardar Cambios</button>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                {selectedOption === 'editar' && (
                                    <form className="form flexBox-column" onSubmit={this.sendForm} onChange={this.changeState}>
                                        <div className="subitem flexBox-column center">
                                            <label htmlFor="idProducto">ID:</label>
                                            <input
                                                type="number"
                                                id="idProducto"
                                                placeholder='Ingrese el ID'
                                                min={0}
                                                step={1}
                                                ref={this.idProductoRef}
                                                required
                                            />
                                            <br />
                                            <label htmlFor="nuevoEstatus">Nuevo Estatus:</label>
                                            <input
                                                type="text"
                                                id="nuevoEstatus"
                                                placeholder="Ingrese Nuevo Estatus"
                                                ref={this.estatusRef}
                                                required
                                            />
                                        </div>
                                        <div className="item center">
                                            <button className="btn" type="submit">Guardar Cambios</button>
                                        </div>
                                    </form>
                                )}

                                {selectedOption === 'nuevo' && (
                                    <form className="form flexBox-column" onSubmit={this.sendForm} onChange={this.changeState}>
                                        <div className="subitem flexBox-column center">
                                            <label htmlFor="nombreProducto">Nombre del Producto:</label>
                                            <input
                                                type="text"
                                                id="nombreProducto"
                                                ref={this.nombreRef}
                                                required
                                            />
                                        </div>
                                        <div className="item center">
                                            <button className="btn" type="submit">Guardar Cambios</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        ) : (
                            <div className="item flexBox-column center">
                                <select onChange={this.handleChange} value={selectedOption}>
                                    <option value="">Seleccione una opción</option>
                                    <option value="disminuir">Disminuir Inventario</option>

                                </select>

                                {selectedOption === 'disminuir' && (
                                    <form className="form flexBox-column" onSubmit={this.sendForm2} onChange={this.changeState}>
                                        <div className="subitem flexBox-column center">
                                            <label htmlFor="idProducto">ID:</label>
                                            <input
                                                type="number"
                                                id="idProducto"
                                                placeholder='Ingrese el ID'
                                                min={0}
                                                step={1}
                                                ref={this.idProductoRef}
                                                required
                                            />
                                            <label htmlFor="cantidadProducto">Cantidad:</label>
                                            <input
                                                type="number"
                                                id="cantidadProducto"
                                                placeholder='Ingrese la cantidad'
                                                min={0}
                                                step={1}
                                                ref={this.cantidadRef}
                                                required
                                            />
                                            <div className="item center">
                                                <button className="btn" type="submit">Guardar Cambios</button>
                                            </div>
                                        </div>
                                    </form>
                                )}

                            </div>
                        )
                    }
                    {/* INVENTARIO & HISTORIAL*/}
                    <div className="item flexBox-column">
                        <div className="subitem center table">
                            <table>
                                <tr>
                                    <th>Id Producto</th>
                                    <th>Descripción</th>
                                    <th>Cantidad</th>
                                    <th>Estatus</th>
                                </tr>
                                {listProducts}
                            </table>
                        </div>
                        {this.state.usuario.rol === 'Administrador' &&
                            <div className="subitem flexBox-column table">
                                <form className="form flexBox-row" onSubmit={this.sendForm3} onChange={this.change}>
                                    <label htmlFor="nuevoEstatus">Filtrar por:</label>
                                    <input
                                        type="text"
                                        id="filtro"
                                        placeholder="Ingrese Entradas o Salidas"
                                        ref={this.busquedaRef}
                                        required
                                    />
                                    <button className="btn" type="submit">Buscar</button>
                                </form>
                                <table>
                                    <tr>
                                        <th>Historial ID</th>
                                        <th>Nombre</th>
                                        <th>Tarea</th>
                                        <th>Id Producto</th>
                                        <th>Movimiento</th>
                                        <th>Fecha y Hora</th>
                                        <th>Modulo</th>
                                    </tr>
                                    {history}
                                </table>
                            </div>
                        }

                    </div>


                </div>
            </div>
        );
    }
}
export default Home;