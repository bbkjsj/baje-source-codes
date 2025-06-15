import { ClientRequest } from 'http';
import * as https from 'https';
import * as querystring from 'querystring';
import { Logger } from '@nestjs/common';

export class KavenegarSMS {

  private token: string;
  private recetor: string;
  private template: string;


  constructor() {
    this.token = '64643961466156775571762F4D45726B2B48582B703872586E4B4F706F536C49546F66476E56785A435A633D'
  }



  sendVerificationCode(args: {
    code: string;
    mobile: string;
  }) {

    const postData = {
      receptor: args.mobile,
      token: args.code,
      template: 'verify'
    };

    const req: ClientRequest = https.request({
      host: 'api.kavenegar.com',
      path: `/v1/${this.token}/verify/lookup.json`,
      method: 'post',
      headers: {
        'Content-Length': querystring.stringify(postData).length,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      port: '443'
    }, (e) => {
      e.setEncoding('utf8');
      let result: string = '';

      e.on('data', (data) => {
        result += data;
      });

      e.on('end', () => {
        let jsonObject = JSON.parse(result);

        new Logger().verbose(`verification code ${args.code} sent to ${args.mobile}`);
      });

      e.on('error', (error) => {
        throw new Error(error.message);
      });
    });

    req.write(querystring.stringify(postData), 'utf-8');
    req.on('error', (error) => {
      throw new Error(error.message);
    });
    req.end();
  }

  sendSMSToTaskCreator(args: {
    creatorMobile: string;
    creatorName: string;
    taskTitle: string;
    taskId: number;
  }) {
    const postData = {
      'receptor': `'${args.creatorMobile}'`,
      'token': `'${args.creatorName}'`,
      'token2': `'${args.taskId.toString()}'`,
      'token3': `'${args.taskTitle}'`,
      'template': 'createtask'
    };

    console.log(postData);

    const req: ClientRequest = https.request({
      host: 'api.kavenegar.com',
      path: `/v1/${this.token}/verify/lookup.json`,
      method: 'post',
      headers: {
        'Content-Length': querystring.stringify(postData).length,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      port: '443'
    }, (e) => {
      e.setEncoding('utf8');
      let result: string = '';

      e.on('data', (data) => {
        result += data;
      });

      e.on('end', () => {
        let jsonObject = JSON.parse(result);

        console.log(result);

        new Logger().verbose(`create task sms for task id: ${args.taskId.toString()} sent to ${args.creatorMobile}`);
      });

      e.on('error', (error) => {
        throw new Error(error.message);
      });
    });

    req.write(querystring.stringify(postData), 'utf-8');
    req.on('error', (error) => {
      throw new Error(error.message);
    });
    req.end();
  }

  sendSMSAfterTaskApproved(args: {
    creatorMobile: string;
    creatorName: string;
    taskTitle: string;
    taskId: number;
  }) {
    const postData = {
      receptor: args.creatorMobile,
      token: args.creatorName,
      token2: args.taskId.toString(),
      token3: args.taskTitle,
      template: 'approve-task'
    };

    const req: ClientRequest = https.request({
      host: 'api.kavenegar.com',
      path: `/v1/${this.token}/verify/lookup.json`,
      method: 'post',
      headers: {
        'Content-Length': querystring.stringify(postData).length,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      port: '443'
    }, (e) => {
      e.setEncoding('utf8');
      let result: string = '';

      e.on('data', (data) => {
        result += data;
      });

      e.on('end', () => {
        let jsonObject = JSON.parse(result);

        new Logger().verbose(`approve task sms for task id: ${args.taskId.toString()} sent to ${args.creatorMobile}`);
      });

      e.on('error', (error) => {
        throw new Error(error.message);
      });
    });

    req.write(querystring.stringify(postData), 'utf-8');
    req.on('error', (error) => {
      throw new Error(error.message);
    });
    req.end();
  }

  sendNotDoneTask(args: {
    creatorMobile: string;
    creatorName: string;
    taskTitle: string;
    taskId: number;
  }) {
    const postData = {
      receptor: args.creatorMobile,
      token: args.creatorName,
      token2: args.taskId.toString(),
      token3: args.taskTitle,
      template: 'notdone-task'
    };

    const req: ClientRequest = https.request({
      host: 'api.kavenegar.com',
      path: `/v1/${this.token}/verify/lookup.json`,
      method: 'post',
      headers: {
        'Content-Length': querystring.stringify(postData).length,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      port: '443'
    }, (e) => {
      e.setEncoding('utf8');
      let result: string = '';

      e.on('data', (data) => {
        result += data;
      });

      e.on('end', () => {
        let jsonObject = JSON.parse(result);

        new Logger().verbose(`not done task sms for task id: ${args.taskId.toString()} sent to ${args.creatorMobile}`);
      });

      e.on('error', (error) => {
        throw new Error(error.message);
      });
    });

    req.write(querystring.stringify(postData), 'utf-8');
    req.on('error', (error) => {
      throw new Error(error.message);
    });
    req.end();
  }

  sendDoneTask(args: {
    creatorMobile: string;
    creatorName: string;
    taskTitle: string;
    taskId: number;
  }) {
    const postData = {
      receptor: args.creatorMobile,
      token: args.creatorName,
      token2: args.taskId.toString(),
      token3: args.taskTitle,
      template: 'done-task'
    };

    const req: ClientRequest = https.request({
      host: 'api.kavenegar.com',
      path: `/v1/${this.token}/verify/lookup.json`,
      method: 'post',
      headers: {
        'Content-Length': querystring.stringify(postData).length,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      port: '443'
    }, (e) => {
      e.setEncoding('utf8');
      let result: string = '';

      e.on('data', (data) => {
        result += data;
      });

      e.on('end', () => {
        let jsonObject = JSON.parse(result);

        new Logger().verbose(`not done task sms for task id: ${args.taskId.toString()} sent to ${args.creatorMobile}`);
      });

      e.on('error', (error) => {
        throw new Error(error.message);
      });
    });

    req.write(querystring.stringify(postData), 'utf-8');
    req.on('error', (error) => {
      throw new Error(error.message);
    });
    req.end();
  }


}