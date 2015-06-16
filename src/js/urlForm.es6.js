/* UrlForm */
'use strict';

module.exports = React.createClass({
    handleSubmit (event) {
        event.preventDefault();
        let url = React.findDOMNode(this.refs.url).value.trim();
        if ( !url.match('http://') ) {
            url = `http://${url}`;
        }
        let port = React.findDOMNode(this.refs.port).value.trim();
        if ( !url || !port ) {
            return;
        }
        this.props.onUrlSubmit({url, port});
        React.findDOMNode(this.refs.url).value = '';
        React.findDOMNode(this.refs.port).value = '';
        return;
    },
    render () {
        // console.log('render UrlForm');
        return (
            <div className="urlForm">
                <form className="form-inline" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label for="urlInput">Url</label>
                        <input id="urlInput" type="text" placeholder="url" className="urlInput form-control" ref="url"></input>
                    </div>
                    <span>:</span>
                    <div className="input-group">
                        <input id="portInput" type="number" placeholder="port" className="portInput form-control" ref="port"></input>
                        <span className="input-group-btn">
                            <button className="btn btn-default" type="submit">Add</button>
                        </span>
                    </div>
                </form>
                <hr />
            </div>
        );
    }
});
