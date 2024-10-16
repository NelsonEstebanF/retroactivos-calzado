let empleado;
let valoresMes;
let diferenciaAcumulada = 0;

// Función para formatear números
function formatearNumero(numero) {
    const strNumero = parseFloat(numero).toFixed(2);
    const [parteEntera, parteDecimal] = strNumero.split(".");
    const parteEnteraConPunto = parteEntera.replace(/(\d)(?=(\d{3})+$)/g, '$1.');
    return `${parteEnteraConPunto}${parteDecimal ? `,${parteDecimal}` : ""}`;
}

// Componente para mostrar una fila de datos
const FilaDatos = ({ concepto, cantidad, unidadActual, subtotalActual, unidadPagada, subtotalPagado }) => (
    <tr>
        <td>{concepto}</td>
        <td>{cantidad}</td>
        <td>{unidadActual}</td>
        <td>{subtotalActual}</td>
        <td>{unidadPagada}</td>
        <td>{subtotalPagado}</td>
    </tr>
);

// Componente para mostrar los datos de un mes
const EmpleadoMes = ({ mes, data, valores, mayo }) => (
    <div className="container mt-5">
        <table className="table table-bordered  table-striped">
            <thead>
                <tr>
                    <th colSpan="2"><h3>{mes.charAt(0).toUpperCase() + mes.slice(1)}</h3></th>
                    <th colSpan="2">Valores actualizados</th>
                    <th colSpan="2">Valores pagados</th>
                </tr>
            </thead>
            <thead>
                <tr>
                    <th>Concepto</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                    <th>Subtotal</th>
                    <th>Unidad</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                <FilaDatos
                    concepto="Horas trabajadas"
                    cantidad={valores.cant_horas}
                    unidadActual={formatearNumero(valores.v_hora)}
                    subtotalActual={formatearNumero(data.horas)}
                    unidadPagada={formatearNumero(mayo.v_hora)}
                    subtotalPagado={formatearNumero(data.horas_d)}
                />
                <FilaDatos
                    concepto="Merienda"
                    cantidad={valores.cant_horas}
                    unidadActual={formatearNumero(valores.v_merienda)}
                    subtotalActual={formatearNumero(data.merienda)}
                    unidadPagada={formatearNumero(mayo.v_merienda)}
                    subtotalPagado={formatearNumero(data.merienda_d)}
                />
                <tr>
                    <td>Total</td>
                    <td colSpan="2"></td>
                    <td>{formatearNumero(data.total)}</td>
                    <td></td>
                    <td>{formatearNumero(data.total_d)}</td>
                </tr>
            </tbody>
            <thead>
                <tr>
                    <th colSpan="5">Diferencia</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr class="table-danger">
                    <td colSpan="5" class="h5">{formatearNumero(data.total)} - {formatearNumero(data.total_d)}</td>
                    <td class="h5">{formatearNumero(data.diferencia)}</td>
                </tr>
            </tbody>
        </table>
    </div>
);

// Componente para mostrar la diferencia acumulada
const DiferenciaAcumulada = ({ diferencia }) => (
    <div className="container mt-5">
        <table className="table table-bordered table-info">
            <thead>
                <tr>
                    <th><h4>Total Diferencia Acumulada</h4></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><h4>{formatearNumero(diferencia)}</h4></td>
                </tr>
            </tbody>
        </table>
    </div>
);

// Función para exportar a PDF
const exportToPDF = () => {
    const { jsPDF } = window.jspdf;
    const contenido = document.getElementById('contenidoPDF');

    html2canvas(contenido, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width / 2;
        const imgHeight = canvas.height / 2;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.90;
        const newImgWidth = imgWidth * ratio;
        const newImgHeight = imgHeight * ratio;
        const x = (pdfWidth - newImgWidth) / 2;
        const y = (pdfHeight - newImgHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, newImgWidth, newImgHeight);
        const nombre = empleado.nombre || "calculos";

        pdf.save(`${nombre}.pdf`);
    });
};

const App = () => (
    <div className="container text-center mt-5">
        <div id="contenidoPDF">
            <h1>{empleado.nombre}: categoría - {empleado.categoria}</h1>
            {Object.entries(empleado).filter(([key]) => key !== "nombre" && key !== "categoria").map(([mes, data]) => (
                <EmpleadoMes key={mes} mes={mes} data={data} valores={valoresMes[mes]} mayo={valoresMes['agosto']} />
            ))}
            <DiferenciaAcumulada diferencia={diferenciaAcumulada} />
        </div>
        <button className="btn btn-primary mr-4" onClick={() => {
            localStorage.clear();
            window.location.href = 'index.html';
        }}>Volver al inicio</button>
        <button className="btn btn-success" onClick={exportToPDF}>Exportar PDF</button>
    </div>
);

const init =  async() => {
    empleado = JSON.parse(localStorage.getItem('resultadoEmpleado'));
    valoresMes = JSON.parse(localStorage.getItem('valoresMes'));
    diferenciaAcumulada = JSON.parse(localStorage.getItem('diferenciaAcumulada')) || 0;
    ReactDOM.render(<App />, document.getElementById('root'));
}

init();
