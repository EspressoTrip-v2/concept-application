const { ModuleFederationPlugin } = require("webpack").container;

const { dependencies } = require("./package.json");

module.exports = {
  webpack: {
    plugins: {
      add: [
        new ModuleFederationPlugin({
          name: "employee",
          filename: "remoteEntry.js",
          remotes: {
            app_shell:
              "app_shell@https://acmefast.dev/app-shell/remoteEntry.js",
          },
          exposes: {
            "./Employee": "./src/Employee",
          },
          shared: {
            ...dependencies,
            react: {
              // eager: true,
              singleton: true,
              requiredVersion: dependencies.react,
            },
            "react-dom": {
              // eager: true,
              singleton: true,
              requiredVersion: dependencies["react-dom"],
            },
          },
        }),
      ],
    },
  },
};
