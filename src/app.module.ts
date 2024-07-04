import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { CoreModule } from '@st-api/core';

@Module({
  imports: [CoreModule.forRoot()],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
