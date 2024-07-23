import {getConecction} from '../database/connection.js'   
import sql from 'mssql';

/* TABLA DE USUARIOS */
export const getUsuariostoLog = async (req,res) =>{
    
    console.log(req.body.nombre);
    console.log(req.body.contraseña);
    const pool = await getConecction();
    const result = await pool.request()
    .input('nombre',sql.VarChar,req.body.nombre)
    .input('contraseña',sql.VarChar,req.body.contraseña)
    .query("SELECT * FROM usuarios WHERE nombre= @nombre and contraseña = @contraseña;SELECT SCOPE_IDENTITY() AS id;");
   
    if(result.rowsAffected[0] === 0){
        return res.json({message: 'usuario inexistente'});
    }else{
        if(result.recordset[0].nombre === req.body.nombre){
            if(result.recordset[0].contraseña === req.body.contraseña){
                res.json({
                    message:'success',
                    results : result.recordset
                })
            }
        }else{
            res.json({message:'usuario o contraseña incorrectos'})
        }
    }
   
}
export const getUser = async (req,res) =>{
    
    const pool = await getConecction();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("SELECT * FROM usuarios WHERE id_usuario = @id");
    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message: 'usuario inexistente'});
    }else{
        res.json({
            message:'success',
            results : result.recordset
        })
    }
}
/* TABLA DE ROLES */
export const getRoles = async (req,res) =>{
    const pool = await getConecction();
    const result = await pool.request().query("SELECT * FROM roles");
    res.json({
        message: 'success',
        results: result.recordset
    }); 
}
export const getRol = async (req,res) =>{
    
    const pool = await getConecction();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("SELECT * FROM roles WHERE id_rol = @id");
    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message: 'rol inexistente'});
    }else{
        res.json({
            message:'success',
            results : result.recordset
        })
    }
}
/* TABLA DE HISTORIAL */
export const newRegisterHistory = async (req,res) =>{

    console.log(req.body);
    const fechaHora = ObterFechayHora();
    const pool = await getConecction();
    const result = await pool.request()

    .input('nombre',sql.VarChar,req.body.nombre)
    .input('tarea',sql.VarChar, req.body.tarea)
    .input('id_producto',sql.Int, req.body.id_producto)
    .input('movimiento',sql.VarChar,req.body.movimiento)
    .input('fechaHora',sql.VarChar, fechaHora) 
    .input('modulo',sql.VarChar, req.body.modulo)

    .query("INSERT INTO historial(nombre,tarea,id_producto,movimiento,fecha_hora,modulo) VALUES (@nombre,@tarea,@id_producto,@movimiento,@fechaHora,@modulo); SELECT SCOPE_IDENTITY() AS id_historial;");

    res.json({
        message: 'success',
        results: {
            id: result.recordset[0].id_producto,
            nombre: req.body.nombre,
            tarea: req.body.tarea,
            id_producto: req.body.id_producto,
            movimiento: req.body.movimiento,
            fecha:  fechaHora,
            módulo: req.body.modulo
        }
    });
}
export const getHistory = async (req,res) =>{
    
    const pool = await getConecction();
    const result = await pool.request()
    .input('modulo',sql.VarChar,req.params.modulo)
    .query("SELECT * FROM historial WHERE modulo = @modulo");
    res.json({
        message: 'success',
        results: result.recordset
    });
}
/* TABLA DE PRODUCTOS */
export const getAllProducts = async (req,res) =>{
    const pool = await getConecction();
    const result = await pool.request().query("SELECT * FROM productos");
    res.json({
        message: 'success',
        results: result.recordset
    });
}
export const getProducts = async (req,res) =>{
    console.log(req.body.estatus)
    const pool = await getConecction();
    const result = await pool.request()
    .input('estatus',sql.VarChar,req.params.estatus)
    .query("SELECT * FROM productos WHERE estatus = @estatus");
    res.json({
        message: 'success',
        results: result.recordset
    });
}
export const getProduct = async (req,res) =>{
    let id = req.params.id;
    console.log(id)
    if (!id) {
        return res.status(400).json({ message: 'ID del producto es requerido' });
    }
    const pool = await getConecction();
    const result = await pool.request()
    .input('id',sql.Int, id)
    .query("SELECT * FROM productos WHERE id_producto = @id");
    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message: 'producto inexistente'});
    }else{
        res.json({
            message: 'success',
            results: result.recordset[0]
        });
    }
}
export const newProduct = async (req,res) =>{
    console.log(req.params.nombre);
    const pool = await getConecction();
    const result = await pool.request()
    .input('nombre',sql.VarChar,req.params.nombre)
    .input('cantidad',sql.Int, 0)
    .input('estatus',sql.VarChar, 'Activo')
    .query("INSERT INTO productos(nombre,cantidad,estatus) VALUES (@nombre,@cantidad,@estatus); SELECT SCOPE_IDENTITY() AS id_producto;");
    console.log(result);
    res.json({
        message: 'success',
        results: {
            id: result.recordset[0].id_producto,
            nombre: req.params.nombre,
            cantidad: 0,
            estatus: 'Activo'
        }
    });
}
export const updateQTYProduct = async (req,res) =>{
    const pool = await getConecction();
    const result = await pool.request()
    .input('id',sql.Int,req.params.id)
    .input('cantidad',sql.Int,req.body.cantidad)
    .query("UPDATE productos SET cantidad=@cantidad WHERE id_producto=@id;SELECT SCOPE_IDENTITY() AS id;");
    
    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message: 'producto inexistente'});
    }else{
        res.json({
            message: 'success',
            results:{
                id: result.recordset[0].id_producto,
                cantidad: req.body.cantidad,
            }
        });
    }

}
export const updateStatusProduct = async (req,res) =>{
    const pool = await getConecction();
    const result = await pool.request()
    .input('id',sql.Int,req.params.id)
    .input('estatus',sql.VarChar,req.body.estatus)
    .query("UPDATE productos SET estatus=@estatus WHERE id_producto=@id;SELECT SCOPE_IDENTITY() AS id;");
    
    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message: 'producto inexistente'});
    }else{
        res.json({
            message: 'success',
            results:{
                id: result.recordset,
                cantidad: req.body.estatus,
            }
        });
    }

}
export const specialQuery = async (req,res) =>{
    const pool = await getConecction();
    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query("SELECT usuarios.*, roles.rol From usuarios INNER JOIN roles on usuarios.id_rol = roles.id_rol WHERE id_usuario = @id Group by usuarios.nombre,usuarios.id_usuario,usuarios.contraseña, usuarios.correo,usuarios.id_rol, usuarios.estatus, roles.rol;");
    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message: 'error en la consulta'});
    }else{
        res.status(200).json({
            message: 'success',
            results: result.recordset
            });
    }
}

const ObterFechayHora = () =>{
    const fechaHoraActual = new Date();
    const anio = fechaHoraActual.getFullYear();
    const mes = (fechaHoraActual.getMonth() + 1).toString().padStart(2, '0'); 
    const dia = fechaHoraActual.getDate().toString().padStart(2, '0');
    const horas = fechaHoraActual.getHours().toString().padStart(2, '0');
    const minutos = fechaHoraActual.getMinutes().toString().padStart(2, '0');
    const segundos = fechaHoraActual.getSeconds().toString().padStart(2, '0');
    return `${dia}-${mes}-${anio} ${horas}:${minutos}:${segundos}`;
}

