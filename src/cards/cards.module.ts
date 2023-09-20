import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { AppUpdate } from './cards.update';
import { sessionMiddleware } from 'src/middleware/session.middleware';

@Module({
  imports: [
      TelegrafModule.forRoot({
      token: '6096883460:AAFn5VFRPNfQ08lGb-XOy0m-xPPfFgDufHs',
      middlewares: [sessionMiddleware]
    })
  ],
  controllers: [CardsController],
  providers: [CardsService, AppUpdate],
})
export class CardsModule {}
