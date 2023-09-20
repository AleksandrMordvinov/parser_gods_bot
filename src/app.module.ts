import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './cards/cards.module';
import { AppUpdate } from './cards/cards.update';
import { TelegrafModule } from 'nestjs-telegraf';
import { sessionMiddleware } from './middleware/session.middleware';

@Module({
  imports: [CardsModule,
  //   TelegrafModule.forRoot({
  //   token: '6096883460:AAFn5VFRPNfQ08lGb-XOy0m-xPPfFgDufHs',
  //   middlewares: [sessionMiddleware]
  // })
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
