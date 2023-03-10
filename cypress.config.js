const cucumber = require('cypress-cucumber-preprocessor').default

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber()),
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    specPattern: '**/features/*.{feature,features}',
    excludeSpecPattern: '**/pages/*',
    videosFolder: "cypress/reports/videos",
    screenshotsFolder: "cypress/reports/screenshots",
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      charts: true,
      reportPageTitle: 'custom-title',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
    },
    projectId: "qrq1nw"

  },
});
