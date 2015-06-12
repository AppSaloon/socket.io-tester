/* ConnectionStatus */
'use strict';
module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return { connection: this.props.socket.connected ? true : 'connecting' };
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        this.props.socket.on('connect', function () {
            // console.info('connected');
            _this.setState({ connection: true });
            // }).on('connect_error', (error) => {
            // console.info('connection error');
            // console.error(error);
        }).on('reconnect_attempt', function () {
            // console.info('reconnecting');
            _this.setState({ connection: 'reconnecting' });
        }).on('reconnect', function () {
            // console.info('reconnected');
            _this.setState({ connection: true });
        }).on('reconnect_failed', function (error) {
            // console.info('reconnection end (failed)');
            // console.error(error);
            _this.setState({ connection: 'failed' });
        });
    },
    // componentWillUnmount () {
    // this.props.socket.off('connect').off('connect_error').off('reconnect_attempt').off('reconnect').off('reconnect_failed');
    // },
    handleReconnect: function handleReconnect(event) {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        this.props.socket.connect();
        this.setState({ connection: 'reconnecting' });
    },
    render: function render() {
        var connection = this.state.connection;
        var status = 'glyphicon glyphicon-ok-circle';
        var status2 = 'Connected';
        var className = 'pull-right text-success';
        var disconnected = false;
        if (connection === 'connecting') {
            status = 'glyphicon glyphicon-refresh';
            status2 = 'Connecting';
            className = 'pull-right text-info';
        } else if (connection === 'failed') {
            status = 'glyphicon glyphicon-remove-circle';
            status2 = 'Disconnected';
            className = 'pull-right text-danger';
            disconnected = true;
        } else if (connection === 'reconnecting') {
            status = 'glyphicon glyphicon-refresh';
            status2 = 'Reconnecting';
            className = 'pull-right text-warning';
        }
        return React.createElement(
            'span',
            { className: className },
            status2,
            ' ',
            React.createElement('span', { className: status }),
            ' ',
            disconnected ? React.createElement(
                'button',
                { onClick: this.handleReconnect, className: 'btn btn-xs btn-default' },
                React.createElement('span', { className: 'glyphicon glyphicon-refresh' })
            ) : ''
        );
    }
});