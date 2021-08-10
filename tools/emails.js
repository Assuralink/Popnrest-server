const sgMail = require('@sendgrid/mail')
const PARAMS = require('../constants/index');

sgMail.setApiKey(PARAMS.SENDGRID_API_KEY)

module.exports = sgMail;