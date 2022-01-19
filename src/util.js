import config from './config';

/**
 * Converting timestamp to date
 * 
 * param {Number} timestamp
 **/
export function timestampToDate(timestamp){
    let month = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    let d =  new Date(timestamp * 1000);

    return [d.getDate(), month[d.getMonth()]].join(' ');
}

/**
 * Converting timestamp to time
 * 
 * param {Number} timestamp
 **/
export function timestampToTime(timestamp){
    let d =  new Date(timestamp * 1000);

    return [d.getHours() < 10 ? '0' + d.getHours() : d.getHours(), 
            d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()].join(':');
}

export function buildIconUrl(code){
    return config.openWeatherMap.imgUrl + code + '.png';
}

export function convertingHpaTomHg(pressure){
    // Coefficient for converting pressure units from hPa into mmHg
    const hpaTomHgCoefficient = 0.75008;
    return Math.round(hpaTomHgCoefficient * pressure);
}

export function roundTo(value, part){
    return parseFloat(value.toFixed(part));
}

export function appendBody(){
    const el = document.createElement('div');
    document.body.appendChild(el);

    return el;
}