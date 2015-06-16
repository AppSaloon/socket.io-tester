/* messages */
module.exports = React.createClass({
    render () {
        // console.log('render EventMessage');
        let message = this.props.children.message;
        try {
            message = JSON.parse(message);
        }
        catch (error) {
        }
        let time = new Date(this.props.children.key).toString();
        return (
            <tr className="eventNameMessage">
                <td>
                    {message}
                </td>
                <td>
                    {time}
                </td>
            </tr>
        );
    }
});
