// primo grafico line con dati vendite mensili
$.ajax({
    url: 'http://157.230.17.132:4002/sales',
    method: 'GET',
    success: function (data) {
        var costruttore = costruttoreDatiMesi(data);
        costruttoreGraficoLine(costruttore);
    },
    error: function (err) {
        alert('errore richiesta');
    }
});

// secondo grafico pie con dati vendite percentuali annuali per venditore
$.ajax({
    url: 'http://157.230.17.132:4002/sales',
    method: 'GET',
    success: function (data) {
        var costruttore = costruttoreDatiVenditori(data);
        costruttoreGraficoPie(costruttore.venditori, costruttore.venditePercentuali);
    },
    error: function (err) {
        alert('errore richiesta');
    }
});


// funzione per ricavare i dati delle vendite mensili
function costruttoreDatiMesi(array) {
    var objIntermedioMesi = {};
    for (var i = 0; i < array.length; i++) {
        var oggettoSingolo = array[i];
        var giornoVendita = oggettoSingolo.date;
        var meseVendita = moment(giornoVendita, "DD-MM-YYYY").clone().month(); // ottengo i numeri dei mesi che escono già ordinati nell'oggetto
        if (objIntermedioMesi[meseVendita] === undefined) {
            objIntermedioMesi[meseVendita] = 0;
        }
        objIntermedioMesi[meseVendita] += oggettoSingolo.amount;
    }
    var dataMesi = [];
    for (var key in objIntermedioMesi) {
        // labelsPC.push(key);
        dataMesi.push(objIntermedioMesi[key]);
    }
    return dataMesi;
};

// funzione per ricavare i dati delle vendite annuali per ogni venditore
function costruttoreDatiVenditori(array) {
    var objIntermedioVenditori = {};
    var labelsVenditori = [];
    var dataVenditori = [];
    var totaleVendite = 0;
    var dataVenditoriPercentuale = [];

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
    for (var i = 0; i < dataVenditori.length; i++) {
        totaleVendite += dataVenditori[i];
    }
    for (var i = 0; i < dataVenditori.length; i++) {
        dataVenditori[i] = ((dataVenditori[i] / totaleVendite) * 100);
        dataVenditoriPercentuale[i] = Math.round(dataVenditori[i] * 100) / 100;
    }
    return {
        venditePercentuali: dataVenditoriPercentuale,
        venditori: labelsVenditori
    }
}

// costruzione grafico-line per andamento vendite mensili complessive
function costruttoreGraficoLine(dati) {
    var lineChart = new Chart($('#grafico-line'), {
        type: 'line',
        data: {
            labels: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
            datasets: [{
                label: 'Vendite Mensili',
                borderColor: 'rgb(255, 99, 132)',
                data: dati,
                lineTension: 0,
            }]
        }
    });
}

// costruzione grafico-pie per andamento vendite per venditore
function costruttoreGraficoPie(datiLabels, dati) {
    var pieChart = new Chart($('#grafico-pie'), {
        type: 'pie',
        data: {
            labels: datiLabels,
            datasets: [{
                label: 'Vendite Mensili',
                data: dati,
                backgroundColor: ['lightgreen', 'lightblue', 'lightcoral', 'yellow']
            }]
        }
    });
}
