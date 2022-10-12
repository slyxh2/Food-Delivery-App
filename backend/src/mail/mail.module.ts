import { DynamicModule, Global, Module } from '@nestjs/common';
import { MAIL_CONFIG_OPTION } from 'src/common/common.const';
import { MailModuleOptions } from './mail.interface';
import { MailService } from './mail.service';

@Global()
@Module({})
export class MailModule {
    static forRoot(options: MailModuleOptions): DynamicModule {
        return {
            module: MailModule,
            providers: [
                {
                    provide: MAIL_CONFIG_OPTION,
                    useValue: options
                },
                MailService
            ],
            exports: [MailService]
        }
    }
}
