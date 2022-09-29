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
    const cantidad = document.querySelector('#cantidad').value;

    // Validar

    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if ( cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }


    
}

