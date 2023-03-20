const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const {
  smtp,
  mailOptionsBanned,
  mailOptions,
  mailOptionsRecover,
  mailNotifyOption,
} = require("../config");

let transporter;
transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: smtp.secure, // true for 465, false for other ports
  auth: {
    user: smtp.user, // generated ethereal user
    pass: smtp.pass, // generated ethereal password
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".html",
      partialsDir: "views",
      layoutsDir: "views",
      defaultLayout: false,
    },
    viewPath: "views",
    extName: ".html",
  })
);

// create reusable transporter object using the default SMTP transport

function replaceAttributes(text, context) {
  for (const attr of Object.keys(context)) {
    text = text.replace("{" + attr + "}", context[attr]);
  }
  return text;
}

exports.sendMail = function (to, context) {
  console.log("\n\n", smtp);
  const options = {
    ...mailOptions,
    to,
    context,
    subject: replaceAttributes(mailOptions.subject, context),
  };
  return transporter.sendMail(options);
};
exports.sendNotificationMail = function (to, context) {
  const options = {
    ...mailNotifyOption,
    to,
    context,
    subject: replaceAttributes(mailNotifyOption.subject, context),
  };
  return transporter.sendMail(options);
};
exports.sendRecoveryMail = function (to, context) {
  const options = {
    ...mailOptionsRecover,
    to,
    context,
    subject: replaceAttributes(mailOptionsRecover.subject, context),
  };
  return transporter.sendMail(options);
};
exports.sendBanMail = function (to, context) {
  const options = {
    ...mailOptionsBanned,
    to,
    context,
    subject: replaceAttributes(mailOptionsBanned.subject, context),
  };
  return transporter.sendMail(options);
};
