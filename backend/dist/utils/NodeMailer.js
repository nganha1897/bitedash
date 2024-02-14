"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeMailer = void 0;
const nodeMailer = require("nodemailer");
const SendGrid = require("nodemailer-sendgrid-transport");
const environment_1 = require("../environments/environment");
class NodeMailer {
    static initiateTransport() {
        return nodeMailer.createTransport(SendGrid({
            auth: {
                api_key: (0, environment_1.getEnvironmentVariables)().sendgrid.api_key,
            },
        }));
    }
    static sendMail(data) {
        return NodeMailer.initiateTransport().sendMail({
            from: (0, environment_1.getEnvironmentVariables)().sendgrid.email_from,
            to: data.to,
            subject: data.subject,
            html: data.html,
        });
    }
}
exports.NodeMailer = NodeMailer;
