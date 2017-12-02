var md5 = require( "md5" );
var sha1 = require( "sha1" );
var curl = require( "curl" );
var WebSocket = require( 'ws' );
var settings = require( './settings.json' );

function getSign( options, apiKey ) {
    var buffer = [];
    var keys = Object.keys( options ).sort();
    keys.forEach( function ( value ) {
        buffer.push( options[ value ] );
    } );
    buffer.push( apiKey );
    return md5( sha1( buffer.join( ";" ) ) );
};

function getUrlByObject( options ) {
    var result = [];
    for ( var name in options ) {
        result.push( name + "=" + encodeURIComponent( options[ name ] ) );
    };
    return result.join( "&" );
};

function sendRequest( url, options, handler ) {
    options.sign = getSign( options, settings.apiKey );
    url = url + "?" + getUrlByObject( options );
    curl.get( url, options, handler );
}

function sendSMS( number, message, handler ) {
    sendRequest( settings.url.send, {
        message: message,
        project: settings.project,
        sender: settings.sender,
        recipients: number
    }, handler );
}

var WebSocketServer = WebSocket.Server;
var port = 20000;
var ws = new WebSocketServer( {
    port: port
});

console.log( 'Websockets server started' );

ws.on( 'connection', function( socket ) {
    socket.on( 'message', function( data ) {
        var code = data.split( ';' )[0];
        var phone = data.split( ';' )[1];
        var message = "Получена заявка от калькулятора:\r\nНомер телефона: " +
            phone + ".\r\nКод: " + code + ".";
        sendSMS( settings.phone, message, function( err, response, body ) {
            if ( err ) {
                socket.send( "error" );
             } else {
                 body = JSON.parse( body );
                 if ( body.status == "success" ) {
                     socket.send( "success" );
                 } else {
                     socket.send( "error" );
                 };
             };
        } );
    });
});
