module.exports = {
    loggin: {
        logs_length: Number(process.env.LOGS_BUFFER_LENGTH) || 100,
    },
    smtp: {
        host: process.env.MAIL_HOST || "smtp.ethereal.email",
        port: Number(process.env.MAIL_PORT) || 587,
        secure: Boolean(process.env.MAIL_SECURE),
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    rabbitMQ: (() => {
        const rabbitHost = "rabbitmq";
        const pass = process.env.RABBITMQ_MANAGER_PASS || "guest";
        const user = process.env.RABBITMQ_MANAGER_USER || "guest";
        return {
            rabbitHost: user + ":" + pass + "@" + rabbitHost,
        };
    })(),
    rabbitQueues: {
        saveData: {
            exchange: "debug.save",
            queue: "monitorServer",
        },
    },

    mailOptions: {
        subject: "Monitor: {containerId} EXITED with status code {exitCode}",
        from: process.env.MAIL_USER,
        template: "email",
        to: process.env.NOTIFICATION_MAIL_TO,
    },
    // how frenquently check docker stats
    dockerIntervalCheck: 10000, // ms

    // how frequently check service heartbeat
    bServiceIntervalCheck: 10000, // ms

    // pass for this server
    auth: {
        pass: process.env.MONITOR_PASSWORD || "",
        user: process.env.MONITOR_USER || "",
        secret: process.env.MONITOR_COOKIE_SECRET || "42",
    },
};
