export interface MailModuleOptions {
    apiKey: string,
    domain: string,
    fromEmail: string
}


export interface EmailVar {
    key: string,
    value: string
}

export interface VerificationEmailInf {
    email: string,
    code: string
}