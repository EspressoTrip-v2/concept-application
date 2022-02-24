const { ModuleFederationPlugin } = require("webpack").container;

const { dependencies } = require("./package.json");

module.exports = {
  webpack: {
    plugins: {
      add: [
        new ModuleFederationPlugin({
          name: "employee_dashboard",
          filename: "remoteEntry.js",
          remotes: {
            app_shell:
              "app_shell@https://acmefast.dev/app-shell/remoteEntry.js",
          },
          exposes: {
            "./EmployeeDashboard": "./src/EmployeeDashboard",
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
