/**
 * @param {Number} tag - Tag
 * @param {Number} monat - Monat
 * @param {Number} jahr - Jahr als vierstellige Zahl
 * @return {Number} Wochentag, 0 = Sonntag, 1 = Montag, ... , 6 = Samstag
 */
function wochentag(tag, monat, jahr) {
    let h = Math.floor(jahr / 100);
    let j = jahr % 100;
    let m = monat;
    // Umwandlung in altrömische Zeitrechnung
    if (m < 3) {
        m += 10;
        if (j === 0) {
            j = 99;
            h -= 1;
        } else {
            j -= 1;
        }
    } else {
        m -= 2;
    }
    // Zellersche Formel
    let w = (tag+Math.floor(2.61*m-0.2)+j+Math.floor(j/4)+Math.floor(h/4)-2*h);
    w %= 7;
    if (w < 0) {
        w = 7 - Math.abs(w);
    }
    return w;
}

/**
 * @param {Number} jahr - Jahr als vierstellige Zahl
 * @return {Boolean} 'true', wenn Jahr ein Schaltjahr ist, sonst 'false'
 */
function schaltjahr(jahr) {
    return (jahr % 4 === 0) && !((jahr % 100 === 0) && (jahr % 400 !== 0));
}

/**
 * @param {Number} monat - Monat
 * @param {Number} jahr - Jahr als vierstellige Zahl
 * @return {Number} Anzahl der Tage des Monats im angegebenen Jahr
 */
function anzahlTage(monat, jahr) {
    switch (monat) {
        case 1: return 31;
        case 2:
            if (schaltjahr(jahr)) return 29;
            else return 28;
        case 3: return 31;
        case 4: return 30;
        case 5: return 31;
        case 6: return 30;
        case 7: return 31;
        case 8: return 31;
        case 9: return 30;
        case 10: return 31;
        case 11: return 30;
        case 12: return 31;
    }
}

/**
 * @param {Number} monat - Monat
 * @return {String} Monatsname
 */
function monatsname(monat) {
    switch (monat) {
        case 1: return 'Januar';
        case 2: return 'Februar';
        case 3: return 'März';
        case 4: return 'April';
        case 5: return 'Mai';
        case 6: return 'Juni';
        case 7: return 'Juli';
        case 8: return 'August';
        case 9: return 'September';
        case 10: return 'Oktober';
        case 11: return 'November';
        case 12: return 'Dezember';
    }
}

/**
 * @param {Number} jahr - Jahr als vierstellige Zahl
 * @return {Date} - Ostersonntag im angegebenen Jahr
 */
function ostersonntag(jahr) {
    const k = Math.floor(jahr / 100);
    const m = 15 + Math.floor((3*k+3) / 4) - Math.floor((8*k+13) / 25);
    const s = 2 - Math.floor((3*k+3) / 4);
    const a = jahr % 19;
    const d = (19*a+m) % 30;
    const r = Math.floor((d + Math.floor(a / 11)) / 29);
    const og = 21 + d - r;
    const sz = 7 - (jahr + Math.floor(jahr / 4) + s) % 7;
    const oe = 7 - (og - sz) % 7;
    const os = og + oe;
    const tag = new Date(jahr,2); // März
    if (os > 31) {
        tag.setMonth(3); // April
        tag.setDate(os - 31);
    } else {
        tag.setDate(os);
    }
    return tag;
}

/**
 * @param {Number} monat - Monat
 * @param {String} bl - Bundesland ('BB' oder 'BE')
 * @return {Number[]} Array mit den Tagen
 */
function unbeweglicheFeiertage(monat, bl) {
    let feiertage = [];
    switch (monat) {
        case 1: feiertage.push(1); break;
        case 2: break;
        case 3:
            if (bl === 'BE') {
                feiertage.push(8); // Berlin
            }
            break;
        case 4: break;
        case 5: feiertage.push(1); break;
        case 6: break;
        case 7: break;
        case 8: break;
        case 9: break;
        case 10:
            feiertage.push(3);
            if (bl === 'BB') {
                feiertage.push(31); // Brandenburg
            }
            break;
        case 11: break;
        case 12:
            // feiertage.push(24); // kein Feiertag
            feiertage.push(25);
            feiertage.push(26);
        // feiertage.push(31); // kein Feiertag
    }
    return feiertage;
}

/**
 * @param {Number} monat - Monat
 * @param {Number} jahr - Jahr als vierstellige Zahl
 * @return {Number[]} Array mit den Tagen
 */
function beweglicheFeiertage(monat, jahr) {
    const feiertage = [];
    const os = ostersonntag(jahr);

    // Karfreitag
    const kf = new Date(jahr, os.getMonth(), os.getDate()-2);
    // Ostermontag
    const om = new Date(jahr, os.getMonth(), os.getDate()+1);
    // Himmelfahrt (39 Tage nach Ostersonntag)
    const hf = new Date(jahr, os.getMonth(), os.getDate()+39);
    // Pfingstmontag (50 Tage nach Ostersonntag)
    const pm = new Date(jahr, os.getMonth(), os.getDate()+50);

    if (monat === kf.getMonth()+1) {
        feiertage.push(kf.getDate());
    }
    if (monat === om.getMonth()+1) {
        feiertage.push(om.getDate());
    }
    if (monat === hf.getMonth()+1) {
        feiertage.push(hf.getDate());
    }
    if (monat === pm.getMonth()+1) {
        feiertage.push(pm.getDate());
    }
    return feiertage;
}