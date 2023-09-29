import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { show_alerta } from '../functions'



const VerProductos = () => {

  const url = 'http://localhost:8080/api/v1/categorias'

  const [categorias, setCategorias] = useState([]) //variable para almacenar las categorias
  const [id, setId] = useState('')
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [operation, setOperation] = useState(1) //variable para controlar si es Guardar (1) Actualizar (2) Eliminar (3)
  const [title, setTitle] = useState('')


  /*----------------Hook de Efectos para una vez que renderice la página cargue todos los productos ---------------------*/
  useEffect(() => {
    getCategorias()
  }, [])

  /*----------------------Programar las alerta de SweetaAlert y funcines que necesitamos------------------*/

  const getCategorias = async () => {
    try {
      const response = await axios.get(url)
      setCategorias(response.data.categoriaResponse.categorias)
      console.log(response.data.categoriaResponse.categorias)
    } catch (error) {
      console.log('Error al obtener las categorias ', error)
    }
  }

  /*----------------------funcion para open modal para elegir la operacion------------------*/

  const openModal = (op, id, name, descripcion) => { //op 1: Guardar, 2: Editar
    //Cuando se abre el modal se limpian los campos
    setNombre('')
    setDescripcion('')
    setOperation(op)

    if (op === 1) {
      setTitle('Registrar Categoria')
    } else if (op === 2) {
      setTitle('Editar Categoria')
      setId(id)
      setNombre(name) //se asigna el nombre de la categoria a la variable nombre para luego actualizar
      setDescripcion(descripcion)
    }

    /*----------------------------  encender el foco del input nombre se invoca cuando se agregan o editan categorias  ----------------------------*/

    window.setTimeout(() => {
      document.getElementById('nombre').focus()
    }, 500)

  }

  /*----------------------validar que los campos de formularios esten llenos para enviar solicitud------------------*/

  const validarCampos = () => {
    var parametros;
    var metodo;

    if (nombre.trim() === '') {
      show_alerta('Escribe el nombre del producto', 'warning')
    }
    else if (descripcion.trim() === '') {
      show_alerta('Escribe la descripcion del producto', 'warning')
    } else {
      //Si los campos estan llenos se procede a enviar la solicitud

      if (operation === 1) {
        parametros = {
          nombre: nombre,
          descripcion: descripcion
        }
        metodo = 'POST'
      }else{
        parametros = {
          id: id,
          nombre: nombre,
          descripcion: descripcion
        }
        metodo = 'PUT'
      }

      //enviar la solicitud

      enviarSolicitud( metodo,parametros,)
    }
  }


  /*----------------------funcion para enviar la solicitud------------------*/

  const enviarSolicitud = async ( metodo,parametros) => {
     await axios({ method: metodo, url: url, data: parametros }).then(function (response) {
      let tipo = response.data[0]
      let mensaje = response.data[1]
      show_alerta(mensaje, tipo)

      //si la respuesta es exitosa se cierra el modal y se actualiza la tabla

      if (tipo === 'success') {
        document.getElementById('btnCerrar').click();
        getCategorias()
      }

    })
      .catch(function (error) {
        show_alerta('Error al enviar la solicitud', 'error')
        console.log(error)
      })

  }

  /*----------------------funcion para eliminar una categoria------------------*/

  const eliminarCategoria = async (id,name) => {

     const MySwal = withReactContent(Swal)
     MySwal.fire({
      title: '¿Estas seguro de eliminar la categoria '+name+'?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(url+'/'+id).then(function (response) {
          let tipo = response.data[0] //success o error
          let mensaje = response.data[1] //mensaje de respuesta
          show_alerta(mensaje, tipo)
          getCategorias()
        })
          .catch(function (error) {
            show_alerta('Error al enviar la solicitud', 'error')
            console.log(error)
          })
      }
    })

  }


  return (
    <div className='App'>

      {/* Renderizar el boton Agregar Categoria */}
      <div className='container-fluid'>
        <div className='row mt-3'>
          <div className='col-md-4 offset-md-4'>
            <div className='d-grid mx-auto'>
              <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalCategoria'>
                <i className="fa-solid fa-circle-plus"></i>Agregar Categoria</button>
            </div>
          </div>
        </div>

        {/* Renderizar la tabla de categorias */}

        <div className='row mt-3'>
          <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
            <div className='table-responsive'>
              <table className='table table-striped table-hover table-bordered'>
                <thead className='table-dark'>
                  <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {categorias.map((categoria) => (
                    <tr key={categoria.id}>
                      <td>{categoria.id}</td>
                      <td>{categoria.nombre}</td>
                      <td>{categoria.descripcion}</td>
                      <td>
                        <button onClick={() => openModal(2, categoria.id, categoria.nombre, categoria.descripcion)}
                          className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalCategoria'>
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        {' '}
                        <button onClick={()=>eliminarCategoria(categoria.id,categoria.nombre)} className='btn btn-danger'>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Renderizar el modal para agregar categorias */}
      <div id='modalCategoria' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>

            {/* cuerpo del Modal */}
            <div className='modal-body'>
              <input type='hidden' id='id'></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input
                  type='text'
                  id='nombre'
                  className='form-control'
                  placeholder='Nombre'
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                />
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                <input
                  type='text'
                  id='descripcion'
                  className='form-control'
                  placeholder='Descripcion'
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                />
              </div>

              {/* button de Guardar */}
              <div className='d-grid col-6  mx-auto'>
                <button onClick={()=>validarCampos()} className='btn btn-success' type='button' id='btnGuardar'>
                  <i className="fa-solid fa-floppy-disk"></i> Guardar
                </button>
              </div>
              {/* pie del Modal */}

              <div className='modal-footer'>
                <button id ='btnCerrar' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                  <i className="fa-solid fa-window-close"></i> Cerrar
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerProductos
