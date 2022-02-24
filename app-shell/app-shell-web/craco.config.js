const { ModuleFederationPlugin } = require("webpack").container;

const { dependencies } = require("./package.json");

module.exports = {
  webpack: {
    plugins: {
      add: [
        new ModuleFederationPlugin({
          name: "app_shell",
          filename: "remoteEntry.js",
          remotes: {
            division: "division@https://acmefast.dev/division/remoteEntry.js",
            employee: "employee@https://acmefast.dev/employee/remoteEntry.js",
            employee_dashboard:
              "employee_dashboard@https://acmefast.dev/employee-dashboard/remoteEntry.js",
            task: "task@https://acmefast.dev/task/remoteEntry.js",
          },
          exposes: {
            "./AppShell": "./src/App",
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
