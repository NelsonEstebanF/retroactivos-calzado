const meses = ['septiembre', 'octubre'];

// Define el componente del formulario
const Formulario = () => (
    <form className="container mt-5">
        <Cabecera />
        <Meses />
        <button 
            type="button" 
            className="btn btn-primary" 
            id="calcular"
        >calcular</button>
    </form>
);

const Cabecera = () => {
    return (
        <div className="form-row">
                    <div className="form-group col-8">
                        <label htmlFor="nombre">Nombre:</label>
                        <input type="text" className="form-control" id="nombre" name="nombre" />
                    </div>
                    <div className="col-1"></div>
                    <div className="form-group col-3">
                        <label>Categoría:</label><br />
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="categoria" id="categoria3" value="3" />
                            <label className="form-check-label" htmlFor="categoria3">3</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="categoria" id="categoria4" value="4" defaultChecked />
                            <label className="form-check-label" htmlFor="categoria4">4</label>
                        </div>
                    </div>
        </div>
    );
};

const Meses = () => (
    <div className="form-row">
        {meses.map(mes => (
            <div className="col-4" id={`mes_${mes}`} key={mes}>
                <h4>{mes.charAt(0).toUpperCase() + mes.slice(1)}</h4>
                    <div className="form-group">
                        <label htmlFor={`${mes}_horas`}>Horas:</label>
                        <input type="number" className="form-control" id={`${mes}_horas`} name={`${mes}_horas`} step="0.5" min="0" placeholder="0" />
                    </div>
            </div>
        ))}
    </div>
);

// Renderiza el componente Formulario en el elemento con ID "root"
ReactDOM.render(<Formulario />, document.getElementById('root'));
