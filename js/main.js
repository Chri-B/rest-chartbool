
// creo oggetto intermedio da riempire con dati per grafico
var objIntermedioMesi = {};
var dataMesi = [];
getVenditeMensili();
var objIntermedioVenditori = {};
var labelsVenditori = [];
var dataVenditori = [];
var totaleVendite = 0;
var dataVenditoriPercentuale = [];
getVenditeVenditori();




// grafico-line per andamento vendite mensili complessive
var lineChart = new Chart($('#grafico-line'), {
    type: 'line',
    data: {
        labels: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
        datasets: [{
            label: 'Vendite Mensili',
            borderColor: 'rgb(255, 99, 132)',
            data: dataMesi,
            lineTension: 0,
        }]
    }
});

// grafico-pie per andamento vendite annuali per venditore
var pieChart = new Chart($('#grafico-pie'), {
    type: 'pie',
    data: {
        labels: labelsVenditori,
        datasets: [{
            label: 'Vendite Mensili',
            data: dataVenditoriPercentuale,
            backgroundColor: ['lightgreen', 'lightblue', 'lightcoral', 'yellow']
        }]
    }
});


function getVenditeMensili() {
    $.ajax({
        url: 'http://157.230.17.132:4002/sales',
        method: 'GET',
        success: function (data) {
            getDatiMesi(data);
        },
        error: function (err) {
            alert('errore richiesta');
        }
    });
};

function getVenditeVenditori() {
    $.ajax({
        url: 'http://157.230.17.132:4002/sales',
        method: 'GET',
        success: function (data) {
            getDatiVenditori(data);
        },
        error: function (err) {
            alert('errore richiesta');
        }
    });
};

// funzione per ricavare i dati delle vendite mensili e popolare la variabile dataPC
function getDatiMesi(array) {
    for (var i = 0; i < array.length; i++) {
        var oggettoSingolo = array[i];
        var giornoVendita = oggettoSingolo.date;
        var meseVendita = moment(giornoVendita, "DD-MM-YYYY").clone().month(); // ottengo i numeri dei mesi che escono già ordinati nell'oggetto
        if (objIntermedioMesi[meseVendita] === undefined) {
            objIntermedioMesi[meseVendita] = 0;
        }
        objIntermedioMesi[meseVendita] += oggettoSingolo.amount;
    }
    // !!!!!!!!!!! NON VIENE ESEGUITO IL CICLO !!!!!!!!!!
    // DEVO INSERIRLO PER FORZA DENTRO LA FUNZIONE! ALTRIMENTI E' INVISIBILE
    for (var key in objIntermedioMesi) {
        // labelsPC.push(key);
        dataMesi.push(objIntermedioMesi[key]);
    }
}

function getDatiVenditori(array) {
    for (var i = 0; i < array.length; i++) {
        var oggettoSingolo = array[i];
        var venditore = oggettoSingolo.salesman;
        if (objIntermedioVenditori[venditore] === undefined) {
            objIntermedioVenditori[venditore] = 0;
        }
        objIntermedioVenditori[venditore] += oggettoSingolo.amount;
    }
    for (var key in objIntermedioVenditori) {
        labelsVenditori.push(key);
        dataVenditori.push(objIntermedioVenditori[key]);
    }
    // !!!!!!!!!!! NON VIENE ESEGUITO IL CICLO !!!!!!!!!!
    // DEVO INSERIRLO PER FORZA DENTRO LA FUNZIONE! ALTRIMENTI E' INVISIBILE
    for (var i = 0; i < dataVenditori.length; i++) {
        totaleVendite += dataVenditori[i];
    }

    for (var i = 0; i < dataVenditori.length; i++) {
        dataVenditori[i] = ((dataVenditori[i] / totaleVendite) * 100);
        dataVenditoriPercentuale[i] = Math.round(dataVenditori[i] * 100) / 100;
    }
    console.log(dataVenditoriPercentuale);
}
