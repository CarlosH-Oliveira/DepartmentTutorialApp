import { useEffect, useState } from "react";
import $, { event } from 'jquery';
import { Modal } from "react-bootstrap";

export function EmployeeDetails () {

    const [EmployeesData, SetEmployeesData] = useState<Array<any>>([])
    const [CurrentEmployee, SetCurrentEmployee] = useState<object|undefined>(undefined)
    const [NewEmployeeName, SetNewEmployeeName] = useState("")
    const [NewEmployeeDepartment, SetNewEmployeeDepartment] = useState("")
    const [File, SetFile] = useState<File | null>(null);
    const [formData, SetFormData] = useState(new FormData());
    const [errorModalShow, setErrorModalShow] = useState(false);
    const [inputModalShow, setInputModalShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect( function(){

        const fetchData = async() => {
            try {
                const response = await fetch( "https://localhost:7065/Employee" )
            
                if( !response.ok ){
                    throw new Error()
                }else{
                    const data = await response.json(); 
                    SetEmployeesData( data ) 
                }  
            } catch (error:any) {
                setErrorMessage("Erro ao buscar dados de funcionários")
                setErrorModalShow(true)
            }
        }

        fetchData(); 

      }, [] )

    useEffect( function(){
        if( CurrentEmployee != undefined ){
            var employee : any = CurrentEmployee
            SetNewEmployeeName( employee.Name )
        }
    }, [CurrentEmployee] )

    useEffect( function(){
        if( CurrentEmployee != undefined ){
            var employee : any = CurrentEmployee
            SetNewEmployeeDepartment( employee.Department )
        }
    }, [CurrentEmployee] )

    const handleFormData = ( e:React.ChangeEvent<HTMLInputElement> ) => {
        if ( e.target.files && e.target.files[0] ) {
            SetFile( e.target.files[0] );
        }
    }

    const addEmployeeClick = () => {
        if( CurrentEmployee != undefined ){
            SetCurrentEmployee( undefined )
        }
        setInputModalShow( true )
    }

    const addEmployee = async () => {
        try {
            var newEmployeeData = "{ 'name' : '" + NewEmployeeName + "', 'department' : '" + NewEmployeeDepartment + "' }"
            var addResponse = await fetch( "https://localhost:7065/Employee/create", {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : newEmployeeData,
            })

            if( !addResponse.ok ){
                if(addResponse.status !== 500){
                    throw new Error("Departamento não existe")
                }
                throw new Error("Erro no servidor")
            }
            
            var response = await fetch( "https://localhost:7065/Employee" )
            
            if( !response.ok ){
                throw new Error()
            }else{
                var data = await response.json()
                SetEmployeesData(data)
            }

        } catch (error:any) {

            setErrorMessage(error.message)
            setErrorModalShow(true)
            setInputModalShow(false)

        }
        window.location.reload();
    }

    const editEmployeeClick = ( employee:object ) => {
        var cEmployee = CurrentEmployee
        if(editEmployee !== cEmployee){
            SetCurrentEmployee(employee)
        }
        setInputModalShow( true )
    }

    const editEmployee = async() =>{
        console.log(CurrentEmployee)
        if ( File ) {
            formData.append( 'arquivo', File )
        }
        var editEmployee : any = CurrentEmployee
        console.log(editEmployee.Id)
        var editData = "{ 'name' : '" + NewEmployeeName + "', 'department':'" + NewEmployeeDepartment + "' }"

        try {
            var editResponse = await fetch( "https://localhost:7065/Employee/alter/" + editEmployee.Id, {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : editData,
            })
            
            if( !editResponse.ok ){
                throw new Error("Erro na edição. Possivelmente o departamento informado não é válido.")
            }

            var savePhotoResponse = await fetch( "https://localhost:7065/Employee/photo/" + editEmployee.Id, {
                method : 'POST',
                body : formData
                })

            if( !savePhotoResponse.ok ){
                throw new Error("Erro no salvamento da imagem")
            }
            
            var response = await fetch( "https://localhost:7065/Employee" )
            
            if( !response.ok ){
                throw new Error("Erro na busca de dados")
            }else{
                var data = await response.json()
                SetEmployeesData(data)
            }

        } catch (error:any) {
            setErrorMessage(error.message)
            setErrorModalShow(true)
            setInputModalShow(false)
        }
        window.location.reload();
    }

    const deleteEmployeeClick = async( item:any ) => {

        try {
            var deleteResponse = await fetch( "https://localhost:7065/Employee/delete/" + item.Id, {
            method : 'DELETE',
            })
            
            if( !deleteResponse.ok ){
                throw new Error("Erro na exclusão de funcionário")
            }
            
            var response = await fetch( "https://localhost:7065/Employee" )
                
            if( !response.ok ){
                throw new Error()
            }else{
                var data = await response.json()
                SetEmployeesData(data)
            }
        } catch (error:any) {
            setErrorMessage(error.message)
            setErrorModalShow(true)
            setInputModalShow(false)
        }
        window.location.reload();
    }
    
    return(
        <main className="container-fluid p-5">
            <h1 className='d-flex justify-content-center m-3'>Employee Page</h1>
            <button className="btn btn-primary m-2" onClick={ (event) => addEmployeeClick() }>Add New Employee</button>
            <table className="table table-dark table-striped" style={{marginTop:"2em"}}>
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">EMPLOYEE NAME</th>
                        <th scope="col">EMPLOYEE DEPARTMENT</th>
                        <th scope="col">DATE OF JOINING</th>
                        <th scope="col">PHOTO FILENAME</th>
                        <th scope="col">MODIFY</th>
                        <th scope="col">DELETE</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        EmployeesData.map( ( item:any ) => {
                            var date = item.DateOfJoining.split("T")
                            return(
                            <tr key={ item.Id }>
                                <td>{ item.Id }</td>
                                <td>{ item.Name }</td>
                                <td>{ item.Department }</td>
                                <td>{ date[0] }</td>
                                <td>{ item.PhotoFileName }</td>
                                <td>
                                    <button onClick={ (event) => editEmployeeClick(item) }>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                        </svg>
                                    </button>
                                </td>
                                <td>
                                    <button onClick={ (event) => deleteEmployeeClick(item) }>
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
            
            <Modal className="modal fade" id="input-modal" tabIndex={-1} aria-labelledby="inputModalLabel" show={inputModalShow}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{ CurrentEmployee == undefined ? "Add a new Employee" : "Update Employee" }</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={ (event) => { setInputModalShow(false) }}></button>
                        </div>
                        <div className="modal-body">
                            <div className="input-group mb-3">
                                <span className="input-group-text">Employee Name</span>
                                <input type="text" className="form-control" value={ NewEmployeeName } onChange={ (event) => SetNewEmployeeName(event.target.value) }/>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Employee Department</span>
                                <input type="text" className="form-control" value={ NewEmployeeDepartment } onChange={ (event) => SetNewEmployeeDepartment(event.target.value) }/>
                            </div>
                                { CurrentEmployee != undefined ? <div className="custom-file">
                                    <div className="input-group mb-3">
                                        <label htmlFor="formFile" className="form-label"/>
                                        <input type="file" className="form-control" id="formFile" accept="image/*" onChange={ (event) => handleFormData(event) }/>
                                    </div>
                                </div> : null }
                        </div>
                        <div className="modal-footer">
                            {
                                CurrentEmployee == undefined ? <button className="btn btn-primary float-start" onClick={ (event) => addEmployee() }>Create</button> : null
                            }
                            {
                                CurrentEmployee != undefined ? <button className="btn btn-primary float-start" onClick={ (event) => editEmployee() }>Update</button> : null
                            }
                            <button type="button" className="btn btn-secondary" onClick={ (event) => { setInputModalShow(false) }}>Close</button>
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