const { merge } = require("webpack-merge");
const common = require("./webpack.config.common");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const detectPort = require("detect-port");
const inquirer = require("inquirer");

const DEFAULT_PORT = 3000;

const getPort = async () => {
  const port = await detectPort(DEFAULT_PORT);
  if (port === DEFAULT_PORT) {
    return port;
  }
  // If the Default Port is not available, ask the user if they want to use the next available port
  const { useNextPort } = await inquirer.prompt([
    {
      type: "confirm",
      name: "useNextPort",
      message: `Port ${DEFAULT_PORT} is already in use. Would you like to run the app on port ${port}?`,
    },
  ]);
  return useNextPort ? port : null;
};

module.exports = async () => {
  const port = await getPort();
  if (!port) {
    console.log("Server Cancelled. Exiting...");
    process.exit(0);
  }
  return merge(common, {
    mode: "development",
    entry: "./demo/index.jsx",
    devtool: "eval-source-map",
    devServer: {
      static: path.resolve(__dirname, "demo"),
      compress: true,
      port,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./demo/index.html",
      }),
    ],
  });
};
