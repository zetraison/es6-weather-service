'use strict';

import config from 'config';

class Service {

    request(url, options){

        options = options || {};
        options.method = options.method || 'GET';
        options.headers = {
            'Accept': 'application/json'
        };

        return $.ajax(config.baseUrl + url, options);
    }

}

export default Service;