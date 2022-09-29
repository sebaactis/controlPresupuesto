// Variables

const formulario = document.querySelector('#agregar-gasto');
const gastoLista = document.querySelector('#gastos');


// Eventos

eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}



// Classes

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 )
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter (gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto (cantidad) {
        const { presupuesto, restante } = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        // Crea el div

        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje error
        divMensaje.textContent = mensaje;

        // Inserta el mensaje

        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        // Quitar el texto

        setTimeout(() => {
            divMensaje.remove();
        }, 3000)
    }

    mostrarGastos(gastos) {

        this.limpiarHTML(); // Elimina el HTML

        // Iterar sobre los gastos

        gastos.forEach (gasto => {
            const {cantidad, nombre, id} = gasto;

            

            // Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            console.log(nuevoGasto);

            // Agregar el HTML del gasto

            nuevoGasto.innerHTML = `
            ${nombre} <span class="bagde badge-primary badge-pill"> $${cantidad} </span>

            `
            // Boton para borrar gasto

            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'Borrar';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);
            // Agregar al HTML

            gastoLista.appendChild(nuevoGasto);
        })
    }

    limpiarHTML() {
        while(gastoLista.firstChild) {
            gastoLista.removeChild(gastoLista.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');
        // Comprobar 25%

        if( (presupuesto / 4  ) > restante) {
           restanteDiv.classList.remove('alert-success', 'alert-warning');
           restanteDiv.classList.add('alert-danger'); 
        } else if ( ( presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        if (restante <= 0 ) {
            ui.imprimirAlerta('El presupuesto se agoto', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }

    // Si el total es 0 o menor

    
};

const ui = new UI();
let presupuesto;

// Funciones

function preguntarPresupuesto () {
    const alertPresupuesto = prompt('Ingrese su presupuesto');

      if (alertPresupuesto === '' || alertPresupuesto === null || isNaN(alertPresupuesto) || alertPresupuesto <= 0 ) {
        window.location.reload();
      }

      // Presupuesto valido
      presupuesto = new Presupuesto(alertPresupuesto);
      
      ui.insertarPresupuesto(presupuesto);
}


function agregarGasto (e) {
    e.preventDefault();

    // Leer datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // Validar

    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if ( cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }

    // Generar un objeto con el gasto

    const gasto = { nombre, cantidad, id: Date.now() }

    //Agregar gasto
    presupuesto.nuevoGasto(gasto);

    // Mensaje correcto agregado de gasto
    ui.imprimirAlerta('Gasto agregado');

    // Imprimir gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos (gastos);

    // Actualizar restante
    ui.actualizarRestante(restante);

    // 
    ui.comprobarPresupuesto(presupuesto);

    // Reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id) {
    // Elimina el gasto del objeto
    presupuesto.eliminarGasto(id);

    // Elimina los gastos del HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}

