import { useEffect, useState } from "react"
import $, { event } from 'jquery';
import { Modal } from "react-bootstrap";

export function DepartmentDetails () {
    var baseList:any = []
    const [DepartmentData, SetDepartmentData] = useState(baseList)
    const [CurrentDepartment, SetCurrentDepartment] = useState<object|undefined>(undefined)
    const [NewDepartment, SetNewDepartment] = useState("")
    const [errorModalShow, setErrorModalShow] = useState(false);
    const [inputModalShow, setInputModalShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    console.log(CurrentDepartment)

    useEffect( function(){

        const fetchData = async() => {
            try {
                const response = await fetch("https://localhost:7065/Department/department")
            
                if( !response.ok ){
                    throw new Error()
                }else{
                    const data = await response.json(); 
                    SetDepartmentData( data ) 
                }  
            } catch (error:any) {
                setErrorMessage("Erro ao buscar dados de departamentos")
                setErrorModalShow(true)
            }
        }

        fetchData(); 

    }, [] )

    useEffect( function(){
        SetNewDepartment( "" )
    }, [DepartmentData] )

    useEffect( function(){
        if( CurrentDepartment != undefined ){
            var department : any = CurrentDepartment
            SetNewDepartment( department.Name )
        }
    }, [CurrentDepartment] )

    const addDepartmentClick = () =>{
        if( CurrentDepartment != undefined ){
            SetCurrentDepartment( undefined )
        }
        setInputModalShow( true )
    }

    const addDepartment = async () => {

        try {
            var newDepartmentData = "{ 'name' : '" + NewDepartment + "' }"
            var newDepartmentResponse = await fetch( "https://localhost:7065/Department/department/create", {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : newDepartmentData,
                })
            
            if( !newDepartmentResponse.ok ){
                throw new Error("Erro ao criar novo departamento")
            }
            
            var response = await fetch( "https://localhost:7065/Department/department" )
            
            if( !response.ok ){
                throw new Error()
            }else{
                var data = await response.json()
                SetDepartmentData(data)
            }
        } catch (error:any) {
            setErrorMessage(error.message)
            setErrorModalShow(true)
            setInputModalShow(false)
        }

    }

    const editDepartmentClick = ( department:object ) =>{
        SetCurrentDepartment( department )
        setInputModalShow( true )
    }

    const editDepartment = async () => {

        try {
            var editDepartmentData = "{ 'name' : '" + NewDepartment + "' }"
            var editDepartment : any = CurrentDepartment
            var editDepartmentResponse = await fetch( "https://localhost:7065/Department/department/alter/" + editDepartment.Id, {
                method : 'PUT',
                headers : {
                    'Content-Type': 'application/json',
                },
                body : editDepartmentData,
                })
            
            if( !editDepartmentResponse.ok ){
                throw new Error("Erro ao editar nome do departamento")
            }
            
            var response = await fetch("https://localhost:7065/Department/department")
            if( !response.ok ){
                throw new Error()
            }else{
                var data = await response.json()
                SetDepartmentData(data)
            }
        } catch (error:any) {
            setErrorMessage(error.message)
            setErrorModalShow(true)
            setInputModalShow(false)
        }
        
    }

    const deleteDepartmentClick = async ( item:any ) => {

        try {
            var deleteResponse = await fetch( "https://localhost:7065/Department/department/delete/" + item.Id, {
            method : 'DELETE',
            })
            
            if( !deleteResponse.ok ){
                throw new Error("Erro na exclusão de departamento")
            }
        
            var response = await fetch( "https://localhost:7065/Department/department" )

            if( !response.ok ){
                throw new Error()
            }else{
                var data = await response.json()
                SetDepartmentData(data)
            }
        } catch (error:any) {
            setErrorMessage(error.message)
            setErrorModalShow(true)
            setInputModalShow(false)
        }
        
    }

    return(
        <main className="container-fluid p-5">
            <h1 className='d-flex justify-content-center m-3'>Department Page</h1>
            <button className="btn btn-primary m-2" onClick={event => addDepartmentClick()}>Add New Department</button>
            <table className="table table-dark table-striped" style={{marginTop:"2em"}}>
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">DEPARTMENT NAME</th>
                        <th scope="col">MODIFY</th>
                        <th scope="col">DELETE</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        DepartmentData.map( ( item:any ) => {
                            return(
                                <tr key={ item.Id }>
                                    <td>{ item.Id }</td>
                                    <td>{ item.Name }</td>
                                    <td>
                                        <button onClick={ event => editDepartmentClick( item ) }>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                            </svg>
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={ event => deleteDepartmentClick( item ) }>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            
            <Modal className="modal fade" id="input-modal" tabIndex={-1} aria-labelledby="exampleModalLabel" show={inputModalShow}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{ CurrentDepartment == undefined ? "Add a new Department" : "Update Department" }</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={ (event) => { setInputModalShow(false) } }></button>
                        </div>
                        <div className="modal-body">
                            <div className="input-group mb-3">
                                <span className="input-group-text">DepartmentName</span>
                                <input type="text" className="form-control" value={NewDepartment} onChange={event => SetNewDepartment(event.target.value)}/>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {
                                CurrentDepartment == undefined ? <button className="btn btn-primary float-start" onClick={ event => addDepartment() }>Create</button> : null
                            }
                            {
                                CurrentDepartment != undefined ? <button className="btn btn-primary float-start" onClick={ event => editDepartment() }>Update</button> : null
                            }
                            <button type="button" className="btn btn-secondary" onClick={ (event) => { setInputModalShow(false) } }>Close</button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal className="modal fade" id="error-modal" tabIndex={-1} aria-labelledby="errorModalLabel" show={errorModalShow}>
                <div className="modal-dialog">
                    <div className="modal-content" style={{backgroundColor:"red"}}>
                        <div className="modal-header">
                            <h5 className="modal-title">ERROR</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={ (event) => { setErrorModalShow(false) }}></button>
                        </div>
                        <div className="modal-body">
                            <p className="lead">
                                { errorMessage }
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>
        </main>  
    )
}