import config from 'config';

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

/**
 * Return current geolocation position
 * 
 * param {Function} callback
 **/
export function getCurrentPosition(){
    
    return new Promise((resolve, reject) => {
        
        navigator.geolocation.getCurrentPosition(res => {
            resolve([res.Coordinates.latitude, res.Coordinates.longitude]);
        });
    });
}

export function buildIconUrl(code){
    return config.openWeatherMap.imgUrl + code + '.png';
}

export function convertingHpaTomHg(pressure){
    return Math.round(config.hpaTomHgCoefficient * pressure);
}

export function roundTo(value, part){
    return parseFloat(value.toFixed(part));
}

export function appendBody(){

    var el = document.createElement('div');
    document.body.appendChild(el);

    return el;
}