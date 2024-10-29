// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
//importamos la clase GastosCombustible
import { GastoCombustible } from './class/GastoCombustible.js';
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = '../recursos/tarifasCombustible.json';
let gastosJSONpath = '../recursos/gastosCombustible.json';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}
// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
//limitar el calendario a 2010-2020
//asignamos max y min
const dateMin = "2010-01-01"
const dateMax = "2020-12-31"
//creamos la funcion rangoAnios y le pasamos por parametros dateMin y dateMax
function rangoAnios(dateMin, dateMax) {
    //cogemos id del formulario y la guardamos en date
    const date = document.getElementById('date');
    //establecemos
    date.min = dateMin;
    date.max = dateMax;
}
//llamamos a la función y le pasamos por parametro las constantes con los valores
rangoAnios(dateMin, dateMax);


// Calcular gasto total por año al iniciar la aplicación OK
function calcularGastoTotal() {
    // array asociativo con clave=año y valor=gasto total    
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    }
    //le hacemos un foreach al array gastosJson para recorrerlo
    gastosJSON.forEach(objeto => {
        let fechaString = objeto.date;
        let fecha = new Date(fechaString);
        let gasto = objeto.precioViaje;
        //vamos sumando el gasto en el array aniosArray segun el año al que corresponda
        aniosArray[fecha.getFullYear()] += gasto;
    });
    //usamos un for para recorrer los años y ponerlos en el html
    //--------mirar una forma de detectar los años solos------------//
    for (let i = 2010; i <= 2020; i++) {
        let gastoAnio = document.getElementById("gasto" + i);
        gastoAnio.textContent = aniosArray[i].toFixed(2) + '€';
    }

}
//ejecutamos la funcion
calcularGastoTotal();

//guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault();

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value);
    const kilometros = parseFloat(document.getElementById('kilometers').value);

    let gastoViaje = 0;

    //calcular tarifa usando un for of para recorrer el array tarifasJson
    for (let objeto of tarifasJSON.tarifas) {
        //si el año coincide
        if (fecha.getFullYear() == objeto.anio) {
            //calculamos tarifa
            gastoViaje = objeto.vehiculos[tipoVehiculo] * kilometros;
        }
    }
    //creamos el objeto gastoCombustible
    const gastoCombustible = new GastoCombustible(tipoVehiculo, new Date(fecha), kilometros, gastoViaje);
    let gastoReciente = document.getElementById('expense-list');
    //mostramos en la intefaz el objeto pasado por el metodo convertoJSON
    gastoReciente.textContent = gastoCombustible.convertToJSON();

    //lo añadimos al array
    gastosJSON.push(gastoCombustible);
    //actualizamos los gastos en el nuevo gasto
    calcularGastoTotal();

    //reseteamos el formulario con el metodo reset()
    document.getElementById('fuel-form').reset();
}

