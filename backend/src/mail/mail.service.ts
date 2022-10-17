import { Inject, Injectable } from "@nestjs/common";
import { MAIL_CONFIG_OPTION } from "src/common/common.const";
import { EmailVar, MailModuleOptions, VerificationEmailInf } from "./mail.interface";
const Mailgun = require('mailgun.js');
import * as FormData from 'form-data';


@Injectable()
export class MailService {
    constructor(
        @Inject(MAIL_CONFIG_OPTION) private readonly options: MailModuleOptions
    ) { }

    private async sendEmail(subject: string, templateName: string, emailVar: EmailVar[]) {
        // const { subject, content } = emailInf;

        const mailgun = new Mailgun(FormData);
        const mg = mailgun.client({ username: 'api', key: this.options.apiKey });
        const mailData = {
            from: `Patrick from Number Eat <mailgun@${this.options.domain}>`,
            to: ['750772121@qq.com'],
            subject: subject,
            template: templateName // verify
            // "v:code": 'asasa',
            // "v:username": 'patrick'
        };
        emailVar.forEach(item => mailData["v:" + item.key] = item.value);

        mg.messages.create(this.options.domain, mailData);
        // .then(msg => console.log(msg)) // logs response data
        // .catch(err => console.error(err)); // logs any error

    }

    sendVerificationEmail(inf: VerificationEmailInf) {
        const { code, email } = inf;
        this.sendEmail('verify-email', 'verify', [
            { key: 'code', value: code },
            { key: 'username', value: email }
        ])
    }
}