// grafici line con dati vendite mensili
stampaGraficiFinali();

// al click vengono aggiunti i nuovi dati e aggiornati i grafici
$('#invia-dati').click(function() {
    updateCharts();
});

// chiamata API per raggiungere i dati relativi alle vendite annuali di ogni venditore
function stampaGraficiFinali() {
    $.ajax({
        url: 'http://157.230.17.132:4002/sales',
        method: 'GET',
        success: function (data) {
            var costruttoreMesi = costruttoreDatiMesi(data);
            costruttoreGraficoLine(costruttoreMesi);
            var costruttoreVenditori = costruttoreDatiVenditori(data);
            var datiVenditePercentuali = getPercentualiVendite(costruttoreVenditori.data)
            costruttoreGraficoPie(costruttoreVenditori.labels, datiVenditePercentuali);
            var costruttoreQuarter = costruttoreDatiQuarter(data);
            costruttoreGraficoBar(costruttoreQuarter);
        },
        error: function (err) {
            alert('errore richiesta');
        }
    });
}

// funzione per ricavare i dati delle vendite mensili
function costruttoreDatiMesi(array) {
    var objIntermedio = {};
    var dataPC = [];
    for (var i = 0; i < array.length; i++) {
        var oggettoSingolo = array[i];
        var giornoVendita = oggettoSingolo.date;
        var meseVendita = moment(giornoVendita, "DD-MM-YYYY").clone().month(); // ottengo i numeri dei mesi che escono già ordinati nell'oggetto
        if (objIntermedio[meseVendita] === undefined) {
            objIntermedio[meseVendita] = 0;
        }
        objIntermedio[meseVendita] += parseInt(oggettoSingolo.amount);
    }
    for (var key in objIntermedio) {
        dataPC.push(objIntermedio[key]);
    }
    return dataPC;
};

// funzione per ricavare i dati delle vendite quadrimestrali
function costruttoreDatiQuarter(array) {
    var objIntermedio = {};
    var dataPC = [];
    for (var i = 0; i < array.length; i++) {
        var oggettoSingolo = array[i];
        var giornoVendita = oggettoSingolo.date;
        var quarterVendita = moment(giornoVendita, "DD-MM-YYYY").quarter(); // ottengo i numeri dei quadrimestri
        if (objIntermedio[quarterVendita] === undefined) {
            objIntermedio[quarterVendita] = 0;
        }
        objIntermedio[quarterVendita] += parseInt(oggettoSingolo.amount);
    }
    for (var key in objIntermedio) {
        dataPC.push(objIntermedio[key]);
    }
    return dataPC;
};

// funzione per ricavare i dati delle vendite annuali per ogni venditore
function costruttoreDatiVenditori(array) {
    var objIntermedio = {};
    var labelsPC = [];
    var dataPC = [];
    for (var i = 0; i < array.length; i++) {
        var oggettoSingolo = array[i];
        var venditore = oggettoSingolo.salesman;
        if (objIntermedio[venditore] === undefined) {
            objIntermedio[venditore] = 0;
        }
        objIntermedio[venditore] += parseInt(oggettoSingolo.amount);
    }
    for (var key in objIntermedio) {
        labelsPC.push(key);
        dataPC.push(objIntermedio[key]);
    }
    return {
        data: dataPC,
        labels: labelsPC
    }
}

// funzione per ricavare le percentuali di vendita annue
function getPercentualiVendite(dataVend) {
    var totaleVendite = 0;
    var dataVenditoriPercentuale = [];

    for (var i = 0; i < dataVend.length; i++) {
        totaleVendite += dataVend[i];
    }
    for (var i = 0; i < dataVend.length; i++) {
        dataVend[i] = ((dataVend[i] / totaleVendite) * 100).toFixed(1);
    }
    return dataVend;
}

// costruzione grafico-line per andamento vendite mensili complessive
function costruttoreGraficoLine(dati) {
    var lineChart = new Chart($('#grafico-line'), {
        type: 'line',
        data: {
            labels: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
            datasets: [{
                label: 'Vendite Mensili',
                borderColor: 'rgb(0, 8, 198)',
                backgroundColor: 'rgba(0, 8, 198, 0.2)',
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
        },
        options: {
            responsive: true,
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
                    }
                }
            }
        }
    });
}

// costruzione grafico-bar per andamento vendite quadrimestrali
function costruttoreGraficoBar(dati) {
    var barChart = new Chart($('#grafico-bar'), {
        type: 'bar',
        data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{
                label: 'Quadrimestre',
                data: dati,
                backgroundColor: ['rgba(42, 201, 217, 0.2)', 'rgba(254, 0, 0, 0.2)', 'rgba(250, 255, 9, 0.5)', 'rgba(210, 55, 223, 0.3)'],
                borderColor: ['rgb(42, 201, 217)', 'rgb(254, 0, 0)', 'rgb(251, 196, 0)', 'rgb(210, 55, 223)'],
                borderWidth: 1
            }]
        }
    });
}

// aggiornamento grafico con nuovi dati inseriti
function updateCharts() {
    $.ajax({
        url: 'http://157.230.17.132:4002/sales',
        method: 'POST',
        data: {
            salesman: $('#selezione-venditore').val(),
            amount: $('#input-vendita').val(),
            date: moment($('#input-giorno').val(), 'YYYY-MM-DD').format('DD/MM/YYYY')
        },
        success: function (data) {
            stampaGraficiFinali();
        },
        error: function (err) {
            alert('errore aggiunta dati');
        }
    });

}
