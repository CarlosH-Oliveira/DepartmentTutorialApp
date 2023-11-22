import { NavLink } from "react-router-dom";

export function HomePage () {
    return(
        <div>
            <h1 className='d-flex justify-content-center m-3'>Essa é a HomePage</h1>
            <h3 className='d-flex justify-content-center m-3'>React Department App</h3>
            <nav className='navbar navbar-expand-sm bg-light navbar-dark'>
                <ul className='navbar-nav'>
                <li className='nav-item- m-1'>
                    <NavLink className="btn btn-light btn-outline-primary" to="/department">Departamento</NavLink>
                </li>
                <li className='nav-item- m-1'>
                    <NavLink className="btn btn-light btn-outline-primary" to="/employee">Funcionários</NavLink>
                </li>
                </ul>
            </nav>
        </div>
    )
}