import React,{useEffect,useState} from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'

const baseUrl = 'http://localhost:8080/api/v1/categorias'

const CategoriaTable = () => {

    const[categorias,setCategorias]=useState([])
    const[search,setSearch]=useState('')
    const[filteredCategorias,setFilteredCategorias]=useState([])

    const obtenerCategorias=async()=>{
        try {
            const response=await axios.get(baseUrl)
            setCategorias(response.data.categoriaResponse.categorias)
        }catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        const resul = categorias.filter((categoria) => {
            return categoria.nombre.toLowerCase().match(search.toLowerCase());
        });
        setFilteredCategorias(resul);
        },[search,categorias])



    useEffect(()=>{
        obtenerCategorias()
    },[])

    //definir las columnas DataTable
    const columns=[
        {
            name:'Id',
            selector: row => row.id,
            sortable:true
        },
        {
            name:'Nombre',
            selector: row => row.nombre,
            sortable:true
        },
        {
            name:'Descripcion',
            selector: row => row.descripcion,
            sortable:true
        },
        {
            name: 'Acciones',
            cell: row =>(
                <div className='d-flex justify-content-center'>
                    <button className='btn btn-warning'>Editar</button>
                    <button className='btn btn-danger ms-2' >Eliminar</button>
                </div>
            )
        }

    ]

  return (
    <div>
        <h3 className='text-center'>Muestra Listado de Categoria</h3>
         <div className='d-flex justify-content-end'>
            <button className='btn btn-primary'> Agregar </button>
         </div>

        <DataTable
            columns={columns}
            data={filteredCategorias}
            pagination
            paginationComponentOptions={{rowsPerPageText:'Filas por pagina',rangeSeparatorText:'de'}}
            fixedHeader
            fixedHeaderScrollHeight='600px'
            highlightOnHover
            subHeader
            subHeaderComponent={
                <input
                    type='text'
                    placeholder='Buscar Categoria'
                    className='w-25 form-control'
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}

                    />
                    
            }
        
        />
      
    </div>
  )
}

export default CategoriaTable
