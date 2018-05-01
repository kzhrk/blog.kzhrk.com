import webpack from 'webpack';
import path from 'path';

export default {
	entry: {
    vendors: 'highlight.js'
	},

	output: {
		path: path.resolve(__dirname, './public/js'),
		filename: '[name].js'
	},

	resolve: {
		extensions: ['.js']
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				use: [{
					loader: "babel-loader"
				}]
			}
		]
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
	]
}