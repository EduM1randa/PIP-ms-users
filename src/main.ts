import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { RmqExceptionFilter } from "./common/filters/rmq-exceptions.filter";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          "amqps://rvewvxvp:NGhEBlSHgBKMlYnp7AucxIUyk4lvpbV4@jackal.rmq.cloudamqp.com/rvewvxvp",
        ],
        queue: "users_queue",
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new RmqExceptionFilter());
  await app.listen();
}
bootstrap();
