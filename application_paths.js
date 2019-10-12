const os = require('os');
// port is obtained from MagicMirror/js/defaults.js
const { port: MM_PORT } = require('../../js/defaults');

const getHostAddress = () => {
	const addr = Object.values(os.networkInterfaces())
		.map(iface => iface
			.find(addr => addr.family === 'IPv4' && !addr.internal))
		.filter(addr => addr)[0];
	return addr ? addr.address : "localhost";
}

const MMM_SERVER_PORT = 6161;
module.exports = {
    HOST_ADDRESS: getHostAddress(),
    MM_PORT,
    MMM_SERVER_PORT,
}
