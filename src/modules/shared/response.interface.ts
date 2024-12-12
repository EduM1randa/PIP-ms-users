import { HttpStatus } from '@nestjs/common';

export class ResponseMessage {
  status!: HttpStatus;
  success!: boolean;
  message!: string;
  data?: any;
}