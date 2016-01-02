export default {
    baseUrl: '',
    
    // Wheather openweathermap.org API
    openWeatherMap: {
        apiUrl: 'http://api.openweathermap.org/data/2.5/',
        imgUrl: 'http://openweathermap.org/img/w/',
        apikey: 'Your Openweathermap API key'
    },
    
    // Set default city for weather showing
    defaultCity: 'Moscow',
    
    // Coefficient for converting pressure units from hPa into mmHg
    hpaTommHgCoeff: 0.75008
};