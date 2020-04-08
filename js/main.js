// primo grafico line con dati vendite mensili
getVenditeMensili();

// secondo grafico pie con dati vendite percentuali annuali per venditore
getVenditeAnnueVenditori();

// al click vengono aggiunti i nuovi dati e aggiornati i grafici
$('#invia-dati').click(function() {
    updateCharts();
    getVenditeMensili();
    getVenditeAnnueVenditori();
});

// chiamata API per raggiungere i dati relativi a vendite mensili
function getVenditeMensili() {
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
}

// chiamata API per raggiungere i dati relativi alle vendite annuali di ogni venditore
function getVenditeAnnueVenditori() {
    $.ajax({
        url: 'http://157.230.17.132:4002/sales',
        method: 'GET',
        success: function (data) {
            var costruttore = costruttoreDatiVenditori(data);
            var datiVenditePercentuali = getPercentualiVendite(costruttore.data)
            costruttoreGraficoPie(costruttore.labels, datiVenditePercentuali);
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

// aggiornamento grafico con nuovi dati inseriti
function updateCharts() {
    $('#grafico-line').empty();
    $('#grafico-pie').empty();
    $.ajax({
        url: 'http://157.230.17.132:4002/sales',
        method: 'POST',
        data: {
            salesman: $('#selezione-venditore').val(),
            amount: $('#input-vendita').val(),
            date: moment($('#input-giorno').val()).format('DD-MM-YYYY')
        },
        success: function (data) {
        },
        error: function (err) {
            alert('errore aggiunta dati');
        }
    });

}
