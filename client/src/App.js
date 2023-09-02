import './App.css';
import {useState} from 'react'
import Axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const noti = withReactContent(Swal);



function App() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState();
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState();
  const [id, setId] = useState();

  const [empleadosList, setEmpleados] = useState([]);

  const [editar, setEditar] =useState(false);

  
  
    const add = () =>{
      Axios.post("http://localhost:3001/create",{
        nombre:nombre,
        edad:edad,
        pais:pais,
        cargo:cargo,
        anios:anios
      }).then(()=>{
        getEmpleados();
        limpiarCampos();

        noti.fire({
          title: <strong>Registro Exitoso!</strong>,
          html: <i>El empleado {nombre} fue registrado con exito!</i>,
          icon: 'success'
        })
      })
    }

  const getEmpleados = () =>{
    Axios.get("http://localhost:3001/empleados").then((response)=>{
      setEmpleados(response.data)

    })
  }

  const editarEmpleado =(val)=>{
    setEditar(true);

    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAnios(val.anios);
    setId(val.id);
  }

  const update = () =>{
    Axios.put("http://localhost:3001/update",{
      id:id,
      nombre:nombre,
      edad:edad,
      pais:pais,
      cargo:cargo,
      anios:anios
    }).then(()=>{
      getEmpleados();
      limpiarCampos();
      noti.fire({
        title: <strong>Actualizacion Exitosa!</strong>,
        html: <i>La informacion de {nombre} fue actualizada correctamente</i>,
        icon: 'success'
      })
    })
  }

  const deleteEmpleado = (val) =>{
    noti.fire({
      title: 'Are you sure?',
      html: `Desea eliminar a ${val.nombre}?!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id}`).then(()=>{
      
          getEmpleados();
          limpiarCampos();
          noti.fire(

            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
          }).catch(function(error){
            noti.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
              footer: JSON.parse(JSON.stringify(error)).message
            })
          
        })
        
      }
    })

    
  }

  const limpiarCampos =()=>{
    setNombre("");
    setEdad("");
    setPais("");
    setCargo("");
    setAnios("");
    setEditar(false);
    
  }

  return (
    <div className='container'>
      <Card className="text-center">
      <Card.Header>GESTION DE EMPLEADOS</Card.Header>
      <Card.Body>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">Nombre</span>
          </div>
          <input 
            onChange={(event)=>{
              setNombre(event.target.value)
            }}
          type="text" value={nombre} className="form-control" placeholder="Nombre" aria-label="Nombre" aria-describedby="basic-addon1"/>
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">Edad</span>
          </div>
          <input 
            onChange={(event)=>{
              setEdad(event.target.value)
            }}
          type="number" value={edad} className="form-control" placeholder="Edad" aria-label="Edad" aria-describedby="basic-addon1"/>
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">Pais</span>
          </div>
          <input 
            onChange={(event)=>{
              setPais(event.target.value)
            }}
          type="text" value={pais} className="form-control" placeholder="Pais" aria-label="Pais" aria-describedby="basic-addon1"/>
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">Cargo</span>
          </div>
          <input 
            onChange={(event)=>{
              setCargo(event.target.value)
            }}
          type="text" value={cargo} className="form-control" placeholder="Cargo" aria-label="Cargo" aria-describedby="basic-addon1"/>
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">Años</span>
          </div>
          <input 
            onChange={(event)=>{
              setAnios(event.target.value)
            }}
          type="text" value={anios} className="form-control" placeholder="Años" aria-label="Anios" aria-describedby="basic-addon1"/>
        </div>          
      </Card.Body>
      <Card.Footer className="text-muted">
        {
          editar
          ?
          <div>
            <button className='btn btn-warning m-2' onClick={update}>Guardar</button>
            <button className='btn btn-info m-2' onClick={limpiarCampos}>Cancelar</button>
          </div>
          
          :
          <button className='btn btn-success' onClick={add}>Registrar</button>
        }
        
        <div className='lista'>
            <button className='btn btn-primary mt-2' onClick={getEmpleados}>Listar</button>
            
        </div>
      </Card.Footer>
    </Card>

  

    <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Edad</th>
                <th scope="col">Pais</th>
                <th scope="col">Cargo</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
           
              {
               
                  empleadosList.map((val,key)=>{
                    return <tr key={val.id}>
                      <th>{val.id}</th>
                      <td>{val.nombre}</td>
                      <td>{val.edad}</td>
                      <td>{val.pais}</td>
                      <td>{val.cargo}</td>
                      <td>
                      <div className="btn-group" role="group" aria-label="Basic example">
                        <button 
                        onClick={()=>{
                          editarEmpleado(val);
                        }}
                        type="button" className="btn btn-info">Editar</button>
                        <button onClick={()=>{
                          deleteEmpleado(val);
                        }} type="button" className="btn btn-danger">Eliminar</button>
                      </div>
                      </td>
                    </tr>          
                  })
                   
                }
                
                
            </tbody>
          </table>
      
    </div>
    
  );
}

export default App;

