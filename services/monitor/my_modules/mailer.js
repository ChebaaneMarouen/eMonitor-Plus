const nodemailer = require("nodemailer");
var hbs = require("nodemailer-express-handlebars");
const { smtp, mailOptions } = require("../config");

let transporter;

transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure, // true for 465, false for other ports
    auth: {
        user: smtp.user, // generated ethereal user
        pass: smtp.pass // generated ethereal password
    }
});

transporter.use(
    "compile",
    hbs({
        viewEngine: {
            extName: ".html",
            partialsDir: "views",
            layoutsDir: "views",
            defaultLayout: "email.html"
        },
        viewPath: "views",
        extName: ".html"
    })
);
// create reusable transporter object using the default SMTP transport

function replaceAttributes(text, context) {
    for (const attr of Object.keys(context)) {
        text = text.replace("{" + attr + "}", context[attr]);
    }
    return text;
}

exports.sendMail = function(context) {
    const options = {
        ...mailOptions,
        context,
        subject: replaceAttributes(mailOptions.subject, context),
        attachments: [
            {
                filename: "LOGS:" + context.containerId + ".txt",
                content: String(context.logs),
                contentType: "text/plain"
            }
        ]
    };
    console.log(context.logs);
    return transporter.sendMail(options);
};
