/* UrlForm */
'use strict';

module.exports = React.createClass({
    handleSubmit (event) {
        event.preventDefault();
        let url = React.findDOMNode(this.refs.url).value.trim();
        if (!url) {
            return;
        }
        if (!url.match('http://')) {
            url = `http://${url}`;
        }
        this.props.onUrlSubmit(url);
        React.findDOMNode(this.refs.url).value = '';
    },
    render () {
        return (
            <div className="urlForm">
                <form className="form-inline" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label for="urlInput">Url</label>
                        <input id="urlInput" type="text" placeholder="url" className="urlInput form-control" ref="url"></input>
                    </div>
                    <div className="input-group">
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
