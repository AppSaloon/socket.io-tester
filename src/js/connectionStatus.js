/* ConnectionStatus */
'use strict';
module.exports = React.createClass({
    getInitialState () {
        return {connection: this.props.socket.connected ? true : 'connecting'};
    },
    componentDidMount () {
        this.props.socket.on('connect', () => {
            // console.info('connected');
            this.setState({connection: true});
        // }).on('connect_error', (error) => {
            // console.info('connection error');
            // console.error(error);
        }).on('reconnect_attempt', () => {
            // console.info('reconnecting');
            this.setState({connection: 'reconnecting'});
        }).on('reconnect', () => {
            // console.info('reconnected');
            this.setState({connection: true});
        }).on('reconnect_failed', (error) => {
            // console.info('reconnection end (failed)');
            // console.error(error);
            this.setState({connection: 'failed'});
        });
    },
    // componentWillUnmount () {
        // this.props.socket.off('connect').off('connect_error').off('reconnect_attempt').off('reconnect').off('reconnect_failed');
    // },
    handleReconnect (event) {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        this.props.socket.connect();
        this.setState({connection: 'reconnecting'});
    },
    render () {
        let connection = this.state.connection;
        let status = 'glyphicon glyphicon-ok-circle';
        let status2 = 'Connected';
        let className = 'pull-right text-success';
        let disconnected = false;
        if ( connection === 'connecting' ) {
            status = 'glyphicon glyphicon-refresh';
            status2 = 'Connecting';
            className = 'pull-right text-info';
        } else if ( connection === 'failed' ) {
            status = 'glyphicon glyphicon-remove-circle';
            status2 = 'Disconnected';
            className = 'pull-right text-danger';
            disconnected = true;
        } else if ( connection === 'reconnecting' ) {
            status = 'glyphicon glyphicon-refresh';
            status2 = 'Reconnecting';
            className = 'pull-right text-warning';
        }
        return (
            <span className={className}>{status2} <span className={status}></span> {disconnected ? <button onClick={this.handleReconnect} className="btn btn-xs btn-default"><span className="glyphicon glyphicon-refresh"></span></button> : ''}</span>
        );
    }
});
