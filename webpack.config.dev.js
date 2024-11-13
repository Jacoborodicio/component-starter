const { merge } = require("webpack-merge");
const common = require("./webpack.config.common");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const detectPort = require("detect-port");
const { input } = require("@inquirer/prompts");

const DEFAULT_PORT = 3000;

const getFinalPort = async () => {
  const finalPort = await detectPort(DEFAULT_PORT);
  if (finalPort === DEFAULT_PORT) {
    return finalPort;
  }
  // If the Default Port is not available, ask the user if they want to use the next available port
  const shouldUseAnotherPort = await input({
    type: "confirm",
    name: "useNextPort",
    message: `Port ${DEFAULT_PORT} is already in use. Would you like to run the app on port ${finalPort}?`,
  });
  return shouldUseAnotherPort ? finalPort : null;
};

module.exports = async () => {
  const port = await getFinalPort();
  if (!port) {
    console.log("Development Server Cancelled. Exiting...");
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
