
var arrayMesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

// creo oggetto intermedio da rimepire con dati per grafico
var objIntermedioMesi = {};
chiamataApi();
console.log(objIntermedioMesi);


var labelsPC = [];
var dataPC = [];

for (var pippo in objIntermedioMesi) {
    console.log(pippo);
}




// stampa grafico chart.js
// grafico-line per andamento vendite mensili complessive
// var chartLine = new Chart($('#grafico-line'), {
//     type: 'line',
//     data: {
//         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//         datasets: [{
//             label: 'My First dataset',
//             backgroundColor: 'rgb(255, 99, 132)',
//             borderColor: 'rgb(255, 99, 132)',
//             data: [0, 10, 5, 2, 20, 30, 45]
//         }]
//     }
// });

// grafico-pie per andamento vendite annuali per venditore
// var chartPie = new Chart($('#grafico-pie'), {
//     type: 'pie',
//     data: {
//         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//         datasets: [{
//             label: 'My First dataset',
//             backgroundColor: 'rgb(255, 99, 132)',
//             borderColor: 'rgb(255, 99, 132)',
//             data: [0, 10, 5, 2, 20, 30, 45]
//         }]
//     }
// });

function chiamataApi() {
    $.ajax({
        url: 'http://157.230.17.132:4002/sales',
        method: 'GET',
        success: function (data) {
            getDati(data);
        },
        error: function (err) {
            alert('errore richiesta');
        }
    });
};

function getDati(array) {
    for (var i = 0; i < array.length; i++) {
        var oggettoSingolo = array[i];
        var dataVendita = oggettoSingolo.date;
        var meseVendita = moment(dataVendita, "DD-MM-YYYY").clone().format('MMMM');
        // var meseVendita = moment(dataVendita, "DD-MM-YYYY").clone().mont(); // ottengo i numeri dei mesi che escono ordinati nell'oggetto
        if (objIntermedioMesi[meseVendita] === undefined) {
            objIntermedioMesi[meseVendita] = 0;
        }
        objIntermedioMesi[meseVendita] += oggettoSingolo.amount;
    }
}
