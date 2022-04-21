/*
* Author: Christoph Böttger
* Date: 21.04.2022
*/

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