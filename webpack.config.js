var htmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var InlineManifestWebpackPlugin=require('inline-manifest-webpack-plugin');
var UglifyJsPlugin=require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const cleanWebpackPlugin = require('clean-webpack-plugin'); 

var isProduction = process.env.MODE_ENV === 'production';

module.exports = {
	target: 'node',
	mode:'none',
	context:__dirname,
	entry:{
		main:'./src/app.js',
		vender:['jquery'],
	},
	// ['./src/script/main.js','./src/script/a.js'],
	output:{
		path:path.resolve(__dirname,'dist'),
		filename:'js/[name].bundle.js',
	},
	module:{
		rules:[
			{
				test:/\.js$/,
				exclude:path.resolve(__dirname,'node_modules'),
				include:path.resolve(__dirname,'src'),
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
      			}
			},
			{
				test:/\.html$/,
				loader:'html-loader',
			},
			// {
			// 	test:/\.(png|jpg|gif|svg)$/i,
			// 	loaders:['url-loader',],
			// 	// loader:'file-loader',
			// 	options: {
			// 		limit:200000,
			// 		name: '[name]-[hash].[ext]',
			// 		outputPath: 'images/'
			// 	}
			// },
			{
				test:/\.(png|jpg|gif|svg)$/i,
				use: [ 
					{
						loader : 'url-loader',
						options: {
							limit:2000,
							name: '[name]-[hash].[ext]',
							outputPath: 'images/'
						}
					},
					'image-webpack-loader'
				]
			},
			{
				test:/\.tpl$/,
				loader:'ejs-loader',
			},
			{
				test: /\.(css|sass|scss)$/,
				use: [ 
					!isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
					'style-loader', 
					{
						loader : 'css-loader',
						options : {
							minimize : true,
							importLoaders : 1,
						},
					},
		           {
		           		loader: 'postcss-loader',
		           		options:{
			           		plugins:[
					           	require("postcss-import")(),
					           	require("autoprefixer")("last 100 versions")
				           	]
			           	}
		       		},
		       		'sass-loader'
	           	]
	       	},
	       	{
				test: /\.less$/,
				use: [ 
					'style-loader', 
					{
						loader : 'css-loader',
						options : {
							importLoaders : 1
						},
					},
		           {loader: 'postcss-loader',options:{plugins:[require("postcss-import")(),require("autoprefixer")("last 100 versions")]}},
		           'less-loader'
	           	]
	       },


	   //     {
				// test: /\.sass$/,
				// use: [ 
				// 	'style-loader', 
				// 	{
				// 		loader : 'css-loader',
				// 		options : {
				// 			importLoaders : 1
				// 		},
				// 	},
		  //          {loader: 'postcss-loader',options:{plugins:[require("postcss-import")(),require("autoprefixer")("last 100 versions")]}},
		  //          'sass-loader'
	   //         	]
	   //     },
		]
	},
	plugins:[
		new htmlWebpackPlugin({
			filename:'index.html',
			template:'index.ejs',
			inject:'body'
		}),
		new InlineManifestWebpackPlugin(),
		new webpack.BannerPlugin('fergson,love you'),
		new MiniCssExtractPlugin({
		      filename: "[name].css",
		      chunkFilename: "[id].css"
		}),
		new cleanWebpackPlugin(
			['dist'], //这里指每次清除dist文件夹的文件 匹配的文件夹
		),
	],
	optimization: {
	    splitChunks: {
	      cacheGroups: {
	        styles: {
	          name: 'styles',
	          test: /\.css$/,
	          chunks: 'all',
	          enforce: true
	        }
	      }
	    }
  	},
	
}


if (isProduction) {
	module.exports.plugins.push(
		new UglifyJsPlugin({
			uglifyOptions: {
				compress: false
			}
		})
	)
}
























