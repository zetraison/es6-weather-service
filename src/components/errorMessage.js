import React from 'react';

const ErrorMessage = (props) => {
    const {message} = props;
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="error-template">
                        <h1>Oops!</h1>
                        <h2>Server error</h2>
                        <div className="error-details">
                            {message}
                        </div>
                        <div className="error-actions">
                            <a href="/" className="btn btn-primary btn-lg"><span className="glyphicon glyphicon-home"></span>Take Me Home </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ErrorMessage;
