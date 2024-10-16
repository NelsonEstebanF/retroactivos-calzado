let Valores_base = null;
let Empleado = {
    /* 
    "nombre": "",
    "categoria": 0
    "mesEjemplo": {
        "horas": 0,
        "merienda": 0,
        "total": 0
        "horas_d" :0,
        "merienda_d":0,
        "bono":0,
        "total_d":0,
        "diferencia":0
    }*/
};
let valor_mes = {
    /*"mesEjemplo": {
        "cant_horas",: 0,
        "v_hora": 0,
        "v_merienda": 0,
    }*/
};

// Función para cargar el archivo JSON al inicio de la aplicación
async function cargarEscalasSalariales() {
    try {
        const response = await fetch('escalasSalariales.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo JSON');
        }
        Valores_base = await response.json();
        console.log('Escalas salariales cargadas:', Valores_base);
    } catch (error) {
        console.error('Error al cargar las escalas salariales:', error);
    }
}

// Función para cargar valores de todos los meses en valores_mes
function cargarValoresMes() {
    for (const mes in Valores_base) {
      let cantHorasElement = 0;
  
      if (mes !== 'agosto') {
        cantHorasElement = document.getElementById(`${mes}_horas`) || { value: '0' };
        }
      
      const cantHorasValue = parseFloat(cantHorasElement.value);
  
      valor_mes[mes] = {
        cant_horas: isNaN(cantHorasValue) ? 0 : cantHorasValue.toFixed(1),
        v_hora: Valores_base[mes][Empleado.categoria].v_hora,
        v_merienda: Valores_base[mes].merienda,
      };
    }
  }

// Función para calcular los valores para un mes específico
function calcularMes(mes) {
    
    // Valores actuales
    const valorHora = parseFloat(valor_mes[mes].v_hora);
    const valorMerienda = parseFloat(valor_mes[mes].v_merienda);
    const horas = valor_mes[mes].cant_horas * valorHora;
    const merienda = valorMerienda * valor_mes[mes].cant_horas;
    const total = parseFloat((horas + merienda).toFixed(2));

   // Valores de febrero
const valorHora_d = parseFloat(valor_mes['agosto'].v_hora);
const valorMerienda_d = parseFloat(valor_mes['agosto'].v_merienda);
const horas_d = valor_mes[mes].cant_horas * valorHora_d;
const merienda_d = valorMerienda_d * valor_mes[mes].cant_horas;
const total_d = parseFloat((horas_d + merienda_d).toFixed(2));
const diferencia = parseFloat((total - total_d).toFixed(2));

    return {
        horas,
        merienda,
        total,
        horas_d,
        merienda_d,
        total_d,
        diferencia
    };
}


// Función para obtener los valores generales del empleado y de cada mes
function obtener_valores_generales() {
    const nombreElem = document.getElementById('nombre');
    const categoriaElem = document.querySelector('input[name="categoria"]:checked');
    Empleado["nombre"] = nombreElem ? nombreElem.value : "";
    Empleado["categoria"] = categoriaElem ? parseInt(categoriaElem.value) : 0;
    cargarValoresMes();
}
// Función principal para calcular los valores del empleado
function calcular() {
    localStorage.clear(); // Limpiar localStorage
    obtener_valores_generales();
    const meses = document.querySelectorAll('[id^="mes_"]');
    let totalDiferenciaAcumulada = 0;
    meses.forEach(mesDiv => {
        const mesId = mesDiv.id.replace('mes_', '');
        Empleado[mesId] = calcularMes(mesId);
        totalDiferenciaAcumulada += parseFloat(Empleado[mesId].diferencia);
    });

    localStorage.setItem('valoresMes', JSON.stringify(valor_mes));
    localStorage.setItem('resultadoEmpleado', JSON.stringify(Empleado));
    localStorage.setItem('diferenciaAcumulada', totalDiferenciaAcumulada.toFixed(2));
    window.location.href = 'resultados.html';
}

// Asociar la función 'calcular' al botón 'Calcular'
async function init() {
    await cargarEscalasSalariales();
    setTimeout(() => {
        const calcularButton = document.getElementById('calcular');
        calcularButton.addEventListener('click', calcular);
    }, 500);
}

init();
