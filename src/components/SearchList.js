import React from "react";
import "../stylesheets/SearchList.scss";

function printList(props) {
  if (props.queryInput !== "") {
    let employeesFiltered = props.allEmployees.filter(employee => employee.nombre_empleado.toUpperCase().includes(props.queryInput.toUpperCase()));
    return employeesFiltered.map((employee, index) => {
      return (
        <li key={index} className="employee__list--item" data-id={employee.id_empleado} onClick={props.handleClick}>
          {`${employee.nombre_empleado} ${employee.apellidos_empleado ? employee.apellidos_empleado : ""} `}
        </li>
      );
    });
  }
}

function addHiddenClass(props) {
  let employeesArray = props.allEmployees.filter(employee => employee.nombre_empleado.toUpperCase().includes(props.queryInput.toUpperCase()));
  if (employeesArray.length === 0) {
    return "hidden";
  }
}

function addClass(props) {
  if (props.queryInput === "" || !isNaN(props.queryInput)) {
    return "hidden";
  } else {
    return "employee__list";
  }
}

const SearchList = props => {
  return (
    <div className="employee__searcher">
      <input placeholder="Id o Nombre del Colaborador" className="employee__input" type="text" onChange={props.getValue} value={props.queryInput}></input>
      <ul className={`${addClass(props)} ${props.classHidden} ${addHiddenClass(props)}`}> {printList(props)} </ul>
    </div>
  );
};

export default SearchList;
