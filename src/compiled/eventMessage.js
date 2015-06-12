/* messages */
"use strict";

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        // console.log('render EventMessage');
        var message = this.props.children.message;
        try {
            message = JSON.parse(message);
        } catch (error) {}
        var time = new Date(this.props.children.key).toString();
        return React.createElement(
            "tr",
            { className: "eventNameMessage" },
            React.createElement(
                "td",
                null,
                message
            ),
            React.createElement(
                "td",
                null,
                time
            )
        );
    }
});