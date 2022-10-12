export interface MailModuleOptions {
    apiKey: string,
    domain: string,
    fromEmail: string
}


export interface EmailVar {
    key: string,
    value: string
}

export interface VerficationEmailInf {
    email: string,
    code: string
}