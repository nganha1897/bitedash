import * as nodeMailer from "nodemailer";
import * as SendGrid from "nodemailer-sendgrid-transport";
import { getEnvironmentVariables } from "../environments/environment";

export class NodeMailer {
  private static initiateTransport() {
    return nodeMailer.createTransport(
      SendGrid({
        auth: {
          api_key: getEnvironmentVariables().sendgrid.api_key,
        },
      })
    );
  }

  static sendMail(data: {
    to: [string];
    subject: string;
    html: string;
  }): Promise<any> {
    return NodeMailer.initiateTransport().sendMail({
      from: getEnvironmentVariables().sendgrid.email_from,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
  }
}
