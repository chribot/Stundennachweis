/**
 * @param {String} id - id of parent div
 * @param {String} value - text for input elements
 */
function generateInputElements(id, value) {
    let html = '';
    const container = document.getElementById(id);

    // generiere input Felder
    for (let i = 0; i < 31; i++) {
        html += '<input type="text">';
    }
    container.innerHTML = html;

    // Wert eintragen
    const inputFelder = container.childNodes;
    for (const inputFeld of inputFelder) {
        inputFeld.value = value;
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
    // Date expects month from range 0-11
    // our endOfMonth function uses range 1-12 -> month+1
    // we set Date to next month (month+1), and go one day backwards (date=0) to last day of previous month
    const d = new Date(year, month, 0);
    return d.getDate();
}

function createInputs() {
    // Standardwerte, TODO: config auslesen
    const stundeBeginn = 7;
    const minuteBeginn = 0;
    const stundeEnde = 13;
    const minuteEnde = 30;
    const arbeitBeginn = twoDigits(stundeBeginn) + ':' + twoDigits(minuteBeginn) + ' Uhr';
    const arbeitEnde = stundeEnde + ':' + minuteEnde + ' Uhr';

    // Tage des Monats
    console.log(endOfMonth(2, 2000));

    // Arbeitsbeginn
    generateInputElements("arbeitsbeginn", arbeitBeginn);

    // Arbeitsende
    generateInputElements("arbeitsende", arbeitEnde);

    // Zeitstunden
    const startDate = new Date(0, 0, 0, stundeBeginn, minuteBeginn, 0);
    const endDate = new Date(0, 0, 0, stundeEnde, minuteEnde, 0);
    const diff = endDate.getTime() - startDate.getTime();
    const diffStunden = diff / 3600000;
    generateInputElements("zeitstunden", diffStunden.toString());

    // Bemerkung
    generateInputElements("bemerkung", 'Feiertag');
}