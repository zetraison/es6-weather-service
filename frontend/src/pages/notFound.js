import React from 'react/lib/React';

class NotFoundPage extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="error-template">
                            <h1>Oops!</h1>
                            <h2>404 Not Found</h2>
                            <div className="error-details">
                                Sorry, an error has occurred, Requested page not found!
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
}

export default NotFoundPage;