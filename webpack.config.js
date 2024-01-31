const path = require('path');

module.exports = {
	entry: './script.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	externals: {
		// Exclude all modules in node_modules from being bundled
		// and instead require them at runtime from the global scope
		// This assumes that the necessary libraries are available globally
		// (e.g., through a CDN or included in your HTML)
		node_modules: 'commonjs2 node_modules',
	},
	mode: 'development',
};
