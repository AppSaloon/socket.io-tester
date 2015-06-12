/* UrlForm */
'use strict';

module.exports = React.createClass({
    displayName: 'exports',

    handleSubmit: function handleSubmit(event) {
        event.preventDefault();
        var url = React.findDOMNode(this.refs.url).value.trim();
        if (!url.match('http://')) {
            url = 'http://' + url;
        }
        var port = React.findDOMNode(this.refs.port).value.trim();
        if (!url || !port) {
            return;
        }
        this.props.onUrlSubmit({ url: url, port: port });
        React.findDOMNode(this.refs.url).value = '';
        React.findDOMNode(this.refs.port).value = '';
        return;
    },
    render: function render() {
        // console.log('render UrlForm');
        return React.createElement(
            'div',
            { className: 'urlForm' },
            React.createElement(
                'form',
                { className: 'form-inline', onSubmit: this.handleSubmit },
                React.createElement(
                    'div',
                    { className: 'form-group' },
                    React.createElement(
                        'label',
                        { 'for': 'urlInput' },
                        'Url'
                    ),
                    React.createElement('input', { id: 'urlInput', type: 'text', placeholder: 'url', className: 'urlInput form-control', ref: 'url' })
                ),
                React.createElement(
                    'span',
                    null,
                    ':'
                ),
                React.createElement(
                    'div',
                    { className: 'input-group' },
                    React.createElement('input', { id: 'portInput', type: 'number', placeholder: 'port', className: 'portInput form-control', ref: 'port' }),
                    React.createElement(
                        'span',
                        { className: 'input-group-btn' },
                        React.createElement(
                            'button',
                            { className: 'btn btn-default', type: 'submit' },
                            'Add'
                        )
                    )
                )
            ),
            React.createElement('hr', null)
        );
    }
});