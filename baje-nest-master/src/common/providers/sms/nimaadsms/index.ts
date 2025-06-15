
import * as request from "request";
import { Logger } from '@nestjs/common';

export class NimaadSMS {
    private token = '';
    private panelUsername = 'ngoharzamin';
    private panelPassword = '111030865';
    constructor() {
        this.token = 'boI_qajTx3heu5e3H0t9Y0mrqsLqD-VT1X6MU3kcB3Y=';
    }

    sendVerificationCode(code: string, mobile: string){
        try{
            request.post({
                url: 'http://rest.ippanel.com/v1/messages/patterns/send',
                body: {
                    'originator' : '+9810008379',
                    'pattern_code' :'jx1x9kski9',
                    'recipient': mobile,
                    'values': {
                        'code' : code
                    }
                },
                headers: {
                    'Authorization' : `AccessKey ${this.token}`,
                    'Content-Type': 'application/json'
                },
                json: true
            }, (error, response, body) => {
                if(!error && response.statusCode === 200) {
                    new Logger().verbose(`verification code sent: ${code}`)
                }
            });
        }
        catch(err) {
            throw err;
        }
    }

    sendCreatedTask(mobile: string, taskId: number, name: string) {
        try{
            request.post({
                url: 'http://rest.ippanel.com/v1/messages/patterns/send',
                body: {
                    'originator' : '+9810008379',
                    'pattern_code' :'71d8wft4qs',
                    'recipient': mobile,
                    'values': {
                        'name' : name,
                        'taskId': taskId.toString()
                    }
                },
                headers: {
                    'Authorization' : `AccessKey ${this.token}`,
                    'Content-Type': 'application/json'
                },
                json: true
            }, (error, response, body) => {
                if(!error && response.statusCode === 200) {
                    new Logger().verbose(`sms sent to ${mobile} after task created`);
                }
            });
        }
        catch(err) {
            throw err;
        }
    }

    sendTaskPercentage(percentage: number, mobile:string, taskId: number, name:string) {
        try{
            request.post({
                url: 'http://rest.ippanel.com/v1/messages/patterns/send',
                body: {
                    'originator' : '+9810008379',
                    'pattern_code' :'y7mr0hepvy',
                    'recipient': mobile,
                    'values': {
                        'percent' : percentage.toString(),
                        'taskId': taskId.toString()
                    }
                },
                headers: {
                    'Authorization' : `AccessKey ${this.token}`,
                    'Content-Type': 'application/json'
                },
                json: true
            }, (error, response, body) => {
                if(!error && response.statusCode === 200) {
                    new Logger().verbose(`sms sent to ${mobile} on ${percentage}% of task #${taskId}.`);
                }
            });
        }
        catch(err) {
            throw err;
        }
    }

    sendSMSToTaskCreator(args: {
        creatorMobile: string;
        creatorName: string;
        taskTitle: string;
        taskId: number;
    }) {
        try{
            request.post({
                url: 'http://rest.ippanel.com/v1/messages/patterns/send',
                body: {
                    'originator' : '+9810008379',
                    'pattern_code' :'nyzz00atg8fwzs1',
                    'recipient': args.creatorMobile,
                    'values': {
                        'fullName' : args.creatorName.toString(),
                        'taskId': args.taskId.toString(),
                        'taskSubject': args.taskTitle
                    }
                },
                headers: {
                    'Authorization' : `AccessKey ${this.token}`,
                    'Content-Type': 'application/json'
                },
                json: true
            }, (error, response, body) => {
                if(!error && response.statusCode === 200) {
                    new Logger().verbose(`create task sms for task id: ${args.taskId.toString()} sent to ${args.creatorMobile}`);
                }

                if(error) {
                    console.log(error);
                }
            });
        }
        catch(err) {
            throw err;
        }
    }

    sendSMSAfterTaskApproved(args: {
        creatorMobile: string;
        creatorName: string;
        taskTitle: string;
        taskId: number;
    }) {
        try{
            request.post({
                url: 'http://rest.ippanel.com/v1/messages/patterns/send',
                body: {
                    'originator' : '+9810008379',
                    'pattern_code' :'a4fblyc0edk3j7j',
                    'recipient': args.creatorMobile,
                    'values': {
                        'fullName' : args.creatorName.toString(),
                        'taskId': args.taskId.toString(),
                        'taskSubject': args.taskTitle
                    }
                },
                headers: {
                    'Authorization' : `AccessKey ${this.token}`,
                    'Content-Type': 'application/json'
                },
                json: true
            }, (error, response, body) => {
                if(!error && response.statusCode === 200) {
                    new Logger().verbose(`approve task sms for task id: ${args.taskId.toString()} sent to ${args.creatorMobile}`);
                }

                if(error) {
                    console.log(error);
                }
            });
        }
        catch(err) {
            throw err;
        }
    }

    sendNotDoneTask(args: {
        creatorMobile: string;
        creatorName: string;
        taskTitle: string;
        taskId: number;
    }) {
        try{
            request.post({
                url: 'http://rest.ippanel.com/v1/messages/patterns/send',
                body: {
                    'originator' : '+9810008379',
                    'pattern_code' :'nep8ikj84gnbnmc',
                    'recipient': args.creatorMobile,
                    'values': {
                        'fullName' : args.creatorName.toString(),
                        'taskId': args.taskId.toString(),
                        'taskSubject': args.taskTitle
                    }
                },
                headers: {
                    'Authorization' : `AccessKey ${this.token}`,
                    'Content-Type': 'application/json'
                },
                json: true
            }, (error, response, body) => {
                if(!error && response.statusCode === 200) {
                    new Logger().verbose(`not done task sms for task id: ${args.taskId.toString()} sent to ${args.creatorMobile}`);
                }

                if(error) {
                    console.log(error);
                }
            });
        }
        catch(err) {
            throw err;
        }
    }

    sendDoneTask(args: {
        creatorMobile: string;
        creatorName: string;
        taskTitle: string;
        taskId: number;
    }) {
        try{
            request.post({
                url: 'http://rest.ippanel.com/v1/messages/patterns/send',
                body: {
                    'originator' : '+9810008379',
                    'pattern_code' :'rmhkq56tvo68qm3',
                    'recipient': args.creatorMobile,
                    'values': {
                        'fullName' : args.creatorName.toString(),
                        'taskId': args.taskId.toString(),
                        'taskSubject': args.taskTitle
                    }
                },
                headers: {
                    'Authorization' : `AccessKey ${this.token}`,
                    'Content-Type': 'application/json'
                },
                json: true
            }, (error, response, body) => {
                if(!error && response.statusCode === 200) {
                    new Logger().verbose(`done task sms for task id: ${args.taskId.toString()} sent to ${args.creatorMobile}`);
                }

                if(error) {
                    console.log(error);
                }
            });
        }
        catch(err) {
            throw err;
        }
    }
}