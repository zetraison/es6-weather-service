/**
 * Return current geolocation position
 **/
 export function getCurrentPosition(){
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(res => resolve([res.coords.latitude, res.coords.longitude]));
    });
}