class GastoCombustible{

    constructor(vehicleType, date, kilometers, precioViaje){
        this.vehicleType = vehicleType;
        this.date = date;
        this.kilometers = kilometers;
        this.precioViaje = precioViaje;
    }
    convertToJSON(){
        return JSON.stringify(this);
    }


}
export {GastoCombustible}
// 1.
// Crear la estructura de directorios, respetando la arquitectura estudiada, con los ficheros adjuntos PENDIENTE
