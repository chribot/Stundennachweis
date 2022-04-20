/**
 * @param {String} id - id of parent div
 * @param {Number} numberOfInputs - id of parent div
 */
function generateInputElements(id, numberOfInputs) {
    const container = document.getElementById(id);
    let html = '';
    for (let i = 0; i < 31; i++) {
        if (i < numberOfInputs) {
            html += '<input type="text">';
        } else {
            html += '<input type="text" disabled>';
        }
    }
    container.innerHTML = html;
}

/**
 * @param {String} id - id of parent div
 * @param {Number} numberOfInputs - id of parent div
 * @param {String} defaultValue - text for input elements
 * @param {Number[]} arrayWeekend - array of weekend-days (no workdays)
 * @param {Number[]} arrayHoliday - array of holidays
 */
function fillInputElements(id,
                               numberOfInputs, defaultValue,
                               arrayWeekend, arrayHoliday) {
    const /**HTMLInputElement*/inputFelder = document.getElementById(id).childNodes;
    const hgFarbe = "rgb(244,242,239)";
    let day = 1;
    for (let i = 0; i < 31; i++) {
        if (i < numberOfInputs) {
            inputFelder[i].disabled = false;
            if (arrayWeekend.includes(day)) {
                if (id==="bemerkung") {
                    inputFelder[i].value = "Wochenende";
                } else {
                    inputFelder[i].style.backgroundColor = hgFarbe;
                    inputFelder[i].value = "---";
                }
            } else if (arrayHoliday.includes(day)) {
                if (id==="bemerkung") {
                    inputFelder[i].value = "Feiertag";
                } else {
                    inputFelder[i].style.backgroundColor = hgFarbe;
                    inputFelder[i].value = "---";
                }
            } else {
                inputFelder[i].value = defaultValue;
                inputFelder[i].style.backgroundColor = "transparent";
            }
            day++;
        } else {
            // alle anderen Felder im Monat zurücksetzen
            inputFelder[i].value = '';
            inputFelder[i].disabled = true;
            inputFelder[i].style.backgroundColor = "transparent";
        }
    }
}

/**
 * @param {Number} n - number
 * @return {String} - two-digit number with leading zero
 */
function twoDigits(n){
    return n.toLocaleString('de-DE', {
        minimumIntegerDigits: 2,
        useGrouping: false
    })
}

/**
 * @param {Number} month - January = 1 ... December = 12
 * @param {Number} year - year
 * @return {Number} - last day of the month in given year
 */
function endOfMonth(month, year) {
    if (month === 12) {
        year += 1;
        month = 0;
    }
    // Date expects month range 0-11
    // our endOfMonth function uses range 1-12 -> month+1
    // we set Date to next month (month+1), and go one day backwards (date=0) to last day of previous month
    const d = new Date(year, month, 0);
    return d.getDate();
}

/**
 * @param {Number} month - January = 1 ... December = 12
 * @param {Number} year - year
 * @return {Number[]} - list of all days that are not workdays
 */
function weekendDays(month, year) {
    let date = new Date(year, month-1);
    let wd = [];
    const lastDay = endOfMonth(month, year);
    for (let i = 0; i < lastDay; i++) {
        date.setDate(i+1);
        if (date.getDay()===6 || date.getDay()===0) {
            wd.push(date.getDate());
        }
    }
    return wd;
}

function nextMonth() {
    // Monat um 1 erhöhen
    if (config.monat < 12) {
        config.monat += 1;
    } else {
        config.monat = 1;
        config.jahr += 1;
    }
    updateInputs();
}

function prevMonth() {
    // Monat um 1 verringern
    if (config.monat > 1) {
        config.monat -= 1;
    } else {
        config.monat = 12;
        config.jahr -= 1;
    }
    updateInputs();
}

function updateInputs() {
    // Daten neu berechnen
    const zeitraum = twoDigits(config.monat) + ' / ' + config.jahr.toString();
    const tageMonat = endOfMonth(config.monat, config.jahr);
    const wochenenden = weekendDays(config.monat, config.jahr);
    const feiertage = beweglicheFeiertage(config.monat, config.jahr)
        .concat( unbeweglicheFeiertage(config.monat, config.bundesland) );

    // Werte der Inputs ändern
    document.getElementById("zeitraum").value = zeitraum;
    fillInputElements("arbeitsbeginn", tageMonat, config.arbeitBeginn, wochenenden, feiertage);
    fillInputElements("arbeitsende", tageMonat, config.arbeitEnde, wochenenden, feiertage);
    fillInputElements("zeitstunden", tageMonat, config.diffStunden, wochenenden, feiertage);
    fillInputElements("bemerkung", tageMonat, '', wochenenden, feiertage);
}

let config = {
    stundeBeginn: undefined,
    minuteBeginn: undefined,
    stundeEnde: undefined,
    minuteEnde: undefined,
    monat: undefined,
    jahr: undefined,
    teilnehmer: undefined,
    kundenNr: undefined,
    firma: undefined,
    bundesland: undefined
};
function loadConfigFile() {
    // config.json Datei laden
    fetch("./config.json")
        .then(response => { return response.json(); })
        .then(data => {
            // alle Daten aus der config.json
            config = data;

            // zusätzliche Daten hinzufügen
            let heute = new Date();
            if (config.monat === 0) config.monat = heute.getMonth()+1;
            if (config.jahr === 0) config.jahr = heute.getFullYear();
            config.arbeitBeginn = twoDigits(config.stundeBeginn) + ':' + twoDigits(config.minuteBeginn) + ' Uhr';
            config.arbeitEnde = config.stundeEnde + ':' + config.minuteEnde + ' Uhr';
            const startDate = new Date(0, 0, 0, config.stundeBeginn, config.minuteBeginn, 0);
            const endDate = new Date(0, 0, 0, config.stundeEnde, config.minuteEnde, 0);
            const diff = endDate.getTime() - startDate.getTime();
            config.diffStunden = Number(diff / 3600000).toString();

            // Inputs erstellen
            createInputs(); })
        .catch((error) => console.error('Error:', error));
}

function createInputs() {
    const zeitraum = twoDigits(config.monat) + ' / ' + config.jahr.toString();
    const tageMonat = endOfMonth(config.monat, config.jahr);
    const wochenenden = weekendDays(config.monat, config.jahr);
    const feiertage = beweglicheFeiertage(config.monat, config.jahr)
        .concat( unbeweglicheFeiertage(config.monat, config.bundesland) );

    // Werte in die 4 Kopffelder eintragen
    document.getElementById("teilnehmer").value = config.teilnehmer;
    document.getElementById("kunden-nr").value = config.kundenNr;
    document.getElementById("praktikumsstelle").value = config.firma;
    document.getElementById("zeitraum").value = zeitraum;

    // Arbeitsbeginn
    generateInputElements("arbeitsbeginn", tageMonat);
    fillInputElements("arbeitsbeginn", tageMonat, config.arbeitBeginn, wochenenden, feiertage);

    // Arbeitsende
    generateInputElements("arbeitsende", tageMonat);
    fillInputElements("arbeitsende", tageMonat, config.arbeitEnde, wochenenden, feiertage);

    // Zeitstunden
    generateInputElements("zeitstunden", tageMonat);
    fillInputElements("zeitstunden", tageMonat, config.diffStunden, wochenenden, feiertage);

    // Bemerkung
    generateInputElements("bemerkung", tageMonat);
    fillInputElements("bemerkung", tageMonat, '', wochenenden, feiertage);
}