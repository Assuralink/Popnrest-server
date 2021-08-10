const PARAMS = {
    mode: "",
    port: 8080 || process.env.PORT,
    SENDGRID_API_KEY: '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'
}

PARAMS.mode = "DEV";
// PARAMS.mode = "PROD";

module.exports = PARAMS;