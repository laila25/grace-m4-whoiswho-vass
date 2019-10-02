import React from "react";
import "./App.css";
import OrgChart from "react-orgchart";
import "react-orgchart/index.css";
import foto from "./perfil-defecto.png";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      nombre_empleado: "",
      id: 0,
      foto_empleado: foto,
      children: [],
      parent: []
    };
    this.getData = this.getData.bind(this);
    this.getValue = this.getValue.bind(this);
    this.consolea = this.consolea.bind(this);
    this.changeColorSelected = this.changeColorSelected.bind(this);
  }

  getData(id) {
    if (!isNaN(id)) {
      fetch(`https://adalab-whoiswho.azurewebsites.net/api/employees/${id}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.setState({
            nombre_empleado: `${data.nombre_empleado ? data.nombre_empleado : ""}` + ` ${data.apellidos_empleado ? data.apellidos_empleado : ""} `,
            id: data.id_empleado
          });
          if (data.id_superior !== "") {
            return fetch(`https://adalab-whoiswho.azurewebsites.net/api/employees/${data.id_superior}`)
              .then(response => response.json())
              .then(data => {
                console.log(data);
                this.setState({
                  parent: [
                    {
                      nombre_empleado: `${data.nombre_empleado ? data.nombre_empleado : ""}` + ` ${data.apellidos_empleado ? data.apellidos_empleado : ""} `,
                      id: data.id_empleado,
                      foto_empleado: foto
                    }
                  ]
                });
                if (data.id_superior !== "") {
                  return fetch(`https://adalab-whoiswho.azurewebsites.net/api/employees/${data.id_superior}`)
                    .then(response => response.json())
                    .then(data => {
                      console.log(data);
                      const spread = [
                        {
                          nombre_empleado: `${data.nombre_empleado ? data.nombre_empleado : ""}` + ` ${data.apellidos_empleado ? data.apellidos_empleado : ""} `,
                          id: data.id_empleado,
                          foto_empleado: foto
                        },
                        ...this.state.parent
                      ];
                      this.setState({
                        parent: spread
                      });
                    });
                }
              });
          }
        });
    }
  }

  getValue(ev) {
    const value = parseInt(ev.target.value);
    this.setState({
      id: value
    },
      () => {
        this.getData(this.state.id);
      }
    );
  };

  changeColorSelected(ev) {
    const selected = ev.currentTarget
    selected.classList.toggle("shadow")
  }
  consolea(ev) {
    this.changeColorSelected(ev)
    console.log(ev.currentTarget.dataset.id);
  }

  render() {
    console.log(this.state.parent);
    const MyNodeComponent = ({ node }) => {
      return (
        <div className="perfil">
          <div className="initechNode" onClick={this.changeColorSelected}>
            <img src={node.foto_empleado} className="img" alt={node.nombre_empleado}></img>
          </div>
          <p className="name">{node.nombre_empleado}</p>
        </div>
      );
    };

    const MyNodeComponentChildren = ({ node }) => {
      return (
        <div className="children">
          <div className="initechNode" onClick={this.consolea} data-id={node.id}>
            <img src={node.foto_empleado} className="img" alt={node.nombre_empleado}></img>
          </div>
          <p className="name">{node.nombre_empleado}</p>
        </div>
      );
    };

    const parentsState = this.state.parent;
    const parents = this.state.parent.map(parent => {
      return (
        <React.Fragment>
          <div className="center-parents">
            <OrgChart tree={parent} NodeComponent={MyNodeComponent} />
          </div>
          <div className="rayita"></div>
        </React.Fragment>
      );
    });

    return (
      <div className="employees-container">
        <input type="text" onChange={this.getValue} value={parseInt(this.state.id)}></input>

        <div className="App flex" id="initechOrgChart">
          {parents}
        </div>

        <div className="App" id="initechOrgChart">
          <OrgChart tree={this.state} NodeComponent={MyNodeComponentChildren} />
        </div>
      </div>
    );
  }
}

export default App;
