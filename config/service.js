module.exports = {
  recaptcha: {
    site_key: process.env.RECAPTCHA_SITEKEY,
    secret_key: process.env.RECAPTCHA_SECRETKEY,
    options: { hl: "fa" },
  },
  google: {
    client_key: process.env.GOOGLE_CLIENTKEY,
    client_secret: process.env.GOOGLE_CLIENTSECRET,
    callback_url: process.env.GOOGLE_CALLBACKURL,
  },
};
