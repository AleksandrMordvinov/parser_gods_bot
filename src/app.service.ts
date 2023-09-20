import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { log } from 'console';
import { stringify } from 'querystring';

@Injectable()
export class AppService {
  async getHello() {
  
    
    return "fetchH";
  }
}
