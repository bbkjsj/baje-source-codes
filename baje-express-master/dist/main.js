/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __resourceQuery = "?100";
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 0;
	var log = __webpack_require__(1);

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function (updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(2)(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function (err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}


/***/ }),
/* 1 */
/***/ ((module) => {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function (level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function (level) {
	logLevel = level;
};

module.exports.formatError = function (err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function (updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function (moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(1);

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function (moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function (moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function (moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				'[HMR] Consider using the optimization.moduleIds: "named" for module names.'
			);
	}
};


/***/ }),
/* 3 */
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(4);
const core_1 = __webpack_require__(5);
const app_module_1 = __webpack_require__(6);
const chalk = __webpack_require__(69);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.setGlobalPrefix('api/v1/baje');
    app.useGlobalPipes(new common_1.ValidationPipe({}));
    await app.listen(4004);
    if (true) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
    console.log(chalk.greenBright('-----------------------------------\n'), chalk.magenta('server is running on port 4004\n'), chalk.greenBright('----------------------------------'));
}
bootstrap();


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common");;

/***/ }),
/* 5 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core");;

/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(4);
const app_controller_1 = __webpack_require__(7);
const app_service_1 = __webpack_require__(8);
const typeorm_1 = __webpack_require__(9);
const personnel_module_1 = __webpack_require__(10);
const config_1 = __webpack_require__(60);
const sign_module_1 = __webpack_require__(61);
const ormconfig = __webpack_require__(70);
const damageService_module_1 = __webpack_require__(118);
const mission_module_1 = __webpack_require__(122);
const timeoff_module_1 = __webpack_require__(126);
const contractProgress_module_1 = __webpack_require__(131);
const contract_module_1 = __webpack_require__(135);
const hse_module_1 = __webpack_require__(142);
const jobs_module_1 = __webpack_require__(160);
const vehicle_module_1 = __webpack_require__(157);
const company_module_1 = __webpack_require__(173);
const table_name_module_1 = __webpack_require__(181);
const tasks_module_1 = __webpack_require__(188);
const cron_module_1 = __webpack_require__(218);
const event_emitter_1 = __webpack_require__(214);
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot(ormconfig),
            sign_module_1.SignModule,
            personnel_module_1.PersonnelModule,
            damageService_module_1.DamageServiceModule,
            mission_module_1.MissionModule,
            timeoff_module_1.TimeOffModule,
            contractProgress_module_1.ContractProgressModule,
            contract_module_1.ContractModule,
            jobs_module_1.JobsModule,
            vehicle_module_1.VehicleModule,
            company_module_1.CompanyModule,
            table_name_module_1.TableNameModule,
            hse_module_1.HseModule,
            tasks_module_1.TasksModule,
            cron_module_1.CronModule,
            event_emitter_1.EventEmitterModule.forRoot()
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(4);
const app_service_1 = __webpack_require__(8);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);
exports.AppController = AppController;


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(4);
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;


/***/ }),
/* 9 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/typeorm");;

/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonnelModule = void 0;
const common_1 = __webpack_require__(4);
const platform_express_1 = __webpack_require__(11);
const typeorm_1 = __webpack_require__(9);
const multer_1 = __webpack_require__(12);
const personnel_controller_1 = __webpack_require__(13);
const personnel_service_1 = __webpack_require__(17);
const personnel_access_schema_1 = __webpack_require__(23);
const personnel_schema_1 = __webpack_require__(24);
const moment = __webpack_require__(52);
const path_1 = __webpack_require__(53);
const subordinate_schema_1 = __webpack_require__(25);
const job_title_module_1 = __webpack_require__(59);
const personnel_shift_schema_1 = __webpack_require__(34);
const personnel_jobs_schema_1 = __webpack_require__(35);
let PersonnelModule = class PersonnelModule {
};
PersonnelModule = __decorate([
    (0, common_1.Module)({
        imports: [
            job_title_module_1.JobTitleModule,
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: './uploads/personnel',
                    filename: (req, file, cb) => {
                        cb(null, `${moment().utc(true).format('YYMMDDHHMMSSS')}${(0, path_1.extname)(file.originalname)}`);
                    }
                }),
                limits: {
                    fileSize: 31457280
                }
            }),
            typeorm_1.TypeOrmModule.forFeature([
                personnel_schema_1.Personnel,
                personnel_access_schema_1.PersonnelAccess,
                subordinate_schema_1.Subordinate,
                personnel_shift_schema_1.PersonnelShift,
                personnel_jobs_schema_1.PersonnelJobs
            ])
        ],
        controllers: [personnel_controller_1.PersonnelController],
        providers: [personnel_service_1.PersonnelService],
        exports: [personnel_service_1.PersonnelService]
    })
], PersonnelModule);
exports.PersonnelModule = PersonnelModule;


/***/ }),
/* 11 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/platform-express");;

/***/ }),
/* 12 */
/***/ ((module) => {

"use strict";
module.exports = require("multer");;

/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonnelController = void 0;
const common_1 = __webpack_require__(4);
const role_decorator_1 = __webpack_require__(14);
const roles_enum_1 = __webpack_require__(15);
const auth_guards_1 = __webpack_require__(16);
const personnel_service_1 = __webpack_require__(17);
const express_1 = __webpack_require__(39);
const create_person_dto_1 = __webpack_require__(40);
const platform_express_1 = __webpack_require__(11);
const update_person_dto_1 = __webpack_require__(49);
const update_personnel_access_dto_1 = __webpack_require__(51);
const multer_1 = __webpack_require__(12);
const moment = __webpack_require__(52);
const path_1 = __webpack_require__(53);
const import_dbf_dto_1 = __webpack_require__(54);
const delete_many_dto_1 = __webpack_require__(55);
const create_personnel_shift_dto_1 = __webpack_require__(56);
const create_personnel_job_dto_1 = __webpack_require__(57);
const update_personnel_job_dto_1 = __webpack_require__(58);
let PersonnelController = class PersonnelController {
    constructor(service) {
        this.service = service;
    }
    async createPersonnel(body) {
        return await this.service.insertPersonn(body);
    }
    personnelDetail(id) {
        return this.service.findPersonnelById(+id);
    }
    async updatePersonnel(body, id, files, req) {
        return await this.service.updatePerson(Number(id), files['national_card_front'] != null ? files['national_card_front'][0].filename : null, files['national_card_rear'] != null ? files['national_card_rear'][0].filename : null, files['birth_certificate'] != null ? files['birth_certificate'][0].filename : null, files['army_service_card'] != null ? files['army_service_card'][0].filename : null, files['person'] != null ? files['person'][0].filename : null, files['sign'] != null ? files['sign'][0].filename : null, body, req.user);
    }
    async getPersonnelSubordinates(id) {
        return await this.service.getPersonnelSubordinates(Number(id));
    }
    async updateSubordinate(id, body) {
        return await this.service.updateSubordinate(+id, body);
    }
    async deleteSubordinate(id) {
        return await this.service.deleteSubordinate(Number(id));
    }
    async updatePersonnelPermission(id, body) {
        return await this.service.updatePersonnelPermission(Number(id), body);
    }
    async listOfPersonnelOfCompanyContract(companyId, contractId, req) {
        return await this.service.personnelOfCompanyContract(req.user, Number(companyId), Number(contractId));
    }
    async uploadDBF(file, body) {
        return await this.service.importPersonnelFromDBF(file.path, Number(body.company_id), Number(body.contract_id));
    }
    async uploadExcel(file, body) {
        return await this.service.importPersonnelFromExcel(file.path, Number(body.company_id), Number(body.contract_id));
    }
    async importSubordinateFromExcel(file) {
        return await this.service.importSubordinateFromExcel(file.path);
    }
    async searchPersonnelByName(body) {
        return await this.service.globalSearch(body.firstName, body.lastName, body.nationalCode, body.insuranceNumber, body.fatherName, body.mobile);
    }
    async deletePersonnels(body) {
        return await this.service.deletePersonnels(body.ids);
    }
    async deleteSubordinates(body) {
        return await this.service.deleteSubordinates(body.ids);
    }
    createPersonnelShift(body) {
        return this.service.createPersonnelShift(body);
    }
    createPersonnelJob(body) {
        return this.service.createPersonnelJob(body);
    }
    updatePersonnelJob(id, body) {
        return this.service.updatePersonnelJob(+id, body);
    }
    findAllPersonnelJobs(params) {
        return this.service.findAllPersonnelJobList(+params.page, +params.size);
    }
    findOnePersonJob(id, params) {
        return this.service.findOnePersonJobs(+id, +params.page, +params.size);
    }
    findPersonnelJob(id) {
        return this.service.personnelJobDetail(+id);
    }
    deletePersonnelJob(id) {
        return this.service.deletePresonnelJob(+id);
    }
    updateContactInfo(id, body) {
        return this.service.updatePersonnel(+id, body);
    }
    async updateDocuments(id, files) {
        const dto = {};
        if (files['army_service_card'] != null) {
            dto['army_service_card_url'] = files['army_service_card'][0].filename;
        }
        if (files['birth_certificate'] != null) {
            dto['birth_certificate_url'] = files['birth_certificate'][0].filename;
        }
        if (files['national_card_front'] != null) {
            dto['national_card_front_url'] = files['national_card_front'][0].filename;
        }
        if (files['national_card_rear'] != null) {
            dto['national_card_rear_url'] = files['national_card_rear'][0].filename;
        }
        if (files['person_img'] != null) {
            dto['image_url'] = files['person_img'][0].filename;
        }
        if (files['sign'] != null) {
            dto['sign_url'] = files['sign'][0].filename;
        }
        if (files['latest_educational_document'] != null) {
            dto['latest_educational_document_url'] = files['latest_educational_document'][0].filename;
        }
        return await this.service.updateDocuments(dto, +id);
    }
};
__decorate([
    (0, role_decorator_1.Roles)(roles_enum_1.Role.person_insert),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_person_dto_1.CreatePersonDTO !== "undefined" && create_person_dto_1.CreatePersonDTO) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "createPersonnel", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "personnelDetail", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, role_decorator_1.Roles)(roles_enum_1.Role.person_edit, roles_enum_1.Role.person_insert),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'national_card_front', maxCount: 1 },
        { name: 'national_card_rear', maxCount: 1 },
        { name: 'birth_certificate', maxCount: 1 },
        { name: 'army_service_card', maxCount: 1 },
        { name: 'person', maxCount: 1 },
        { name: 'sign', maxCount: 1 }
    ])),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof update_person_dto_1.UpdatePersonDTO !== "undefined" && update_person_dto_1.UpdatePersonDTO) === "function" ? _b : Object, String, Array, typeof (_c = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "updatePersonnel", null);
__decorate([
    (0, common_1.Get)('/subordinates/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "getPersonnelSubordinates", null);
__decorate([
    (0, common_1.Put)('/subordinates/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "updateSubordinate", null);
__decorate([
    (0, common_1.Delete)('/subordinates/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "deleteSubordinate", null);
__decorate([
    (0, common_1.Put)('/permission/:personnelId'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('personnelId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof update_personnel_access_dto_1.UpdatePersonnelAccessDTO !== "undefined" && update_personnel_access_dto_1.UpdatePersonnelAccessDTO) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "updatePersonnelPermission", null);
__decorate([
    (0, common_1.Get)('/list/:companyId/:contractId'),
    (0, role_decorator_1.Roles)(roles_enum_1.Role.person_list),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('contractId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, typeof (_e = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "listOfPersonnelOfCompanyContract", null);
__decorate([
    (0, common_1.Post)('/dbf'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('dbf_file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                cb(null, './uploads/personnel/dbf');
            },
            filename: (req, file, cb) => {
                cb(null, `${moment().utc(true).format('YYMMDDHHMMSSS')}${(0, path_1.extname)(file.originalname)}`);
            }
        })
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof Express !== "undefined" && (_f = Express.Multer) !== void 0 && _f.File) === "function" ? _g : Object, typeof (_h = typeof import_dbf_dto_1.ImportDBFDTO !== "undefined" && import_dbf_dto_1.ImportDBFDTO) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "uploadDBF", null);
__decorate([
    (0, common_1.Post)('/excel'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('excel_file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                cb(null, './uploads/personnel/excel');
            },
            filename: (req, file, cb) => {
                cb(null, `${moment().utc(true).format('YYMMDDHHMMSSS')}${(0, path_1.extname)(file.originalname)}`);
            }
        })
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof Express !== "undefined" && (_j = Express.Multer) !== void 0 && _j.File) === "function" ? _k : Object, typeof (_l = typeof import_dbf_dto_1.ImportDBFDTO !== "undefined" && import_dbf_dto_1.ImportDBFDTO) === "function" ? _l : Object]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "uploadExcel", null);
__decorate([
    (0, common_1.Post)('/subordinate/excel'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('excel_file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                cb(null, './uploads/personnel/excel');
            },
            filename: (req, file, cb) => {
                cb(null, `${moment().utc(true).format('YYMMDDHHMMSSS')}${(0, path_1.extname)(file.originalname)}`);
            }
        })
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof Express !== "undefined" && (_m = Express.Multer) !== void 0 && _m.File) === "function" ? _o : Object]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "importSubordinateFromExcel", null);
__decorate([
    (0, common_1.Post)('/search'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "searchPersonnelByName", null);
__decorate([
    (0, common_1.Delete)('/many'),
    (0, role_decorator_1.Roles)(roles_enum_1.Role.person_delete),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_p = typeof delete_many_dto_1.DeletePersonnelManyDTO !== "undefined" && delete_many_dto_1.DeletePersonnelManyDTO) === "function" ? _p : Object]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "deletePersonnels", null);
__decorate([
    (0, common_1.Delete)('/subordinate/many'),
    (0, role_decorator_1.Roles)(roles_enum_1.Role.person_delete),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_q = typeof delete_many_dto_1.DeletePersonnelManyDTO !== "undefined" && delete_many_dto_1.DeletePersonnelManyDTO) === "function" ? _q : Object]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "deleteSubordinates", null);
__decorate([
    (0, common_1.Post)('/shift'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_r = typeof create_personnel_shift_dto_1.CreatePersonnelShiftDTO !== "undefined" && create_personnel_shift_dto_1.CreatePersonnelShiftDTO) === "function" ? _r : Object]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "createPersonnelShift", null);
__decorate([
    (0, common_1.Post)('/jobs'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_s = typeof create_personnel_job_dto_1.CreatePersonnelJobDTO !== "undefined" && create_personnel_job_dto_1.CreatePersonnelJobDTO) === "function" ? _s : Object]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "createPersonnelJob", null);
__decorate([
    (0, common_1.Patch)('/jobs/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_t = typeof update_personnel_job_dto_1.UpdatePersonnelJobDTO !== "undefined" && update_personnel_job_dto_1.UpdatePersonnelJobDTO) === "function" ? _t : Object]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "updatePersonnelJob", null);
__decorate([
    (0, common_1.Get)('/jobs'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "findAllPersonnelJobs", null);
__decorate([
    (0, common_1.Get)('/jobs/person/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "findOnePersonJob", null);
__decorate([
    (0, common_1.Get)('/jobs/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "findPersonnelJob", null);
__decorate([
    (0, common_1.Delete)('/jobs/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "deletePersonnelJob", null);
__decorate([
    (0, common_1.Patch)('/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_u = typeof update_person_dto_1.UpdatePersonDTO !== "undefined" && update_person_dto_1.UpdatePersonDTO) === "function" ? _u : Object]),
    __metadata("design:returntype", void 0)
], PersonnelController.prototype, "updateContactInfo", null);
__decorate([
    (0, common_1.Patch)('/document/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'army_service_card', maxCount: 1 },
        { name: 'birth_certificate', maxCount: 1 },
        { name: 'national_card_front', maxCount: 1 },
        { name: 'national_card_rear', maxCount: 1 },
        { name: 'person_img', maxCount: 1 },
        { name: 'sign', maxCount: 1 },
        { name: 'latest_educational_document', maxCount: 1 }
    ])),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "updateDocuments", null);
PersonnelController = __decorate([
    (0, common_1.Controller)('personnel'),
    __metadata("design:paramtypes", [typeof (_v = typeof personnel_service_1.PersonnelService !== "undefined" && personnel_service_1.PersonnelService) === "function" ? _v : Object])
], PersonnelController);
exports.PersonnelController = PersonnelController;


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(4);
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Role = void 0;
var Role;
(function (Role) {
    Role["su"] = "super";
    Role["person_insert"] = "person/insert";
    Role["person_edit"] = "person/edit";
    Role["person_delete"] = "person/delete";
    Role["person_approve"] = "person/approve";
    Role["person_privatedescription"] = "person/privatedescription";
    Role["person_editcontact"] = "person/editcontact";
    Role["person_viewsubordinate"] = "person/viewsubordinate";
    Role["person_list"] = "person/list";
    Role["legal_insert"] = "legal/insert";
    Role["legal_edit"] = "legal/edit";
    Role["legal_delete"] = "legal/delete";
    Role["legal_approve"] = "legal/approve";
    Role["legal_editcontact"] = "legal/editcontact";
    Role["legal_list"] = "legal/list";
    Role["machinery_insert"] = "machinery/insert";
    Role["machinery_edit"] = "machinery/edit";
    Role["machinery_delete"] = "machinery/delete";
    Role["machinery_approve"] = "machinery/approve";
    Role["machinery_editcontact"] = "machinery/editcontact";
    Role["machinery_list"] = "machinery/list";
    Role["contract_insert"] = "contract/insert";
    Role["contract_edit"] = "contact/edit";
    Role["contract_delete"] = "contract/delete";
    Role["contract_approve"] = "contract/approve";
    Role["contract_list"] = "contract/list";
    Role["contract_progress_add_edit"] = "contract/progress-add-edit";
    Role["contract_progress_approve"] = "contract/progress-approve";
    Role["contract_production_report_add_edit"] = "contract/production-report-add-edit";
    Role["contract_production_report_approve"] = "contract/production-report-approve";
    Role["contract_peyman_report_add_edit"] = "contract/peyman-report-add-edit";
    Role["contract_peyman_report_approve"] = "contract/peyman-report-approve";
    Role["contract_dashboard_report"] = "contract/dashboard-report";
    Role["hse_settings"] = "hse/settings";
    Role["hse_view"] = "hse/view";
    Role["hse_audit"] = "hse/audit";
    Role["hse_approve"] = "hse/approve";
})(Role = exports.Role || (exports.Role = {}));


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Authorized = void 0;
const common_1 = __webpack_require__(4);
const core_1 = __webpack_require__(5);
const personnel_service_1 = __webpack_require__(17);
const jwt_1 = __webpack_require__(37);
const jwt = __webpack_require__(38);
let Authorized = class Authorized {
    constructor(reflector, personnelService) {
        this.reflector = reflector;
        this.personnelService = personnelService;
    }
    async canActivate(context) {
        try {
            const req = context.switchToHttp().getRequest();
            const roles = this.reflector.get('roles', context.getHandler());
            if (!req.headers.authorization) {
                throw new common_1.UnauthorizedException('authorization required');
            }
            const _token = req.headers.authorization.toString();
            const user = await this.oldVerification(_token);
            if (user) {
                if (roles) {
                    if (user.isSuper) {
                        req.user = user;
                        return true;
                    }
                    let userRoles = user.access;
                    if (userRoles == null) {
                        userRoles = await this.personnelService.getPersonnelAccess(user.id);
                    }
                    const accessArray = userRoles.map(item => {
                        return item.access;
                    });
                    if (roles.some((role) => accessArray.includes(role))) {
                        req.user = user;
                        return true;
                    }
                    throw new common_1.UnauthorizedException('insufficient access');
                }
                else {
                    req.user = user;
                    return true;
                }
            }
            throw new common_1.UnauthorizedException('authorization required');
        }
        catch (err) {
            console.log(err);
            throw new common_1.UnauthorizedException(err);
        }
    }
    oldVerification(token) {
        return new Promise(async (resolve, reject) => {
            try {
                const cert = process.env.OLD_PRIVATE_KEY.toString().replace(/%%/g, '\n');
                jwt.verify(token, cert, {
                    algorithms: ['RS256']
                }, async (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        const output = data.UserModel;
                        output.isSuper = output.super;
                        if (output.access == null) {
                            const access = await this.personnelService.getPersonnelAccess(output.id);
                            output.access = access;
                        }
                        resolve(output);
                    }
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    verification(token) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await new jwt_1.JWTToken().verify(token));
            }
            catch (err) {
                reject(err);
            }
        });
    }
};
Authorized = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object, typeof (_b = typeof personnel_service_1.PersonnelService !== "undefined" && personnel_service_1.PersonnelService) === "function" ? _b : Object])
], Authorized);
exports.Authorized = Authorized;


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonnelService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const roles_enum_1 = __webpack_require__(15);
const encryption_1 = __webpack_require__(18);
const typeorm_2 = __webpack_require__(20);
const job_title_service_1 = __webpack_require__(21);
const personnel_access_schema_1 = __webpack_require__(23);
const personnel_schema_1 = __webpack_require__(24);
const subordinate_schema_1 = __webpack_require__(25);
const dbffile = __webpack_require__(26);
const dbf_1 = __webpack_require__(27);
const jmoment = __webpack_require__(28);
const birthplace_1 = __webpack_require__(29);
const gender_enum_1 = __webpack_require__(30);
const marital_status_enum_1 = __webpack_require__(31);
const fs = __webpack_require__(32);
const excelReader = __webpack_require__(33);
const personnel_shift_schema_1 = __webpack_require__(34);
const personnel_jobs_schema_1 = __webpack_require__(35);
const file_1 = __webpack_require__(36);
let PersonnelService = class PersonnelService {
    constructor(model, accessModel, subordinateModel, personnelShiftRepo, personnelJobRepo, jobTitleService) {
        this.model = model;
        this.accessModel = accessModel;
        this.subordinateModel = subordinateModel;
        this.personnelShiftRepo = personnelShiftRepo;
        this.personnelJobRepo = personnelJobRepo;
        this.jobTitleService = jobTitleService;
    }
    async findPersonByUserPassword(username, password) {
        try {
            return await this.model.createQueryBuilder()
                .where('national_number = :national_number and password = :password', {
                national_number: username,
                password: password
            }).getOne();
        }
        catch (err) {
            throw err;
        }
    }
    async updateCode(id, code) {
        try {
            await this.model.createQueryBuilder()
                .update()
                .set({
                code: code
            })
                .where('id = :id', { id: id })
                .execute();
            return true;
        }
        catch (err) {
            throw err;
        }
    }
    async findPersonnelById(id) {
        try {
            return await this.model.createQueryBuilder()
                .where('id = :id', { id: id })
                .getOne();
        }
        catch (err) {
            throw err;
        }
    }
    async getPersonnelAccess(id) {
        try {
            return await this.accessModel.createQueryBuilder()
                .where('personnel_id_fk = :pid', { pid: id })
                .getMany();
        }
        catch (err) {
            throw err;
        }
    }
    async findPersonnel(conditionString, fields) {
        try {
            return this.model.createQueryBuilder()
                .where(conditionString, fields)
                .getMany();
        }
        catch (err) {
            throw err;
        }
    }
    async insertPersonn(dto) {
        try {
            if (dto.mobile1) {
                const checkMobile = await this.findPersonnel('mobile1 = :m1 or mobile2 = :m2', {
                    m1: dto.mobile1,
                    m2: dto.mobile1
                });
                if (checkMobile.length > 0) {
                    throw new common_1.HttpException('شماره موبایل قبلا در سامانه وارد شده است', 400);
                }
            }
            if (dto.mobile2) {
                const checkMobile = await this.findPersonnel('mobile1 = :m1 or mobile2 = :m2', {
                    m1: dto.mobile2,
                    m2: dto.mobile2
                });
                if (checkMobile.length > 0) {
                    throw new common_1.HttpException('شماره موبایل قبلا در سامانه وارد شده است', 400);
                }
            }
            if (dto.national_number) {
                const duplicate = await this.findPersonnel('national_number = :nn or insurance_number = :in', {
                    nn: dto.national_number,
                    in: dto.insurance_number
                });
                if (duplicate.length > 0) {
                    throw new common_1.HttpException('پرسنل با این مشخصات قبلا در سامانه وارد شده است', 400);
                }
            }
            if (dto.password) {
                dto.password = await new encryption_1.Encryption().encrypt(dto.password);
            }
            if (dto.job_title_id) {
                const job = await this.jobTitleService.find('id = :id', { id: dto.job_title_id });
                if (job.length > 0) {
                    dto.job_title = job[0].code;
                }
            }
            const _dto = dto;
            console.log(_dto);
            _dto.shahid_was_colleague = dto.shahid_was_colleague == true ? 1 : 0;
            const newPersonnel = await this.model.createQueryBuilder()
                .insert()
                .values([
                Object.assign(Object.assign({}, _dto), { contract_id_fk: dto.contract_id != null ? +dto.contract_id : null })
            ])
                .execute();
            if (dto.subordinates) {
                for (let i = 0; i < dto.subordinates.length; i++) {
                    await this.subordinateModel.createQueryBuilder()
                        .insert()
                        .values([
                        Object.assign({ personnel_id_fk: newPersonnel.identifiers[0].id }, dto.subordinates[i])
                    ])
                        .execute();
                }
            }
            if (dto.permissions) {
                for (let i = 0; i < dto.permissions.length; i++) {
                    await this.accessModel.createQueryBuilder()
                        .insert()
                        .values([
                        Object.assign(Object.assign({}, dto.permissions[i]), { personnel_id_fk: newPersonnel.identifiers[0].id })
                    ])
                        .execute();
                }
            }
            return {
                id: newPersonnel.identifiers[0].id
            };
        }
        catch (err) {
            throw err;
        }
    }
    async updatePerson(id, nationalFrontFile, nationalRearFile, birthCertFile, armyServiceFile, personFile, signFile, dto, user) {
        try {
            const personnel = await this.model.createQueryBuilder()
                .where('id = :id', { id: id })
                .getOne();
            if (!personnel) {
                throw new common_1.HttpException('invalid personnel id', 400);
            }
            if (dto.mobile1 || dto.mobile2) {
                if (personnel.mobile1 != dto.mobile1 || personnel.mobile2 != dto.mobile2) {
                    const mobileDuplicate = await this.model.createQueryBuilder()
                        .where('mobile1 = :m1 or mobile2 = :m2', {
                        m1: dto.mobile1,
                        m2: dto.mobile2
                    })
                        .getOne();
                    if (mobileDuplicate) {
                        throw new common_1.HttpException(`mobile number already exists`, 400);
                    }
                }
            }
            if (dto.national_number) {
                if (personnel.national_number != dto.national_number) {
                    const nationalNumberDuplicate = await this.model.createQueryBuilder()
                        .where('national_number = :nn', {
                        nn: dto.national_number
                    })
                        .getOne();
                    if (nationalNumberDuplicate) {
                        throw new common_1.HttpException('national number already exists', 400);
                    }
                }
            }
            if (dto.job_title_id) {
                const job = await this.jobTitleService.find('id = :id', { id: dto.job_title_id });
                if (job.length > 0) {
                    dto.job_title = job[0].code;
                }
            }
            if (dto.private_description && !user.isSuper) {
                if (!await this.personnelHasAccess(roles_enum_1.Role.person_privatedescription, user.id)) {
                    delete dto.private_description;
                }
            }
            if (!user.isSuper) {
                if (!await this.personnelHasAccess(roles_enum_1.Role.person_editcontact, user.id)) {
                    delete dto.email;
                    delete dto.mobile2;
                    delete dto.mobile1;
                    delete dto.phone;
                    delete dto.address;
                    delete dto.postal_code;
                    delete dto.email;
                }
            }
            if (dto.password) {
                dto.password = await new encryption_1.Encryption().encrypt(dto.password);
            }
            const updateDTO = Object.assign({}, dto);
            delete updateDTO.subordinates;
            delete updateDTO.permissions;
            delete updateDTO.job_title_id;
            if (nationalFrontFile) {
                updateDTO.national_card_front_url = nationalFrontFile;
            }
            if (nationalRearFile) {
                updateDTO.national_card_rear_url = nationalRearFile;
            }
            if (birthCertFile) {
                updateDTO.birth_certificate_url = birthCertFile;
            }
            if (armyServiceFile) {
                updateDTO.army_service_card_url = armyServiceFile;
            }
            if (personFile) {
                updateDTO.image_url = personFile;
            }
            if (signFile) {
                updateDTO.sign_url = signFile;
            }
            await this.model.createQueryBuilder()
                .update()
                .set(Object.assign({}, updateDTO))
                .where('id = :id', { id: id })
                .execute();
            return {
                id: id
            };
        }
        catch (err) {
            throw err;
        }
    }
    async personnelHasAccess(access, userId) {
        try {
            const _access = await this.accessModel.createQueryBuilder()
                .where('access = :access and personnel_id_fk = :pid', {
                access: access,
                pid: userId
            })
                .getOne();
            return _access ? true : false;
        }
        catch (err) {
            throw err;
        }
    }
    async getPersonnelSubordinates(personnelId) {
        try {
            return await this.subordinateModel.createQueryBuilder()
                .where('personnel_id_fk = :pid', { pid: personnelId })
                .getMany();
        }
        catch (err) {
            throw err;
        }
    }
    async updateSubordinate(id, dto) {
        try {
            delete dto.personnel_id_fk;
            return await this.subordinateModel.createQueryBuilder()
                .update()
                .set(Object.assign({}, dto))
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async deleteSubordinate(id) {
        try {
            return await this.subordinateModel.createQueryBuilder()
                .delete()
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async updatePersonnelPermission(personnelId, dto) {
        try {
            await this.accessModel.createQueryBuilder()
                .delete()
                .where('personnel_id_fk = :pid', { pid: personnelId })
                .execute();
            const newPermission = this.accessModel.create(dto.data);
            newPermission.forEach(item => {
                item.personnel_id_fk = personnelId;
            });
            return await this.accessModel.save(newPermission);
        }
        catch (err) {
            throw err;
        }
    }
    async personnelOfCompanyContract(user, companyId, contractId) {
        try {
            if (user.isSuper) {
                const query = await (0, typeorm_2.createQueryBuilder)(personnel_schema_1.Personnel, 't1')
                    .leftJoinAndSelect('contract', 't2', 't1.contract_id_fk = t2.id')
                    .leftJoinAndSelect('company', 't3', 't1.company_id_fk = t3.id')
                    .select([
                    't2.subject as contract_subject',
                    't3.name as company_name',
                    't1.id as id',
                    't1.contract_id_fk as contract_id',
                    't1.first_name as first_name',
                    't1.last_name as last_name',
                    't1.mobile1 as mobile1',
                    't1.father_name as father_name',
                    't1.national_number as national_number'
                ]);
                if (companyId != -1) {
                    query.andWhere('t1.company_id_fk = :id', { id: companyId });
                }
                if (contractId != -1) {
                    query.andWhere('t1.contract_id_fk = :cid', { cid: contractId });
                }
                const result = await query.getRawMany();
                return JSON.parse(JSON.stringify(result));
            }
            const access = await this.accessModel.createQueryBuilder()
                .where('personnel_id_fk=:pid and access=:access', {
                pid: user.id,
                access: 'person/list'
            })
                .getMany();
            let companies;
            let contracts;
            if (companyId == -1) {
                companies = access.map(item => {
                    return item.company_id_fk;
                });
            }
            else {
                companies = [companyId];
            }
            if (contractId == -1) {
                contracts = access.map(item => {
                    return item.contract_id_fk;
                });
            }
            else {
                contracts = [contractId];
            }
            const list = await (0, typeorm_2.createQueryBuilder)(personnel_schema_1.Personnel, 't1')
                .leftJoinAndSelect('contract', 't2', 't1.contract_id_fk = t2.id')
                .leftJoinAndSelect('company', 't3', 't1.company_id_fk = t3.id')
                .where('t1.company_id_fk in (:companies) and t1.contract_id_fk in (:contracts)', {
                companies: companies.toString(),
                contracts: contracts.toString()
            })
                .select([
                't2.subject as contract_subject',
                't3.name as company_name',
                't1.id as id',
                't1.contract_id_fk as contract_id',
                't1.first_name as first_name',
                't1.last_name as last_name',
                't1.mobile1 as mobile1',
                't1.father_name as father_name',
                't1.national_number as national_number'
            ])
                .getRawMany();
            return JSON.parse(JSON.stringify(list));
        }
        catch (err) {
            throw err;
        }
    }
    async importPersonnelFromDBF(file, companyId, contractId) {
        try {
            const dbfFile = await dbffile.DBFFile.open(file);
            const records = await dbfFile.readRecords();
            if (records.length) {
                let successCounter = 0;
                let totalRecords = 0;
                const dbfHelper = new dbf_1.DBFHelper();
                for (let record of records) {
                    const firstName = await dbfHelper.convert(record.DSW_FNAME);
                    const lastName = await dbfHelper.convert(record.DSW_LNAME);
                    const fatherName = await dbfHelper.convert(record.DSW_DNAME);
                    const idNumber = await dbfHelper.convert(record.DSW_ID1).toString().split('').reverse().join('');
                    const birthDate = jmoment(record.DSW_BDATE, 'jYYYY/jMM/jDD').utc(true).format('YYYY/MM/DD 00:00:00');
                    const sex = await dbfHelper.convert(record.DSW_SEX);
                    const origin = await dbfHelper.convert(record.DSW_NAT);
                    const nationalCode = record.PER_NATCOD.toString();
                    const password = await new encryption_1.Encryption().encrypt(nationalCode);
                    const jobCode = record.DSW_JOB;
                    const birthPlace = await new birthplace_1.BirthPlace().findPlace(nationalCode);
                    const insuranceNumber = record.DSW_ID1;
                    const duplicate = await this.model.createQueryBuilder()
                        .where('national_number = :nn', { nn: nationalCode })
                        .getOne();
                    if (duplicate == undefined) {
                        await this.model.createQueryBuilder()
                            .insert()
                            .values([
                            {
                                first_name: firstName.toString(),
                                last_name: lastName.toString(),
                                father_name: fatherName.toString(),
                                id_number: idNumber,
                                sex: sex == 'مرد' ? gender_enum_1.Gender.MALE : gender_enum_1.Gender.FEMALE,
                                password: password,
                                nation: origin.toString() == 'ایرانی' ? 'iranian' : 'non_iranian',
                                national_number: nationalCode.toString(),
                                company_id_fk: companyId,
                                isargar: 'none',
                                birth_date: birthDate,
                                marital_status: marital_status_enum_1.MaritalStatus.SINGLE,
                                insurance_number: insuranceNumber.toString(),
                                job_title: jobCode.toString(),
                                birth_place: birthPlace.toString(),
                                id_issue_place: birthPlace.toString(),
                                contract_id_fk: Number(contractId),
                                insurance_share_employee: 1,
                                insurance_share_employer: 1,
                                insurance_share_unemployment: 1,
                                insurance_share_harmful: 0
                            }
                        ])
                            .execute();
                        successCounter++;
                    }
                    totalRecords++;
                }
                return {
                    success: successCounter,
                    total: totalRecords
                };
            }
        }
        catch (err) {
            throw err;
        }
        finally {
            if (file) {
                fs.unlink(file, (err) => {
                    if (!err) {
                        console.log('dbf file deleted');
                    }
                });
            }
        }
    }
    async importPersonnelFromExcel(file, companyId, contractId) {
        try {
            const rows = await excelReader.default(file, { sheet: 1 });
            let total = 0;
            let successCounter = 0;
            for (let i = 0; i < rows.length; i++) {
                const nationalCode = rows[i][0].toString();
                const firstName = rows[i][1].toString();
                const lastName = rows[i][2].toString();
                const fatherName = rows[i][3].toString();
                let idNumber = rows[i][4].toString();
                const birthDate = rows[i][5].toString();
                const gender = rows[i][6] == '1' ? gender_enum_1.Gender.MALE : gender_enum_1.Gender.FEMALE;
                const origin = rows[i][7] == '1' ? 'iranian' : 'non_iranian';
                const publicDescription = rows[i][8].toString();
                const privateDescription = rows[i][9].toString();
                const insuranceNumber = rows[i][10].toString();
                const jobCode = rows[i][11].toString();
                const maritalStatus = rows[i][12] == null ? '0' : rows[i][12].toString();
                const armyServiceCode = rows[i][13] == null ? '0' : rows[i][13].toString();
                const personnelNumber = rows[i][14].toString();
                const statusCode = rows[i][15] == '1' ? 'active' : 'inactive';
                const mobile = rows[i][16].toString();
                const address = rows[i][17].toString();
                const postalCode = rows[i][18].toString();
                const telephone = rows[i][19].toString();
                const email = rows[i][20].toString();
                const bankAccount = rows[i][21].toString();
                const bankName = rows[i][22].toString();
                const placeOfBirth = await new birthplace_1.BirthPlace().findPlace(nationalCode);
                const password = await new encryption_1.Encryption().encrypt(nationalCode);
                const year = birthDate.toString().substr(0, 4);
                const month = birthDate.toString().substr(4, 2);
                const day = birthDate.toString().substr(6, 2);
                const gBirthDate = jmoment(`${year}/${month}/${day}`, 'jYYYY/jMM/jDD').format('YYYY/MM/DD 00:00:00');
                if (nationalCode.length != 10) {
                    continue;
                }
                const dup = await this.model.createQueryBuilder()
                    .where('national_number = :nn', { nn: nationalCode })
                    .getOne();
                if (dup != undefined) {
                    continue;
                }
                if (Number(year) > 1368) {
                    idNumber = nationalCode;
                }
                if (insuranceNumber.length > 8) {
                    continue;
                }
                if (insuranceNumber.startsWith('00')) {
                    continue;
                }
                if (mobile) {
                    const mobDup = await this.model.createQueryBuilder()
                        .where('mobile1 = :mm or mobile2 = :mm', { mm: mobile })
                        .getOne();
                    if (mobDup != undefined) {
                        continue;
                    }
                }
                if (firstName == '' || firstName == null || firstName == undefined) {
                    continue;
                }
                if (lastName == '' || lastName == null || lastName == undefined) {
                    continue;
                }
                if (postalCode.length != 10) {
                    continue;
                }
                let army = '';
                switch (armyServiceCode) {
                    case '0':
                        army = 'unknown';
                        break;
                    case '1':
                        army = 'army_done';
                        break;
                    case '2':
                        army = 'medical';
                        break;
                    case '3':
                        army = 'sponsorship';
                        break;
                    case '4':
                        army = 'educational';
                        break;
                    case '5':
                        army = 'none';
                        break;
                    case '6':
                        army = 'purchased';
                        break;
                    case '7':
                        army = 'in_progress';
                        break;
                    default:
                        army = 'error';
                        break;
                }
                await this.model.createQueryBuilder()
                    .insert()
                    .values([
                    {
                        birth_date: birthDate,
                        national_number: nationalCode,
                        first_name: firstName,
                        last_name: lastName,
                        father_name: fatherName,
                        id_number: idNumber,
                        sex: gender,
                        nation: origin,
                        public_description: publicDescription,
                        private_description: privateDescription,
                        password: password,
                        marital_status: maritalStatus == '1' ? 'married' : 'single',
                        army_service: army,
                        job_title: jobCode,
                        insurance_number: insuranceNumber,
                        personnel_id: personnelNumber,
                        job_status: statusCode,
                        mobile1: mobile,
                        phone: telephone,
                        email: email,
                        bank_account1: bankAccount,
                        bank_name1: bankName,
                        address: address,
                        postal_code: postalCode,
                        company_id_fk: companyId,
                        birth_place: placeOfBirth.toString(),
                        id_issue_place: placeOfBirth.toString(),
                        contract_id_fk: contractId,
                        isargar: 'none'
                    }
                ])
                    .execute();
                successCounter++;
            }
            return {
                success: successCounter,
                total: rows.length
            };
        }
        catch (err) {
            throw err;
        }
        finally {
            fs.unlink(file, (err) => {
                if (!err) {
                    console.log('excel file deleted');
                }
            });
        }
    }
    async importSubordinateFromExcel(file) {
        try {
            const rows = await excelReader.default(file, { sheet: 1 });
            let successCounter = 0;
            for (let i = 1; i < rows.length; i++) {
                const natioanlCode = rows[i][0];
                const firstName = rows[i][1];
                const lastName = rows[i][2];
                const fatherName = rows[i][3];
                const shenasname = rows[i][4];
                const birthDateFarsi = rows[i][5];
                const parentNationalCode = rows[i][8];
                const sponsershipStatus = rows[i][11] != undefined ? rows[i][11].toString : 'non_dependent';
                const issuePlace = await new birthplace_1.BirthPlace().findPlace(natioanlCode.toString());
                let relation = '';
                let married = false;
                let updateFatherName = false;
                const year = birthDateFarsi.toString().substr(0, 4);
                const month = birthDateFarsi.toString().substr(4, 2);
                const day = birthDateFarsi.toString().substr(6, 2);
                const jBirthDate = jmoment(`${year}/${month}/${day}`, 'jYYYY/jMM/jDD').format('YYYY/MM/DD 00:00:00');
                switch (rows[i][10]) {
                    case '2':
                        relation = 'wife';
                        married = true;
                        break;
                    case '3':
                        relation = 'brother';
                        break;
                    case '4':
                        relation = 'sister';
                        break;
                    case '5':
                        relation = 'father';
                        updateFatherName = true;
                        break;
                    case '6':
                        relation = 'mother';
                        break;
                    case '7':
                        relation = 'son';
                        married = true;
                        break;
                    case '8':
                        relation = 'daughter';
                        married = true;
                        break;
                    default:
                        relation = 'unknown';
                        break;
                }
                const parent = await this.model.createQueryBuilder()
                    .where('national_number = :nn', { nn: parentNationalCode })
                    .getOne();
                if (parent == undefined) {
                    continue;
                }
                if (updateFatherName) {
                    await this.model.createQueryBuilder()
                        .update()
                        .set({
                        father_name: firstName.toString()
                    })
                        .where('id = :id', { id: parent.id })
                        .execute();
                }
                if (married) {
                    await this.model.createQueryBuilder()
                        .update()
                        .set({
                        marital_status: 'married'
                    })
                        .where('id = :id', { id: parent.id })
                        .execute();
                }
                const subDup = await this.subordinateModel.createQueryBuilder()
                    .where('national_code = :nc', { nc: natioanlCode })
                    .getOne();
                if (subDup != undefined) {
                    continue;
                }
                await this.subordinateModel.createQueryBuilder()
                    .insert()
                    .values([{
                        personnel_id_fk: parent.id,
                        first_name: firstName.toString(),
                        last_name: lastName.toString(),
                        relation: relation,
                        national_code: natioanlCode.toString(),
                        sponsorship_status: sponsershipStatus,
                        father_name: fatherName.toString(),
                        id_number: shenasname.toString(),
                        birth_date: jBirthDate,
                        issue_place: issuePlace.toString()
                    }])
                    .execute();
                successCounter++;
            }
            return {
                success: successCounter
            };
        }
        catch (err) {
            throw err;
        }
        finally {
            fs.unlink(file, (err) => {
                if (!err) {
                    console.log('excel file deleted');
                }
            });
        }
    }
    async globalSearch(firstName, lastName, nationalCode, insuranceNumber, fatherName, mobile) {
        try {
            return await this.model.createQueryBuilder()
                .where('first_name = IFNULL(:firstName, first_name) and last_name = IFNULL(:lastName, last_name) and father_name = IFNULL(:fatherName, father_name) and national_number = IFNULL(:nationalNumber, national_number) and insurance_number = IFNULL(:insuranceNumber, insurance_number) and mobile1 = IFNULL(:mobile, mobile1)', {
                firstName: firstName,
                lastName: lastName,
                fatherName: fatherName,
                nationalNumber: nationalCode,
                insuranceNumber: insuranceNumber,
                mobile: mobile
            })
                .getMany();
        }
        catch (err) {
            throw err;
        }
    }
    async deletePersonnels(ids) {
        try {
            const output = [];
            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                let dup = await (0, typeorm_2.createQueryBuilder)('damage_service')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();
                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'خدمات خسارت'
                    });
                    continue;
                }
                dup = await (0, typeorm_2.createQueryBuilder)('personnel_timeoff')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();
                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'مرخصی'
                    });
                    continue;
                }
                dup = await (0, typeorm_2.createQueryBuilder)('incident')
                    .where('personnel_id_fk = :pid', {
                    pid: id
                }).getCount();
                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'حوادث'
                    });
                    continue;
                }
                dup = await (0, typeorm_2.createQueryBuilder)('imprest')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();
                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'مساعده'
                    });
                    continue;
                }
                dup = await (0, typeorm_2.createQueryBuilder)('personnel_mission')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();
                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'ماموریت'
                    });
                    continue;
                }
                dup = await (0, typeorm_2.createQueryBuilder)('insurance_takmili_personnel')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();
                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'بیمه تکمیلی'
                    });
                    continue;
                }
                dup = await (0, typeorm_2.createQueryBuilder)('insurance_history_claim')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();
                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'ادعای سابقه'
                    });
                    continue;
                }
                dup = await (0, typeorm_2.createQueryBuilder)('insurance')
                    .where('personnel_id_fk = :pid and type= :type', {
                    pid: id,
                    type: 'عمر و حادثه'
                })
                    .getCount();
                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'بیمه عمر و حوادث'
                    });
                    continue;
                }
                dup = await (0, typeorm_2.createQueryBuilder)('settle')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();
                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'تقاضای تسویه حساب'
                    });
                    continue;
                }
                dup = await (0, typeorm_2.createQueryBuilder)('insurance_tamin_personnel')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();
                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'بیمه تامین اجتماعی'
                    });
                    continue;
                }
                dup = await (0, typeorm_2.createQueryBuilder)('doctor_visit')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();
                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'معاینات پزشکی'
                    });
                    continue;
                }
                await this.model.createQueryBuilder()
                    .delete()
                    .where('id = :id', { id: id })
                    .execute();
            }
            return output;
        }
        catch (err) {
            throw err;
        }
    }
    async deleteSubordinates(ids) {
        try {
            ids.forEach(async (item) => {
                await this.subordinateModel.createQueryBuilder()
                    .delete()
                    .where('id = :id', { id: item })
                    .execute();
            });
        }
        catch (err) {
            throw err;
        }
    }
    async insertPersonnelAccess(dto) {
        try {
            return await this.accessModel.createQueryBuilder()
                .insert()
                .values([Object.assign({}, dto)])
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async deletePersonnelAccess(id, access) {
        try {
            await this.accessModel.createQueryBuilder()
                .delete()
                .where('personnel_id_fk = :pid and ', { pid: id })
                .andWhere('access in (:a)', { a: access })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async createPersonnelShift(dto) {
        try {
            const duplicate = await this.personnelShiftRepo.createQueryBuilder()
                .where('personnel_id_fk = :pid and jobs_shift_id_fk = :sid', {
                pid: dto.personnel_id_fk,
                sid: dto.jobs_shift_id_fk
            })
                .getOne();
            if (duplicate) {
                throw new common_1.HttpException('job shift already exists', 400);
            }
            else {
                return await this.personnelShiftRepo.createQueryBuilder()
                    .insert()
                    .values([
                    dto
                ])
                    .execute();
            }
        }
        catch (err) {
            throw err;
        }
    }
    async createPersonnelJob(dto) {
        try {
            const duplicate = await this.personnelJobRepo.createQueryBuilder()
                .where('personnel_id_fk = :pid && contract_id_fk = :prid and jobs_id_fk=:jid', {
                pid: dto.personnel_id_fk,
                prid: dto.contract_id_fk,
                jid: dto.jobs_id_fk
            })
                .getOne();
            if (duplicate) {
                throw new common_1.HttpException(`${dto.personnel_id_fk} already has ${dto.jobs_id_fk} on project #${dto.contract_id_fk}`, 400);
            }
            const _dto = dto;
            _dto.approved = dto.approved == true ? 1 : 0;
            return await this.personnelJobRepo.createQueryBuilder()
                .insert()
                .values([_dto])
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async updatePersonnelJob(id, dto) {
        const _dto = dto;
        _dto.approved = dto.approved == true ? 1 : 0;
        return await this.personnelJobRepo.createQueryBuilder()
            .update()
            .set(Object.assign({}, _dto))
            .where('id = :id', { id: id })
            .execute();
    }
    async findAllPersonnelJobList(page, size) {
        const list = await (0, typeorm_2.createQueryBuilder)('personnel_job', 't1')
            .innerJoinAndSelect('jobs', 't2', 't1.jobs_id_fk = t2.id')
            .innerJoinAndSelect('contract', 't3', 't1.contract_id_fk = t3.id')
            .innerJoinAndSelect('personnel', 't5', 't1.personnel_id_fk = t5.id')
            .leftJoinAndSelect('company', 't4', 't3.employer_id = t4.id')
            .select([
            't1.from_date as from_date',
            't1.to_date as to_date',
            't1.id as id',
            't4.name as company_name',
            't4.id as company_id',
            't3.subject as project',
            't3.id as contract_id',
            't2.title as job_title',
            't2.id as job_id',
            't1.approved as approved',
            't5.first_name as first_name',
            't5.last_name as last_name',
            't5.national_number as national_number',
            't5.id as personnel_id'
        ])
            .limit(size)
            .offset(page - 1)
            .getRawMany();
        const count = await (0, typeorm_2.createQueryBuilder)('personnel_job', 't1')
            .innerJoinAndSelect('jobs', 't2', 't1.jobs_id_fk = t2.id')
            .innerJoinAndSelect('contract', 't3', 't1.contract_id_fk = t3.id')
            .innerJoinAndSelect('personnel', 't5', 't1.personnel_id_fk = t5.id')
            .leftJoinAndSelect('company', 't4', 't3.employer_id = t4.id')
            .select([
            't1.id as id'
        ])
            .getCount();
        return {
            list: list,
            total: count
        };
    }
    async findOnePersonJobs(id, page, size) {
        try {
            const list = await (0, typeorm_2.createQueryBuilder)('personnel_job', 't1')
                .innerJoinAndSelect('jobs', 't2', 't1.jobs_id_fk = t2.id')
                .innerJoinAndSelect('contract', 't3', 't1.contract_id_fk = t3.id')
                .innerJoinAndSelect('personnel', 't5', 't1.personnel_id_fk = t5.id')
                .leftJoinAndSelect('company', 't4', 't3.employer_id = t4.id')
                .where('t1.personnel_id_fk = :pid', { pid: id })
                .select([
                't1.from_date as from_date',
                't1.to_date as to_date',
                't1.id as id',
                't4.name as company_name',
                't4.id as company_id',
                't3.subject as project',
                't3.id as contract_id',
                't2.title as job_title',
                't2.id as job_id',
                't1.approved as approved',
                't5.first_name as first_name',
                't5.last_name as last_name',
                't5.national_number as national_number',
                't5.id as personnel_id'
            ])
                .limit(size)
                .offset(page - 1)
                .getRawMany();
            const count = await (0, typeorm_2.createQueryBuilder)('personnel_job', 't1')
                .innerJoinAndSelect('jobs', 't2', 't1.jobs_id_fk = t2.id')
                .innerJoinAndSelect('contract', 't3', 't1.contract_id_fk = t3.id')
                .innerJoinAndSelect('personnel', 't5', 't1.personnel_id_fk = t5.id')
                .leftJoinAndSelect('company', 't4', 't3.employer_id = t4.id')
                .where('t1.personnel_id_fk = :pid', { pid: id })
                .select([
                't1.id as id'
            ])
                .getCount();
            return {
                list: list,
                total: count
            };
        }
        catch (err) {
            throw err;
        }
    }
    async personnelJobDetail(id) {
        return await (0, typeorm_2.createQueryBuilder)('personnel_job', 't1')
            .innerJoinAndSelect('jobs', 't2', 't1.jobs_id_fk = t2.id')
            .innerJoinAndSelect('contract', 't3', 't1.contract_id_fk = t3.id')
            .innerJoinAndSelect('personnel', 't5', 't1.personnel_id_fk = t5.id')
            .leftJoinAndSelect('company', 't4', 't3.employer_id = t4.id')
            .select([
            't1.from_date as from_date',
            't1.to_date as to_date',
            't1.id as id',
            't4.name as company_name',
            't4.id as company_id',
            't3.subject as project',
            't3.id as contract_id',
            't2.title as job_title',
            't2.id as job_id',
            't1.approved as approved',
            't5.first_name as first_name',
            't5.last_name as last_name',
            't5.national_number as national_number',
            't5.id as personnel_id'
        ])
            .where('t1.id = :id', { id: id })
            .getRawOne();
    }
    async deletePresonnelJob(id) {
        try {
            await this.personnelJobRepo.createQueryBuilder()
                .delete()
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async findPersonnelOfJob(jobId) {
        try {
            return await this.personnelJobRepo.createQueryBuilder()
                .where('jobs_id_fk = :jid', { jid: jobId })
                .getMany();
        }
        catch (err) {
            throw err;
        }
    }
    async findPersonnelofJobs(jobs) {
        return this.personnelJobRepo.createQueryBuilder()
            .where('jobs_id_fk in (:...jobs) and approved = :approved', { jobs: jobs, approved: 1 })
            .getMany();
    }
    async findPersonnelJob(id) {
        return await this.personnelJobRepo.findOne({ where: { personnel_id_fk: id } });
    }
    async getSuperAdmins() {
        return this.model.find({
            where: {
                is_super_user: 1
            }
        });
    }
    async updatePersonnel(id, dto) {
        const personnel = await this.model.findOne({
            where: {
                id: id
            }
        });
        const _dto = dto;
        if (dto.shahid_was_colleague) {
            _dto.shahid_was_colleague = dto.shahid_was_colleague == true ? 1 : 0;
        }
        if (_dto.password) {
            _dto.password = await new encryption_1.Encryption().encrypt(dto.password);
        }
        if (personnel) {
            return await this.model.createQueryBuilder()
                .update()
                .set(_dto)
                .where('id = :id', { id: id })
                .execute();
        }
        else {
            throw new common_1.NotFoundException('personnel could not be found');
        }
    }
    async updateDocuments(dto, id) {
        const personnel = await this.model.findOne({
            where: {
                id: id
            }
        });
        for (let key in dto) {
            dto[key] = new file_1.FileClass('personnel', dto[key]).generateFileName();
        }
        if (personnel) {
            return await this.model.createQueryBuilder()
                .update()
                .set(dto)
                .where('id = :id', { id: personnel.id })
                .execute();
        }
        else {
            throw new common_1.NotFoundException('personnel could not be found');
        }
    }
};
PersonnelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(personnel_schema_1.Personnel)),
    __param(1, (0, typeorm_1.InjectRepository)(personnel_access_schema_1.PersonnelAccess)),
    __param(2, (0, typeorm_1.InjectRepository)(subordinate_schema_1.Subordinate)),
    __param(3, (0, typeorm_1.InjectRepository)(personnel_shift_schema_1.PersonnelShift)),
    __param(4, (0, typeorm_1.InjectRepository)(personnel_jobs_schema_1.PersonnelJobs)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object, typeof (_f = typeof job_title_service_1.JobTitleService !== "undefined" && job_title_service_1.JobTitleService) === "function" ? _f : Object])
], PersonnelService);
exports.PersonnelService = PersonnelService;


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Encryption = void 0;
const clib = __webpack_require__(19);
class Encryption {
    constructor() {
        this.iv = 'Z66RYU1AT6AZ2';
        this.key = 'HPP775p42CzU3yZU7Imelj37D52XvW19';
    }
    encrypt(phrase) {
        return clib.encrypt(phrase, this.key, this.iv);
    }
    decrypt(cipher) {
        return clib.decrypt(cipher, this.key, this.iv);
    }
}
exports.Encryption = Encryption;


/***/ }),
/* 19 */
/***/ ((module) => {

"use strict";
module.exports = require("cryptlib");;

/***/ }),
/* 20 */
/***/ ((module) => {

"use strict";
module.exports = require("typeorm");;

/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobTitleService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(20);
const job_title_schema_1 = __webpack_require__(22);
let JobTitleService = class JobTitleService {
    constructor(model) {
        this.model = model;
    }
    async find(where, fields) {
        try {
            return await this.model.createQueryBuilder()
                .where(where, fields)
                .getMany();
        }
        catch (err) {
            throw err;
        }
    }
};
JobTitleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_title_schema_1.JobTitle)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], JobTitleService);
exports.JobTitleService = JobTitleService;


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobTitle = void 0;
const typeorm_1 = __webpack_require__(20);
let JobTitle = class JobTitle {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JobTitle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], JobTitle.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], JobTitle.prototype, "code", void 0);
JobTitle = __decorate([
    (0, typeorm_1.Entity)({ name: 'job_title' })
], JobTitle);
exports.JobTitle = JobTitle;


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonnelAccess = void 0;
const typeorm_1 = __webpack_require__(20);
let PersonnelAccess = class PersonnelAccess {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], PersonnelAccess.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { nullable: true, name: 'personnel_id_fk' }),
    __metadata("design:type", Number)
], PersonnelAccess.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: 'access', nullable: true, length: 100 }),
    __metadata("design:type", String)
], PersonnelAccess.prototype, "access", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { nullable: true }),
    __metadata("design:type", Number)
], PersonnelAccess.prototype, "company_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { nullable: true }),
    __metadata("design:type", Number)
], PersonnelAccess.prototype, "contract_id_fk", void 0);
PersonnelAccess = __decorate([
    (0, typeorm_1.Entity)({ name: "personnel_access", schema: "bjdb" })
], PersonnelAccess);
exports.PersonnelAccess = PersonnelAccess;


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Personnel = void 0;
const typeorm_1 = __webpack_require__(20);
let Personnel = class Personnel {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Personnel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "birth_date", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 10 }),
    __metadata("design:type", String)
], Personnel.prototype, "national_number", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], Personnel.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], Personnel.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], Personnel.prototype, "father_name", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "id_number", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 1 }),
    __metadata("design:type", String)
], Personnel.prototype, "sex", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], Personnel.prototype, "birth_place", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], Personnel.prototype, "id_issue_place", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], Personnel.prototype, "nation", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Personnel.prototype, "public_description", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Personnel.prototype, "private_description", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Personnel.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 300 }),
    __metadata("design:type", String)
], Personnel.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "marital_status", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "army_service", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], Personnel.prototype, "education", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Personnel.prototype, "job_title", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], Personnel.prototype, "insurance_number", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "personnel_id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "job_type", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "job_status", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Personnel.prototype, "job_disable_date", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Personnel.prototype, "job_disable_description", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 11 }),
    __metadata("design:type", String)
], Personnel.prototype, "mobile1", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 11 }),
    __metadata("design:type", String)
], Personnel.prototype, "mobile2", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], Personnel.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Personnel.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "bank_account1", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "sheba1", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "bank_name1", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "bank_account2", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "sheba2", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "bank_name2", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "bank_account3", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "sheba3", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "bank_name3", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "bank_account4", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "sheba4", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "bank_name4", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "bank_account5", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "sheba5", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "bank_name5", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Personnel.prototype, "national_card_front_url", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Personnel.prototype, "national_card_rear_url", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Personnel.prototype, "birth_certificate_url", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Personnel.prototype, "army_service_card_url", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Personnel.prototype, "company_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], Personnel.prototype, "data_approved", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Personnel.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Personnel.prototype, "sign_url", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Personnel.prototype, "study_field", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], Personnel.prototype, "is_super_user", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "postal_code", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Personnel.prototype, "contract_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], Personnel.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Personnel.prototype, "isargar", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Personnel.prototype, "shahid_name", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], Personnel.prototype, "veteran_percentage", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Personnel.prototype, "frontline_year", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Personnel.prototype, "frontline_month", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Personnel.prototype, "frontline_day", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], Personnel.prototype, "shahid_was_colleague", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Personnel.prototype, "captivity_year", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Personnel.prototype, "captivity_month", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Personnel.prototype, "captivity_day", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Personnel.prototype, "history_total_day", void 0);
__decorate([
    (0, typeorm_1.Column)('double', { nullable: true }),
    __metadata("design:type", Number)
], Personnel.prototype, "insurance_share_employee", void 0);
__decorate([
    (0, typeorm_1.Column)('double', { nullable: true }),
    __metadata("design:type", Number)
], Personnel.prototype, "insurance_share_employer", void 0);
__decorate([
    (0, typeorm_1.Column)('double', { nullable: true }),
    __metadata("design:type", Number)
], Personnel.prototype, "insurance_share_unemployment", void 0);
__decorate([
    (0, typeorm_1.Column)('double', { nullable: true }),
    __metadata("design:type", Number)
], Personnel.prototype, "insurance_share_harmful", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Personnel.prototype, "employeement_date", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Personnel.prototype, "employeement_type", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], Personnel.prototype, "user_type", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Personnel.prototype, "contract_start_date", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Personnel.prototype, "contract_end_date", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 300 }),
    __metadata("design:type", String)
], Personnel.prototype, "latest_educational_document_url", void 0);
Personnel = __decorate([
    (0, typeorm_1.Entity)({ name: 'personnel' })
], Personnel);
exports.Personnel = Personnel;


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Subordinate = void 0;
const typeorm_1 = __webpack_require__(20);
let Subordinate = class Subordinate {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int" }),
    __metadata("design:type", Number)
], Subordinate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Subordinate.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'first_name', nullable: true, length: 100 }),
    __metadata("design:type", String)
], Subordinate.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "last_name", nullable: true, length: 100 }),
    __metadata("design:type", String)
], Subordinate.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "relation", nullable: true, length: 45 }),
    __metadata("design:type", String)
], Subordinate.prototype, "relation", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "national_code", nullable: true, length: 10 }),
    __metadata("design:type", String)
], Subordinate.prototype, "national_code", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "sponsorship_status",
        nullable: true,
        length: 100,
    }),
    __metadata("design:type", String)
], Subordinate.prototype, "sponsorship_status", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "sponsor_description", nullable: true }),
    __metadata("design:type", String)
], Subordinate.prototype, "sponsor_description", void 0);
__decorate([
    (0, typeorm_1.Column)("datetime", { name: "sponsor_date", nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Subordinate.prototype, "sponsor_date", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "father_name", nullable: true, length: 100 }),
    __metadata("design:type", String)
], Subordinate.prototype, "father_name", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "id_number", nullable: true, length: 45 }),
    __metadata("design:type", String)
], Subordinate.prototype, "id_number", void 0);
__decorate([
    (0, typeorm_1.Column)("datetime", { name: "birth_date", nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Subordinate.prototype, "birth_date", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "issue_place", nullable: true, length: 200 }),
    __metadata("design:type", String)
], Subordinate.prototype, "issue_place", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "insurance_number", nullable: true, length: 45 }),
    __metadata("design:type", String)
], Subordinate.prototype, "insurance_number", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "exit_sponsor_reason", nullable: true }),
    __metadata("design:type", String)
], Subordinate.prototype, "exit_sponsor_reason", void 0);
__decorate([
    (0, typeorm_1.Column)("datetime", { name: "exit_sponsor_date", nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Subordinate.prototype, "exit_sponsor_date", void 0);
Subordinate = __decorate([
    (0, typeorm_1.Entity)({ name: 'personnel_subordinate' })
], Subordinate);
exports.Subordinate = Subordinate;


/***/ }),
/* 26 */
/***/ ((module) => {

"use strict";
module.exports = require("dbffile");;

/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DBFHelper = void 0;
class DBFHelper {
    constructor() {
        this.LIST = [
            ["۰", "06F0", "128", "۰"],
            ["۱", "06F1", "129", "۱"],
            ["۲", "06F2", "130", "۲"],
            ["۳", "06F3", "131", "۳"],
            ["۴", "06F4", "132", "۴"],
            ["۵", "06F5", "133", "۵"],
            ["۶", "06F6", "134", "۶"],
            ["۷", "06F7", "135", "۷"],
            ["۸", "06F8", "136", "۸"],
            ["۹", "06F9", "137", "۹"],
            ["،", "060C", "138", "،"],
            ["ـ", "0640", "139", ""],
            ["؟", "061F", "140", "؟"],
            ["ﺁ", "FE81", "141", "آ"],
            ["ﺋ", "FE8B", "142*", "ئ"],
            ["ء", "0621", "143", "ء"],
            ["ﺍ", "FE8D", "144", "ا"],
            ["ﺎ", "FE8E", "145", "ا"],
            ["ﺏ", "FE8F", "146*", "ب"],
            ["ب", "FE8F", "146*", "ب"],
            ["ﺑ", "FE91", "147**", "ب"],
            ["ﭖ", "FB56", "148*", "پ"],
            ["ﭘ", "FB58", "149**", "پ"],
            ["ﺕ", "FE95", "150*", "ت"],
            ["ﺗ", "FE97", "151**", "ت"],
            ["ﺙ", "FE99", "152*", "ث"],
            ["ﺛ", "FE9B", "153**", "ث"],
            ["ﺝ", "FE9D", "154*", "ج"],
            ["ﺟ", "FE9F", "155**", "ج"],
            ["ﭺ", "FB7A", "156*", "چ"],
            ["ﭼ", "FB7C", "157**", "چ"],
            ["ﺡ", "FEA1", "158*", "ح"],
            ["ﺣ", "FEA3", "159**", "ح"],
            ["خ", "FEA5", "160*", "خ"],
            ["ﺧ", "FEA7", "161**", "خ"],
            ["د", "062F", "162", "د"],
            ["ذ", "0630", "163", "ذ"],
            ["ر", "0631", "164", "ر"],
            ["ز", "0632", "165", "ز"],
            ["ژ", "0698", "166", "ژ"],
            ["ﺱ", "FEB1", "167", "س"],
            ["ﺳ", "FEB3", "168", "س"],
            ["ﺵ", "FEB5", "169", "ش"],
            ["ﺷ", "FEB7", "170", "ش"],
            ["ﺹ", "FEB9", "171", "ص"],
            ["ﺻ", "FEBB", "172", "ص"],
            ["ﺽ", "FEBD", "173", "ض"],
            ["ﺿ", "FEBF", "174", "ض"],
            ["ط", "0637", "175", "ط"],
            ["ظ", "0638", "224", "ظ"],
            ["ﻉ", "FEC9", "225*", "ع"],
            ["ﻊ", "FECA", "226**", "ع"],
            ["ﻌ", "FECC", "227*", "ع"],
            ["ﻋ", "FECB", "228**", "ع"],
            ["ﻍ", "FECD", "229*", "غ"],
            ["ﻎ", "FECE", "230**", "غ"],
            ["ﻐ", "FED0", "231*", "غ"],
            ["ﻏ", "FECF", "232**", "غ"],
            ["ﻑ", "FED1", "233*", "ف"],
            ["ﻓ", "FED3", "234**", "ف"],
            ["ﻕ", "FED5", "235*", "ق"],
            ["ﻗ", "FED7", "236**", "ق"],
            ["ﮎ", "FB8E", "237*", "ک"],
            ["ﮐ", "FB90", "238**", "ک"],
            ["ﮒ", "FB92", "239*", "گ"],
            ["ﮔ", "FB94", "240**", "گ"],
            ["ﻝ", "FEDD", "241*", "ل"],
            ["لا", "FEFB", "242*", "لا"],
            ["ﻟ", "FEDF", "243**", "ل"],
            ["ﻡ", "FEE1", "244*", "م"],
            ["ﻣ", "FEE3", "245**", "م"],
            ["ﻥ", "FEE5", "246*", "ن"],
            ["ﻧ", "FEE7", "247**", "ن"],
            ["و", "0648", "248", "و"],
            ["ه", "FEE9", "249*", "ه"],
            ["ﻬ", "FEEC", "250", "ه"],
            ["ﻫ", "FEEB", "251", "ه"],
            ["ﯽ", "FBFD", "252", "ی"],
            ["ﯼ", "FBFC", "253", "ی"],
            ["ﯾ", "FBFE", "254**", "ی"],
            [" ", "00A0", "255", " "]
        ];
        this.NLIST = {
            "۰": ["", "", "", ["", "", ""],
                ["۰", "128"]
            ],
            "۱": ["", "", "", ["", "", ""],
                ["۱", "129"]
            ],
            "۲": ["", "", "", ["", "", ""],
                ["۲", "130"]
            ],
            "۳": ["", "", "", ["", "", ""],
                ["۳", "131"]
            ],
            "۴": ["", "", "", ["", "", ""],
                ["۴", "132"]
            ],
            "۵": ["", "", "", ["", "", ""],
                ["۵", "133"]
            ],
            "۶": ["", "", "", ["", "", ""],
                ["۶", "134"]
            ],
            "۷": ["", "", "", ["", "", ""],
                ["۷", "135"]
            ],
            "۸": ["", "", "", ["", "", ""],
                ["۸", "136"]
            ],
            "۹": ["", "", "", ["", "", ""],
                ["۹", "137"]
            ],
            "،": ["", "", "", ["", "", ""],
                ["،", "138"]
            ],
            " ": ["", "", "", ["", "", ""],
                ["", "255"]
            ],
            "ـ": ["", "", "", ["", "", ""],
                ["ـ", "139"]
            ],
            "آ": ["", "", "", ["", "", ""],
                ["ﺁ", "141"]
            ],
            "ئ": ["ﺋ", "ئ", "ﺋ", ["142", "142", "142"],
                ["ئ", "142"]
            ],
            "ء": ["", "", "", ["", "", ""],
                ["ء", "143"]
            ],
            "ا": ["", "ﺎ", "", ["", "145", ""],
                ["", "144"]
            ],
            "ب": ["ﺑ", "ب", "ﺑ", ["147**", "146**", "147**"],
                ["", "146"]
            ],
            "پ": ["ﭘ", "پ", "ﭘ", ["149**", "148**", "149**"],
                ["", "148"]
            ],
            "ت": ["ﺗ", "ت", "ﺗ", ["151**", "150**", "151**"],
                ["", "150"]
            ],
            "ث": ["ﺛ", "ث", "ﺛ", ["153**", "152**", "153**"],
                ["", "152"]
            ],
            "ج": ["ﺟ", "ج", "ﺟ", ["155**", "154**", "155**"],
                ["", "154"]
            ],
            "چ": ["ﭼ", "چ", "ﭼ", ["157**", "156**", "157**"],
                ["", "156"]
            ],
            "ح": ["ﺣ", "ح", "ﺣ", ["159**", "158**", "159**"],
                ["", "158"]
            ],
            "خ": ["ﺧ", "خ", "ﺧ", ["161**", "160**", "161**"],
                ["", "160"]
            ],
            "د": ["", "د", "", ["", "162", ""],
                ["", "162"]
            ],
            "ذ": ["", "ذ", "", ["", "163", ""],
                ["", "163"]
            ],
            "ر": ["", "ر", "", ["", "164", ""],
                ["", "164"]
            ],
            "ز": ["", "ز", "", ["", "165", ""],
                ["", "165"]
            ],
            "ژ": ["", "ژ", "", ["", "166", ""],
                ["", "166"]
            ],
            "س": ["ﺳ", "س", "ﺳ", ["168", "167", "168"],
                ["", "167"]
            ],
            "ش": ["ﺷ", "ش", "ﺷ", ["170", "169", "170"],
                ["", "169"]
            ],
            "ص": ["ﺻ", "ص", "ﺻ", ["172", "171", "172"],
                ["", "171"]
            ],
            "ض": ["ﺿ", "ض", "ﺿ", ["174", "173", "174"],
                ["", "173"]
            ],
            "ط": ["ط", "ط", "ط", ["175", "175", "175"],
                ["", "175"]
            ],
            "ظ": ["ظ", "ظ", "ظ", ["224", "224", "224"],
                ["", "224"]
            ],
            "ع": ["ﻋ", "ﻊ", "ﻌ", ["228**", "226**", "227*"],
                ["", "225"]
            ],
            "غ": ["ﻏ", "ﻎ", "ﻐ", ["232**", "230**", "231*"],
                ["", "229"]
            ],
            "ف": ["ﻓ", "ف", "ﻓ", ["234**", "233", "234"],
                ["", "233"]
            ],
            "ق": ["ﻗ", "ق", "ﻗ", ["236**", "235", "236"],
                ["", "235"]
            ],
            "ک": ["ﮐ", "ک", "ﮐ", ["238**", "237", "238"],
                ["", "237"]
            ],
            "گ": ["ﮔ", "گ", "ﮔ", ["240**", "239", "240"],
                ["", "239"]
            ],
            "لا": ["", "لا", "", ["", "242*", ""],
                ["", "242"]
            ],
            "ل": ["ﻟ", "ل", "ﻟ", ["243**", "241", "243"],
                ["", "241"]
            ],
            "م": ["ﻣ", "م", "ﻣ", ["245**", "244", "245"],
                ["", "244"]
            ],
            "ن": ["ﻧ", "ن", "ﻧ", ["247**", "246", "247"],
                ["", "246"]
            ],
            "و": ["", "و", "", ["", "248", ""],
                ["", "248"]
            ],
            "ه": ["ﻫ", "ه", "ﻬ", ["251", "249", "250"],
                ["", "249"]
            ],
            "ی": ["ﯾ", "ی", "ﯾ", ["254**", "253", "254"],
                ["", "253"]
            ]
        };
        this.fromIranSystem = ((str) => {
            try {
                let array_1 = [];
                let array_2 = [];
                str = str.split('');
                str = str.reverse();
                let From = [];
                for (let i = 0; i < this.LIST.length; i++) {
                    let r = this.LIST[i];
                    let index = r[2];
                    do {
                        index = index.replace('*', '');
                    } while (index.indexOf('*') >= 0);
                    if (r[3]) {
                        From[index] = r[3];
                    }
                    else {
                        From[index] = r[0];
                    }
                }
                let out = '';
                for (let i = 0; i < str.length; i++) {
                    let rec = str[i];
                    let _ord = this.ord(rec);
                    if (_ord < 128) {
                        out += String.fromCharCode(_ord);
                    }
                    else {
                        if (From[_ord] !== undefined) {
                            out += From[_ord];
                        }
                    }
                }
                return out;
            }
            catch (err) {
                throw err;
            }
        });
        this.ord = ((str) => {
            return str.charCodeAt(0);
        });
        this.convert = (phrase) => {
            return new Promise((resolve, reject) => {
                try {
                    resolve(this.fromIranSystem(phrase));
                }
                catch (err) {
                    reject(err);
                }
            });
        };
    }
}
exports.DBFHelper = DBFHelper;


/***/ }),
/* 28 */
/***/ ((module) => {

"use strict";
module.exports = require("jalali-moment");;

/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BirthPlace = void 0;
class BirthPlace {
    constructor() {
        this.data = {
            "105": "نیشابور",
            "106": "نیشابور",
            "108": "نجف آباد",
            "109": "نجف آباد",
            "110": "فلاورجان",
            "111": "فلاورجان",
            "112": "فریدونشهر",
            "113": "خمینی شهر",
            "114": "خمینی شهر",
            "115": "فریدن",
            "116": "لنجان (زرینشهر)",
            "117": "لنجان (زرینشهر)",
            "118": "اردستان",
            "119": "شهرضا",
            "120": "سمیرم",
            "121": "گلپایگان",
            "122": "خوانسار",
            "123": "نطنز",
            "124": "نائین",
            "125": "کاشان",
            "126": "کاشان",
            "127": "اصفهان",
            "128": "اصفهان",
            "129": "اصفهان",
            "136": "تبریز",
            "137": "تبریز",
            "138": "تبریز",
            "145": "اردبیل",
            "146": "اردبیل",
            "149": "اهر",
            "150": "اهر",
            "152": "میانه",
            "153": "میانه",
            "154": "مراغه",
            "155": "مراغه",
            "157": "مرند",
            "158": "مرند",
            "159": "هشترود",
            "160": "هشترود",
            "161": "مغان",
            "162": "مغان",
            "163": "خلخال",
            "164": "سراب",
            "165": "سراب",
            "166": "مشکین شهر",
            "167": "مشکین شهر",
            "168": "بناب",
            "169": "آذرشهر",
            "170": "اسکو",
            "171": "بستان آباد",
            "172": "شبستر",
            "173": "هریس",
            "174": "اهواز",
            "175": "اهواز",
            "181": "آبادان",
            "182": "خرمشهر",
            "183": "ایذه",
            "184": "ایذه",
            "185": "بهبهان",
            "186": "بهبهان",
            "187": "شوشتر",
            "188": "شوشتر",
            "189": "شادگان",
            "190": "رامهرمز",
            "191": "رامهرمز",
            "192": "اندیمشک",
            "193": "اندیمشک",
            194: "بندرماهشهر",
            195: "بندرماهشهر",
            196: "مسجدسلیمان",
            197: "مسجدسلیمان",
            198: "دشت آزادگان",
            199: "دزفول",
            200: "دزفول",
            202: "گنبد کاووس",
            203: "گنبد کاووس",
            205: "بابل",
            206: "بابل",
            208: "ساری",
            209: "ساری",
            211: "گرگان",
            212: "گرگان",
            213: "آمل",
            214: "آمل",
            215: "قائمشهر",
            216: "قائمشهر",
            217: "بهشهر",
            218: "بهشهر",
            219: "نوشهر",
            220: "نوشهر",
            221: "تنکابن",
            222: "نور",
            223: "بندرترکمن",
            224: "کردکوی",
            225: "سوادکوه",
            226: "علی آباد",
            227: "رامسر",
            228: "شیراز",
            229: "شیراز",
            230: "شیراز",
            236: "کازرون",
            237: "کازرون",
            238: "ممسنی",
            239: "ممسنی",
            240: "آباده",
            241: "آباده",
            242: "مرودشت",
            243: "مرودشت",
            244: "فیروزآباد",
            245: "فیروزآباد",
            246: "جهرم",
            247: "جهرم",
            248: "داراب",
            249: "داراب",
            250: "لارستان",
            251: "لارستان",
            252: "استهبان",
            253: "اقلید",
            254: "سپیدان",
            255: "نی ریز",
            256: "فسا",
            257: "فسا",
            258: "رشت",
            259: "رشت",
            261: "آستارا",
            262: "طالش",
            263: "طالش",
            264: "بندرانزلی",
            265: "رودبار",
            266: "فومن",
            267: "صومعه سرا",
            268: "رودسر",
            269: "رودسر",
            270: "لنگرود",
            271: "لاهیجان",
            272: "لاهیجان",
            273: "آستانه",
            274: "ارومیه",
            275: "ارومیه",
            279: "خوی",
            280: "خوی",
            282: "ماکو",
            283: "ماکو",
            284: "سلماس",
            285: "سلماس",
            286: "مهاباد",
            287: "مهاباد",
            288: "سردشت",
            289: "پیرانشهر",
            290: "نقده",
            291: "سیه چشمه (چالدران)",
            292: "بوکان",
            293: "شاهین دژ",
            294: "تکاب",
            295: "اشنویه",
            296: "میاندوآب",
            297: "میاندوآب",
            298: "کرمان",
            299: "کرمان",
            302: "جیرفت",
            303: "جیرفت",
            304: "رفسنجان",
            305: "رفسنجان",
            306: "سیرجان",
            307: "سیرجان",
            308: "زرند",
            309: "زرند",
            310: "بم",
            311: "بم",
            312: "بافت",
            313: "بافت",
            314: "شهربابک",
            315: "کهنوج",
            316: "کهنوج",
            317: "بردسیر",
            318: "گلباف",
            319: "شهداد",
            320: "فهرج",
            321: "راور",
            322: "پاوه",
            323: "پاوه",
            324: "کرمانشاه",
            325: "کرمانشاه",
            330: "کنگاور",
            331: "هرسین",
            332: "گیلانغرب",
            333: "اسلام آباد",
            334: "اسلام آباد",
            335: "سنقر",
            336: "سرپل ذهاب",
            337: "قصرشیرین",
            338: "بندرعباس",
            339: "بندرعباس",
            341: "میناب",
            342: "میناب",
            343: "بندرلنگه",
            344: "بندرلنگه",
            345: "قشم",
            346: "جاسک",
            347: "حاجی آباد",
            348: "بستک",
            349: "بوشهر",
            350: "بوشهر",
            351: "دشتستان",
            352: "دشتستان",
            353: "بندر گناوه",
            354: "دشتی",
            355: "تنگستان",
            356: "کنگان",
            357: "دیر",
            358: "ایرانشهر",
            359: "ایرانشهر",
            361: "زاهدان",
            362: "زاهدان",
            364: "چابهار",
            365: "چابهار",
            366: "زابل",
            367: "زابل",
            369: "سراوان",
            370: "سراوان",
            371: "خاش",
            372: "سنندج",
            373: "سنندج",
            375: "سقز",
            376: "سقز",
            377: "بیجار",
            378: "بیجار",
            379: "قروه",
            380: "قروه",
            381: "مریوان",
            382: "مریوان",
            383: "کامیاران",
            384: "بانه",
            385: "دیواندره",
            386: "همدان",
            387: "همدان",
            392: "ملایر",
            393: "ملایر",
            395: "نهاوند",
            396: "نهاوند",
            397: "تویسرکان",
            398: "رزن",
            399: "رزن",
            400: "اسدآباد",
            401: "اسدآباد",
            402: "کبودرآهنگ",
            403: "کبودرآهنگ",
            404: "بهار",
            405: "بهار",
            406: "خرم آباد",
            407: "خرم آباد",
            412: "بروجرد",
            413: "بروجرد",
            416: "الیگودرز",
            417: "الیگودرز",
            418: "الشتر",
            419: "کوهدشت",
            420: "نورآباد(دلفان)",
            421: "دورود",
            422: "یاسوج",
            423: "یاسوج",
            424: "دهدشت",
            425: "دهدشت",
            426: "دوگنبدان",
            427: "زنجان",
            428: "زنجان",
            431: "قزوین",
            432: "قزوین",
            436: "خدابنده",
            437: "خدابنده",
            438: "تاکستان",
            439: "تاکستان",
            440: "ابهر",
            441: "ابهر",
            442: "یزد",
            443: "یزد",
            444: "اردکان",
            445: "تفت",
            446: "مهریز",
            447: "بافق",
            448: "میبد",
            449: "ایلام",
            450: "ایلام",
            451: "دهلران",
            452: "مهران",
            453: "شیروان و چرداول",
            454: "آبدانان",
            455: "دره شهر",
            456: "سمنان",
            457: "دامغان",
            458: "شاهرود",
            459: "شاهرود",
            460: "گرمسار",
            461: "شهرکرد",
            462: "شهرکرد",
            464: "بروجن",
            465: "بروجن",
            466: "لردگان",
            467: "فارسان",
            468: "اردل",
            469: "رودان",
            470: "گاوبندی",
            471: "امور خارجه",
            472: "امور خارجه",
            481: "باغ ملک",
            482: "راین",
            483: "چالوس",
            484: "ازنا",
            485: "پلدختر",
            486: "کلاله",
            487: "رامیان",
            488: "مینودشت",
            489: "ساوجبلاغ",
            490: "شهریار",
            491: "شهریار",
            492: "پلدشت",
            493: "چایپاره",
            494: "کرند",
            495: "جوانرود",
            496: "صحنه",
            497: "آق قلا",
            498: "بابلسر",
            499: "نکاء",
            500: "هراز و محمودآباد",
            501: "هراز و محمودآباد",
            502: "فامنین",
            503: "ابرکوه",
            504: "پارس آباد",
            505: "جلفا",
            506: "عجب شیر",
            507: "ملکان",
            508: "آبیک",
            509: "بوئین زهرا",
            510: "شاهین شهر",
            511: "شاهین شهر",
            512: "سمیرم سفلی (دهاقان)",
            513: "بوانات",
            514: "سروستان",
            515: "لامرد",
            516: "ماسال و شاندرمن",
            517: "سیاهکل",
            518: "خمام",
            519: "کلیبر",
            520: "میامی",
            521: "جغتای",
            522: "چناران",
            523: "درمیان",
            524: "مانه و سملقان",
            525: "نیک شهر",
            526: "شوش",
            527: "آغاجاری",
            528: "ویسیان",
            529: "بندر دیلم",
            530: "مهدیشهر",
            531: "مراوه تپه",
            532: "سعد آباد",
            533: "شهرکی و ناروئی (زهک)",
            534: "بدره",
            535: "کوهبنان",
            536: "رودبار کهنوج",
            537: "فین",
            538: "آوج",
            539: "طارم علیا",
            540: "خور و بیابانک",
            541: "مبارکه",
            542: "انار",
            543: "هرات و مروست",
            544: "فراهان",
            545: "ترکمانچای",
            546: "بیضاء",
            547: "خشت و کمارج",
            548: "خرامه",
            549: "تیران و کرون",
            550: "لنده",
            551: "اشکذر (صدوق)",
            552: "نیر",
            553: "کلات",
            554: "خمیر",
            555: "کوهرنگ",
            556: "اسلامشهر",
            557: "اشترینان",
            558: "دهگلان",
            559: "ضیاءآباد",
            560: "ماه نشان",
            561: "بهاباد",
            562: "بجستان",
            563: "نهبندان",
            564: "جرقویه",
            565: "کوهپایه",
            566: "سنجبد(کوثر)",
            567: "ورزقان",
            568: "بندپی",
            569: "شفت",
            570: "رضوانشهر",
            571: "وفس",
            572: "بردسکن",
            573: "جوین",
            574: "زبرخان",
            575: "چادگان",
            576: "چهاردانگه",
            577: "شیرگاه",
            578: "دودانگه",
            579: "گلوگاه",
            580: "رودبار الموت",
            581: "ارکوازی (ملکشاهی)",
            582: "جویبار",
            583: "رابر",
            584: "قلقل رود",
            585: "اروندکنار",
            586: "بشاگرد",
            587: "افشار",
            588: "طارم سفلی",
            589: "سلطانیه",
            590: "رودبار شهرستان",
            591: "رازوجرکلان",
            592: "پاپی",
            593: "هندودر",
            594: "عمارلو",
            595: "ثلاث باباجانی",
            596: "روانسر",
            597: "لاشار(اسپکه)",
            598: "رومشکان",
            599: "بهمنی",
            600: "چاروسا",
            601: "بیله سوار",
            602: "ملکان",
            603: "نیر",
            604: "هوراند",
            605: "ریگان",
            606: "عنبرآباد",
            607: "ماهان",
            608: "منوجان",
            609: "جم",
            610: "شبانکاره",
            611: "میرجاوه",
            612: "چغلوندی",
            613: "چگنی",
            614: "انگوران",
            615: "خرمدره",
            616: "ایوان",
            617: "خنداب",
            618: "زرند مرکزی",
            619: "آران و بیدگل",
            620: "باغ بهادران",
            621: "بوئین و میاندشت",
            622: "میمه",
            623: "صوفیان",
            624: "آزادشهر",
            625: "چمستان",
            626: "کجور",
            627: "کلاردشت",
            628: "گمیشان",
            629: "گندمان",
            630: "املش",
            631: "رحیم آباد",
            632: "فلارد",
            633: "کیار",
            634: "شیروان لومار",
            635: "فاروج",
            636: "چاروایماق",
            637: "انزل",
            638: "سیلوانه",
            639: "سیمینه",
            640: "شوط",
            641: "حمیل",
            642: "بیارجمند",
            643: "احمدآباد",
            644: "تخت جلگه",
            645: "سرباز",
            646: "سروآباد",
            647: "شراء و پیشخوار",
            648: "ارسنجان",
            649: "اوز",
            650: "رشتخوار",
            651: "فیض آباد",
            652: "زیرکوه",
            653: "سنگر",
            654: "حاجی آباد (زرین دشت)",
            655: "خفر",
            656: "گراش",
            657: "مهر",
            658: "پاکدشت",
            659: "فیروزکوه",
            660: "دولت آباد",
            661: "هندیجان",
            662: "رامشیر",
            663: "اندیکا",
            664: "کهریزک",
            665: "سعادت آباد",
            666: "رباط کریم",
            667: "ابوموسی",
            668: "سیب و سوران",
            669: "قصرقند",
            670: "آباده طشک",
            671: "جویم",
            672: "خنج",
            673: "شیبکوه",
            674: "کرانی",
            675: "کشاورز",
            676: "نمشیر",
            677: "تخت سلیمان",
            678: "اشکنان",
            679: "فراشبند",
            680: "هویزه",
            681: "قنقری (خرم بید)",
            682: "بزمان",
            683: "کوار",
            684: "ایوانکی",
            685: "امیدیه",
            686: "نمین",
            687: "باشت",
            688: "دروهان",
            689: "بندرگز",
            690: "انگوت",
            691: "باینگان",
            692: "سردشت",
            693: "کوچصفهان",
            694: "لشت نشاء",
            695: "طالقان",
            696: "میانکوه",
            697: "مارگون",
            698: "قلعه گنج",
            699: "فنوج",
            700: "بسطام",
            701: "دشتیاری",
            702: "کهک",
            703: "بمپور",
            704: "زابلی",
            705: "شیب آب",
            706: "بندر امام خمینی",
            707: "شاوور",
            708: "ایجرود",
            709: "بزینه رود",
            710: "زنجانرود",
            711: "بندپی شرقی",
            712: "عباس آباد",
            713: "میاندورود",
            714: "خورش رستم",
            715: "سرعین",
            716: "سربیشه",
            717: "نظرآباد",
            718: "دستگردان",
            719: "سرایان",
            720: "راسک",
            721: "بشرویه",
            722: "ارزونیه",
            723: "قیروکارزین",
            724: "خلیل آباد",
            725: "کنارک",
            726: "زرین آباد",
            727: "موسیان",
            728: "البرز",
            729: "گتوند",
            730: "لالی",
            731: "ارشق",
            732: "دلوار",
            "083": "طبس",
            "051": "آشتیان",
            "052": "اراک",
            "053": "اراک",
            "058": "تفرش",
            "055": "خمین",
            "057": "دلیجان",
            "059": "ساوه",
            "060": "ساوه",
            "061": "سربند",
            "062": "سربند",
            "056": "محلات",
            "037": "قم",
            "038": "قم",
            "074": "تایباد",
            "072": "تربت جام",
            "073": "تربت جام",
            "069": "تربت حیدریه",
            "070": "تربت حیدریه",
            "076": "خواف",
            "077": "درگز",
            "078": "سبزوار",
            "079": "سبزوار",
            "081": "سرخس",
            "084": "فریمان",
            "086": "قوچان",
            "087": "قوچان",
            "089": "کاشمر",
            "090": "کاشمر",
            "091": "گناباد",
            "092": "مشهد",
            "093": "مشهد",
            "094": "مشهد",
            "096": "مشهد",
            "097": "مشهد",
            "098": "مشهد",
            "063": "اسفراین",
            "067": "بجنورد",
            "068": "بجنورد",
            "075": "جاجرم",
            "082": "شیروان",
            "064": "بیرجند",
            "065": "بیرجند",
            "085": "فردوس",
            "088": "قائنات",
            "001": "تهران مرکزی",
            "002": "تهران مرکزی",
            "003": "تهران مرکزی",
            "004": "تهران مرکزی",
            "005": "تهران مرکزی",
            "006": "تهران مرکزی",
            "007": "تهران مرکزی",
            "008": "تهران مرکزی",
            "011": "تهران جنوب",
            "020": "تهران شرق",
            "025": "تهران شمال",
            "015": "تهران غرب",
            "043": "دماوند",
            "044": "شمیران",
            "045": "شمیران",
            "048": "شهرری",
            "049": "شهرری",
            "041": "ورامین",
            "042": "ورامین",
            "031": "کرج",
            "032": "کرج"
        };
        this.findPlace = ((number) => {
            return new Promise((resolve, _) => {
                if (number.length > 3) {
                    number = number.substring(0, 3);
                }
                const jList = JSON.parse(JSON.stringify(this.data));
                resolve(jList[number]);
            });
        });
    }
}
exports.BirthPlace = BirthPlace;


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["MALE"] = "m";
    Gender["FEMALE"] = "f";
})(Gender = exports.Gender || (exports.Gender = {}));


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MaritalStatus = void 0;
var MaritalStatus;
(function (MaritalStatus) {
    MaritalStatus["SINGLE"] = "single";
    MaritalStatus["MARRIED"] = "married";
})(MaritalStatus = exports.MaritalStatus || (exports.MaritalStatus = {}));


/***/ }),
/* 32 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),
/* 33 */
/***/ ((module) => {

"use strict";
module.exports = require("read-excel-file/node");;

/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonnelShift = void 0;
const typeorm_1 = __webpack_require__(20);
let PersonnelShift = class PersonnelShift {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PersonnelShift.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], PersonnelShift.prototype, "jobs_shift_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], PersonnelShift.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], PersonnelShift.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], PersonnelShift.prototype, "end_date", void 0);
PersonnelShift = __decorate([
    (0, typeorm_1.Entity)({ name: 'personnel_shift' })
], PersonnelShift);
exports.PersonnelShift = PersonnelShift;


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonnelJobs = void 0;
const typeorm_1 = __webpack_require__(20);
let PersonnelJobs = class PersonnelJobs {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PersonnelJobs.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], PersonnelJobs.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], PersonnelJobs.prototype, "jobs_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], PersonnelJobs.prototype, "from_date", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], PersonnelJobs.prototype, "to_date", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], PersonnelJobs.prototype, "contract_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], PersonnelJobs.prototype, "approved", void 0);
PersonnelJobs = __decorate([
    (0, typeorm_1.Entity)({ name: 'personnel_job' })
], PersonnelJobs);
exports.PersonnelJobs = PersonnelJobs;


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileClass = void 0;
class FileClass {
    constructor(module, filename) {
        this.module = module;
        this.filename = filename;
        this.module = module;
        this.filename = filename;
    }
    generateFileName() {
        return `/files/${this.module}/${this.filename}`;
    }
}
exports.FileClass = FileClass;


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JWTToken = void 0;
const common_1 = __webpack_require__(4);
const jwt = __webpack_require__(38);
class JWTToken {
    constructor() {
        try {
            this.pk = process.env.PRIVATE_KEY;
        }
        catch (err) {
            throw err;
        }
    }
    async create(user) {
        try {
            return await jwt.sign(user, this.pk, {
                expiresIn: '30d'
            });
        }
        catch (err) {
            throw err;
        }
    }
    async verify(token) {
        try {
            return await jwt.verify(token, this.pk);
        }
        catch (err) {
            throw new common_1.UnauthorizedException('unable to verify token');
        }
    }
}
exports.JWTToken = JWTToken;


/***/ }),
/* 38 */
/***/ ((module) => {

"use strict";
module.exports = require("jsonwebtoken");;

/***/ }),
/* 39 */
/***/ ((module) => {

"use strict";
module.exports = require("express");;

/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePersonDTO = void 0;
const class_transformer_1 = __webpack_require__(41);
const class_validator_1 = __webpack_require__(42);
const army_service_enum_1 = __webpack_require__(43);
const gender_enum_1 = __webpack_require__(30);
const job_status_enum_1 = __webpack_require__(44);
const job_type_enum_1 = __webpack_require__(45);
const marital_status_enum_1 = __webpack_require__(31);
const create_personnel_access_dto_1 = __webpack_require__(46);
const create_subordinate_dto_1 = __webpack_require__(47);
class CreatePersonDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePersonDTO.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePersonDTO.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePersonDTO.prototype, "father_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePersonDTO.prototype, "id_number", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(gender_enum_1.Gender),
    __metadata("design:type", String)
], CreatePersonDTO.prototype, "sex", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePersonDTO.prototype, "birth_place", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePersonDTO.prototype, "nation", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePersonDTO.prototype, "national_number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDTO.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDTO.prototype, "contract_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDTO.prototype, "mobile1", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(marital_status_enum_1.MaritalStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDTO.prototype, "marital_status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(army_service_enum_1.ArmyService),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDTO.prototype, "army_service", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(job_type_enum_1.JobType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDTO.prototype, "job_type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(job_status_enum_1.JobStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDTO.prototype, "job_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDTO.prototype, "isargar", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['true', 'false']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePersonDTO.prototype, "shahid_was_colleague", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_subordinate_dto_1.CreateSubordinateDTO),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePersonDTO.prototype, "subordinates", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => create_personnel_access_dto_1.CreatePersonnelAccessDTO),
    __metadata("design:type", Array)
], CreatePersonDTO.prototype, "permissions", void 0);
exports.CreatePersonDTO = CreatePersonDTO;


/***/ }),
/* 41 */
/***/ ((module) => {

"use strict";
module.exports = require("class-transformer");;

/***/ }),
/* 42 */
/***/ ((module) => {

"use strict";
module.exports = require("class-validator");;

/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ArmyService = void 0;
var ArmyService;
(function (ArmyService) {
    ArmyService["PURCHASED"] = "\u062E\u0631\u06CC\u062F \u062E\u062F\u0645\u062A";
    ArmyService["UNKNOWN"] = "\u0646\u0627\u0645\u0634\u062E\u0635";
    ArmyService["DONE"] = "\u067E\u0627\u06CC\u0627\u0646 \u062E\u062F\u0645\u062A";
    ArmyService["BAIL_EXEMPTION"] = "\u0645\u0639\u0627\u0641\u06CC\u062A \u06A9\u0641\u0627\u0644\u062A";
})(ArmyService = exports.ArmyService || (exports.ArmyService = {}));


/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobStatus = void 0;
var JobStatus;
(function (JobStatus) {
    JobStatus["ACTIVE"] = "active";
    JobStatus["INACTIVE"] = "inactive";
})(JobStatus = exports.JobStatus || (exports.JobStatus = {}));


/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobType = void 0;
var JobType;
(function (JobType) {
    JobType["OPERATIONAL"] = "operational";
    JobType["NONOPERATIONAL"] = "nonoperational";
})(JobType = exports.JobType || (exports.JobType = {}));


/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePersonnelAccessDTO = void 0;
const class_validator_1 = __webpack_require__(42);
const roles_enum_1 = __webpack_require__(15);
class CreatePersonnelAccessDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreatePersonnelAccessDTO.prototype, "personnelId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreatePersonnelAccessDTO.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreatePersonnelAccessDTO.prototype, "contractId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(roles_enum_1.Role),
    __metadata("design:type", String)
], CreatePersonnelAccessDTO.prototype, "access", void 0);
exports.CreatePersonnelAccessDTO = CreatePersonnelAccessDTO;


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateSubordinateDTO = void 0;
const class_validator_1 = __webpack_require__(42);
const relation_enum_1 = __webpack_require__(48);
class CreateSubordinateDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSubordinateDTO.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSubordinateDTO.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSubordinateDTO.prototype, "national_code", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(relation_enum_1.Relation),
    __metadata("design:type", String)
], CreateSubordinateDTO.prototype, "relation", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSubordinateDTO.prototype, "father_name", void 0);
exports.CreateSubordinateDTO = CreateSubordinateDTO;


/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Relation = void 0;
var Relation;
(function (Relation) {
    Relation["FATHER"] = "father";
    Relation["MOTHER"] = "mother";
    Relation["SON"] = "son";
    Relation["DAUGHTER"] = "daughter";
    Relation["WIFE"] = "wife";
    Relation["BROTHER"] = "brother";
    Relation["SISTER"] = "sister";
})(Relation = exports.Relation || (exports.Relation = {}));


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePersonDTO = void 0;
const mapped_types_1 = __webpack_require__(50);
const create_person_dto_1 = __webpack_require__(40);
class UpdatePersonDTO extends (0, mapped_types_1.PartialType)(create_person_dto_1.CreatePersonDTO) {
}
exports.UpdatePersonDTO = UpdatePersonDTO;


/***/ }),
/* 50 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/mapped-types");;

/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePersonnelAccessDTO = void 0;
const class_transformer_1 = __webpack_require__(41);
const class_validator_1 = __webpack_require__(42);
const create_personnel_access_dto_1 = __webpack_require__(46);
class UpdatePersonnelAccessDTO {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_personnel_access_dto_1.CreatePersonnelAccessDTO),
    __metadata("design:type", Array)
], UpdatePersonnelAccessDTO.prototype, "data", void 0);
exports.UpdatePersonnelAccessDTO = UpdatePersonnelAccessDTO;


/***/ }),
/* 52 */
/***/ ((module) => {

"use strict";
module.exports = require("moment");;

/***/ }),
/* 53 */
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImportDBFDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class ImportDBFDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ImportDBFDTO.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ImportDBFDTO.prototype, "contract_id", void 0);
exports.ImportDBFDTO = ImportDBFDTO;


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeletePersonnelManyDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class DeletePersonnelManyDTO {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], DeletePersonnelManyDTO.prototype, "ids", void 0);
exports.DeletePersonnelManyDTO = DeletePersonnelManyDTO;


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePersonnelShiftDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class CreatePersonnelShiftDTO {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePersonnelShiftDTO.prototype, "jobs_shift_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePersonnelShiftDTO.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreatePersonnelShiftDTO.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], CreatePersonnelShiftDTO.prototype, "end_date", void 0);
exports.CreatePersonnelShiftDTO = CreatePersonnelShiftDTO;


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePersonnelJobDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class CreatePersonnelJobDTO {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePersonnelJobDTO.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePersonnelJobDTO.prototype, "jobs_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreatePersonnelJobDTO.prototype, "from_date", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], CreatePersonnelJobDTO.prototype, "to_date", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePersonnelJobDTO.prototype, "contract_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePersonnelJobDTO.prototype, "approved", void 0);
exports.CreatePersonnelJobDTO = CreatePersonnelJobDTO;


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePersonnelJobDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class UpdatePersonnelJobDTO {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePersonnelJobDTO.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePersonnelJobDTO.prototype, "jobs_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], UpdatePersonnelJobDTO.prototype, "from_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], UpdatePersonnelJobDTO.prototype, "to_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePersonnelJobDTO.prototype, "project_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePersonnelJobDTO.prototype, "approved", void 0);
exports.UpdatePersonnelJobDTO = UpdatePersonnelJobDTO;


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobTitleModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const job_title_schema_1 = __webpack_require__(22);
const job_title_service_1 = __webpack_require__(21);
let JobTitleModule = class JobTitleModule {
};
JobTitleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                job_title_schema_1.JobTitle
            ])
        ],
        controllers: [],
        providers: [job_title_service_1.JobTitleService],
        exports: [job_title_service_1.JobTitleService]
    })
], JobTitleModule);
exports.JobTitleModule = JobTitleModule;


/***/ }),
/* 60 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/config");;

/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignModule = void 0;
const common_1 = __webpack_require__(4);
const personnel_module_1 = __webpack_require__(10);
const sign_controller_1 = __webpack_require__(62);
const sign_service_1 = __webpack_require__(65);
let SignModule = class SignModule {
};
SignModule = __decorate([
    (0, common_1.Module)({
        imports: [personnel_module_1.PersonnelModule],
        controllers: [sign_controller_1.SignController],
        providers: [sign_service_1.SignService],
        exports: [sign_service_1.SignService]
    })
], SignModule);
exports.SignModule = SignModule;


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignController = void 0;
const common_1 = __webpack_require__(4);
const sign_dto_1 = __webpack_require__(63);
const verify_dto_1 = __webpack_require__(64);
const sign_service_1 = __webpack_require__(65);
let SignController = class SignController {
    constructor(service) {
        this.service = service;
    }
    async sign(body) {
        return await this.service.login(body);
    }
    async verify(body) {
        return await this.service.verify(body);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof sign_dto_1.SignDTO !== "undefined" && sign_dto_1.SignDTO) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], SignController.prototype, "sign", null);
__decorate([
    (0, common_1.Post)('/verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof verify_dto_1.VerifyDTO !== "undefined" && verify_dto_1.VerifyDTO) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], SignController.prototype, "verify", null);
SignController = __decorate([
    (0, common_1.Controller)('sign'),
    __metadata("design:paramtypes", [typeof (_c = typeof sign_service_1.SignService !== "undefined" && sign_service_1.SignService) === "function" ? _c : Object])
], SignController);
exports.SignController = SignController;


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class SignDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignDTO.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignDTO.prototype, "password", void 0);
exports.SignDTO = SignDTO;


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VerifyDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class VerifyDTO {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], VerifyDTO.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyDTO.prototype, "code", void 0);
exports.VerifyDTO = VerifyDTO;


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignService = void 0;
const common_1 = __webpack_require__(4);
const encryption_1 = __webpack_require__(18);
const jwt_1 = __webpack_require__(37);
const randomnumber_1 = __webpack_require__(66);
const nimaadsms_1 = __webpack_require__(67);
const personnel_service_1 = __webpack_require__(17);
let SignService = class SignService {
    constructor(personnelService) {
        this.personnelService = personnelService;
    }
    async login(dto) {
        try {
            const _pass = await new encryption_1.Encryption().encrypt(dto.password);
            const personnel = await this.personnelService.findPersonByUserPassword(dto.username, _pass);
            if (personnel) {
                if (personnel.mobile1 || personnel.mobile2) {
                    const rndNumber = await new randomnumber_1.RandomNumber(10000, 99999).generate();
                    const rndHash = new encryption_1.Encryption().encrypt(rndNumber.toString());
                    await this.personnelService.updateCode(personnel.id, rndHash);
                    new nimaadsms_1.NimaadSMS().sendVerificationCode(rndNumber.toString(), personnel.mobile1);
                    return {
                        id: personnel.id
                    };
                }
                else {
                    throw new common_1.HttpException('شماره موبایل شما در سامانه وارد نشده است. لطفا با واحد پشتیبانی تماس حاصل فرمایید', 400);
                }
            }
            else {
                throw new common_1.HttpException('incorrect username/password', 400);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async verify(dto) {
        try {
            const personnel = await this.personnelService.findPersonnelById(dto.id);
            if (personnel) {
                const hashCode = await new encryption_1.Encryption().encrypt(dto.code);
                if (personnel.code == hashCode) {
                    const token = await new jwt_1.JWTToken().create({
                        id: personnel.id,
                        companyId: personnel.company_id_fk != null ? personnel.company_id_fk : -1,
                        isDoctor: personnel.user_type == 'doctor' ? true : false,
                        isSuper: personnel.is_super_user == null ? false : personnel.is_super_user == 1 ? true : false
                    });
                    return {
                        token: token
                    };
                }
                else {
                    throw new common_1.HttpException('incorrect code', 400);
                }
            }
            else {
                throw new common_1.HttpException('invalid user id', 400);
            }
        }
        catch (err) {
            throw err;
        }
    }
};
SignService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof personnel_service_1.PersonnelService !== "undefined" && personnel_service_1.PersonnelService) === "function" ? _a : Object])
], SignService);
exports.SignService = SignService;


/***/ }),
/* 66 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RandomNumber = void 0;
class RandomNumber {
    constructor(fromNumber, toNumber) {
        this.fromNumber = fromNumber;
        this.toNumber = toNumber;
    }
    generate() {
        const num = Math.random() * (this.toNumber - this.fromNumber) + this.fromNumber;
        return Math.floor(num);
    }
}
exports.RandomNumber = RandomNumber;


/***/ }),
/* 67 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NimaadSMS = void 0;
const request = __webpack_require__(68);
const chalk = __webpack_require__(69);
class NimaadSMS {
    constructor() {
        this.token = '';
        this.panelUsername = 'ngoharzamin';
        this.panelPassword = '111030865';
        this.token = 'boI_qajTx3heu5e3H0t9Y0mrqsLqD-VT1X6MU3kcB3Y=';
    }
    sendVerificationCode(code, mobile) {
        try {
            request.post({
                url: 'http://rest.ippanel.com/v1/messages/patterns/send',
                body: {
                    'originator': '+9810008379',
                    'pattern_code': 'jx1x9kski9',
                    'recipient': mobile,
                    'values': {
                        'code': code
                    }
                },
                headers: {
                    'Authorization': `AccessKey ${this.token}`,
                    'Content-Type': 'application/json'
                },
                json: true
            }, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    console.log(chalk.redBright('---------------\n'), chalk.blueBright(`verification code sent: ${code}\n`), chalk.redBright('---------------\n\n'));
                }
            });
        }
        catch (err) {
            throw err;
        }
    }
    sendCreatedTask(mobile, taskId, name) {
        try {
            request.post({
                url: 'http://rest.ippanel.com/v1/messages/patterns/send',
                body: {
                    'originator': '+9810008379',
                    'pattern_code': '71d8wft4qs',
                    'recipient': mobile,
                    'values': {
                        'name': name,
                        'taskId': taskId.toString()
                    }
                },
                headers: {
                    'Authorization': `AccessKey ${this.token}`,
                    'Content-Type': 'application/json'
                },
                json: true
            }, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    console.log(chalk.redBright('---------------\n'), chalk.blueBright(`sms sent to ${mobile} after task created\n`), chalk.redBright('---------------\n\n'));
                }
            });
        }
        catch (err) {
            throw err;
        }
    }
    sendTaskPercentage(percentage, mobile, taskId, name) {
        try {
            request.post({
                url: 'http://rest.ippanel.com/v1/messages/patterns/send',
                body: {
                    'originator': '+9810008379',
                    'pattern_code': 'y7mr0hepvy',
                    'recipient': mobile,
                    'values': {
                        'percent': percentage.toString(),
                        'taskId': taskId.toString()
                    }
                },
                headers: {
                    'Authorization': `AccessKey ${this.token}`,
                    'Content-Type': 'application/json'
                },
                json: true
            }, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    console.log(chalk.redBright('---------------\n'), chalk.blueBright(`sms sent to ${mobile} on ${percentage}% of task #${taskId}.\n`), chalk.redBright('---------------\n\n'));
                }
            });
        }
        catch (err) {
            throw err;
        }
    }
}
exports.NimaadSMS = NimaadSMS;


/***/ }),
/* 68 */
/***/ ((module) => {

"use strict";
module.exports = require("request");;

/***/ }),
/* 69 */
/***/ ((module) => {

"use strict";
module.exports = require("chalk");;

/***/ }),
/* 70 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const dotenv = __webpack_require__(71);
dotenv.config();
const personnel_access_schema_1 = __webpack_require__(23);
const subordinate_schema_1 = __webpack_require__(25);
const job_title_schema_1 = __webpack_require__(22);
const damageService_schema_1 = __webpack_require__(72);
const timeoff_schema_1 = __webpack_require__(73);
const incident_schema_1 = __webpack_require__(74);
const imprest_schema_1 = __webpack_require__(75);
const mission_schema_1 = __webpack_require__(76);
const takmili_schema_1 = __webpack_require__(77);
const history_claim_schema_1 = __webpack_require__(78);
const insurance_schema_1 = __webpack_require__(79);
const settle_schema_1 = __webpack_require__(80);
const tamin_personnel_schema_1 = __webpack_require__(81);
const visit_schema_1 = __webpack_require__(82);
const contractProgress_schema_1 = __webpack_require__(83);
const contractProductionReport_schema_1 = __webpack_require__(84);
const contractPeymanReport_schema_1 = __webpack_require__(85);
const contract_schema_1 = __webpack_require__(86);
const question_schema_1 = __webpack_require__(87);
const job_schema_1 = __webpack_require__(88);
const vehicle_type_schema_1 = __webpack_require__(89);
const checklist_schema_1 = __webpack_require__(90);
const checklist_questions_schema_1 = __webpack_require__(91);
const allocate_question_schema_1 = __webpack_require__(92);
const vehicle_schema_1 = __webpack_require__(93);
const hse_audit_schema_1 = __webpack_require__(94);
const audit_question_schema_1 = __webpack_require__(95);
const job_permission_schema_1 = __webpack_require__(96);
const job_tamin_code_schema_1 = __webpack_require__(97);
const job_shift_schema_1 = __webpack_require__(98);
const job_shift_pattern_schema_1 = __webpack_require__(99);
const job_chart_schema_1 = __webpack_require__(100);
const job_chart_node_schema_1 = __webpack_require__(101);
const personnel_shift_schema_1 = __webpack_require__(34);
const personnel_jobs_schema_1 = __webpack_require__(35);
const company_borad_member_schema_1 = __webpack_require__(102);
const personnel_schema_1 = __webpack_require__(24);
const task_schema_1 = __webpack_require__(104);
const task_member_schema_1 = __webpack_require__(105);
const table_name_schema_1 = __webpack_require__(106);
const column_name_schema_1 = __webpack_require__(107);
const task_condition_schema_1 = __webpack_require__(108);
const test_table_schema_1 = __webpack_require__(109);
const task_schedule_daily_schema_1 = __webpack_require__(110);
const task_schedule_monthly_schema_1 = __webpack_require__(111);
const tasks_schedule_yearly_schema_1 = __webpack_require__(112);
const task_toinform_schema_1 = __webpack_require__(113);
const task_schedule_weekly_schema_1 = __webpack_require__(114);
const task_sms_notification_schema_1 = __webpack_require__(115);
const task_approver_schema_1 = __webpack_require__(116);
const task_notmyduty_schema_1 = __webpack_require__(117);
const config = {
    type: 'mysql',
    host: process.env.DBADDRESS,
    port: 3306,
    username: 'bajedb_user',
    password: 'HWFSzN&CFwU^zgq',
    database: 'bjdb',
    charset: 'UTF8_PERSIAN_CI',
    entities: [
        personnel_schema_1.Personnel,
        personnel_access_schema_1.PersonnelAccess,
        subordinate_schema_1.Subordinate,
        job_title_schema_1.JobTitle,
        damageService_schema_1.DamageService,
        timeoff_schema_1.TimeOff,
        incident_schema_1.PersonnelIncident,
        imprest_schema_1.PersonnelImprest,
        mission_schema_1.PersonnelMission,
        personnel_shift_schema_1.PersonnelShift,
        personnel_jobs_schema_1.PersonnelJobs,
        takmili_schema_1.InsuranceTakmiliPersonnel,
        history_claim_schema_1.InsuranceHistoryClaim,
        insurance_schema_1.Insurance,
        settle_schema_1.Settle,
        tamin_personnel_schema_1.InsuranceTaminPersonnel,
        visit_schema_1.DoctorVisit,
        contractProgress_schema_1.ContractProgress,
        contractProductionReport_schema_1.ContractProductionReport,
        contractPeymanReport_schema_1.ContractPeymanReport,
        contract_schema_1.Contract,
        question_schema_1.HSEQuestion,
        checklist_schema_1.HSEChecklist,
        checklist_questions_schema_1.HSEChecklistQuestion,
        allocate_question_schema_1.HSEAllocateQuestion,
        hse_audit_schema_1.HSEAudit,
        audit_question_schema_1.HSEAuditQuestion,
        job_schema_1.Job,
        job_permission_schema_1.JobPermission,
        job_tamin_code_schema_1.JobsTaminCode,
        job_shift_schema_1.JobsShift,
        job_shift_pattern_schema_1.JobsShiftPattern,
        job_chart_schema_1.JobChart,
        job_chart_node_schema_1.JobChartNode,
        vehicle_type_schema_1.VehicleType,
        vehicle_schema_1.Vehicle,
        company_borad_member_schema_1.CompanyBoardMember,
        task_schema_1.Task,
        task_member_schema_1.TaskMember,
        task_condition_schema_1.TaskCondition,
        task_schedule_daily_schema_1.TasksScheduleDaily,
        task_schedule_weekly_schema_1.TasksScheduleWeekly,
        task_schedule_monthly_schema_1.TasksScheduleMonthly,
        tasks_schedule_yearly_schema_1.TasksScheduleYearly,
        task_toinform_schema_1.TasksToInform,
        task_sms_notification_schema_1.TasksSMSNotification,
        task_approver_schema_1.TaskApprover,
        task_notmyduty_schema_1.TasksNotMyDuty,
        table_name_schema_1.TableName,
        column_name_schema_1.ColumnName,
        test_table_schema_1.TestTable
    ],
    synchronize: false
};
module.exports = config;


/***/ }),
/* 71 */
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");;

/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DamageService = void 0;
const typeorm_1 = __webpack_require__(20);
let DamageService = class DamageService {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], DamageService.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "personnel_id_fk" }),
    __metadata("design:type", Number)
], DamageService.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "type", nullable: true, length: 45 }),
    __metadata("design:type", String)
], DamageService.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)("datetime", { name: "date", nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], DamageService.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "description", nullable: true }),
    __metadata("design:type", String)
], DamageService.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "type_service_damage",
        nullable: true,
        length: 300,
    }),
    __metadata("design:type", String)
], DamageService.prototype, "type_service_damage", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "type_reward_penalty",
        nullable: true,
        length: 300,
    }),
    __metadata("design:type", String)
], DamageService.prototype, "type_reward_penalty", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "amount_reward_penalty",
        nullable: true,
        length: 500,
    }),
    __metadata("design:type", String)
], DamageService.prototype, "amount_reward_penalty", void 0);
__decorate([
    (0, typeorm_1.Column)("tinyint", { name: "hr_approved", nullable: true }),
    __metadata("design:type", Number)
], DamageService.prototype, "hr_approved", void 0);
__decorate([
    (0, typeorm_1.Column)("tinyint", { name: "project_admin_approved", nullable: true }),
    __metadata("design:type", Number)
], DamageService.prototype, "project_admin_approved", void 0);
__decorate([
    (0, typeorm_1.Column)("tinyint", { name: "manager_approved", nullable: true }),
    __metadata("design:type", Number)
], DamageService.prototype, "manager_approved", void 0);
DamageService = __decorate([
    (0, typeorm_1.Entity)({ name: "damage_service" })
], DamageService);
exports.DamageService = DamageService;


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimeOff = void 0;
const typeorm_1 = __webpack_require__(20);
let TimeOff = class TimeOff {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int' }),
    __metadata("design:type", Number)
], TimeOff.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "type", nullable: true, length: 200 }),
    __metadata("design:type", String)
], TimeOff.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "request_type", nullable: true, length: 200 }),
    __metadata("design:type", String)
], TimeOff.prototype, "request_type", void 0);
__decorate([
    (0, typeorm_1.Column)("datetime", { name: "from_date", nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], TimeOff.prototype, "from_date", void 0);
__decorate([
    (0, typeorm_1.Column)("datetime", { name: "to_date", nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], TimeOff.prototype, "to_date", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "description", nullable: true }),
    __metadata("design:type", String)
], TimeOff.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "status", nullable: true, length: 200 }),
    __metadata("design:type", String)
], TimeOff.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "personnel_id_fk", nullable: true }),
    __metadata("design:type", Number)
], TimeOff.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "file_url", nullable: true, length: 300 }),
    __metadata("design:type", String)
], TimeOff.prototype, "file_url", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], TimeOff.prototype, "operator_id_fk", void 0);
TimeOff = __decorate([
    (0, typeorm_1.Entity)({ name: 'personnel_timeoff' })
], TimeOff);
exports.TimeOff = TimeOff;


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonnelIncident = void 0;
const typeorm_1 = __webpack_require__(20);
let PersonnelIncident = class PersonnelIncident {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], PersonnelIncident.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], PersonnelIncident.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], PersonnelIncident.prototype, "injury", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], PersonnelIncident.prototype, "injury_type", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 200, nullable: true }),
    __metadata("design:type", String)
], PersonnelIncident.prototype, "relation", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], PersonnelIncident.prototype, "incident_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], PersonnelIncident.prototype, "injury_other", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], PersonnelIncident.prototype, "injury_type_other", void 0);
PersonnelIncident = __decorate([
    (0, typeorm_1.Entity)({ name: 'incident_personnel' })
], PersonnelIncident);
exports.PersonnelIncident = PersonnelIncident;


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonnelImprest = void 0;
const typeorm_1 = __webpack_require__(20);
let PersonnelImprest = class PersonnelImprest {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PersonnelImprest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], PersonnelImprest.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10,
        scale: 0, }),
    __metadata("design:type", Number)
], PersonnelImprest.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10,
        scale: 0, }),
    __metadata("design:type", Number)
], PersonnelImprest.prototype, "number_of_installment", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], PersonnelImprest.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], PersonnelImprest.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], PersonnelImprest.prototype, "project_manager_status", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], PersonnelImprest.prototype, "accountant_status", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], PersonnelImprest.prototype, "company_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], PersonnelImprest.prototype, "paid_amount", void 0);
PersonnelImprest = __decorate([
    (0, typeorm_1.Entity)({ name: 'imprest' })
], PersonnelImprest);
exports.PersonnelImprest = PersonnelImprest;


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonnelMission = void 0;
const typeorm_1 = __webpack_require__(20);
let PersonnelMission = class PersonnelMission {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PersonnelMission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], PersonnelMission.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], PersonnelMission.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 400 }),
    __metadata("design:type", String)
], PersonnelMission.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 500 }),
    __metadata("design:type", String)
], PersonnelMission.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], PersonnelMission.prototype, "from_date", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], PersonnelMission.prototype, "to_date", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 300 }),
    __metadata("design:type", String)
], PersonnelMission.prototype, "residency", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 400 }),
    __metadata("design:type", String)
], PersonnelMission.prototype, "vehicle", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], PersonnelMission.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], PersonnelMission.prototype, "status", void 0);
PersonnelMission = __decorate([
    (0, typeorm_1.Entity)({ name: 'personnel_mission' })
], PersonnelMission);
exports.PersonnelMission = PersonnelMission;


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InsuranceTakmiliPersonnel = void 0;
const typeorm_1 = __webpack_require__(20);
let InsuranceTakmiliPersonnel = class InsuranceTakmiliPersonnel {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InsuranceTakmiliPersonnel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], InsuranceTakmiliPersonnel.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], InsuranceTakmiliPersonnel.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], InsuranceTakmiliPersonnel.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], InsuranceTakmiliPersonnel.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], InsuranceTakmiliPersonnel.prototype, "insurance_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], InsuranceTakmiliPersonnel.prototype, "main_insurer_personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], InsuranceTakmiliPersonnel.prototype, "is_approved", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], InsuranceTakmiliPersonnel.prototype, "is_deleted", void 0);
InsuranceTakmiliPersonnel = __decorate([
    (0, typeorm_1.Entity)({ name: 'insurance_takmili_personnel' })
], InsuranceTakmiliPersonnel);
exports.InsuranceTakmiliPersonnel = InsuranceTakmiliPersonnel;


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InsuranceHistoryClaim = void 0;
const typeorm_1 = __webpack_require__(20);
let InsuranceHistoryClaim = class InsuranceHistoryClaim {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InsuranceHistoryClaim.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], InsuranceHistoryClaim.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], InsuranceHistoryClaim.prototype, "workshop_code", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], InsuranceHistoryClaim.prototype, "row", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], InsuranceHistoryClaim.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], InsuranceHistoryClaim.prototype, "month", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], InsuranceHistoryClaim.prototype, "number_of_days", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], InsuranceHistoryClaim.prototype, "salary_bonus", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], InsuranceHistoryClaim.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], InsuranceHistoryClaim.prototype, "register_number", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], InsuranceHistoryClaim.prototype, "register_date", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], InsuranceHistoryClaim.prototype, "debt", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], InsuranceHistoryClaim.prototype, "contract_id_fk", void 0);
InsuranceHistoryClaim = __decorate([
    (0, typeorm_1.Entity)({ name: 'insurance_history_claim' })
], InsuranceHistoryClaim);
exports.InsuranceHistoryClaim = InsuranceHistoryClaim;


/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Insurance = void 0;
const typeorm_1 = __webpack_require__(20);
let Insurance = class Insurance {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Insurance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Insurance.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 300 }),
    __metadata("design:type", String)
], Insurance.prototype, "insurer_main", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 300 }),
    __metadata("design:type", String)
], Insurance.prototype, "insurer_company", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Insurance.prototype, "contract_number", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Insurance.prototype, "contract_issue_date", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Insurance.prototype, "contract_date_from_date", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Insurance.prototype, "to_date", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 0, nullable: true }),
    __metadata("design:type", Number)
], Insurance.prototype, "main_insured", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 0, nullable: true }),
    __metadata("design:type", Number)
], Insurance.prototype, "spouse_insured", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 0, nullable: true }),
    __metadata("design:type", Number)
], Insurance.prototype, "doughter_insured", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 0, nullable: true }),
    __metadata("design:type", Number)
], Insurance.prototype, "son_insured", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 0, nullable: true }),
    __metadata("design:type", Number)
], Insurance.prototype, "father_insured", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 0, nullable: true }),
    __metadata("design:type", Number)
], Insurance.prototype, "mother_insured", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Insurance.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Insurance.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Insurance.prototype, "company_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], Insurance.prototype, "approved", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 300 }),
    __metadata("design:type", String)
], Insurance.prototype, "pdf_file_url", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Insurance.prototype, "insurer_main_company_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Insurance.prototype, "change_deadline_date", void 0);
Insurance = __decorate([
    (0, typeorm_1.Entity)({ name: 'insurance' })
], Insurance);
exports.Insurance = Insurance;


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Settle = void 0;
const typeorm_1 = __webpack_require__(20);
let Settle = class Settle {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Settle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Settle.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Settle.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Settle.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Settle.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], Settle.prototype, "approved", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Settle.prototype, "register_user_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Settle.prototype, "status", void 0);
Settle = __decorate([
    (0, typeorm_1.Entity)({ name: 'settle' })
], Settle);
exports.Settle = Settle;


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InsuranceTaminPersonnel = void 0;
const typeorm_1 = __webpack_require__(20);
let InsuranceTaminPersonnel = class InsuranceTaminPersonnel {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InsuranceTaminPersonnel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], InsuranceTaminPersonnel.prototype, "insurance_tamin_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], InsuranceTaminPersonnel.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], InsuranceTaminPersonnel.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], InsuranceTaminPersonnel.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], InsuranceTaminPersonnel.prototype, "total_work_day", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], InsuranceTaminPersonnel.prototype, "daily_salary", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], InsuranceTaminPersonnel.prototype, "monthly_salary", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], InsuranceTaminPersonnel.prototype, "include_benefit", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], InsuranceTaminPersonnel.prototype, "salary_benefit_include", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], InsuranceTaminPersonnel.prototype, "salary_benefit_include_notinclude", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], InsuranceTaminPersonnel.prototype, "insured_share", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], InsuranceTaminPersonnel.prototype, "employer_share", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], InsuranceTaminPersonnel.prototype, "jobless_share", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], InsuranceTaminPersonnel.prototype, "hard_job_share", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], InsuranceTaminPersonnel.prototype, "total_share", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], InsuranceTaminPersonnel.prototype, "job_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], InsuranceTaminPersonnel.prototype, "description", void 0);
InsuranceTaminPersonnel = __decorate([
    (0, typeorm_1.Entity)({ name: 'insurance_tamin_personnel' })
], InsuranceTaminPersonnel);
exports.InsuranceTaminPersonnel = InsuranceTaminPersonnel;


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DoctorVisit = void 0;
const typeorm_1 = __webpack_require__(20);
let DoctorVisit = class DoctorVisit {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DoctorVisit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], DoctorVisit.prototype, "visit_date", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], DoctorVisit.prototype, "doctor_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 300 }),
    __metadata("design:type", String)
], DoctorVisit.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], DoctorVisit.prototype, "approved_position_code", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], DoctorVisit.prototype, "next_visit_date", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], DoctorVisit.prototype, "special_description", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], DoctorVisit.prototype, "personnel_id_fk", void 0);
DoctorVisit = __decorate([
    (0, typeorm_1.Entity)({ name: 'doctor_visit' })
], DoctorVisit);
exports.DoctorVisit = DoctorVisit;


/***/ }),
/* 83 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContractProgress = void 0;
const typeorm_1 = __webpack_require__(20);
let ContractProgress = class ContractProgress {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ContractProgress.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', {
        nullable: true
    }),
    __metadata("design:type", Number)
], ContractProgress.prototype, "contract_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], ContractProgress.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ContractProgress.prototype, "real_progress", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ContractProgress.prototype, "program_progress", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], ContractProgress.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], ContractProgress.prototype, "edit_by_admin", void 0);
ContractProgress = __decorate([
    (0, typeorm_1.Entity)({ name: 'contract_progress' })
], ContractProgress);
exports.ContractProgress = ContractProgress;


/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContractProductionReport = void 0;
const typeorm_1 = __webpack_require__(20);
let ContractProductionReport = class ContractProductionReport {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ContractProductionReport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], ContractProductionReport.prototype, "stone_tonnage", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], ContractProductionReport.prototype, "dust_tonnage", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], ContractProductionReport.prototype, "stone_load_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], ContractProductionReport.prototype, "dust_load_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 45, nullable: true }),
    __metadata("design:type", Number)
], ContractProductionReport.prototype, "contract_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], ContractProductionReport.prototype, "edit_by_admin", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], ContractProductionReport.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 300 }),
    __metadata("design:type", String)
], ContractProductionReport.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], ContractProductionReport.prototype, "description", void 0);
ContractProductionReport = __decorate([
    (0, typeorm_1.Entity)({ name: 'contract_production_report' })
], ContractProductionReport);
exports.ContractProductionReport = ContractProductionReport;


/***/ }),
/* 85 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContractPeymanReport = void 0;
const typeorm_1 = __webpack_require__(20);
let ContractPeymanReport = class ContractPeymanReport {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ContractPeymanReport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], ContractPeymanReport.prototype, "contract_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], ContractPeymanReport.prototype, "edit_by_admin", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], ContractPeymanReport.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], ContractPeymanReport.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], ContractPeymanReport.prototype, "disabled_car_no_tier_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], ContractPeymanReport.prototype, "disabled_car_no_part_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], ContractPeymanReport.prototype, "active_car_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 0 }),
    __metadata("design:type", Number)
], ContractPeymanReport.prototype, "ready_to_work_factor", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], ContractPeymanReport.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], ContractPeymanReport.prototype, "ready_to_work_car_quantity", void 0);
ContractPeymanReport = __decorate([
    (0, typeorm_1.Entity)({ name: 'contract_peyman_report' })
], ContractPeymanReport);
exports.ContractPeymanReport = ContractPeymanReport;


/***/ }),
/* 86 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Contract = void 0;
const typeorm_1 = __webpack_require__(20);
let Contract = class Contract {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Contract.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Contract.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Contract.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Contract.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Contract.prototype, "employer", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Contract.prototype, "contractor", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Contract.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Contract.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Contract.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)('double', { nullable: true }),
    __metadata("design:type", Number)
], Contract.prototype, "initial_amount", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 10 }),
    __metadata("design:type", String)
], Contract.prototype, "workshop_code", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 10 }),
    __metadata("design:type", String)
], Contract.prototype, "row", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], Contract.prototype, "supervision", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Contract.prototype, "manager_id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Contract.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Contract.prototype, "employer_id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", Number)
], Contract.prototype, "boss_id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Contract.prototype, "contractor_type", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Contract.prototype, "contractor_id", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], Contract.prototype, "deleted", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Contract.prototype, "main_contract_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], Contract.prototype, "can_delete", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], Contract.prototype, "edit_by_admin", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], Contract.prototype, "activity", void 0);
Contract = __decorate([
    (0, typeorm_1.Entity)({ name: 'contract' })
], Contract);
exports.Contract = Contract;


/***/ }),
/* 87 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HSEQuestion = void 0;
const typeorm_1 = __webpack_require__(20);
let HSEQuestion = class HSEQuestion {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HSEQuestion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], HSEQuestion.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], HSEQuestion.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], HSEQuestion.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], HSEQuestion.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], HSEQuestion.prototype, "is_reverse", void 0);
HSEQuestion = __decorate([
    (0, typeorm_1.Entity)({ name: 'hse_question' })
], HSEQuestion);
exports.HSEQuestion = HSEQuestion;


/***/ }),
/* 88 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Job = void 0;
const typeorm_1 = __webpack_require__(20);
let Job = class Job {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Job.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], Job.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", Number)
], Job.prototype, "status", void 0);
Job = __decorate([
    (0, typeorm_1.Entity)({ name: 'jobs' })
], Job);
exports.Job = Job;


/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VehicleType = void 0;
const typeorm_1 = __webpack_require__(20);
let VehicleType = class VehicleType {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VehicleType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], VehicleType.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], VehicleType.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], VehicleType.prototype, "pelak", void 0);
VehicleType = __decorate([
    (0, typeorm_1.Entity)({ name: 'vehicle_type' })
], VehicleType);
exports.VehicleType = VehicleType;


/***/ }),
/* 90 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HSEChecklist = void 0;
const typeorm_1 = __webpack_require__(20);
let HSEChecklist = class HSEChecklist {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HSEChecklist.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], HSEChecklist.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEChecklist.prototype, "environment_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEChecklist.prototype, "jobs_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEChecklist.prototype, "vehicle_type_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], HSEChecklist.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], HSEChecklist.prototype, "enable", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEChecklist.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], HSEChecklist.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEChecklist.prototype, "minimum_point", void 0);
HSEChecklist = __decorate([
    (0, typeorm_1.Entity)({ name: 'hse_checklist' })
], HSEChecklist);
exports.HSEChecklist = HSEChecklist;


/***/ }),
/* 91 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HSEChecklistQuestion = void 0;
const typeorm_1 = __webpack_require__(20);
let HSEChecklistQuestion = class HSEChecklistQuestion {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HSEChecklistQuestion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEChecklistQuestion.prototype, "checklist_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEChecklistQuestion.prototype, "question_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEChecklistQuestion.prototype, "weight_factor", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], HSEChecklistQuestion.prototype, "critical", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], HSEChecklistQuestion.prototype, "requirements", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], HSEChecklistQuestion.prototype, "description", void 0);
HSEChecklistQuestion = __decorate([
    (0, typeorm_1.Entity)({ name: 'hse_checklist_question' })
], HSEChecklistQuestion);
exports.HSEChecklistQuestion = HSEChecklistQuestion;


/***/ }),
/* 92 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HSEAllocateQuestion = void 0;
const typeorm_1 = __webpack_require__(20);
let HSEAllocateQuestion = class HSEAllocateQuestion {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HSEAllocateQuestion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEAllocateQuestion.prototype, "question_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEAllocateQuestion.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEAllocateQuestion.prototype, "vehicle_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEAllocateQuestion.prototype, "environment_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], HSEAllocateQuestion.prototype, "from_date", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], HSEAllocateQuestion.prototype, "to_date", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEAllocateQuestion.prototype, "weight_factor", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], HSEAllocateQuestion.prototype, "critical", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], HSEAllocateQuestion.prototype, "requirements", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], HSEAllocateQuestion.prototype, "description", void 0);
HSEAllocateQuestion = __decorate([
    (0, typeorm_1.Entity)({ name: 'hse_allocate_question' })
], HSEAllocateQuestion);
exports.HSEAllocateQuestion = HSEAllocateQuestion;


/***/ }),
/* 93 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Vehicle = void 0;
const typeorm_1 = __webpack_require__(20);
let Vehicle = class Vehicle {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int' }),
    __metadata("design:type", Number)
], Vehicle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], Vehicle.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "organization_code", nullable: true, length: 100 }),
    __metadata("design:type", String)
], Vehicle.prototype, "organization_code", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "type_id_fk", nullable: true }),
    __metadata("design:type", Number)
], Vehicle.prototype, "type_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "system_id_fk", nullable: true }),
    __metadata("design:type", Number)
], Vehicle.prototype, "system_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "style_id_fk", nullable: true }),
    __metadata("design:type", Number)
], Vehicle.prototype, "style_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "plaque1", nullable: true, length: 2 }),
    __metadata("design:type", String)
], Vehicle.prototype, "plaque1", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "plaque2", nullable: true, length: 1 }),
    __metadata("design:type", String)
], Vehicle.prototype, "plaque2", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "plaque3", nullable: true, length: 3 }),
    __metadata("design:type", String)
], Vehicle.prototype, "plaque3", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "plaque4", nullable: true, length: 2 }),
    __metadata("design:type", String)
], Vehicle.prototype, "plaque4", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "engine_number", nullable: true, length: 200 }),
    __metadata("design:type", String)
], Vehicle.prototype, "engine_number", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "chassis_number", nullable: true, length: 200 }),
    __metadata("design:type", String)
], Vehicle.prototype, "chassis_number", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "vin_number", nullable: true, length: 200 }),
    __metadata("design:type", String)
], Vehicle.prototype, "vin_number", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "serial_number", nullable: true, length: 200 }),
    __metadata("design:type", String)
], Vehicle.prototype, "serial_number", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "made_year", nullable: true, length: 5 }),
    __metadata("design:type", String)
], Vehicle.prototype, "made_year", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "color", nullable: true, length: 45 }),
    __metadata("design:type", String)
], Vehicle.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "gearbox", nullable: true, length: 10 }),
    __metadata("design:type", String)
], Vehicle.prototype, "gearbox", void 0);
__decorate([
    (0, typeorm_1.Column)("double", { name: "price", nullable: true }),
    __metadata("design:type", Number)
], Vehicle.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "contract_id_fk", nullable: true }),
    __metadata("design:type", Number)
], Vehicle.prototype, "contract_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "description", nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "card_url", nullable: true, length: 200 }),
    __metadata("design:type", String)
], Vehicle.prototype, "card_url", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "green_card_url", nullable: true, length: 200 }),
    __metadata("design:type", String)
], Vehicle.prototype, "green_card_url", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "ownership_document_url",
        nullable: true,
        length: 200,
    }),
    __metadata("design:type", String)
], Vehicle.prototype, "ownership_document_url", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Vehicle.prototype, "owner_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45, name: 'owner_type' }),
    __metadata("design:type", String)
], Vehicle.prototype, "owner_type", void 0);
Vehicle = __decorate([
    (0, typeorm_1.Entity)({ name: "vehicle" })
], Vehicle);
exports.Vehicle = Vehicle;


/***/ }),
/* 94 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HSEAudit = void 0;
const typeorm_1 = __webpack_require__(20);
let HSEAudit = class HSEAudit {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HSEAudit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEAudit.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEAudit.prototype, "vehicle_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEAudit.prototype, "environment_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEAudit.prototype, "troubleshooter_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], HSEAudit.prototype, "audit_date", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], HSEAudit.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEAudit.prototype, "operator_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], HSEAudit.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], HSEAudit.prototype, "draft", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEAudit.prototype, "minimum_point", void 0);
HSEAudit = __decorate([
    (0, typeorm_1.Entity)({ name: 'hse_audit' })
], HSEAudit);
exports.HSEAudit = HSEAudit;


/***/ }),
/* 95 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HSEAuditQuestion = void 0;
const typeorm_1 = __webpack_require__(20);
let HSEAuditQuestion = class HSEAuditQuestion {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HSEAuditQuestion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEAuditQuestion.prototype, "audit_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], HSEAuditQuestion.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEAuditQuestion.prototype, "question_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], HSEAuditQuestion.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], HSEAuditQuestion.prototype, "critical", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], HSEAuditQuestion.prototype, "weight_factor", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], HSEAuditQuestion.prototype, "requirements", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], HSEAuditQuestion.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], HSEAuditQuestion.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100 }),
    __metadata("design:type", String)
], HSEAuditQuestion.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], HSEAuditQuestion.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], HSEAuditQuestion.prototype, "is_not_related", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], HSEAuditQuestion.prototype, "operator_description", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], HSEAuditQuestion.prototype, "is_reverse", void 0);
HSEAuditQuestion = __decorate([
    (0, typeorm_1.Entity)({ name: 'hse_audit_question' })
], HSEAuditQuestion);
exports.HSEAuditQuestion = HSEAuditQuestion;


/***/ }),
/* 96 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobPermission = void 0;
const typeorm_1 = __webpack_require__(20);
let JobPermission = class JobPermission {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JobPermission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], JobPermission.prototype, "jobs_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], JobPermission.prototype, "permission", void 0);
JobPermission = __decorate([
    (0, typeorm_1.Entity)({ name: 'jobs_permission' })
], JobPermission);
exports.JobPermission = JobPermission;


/***/ }),
/* 97 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobsTaminCode = void 0;
const typeorm_1 = __webpack_require__(20);
let JobsTaminCode = class JobsTaminCode {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JobsTaminCode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], JobsTaminCode.prototype, "jobs_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", String)
], JobsTaminCode.prototype, "code", void 0);
JobsTaminCode = __decorate([
    (0, typeorm_1.Entity)({ name: 'jobs_tamin_code' })
], JobsTaminCode);
exports.JobsTaminCode = JobsTaminCode;


/***/ }),
/* 98 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobsShift = void 0;
const typeorm_1 = __webpack_require__(20);
let JobsShift = class JobsShift {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JobsShift.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 255 }),
    __metadata("design:type", String)
], JobsShift.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], JobsShift.prototype, "time_off_days", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], JobsShift.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 40 }),
    __metadata("design:type", String)
], JobsShift.prototype, "timespan", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], JobsShift.prototype, "calculate_public_holidays", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], JobsShift.prototype, "calculate_extra_work", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], JobsShift.prototype, "calculate_off_work", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], JobsShift.prototype, "public_holidays_are_off", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], JobsShift.prototype, "calculate_night", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], JobsShift.prototype, "calculate_friday", void 0);
JobsShift = __decorate([
    (0, typeorm_1.Entity)({ name: 'jobs_shift' })
], JobsShift);
exports.JobsShift = JobsShift;


/***/ }),
/* 99 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobsShiftPattern = void 0;
const typeorm_1 = __webpack_require__(20);
let JobsShiftPattern = class JobsShiftPattern {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JobsShiftPattern.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], JobsShiftPattern.prototype, "shift_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], JobsShiftPattern.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], JobsShiftPattern.prototype, "days", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], JobsShiftPattern.prototype, "from_time", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], JobsShiftPattern.prototype, "to_time", void 0);
JobsShiftPattern = __decorate([
    (0, typeorm_1.Entity)({ name: 'jobs_shift_pattern' })
], JobsShiftPattern);
exports.JobsShiftPattern = JobsShiftPattern;


/***/ }),
/* 100 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobChart = void 0;
const typeorm_1 = __webpack_require__(20);
let JobChart = class JobChart {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JobChart.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], JobChart.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], JobChart.prototype, "contract_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], JobChart.prototype, "apply_date", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], JobChart.prototype, "enable", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], JobChart.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], JobChart.prototype, "company_id_fk", void 0);
JobChart = __decorate([
    (0, typeorm_1.Entity)({ name: 'jobs_chart' })
], JobChart);
exports.JobChart = JobChart;


/***/ }),
/* 101 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobChartNode = void 0;
const typeorm_1 = __webpack_require__(20);
let JobChartNode = class JobChartNode {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JobChartNode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], JobChartNode.prototype, "chart_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], JobChartNode.prototype, "count", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], JobChartNode.prototype, "jobs_tamin_code_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], JobChartNode.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], JobChartNode.prototype, "parent_id_fk", void 0);
JobChartNode = __decorate([
    (0, typeorm_1.Entity)({ name: 'jobs_chart_node' })
], JobChartNode);
exports.JobChartNode = JobChartNode;


/***/ }),
/* 102 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompanyBoardMember = void 0;
const company_board_member_enum_1 = __webpack_require__(103);
const typeorm_1 = __webpack_require__(20);
let CompanyBoardMember = class CompanyBoardMember {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CompanyBoardMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], CompanyBoardMember.prototype, "company_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], CompanyBoardMember.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45 }),
    __metadata("design:type", typeof (_a = typeof company_board_member_enum_1.CompanyBoardMemberRole !== "undefined" && company_board_member_enum_1.CompanyBoardMemberRole) === "function" ? _a : Object)
], CompanyBoardMember.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", typeof (_b = typeof String !== "undefined" && String) === "function" ? _b : Object)
], CompanyBoardMember.prototype, "signature_rights", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], CompanyBoardMember.prototype, "from_date", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], CompanyBoardMember.prototype, "to_date", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], CompanyBoardMember.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], CompanyBoardMember.prototype, "enabled", void 0);
CompanyBoardMember = __decorate([
    (0, typeorm_1.Entity)({ name: 'company_board_member' })
], CompanyBoardMember);
exports.CompanyBoardMember = CompanyBoardMember;


/***/ }),
/* 103 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompanyBoardMemberRole = void 0;
var CompanyBoardMemberRole;
(function (CompanyBoardMemberRole) {
    CompanyBoardMemberRole["managing_director"] = "MANAGING_DIRECTOR";
    CompanyBoardMemberRole["md_board_of_directors"] = "MD_BOARD_OF_DIRECTORS";
    CompanyBoardMemberRole["md_chairman"] = "MD_CHAIRMAN";
    CompanyBoardMemberRole["md_vice_chairman"] = "MD_VICE_CHAIRMAN";
    CompanyBoardMemberRole["chairman"] = "CHAIRMAN";
    CompanyBoardMemberRole["vice_chairman"] = "VICE_CHAIRMAN";
    CompanyBoardMemberRole["board_of_directors"] = "BOARD_OF_DIRECTORS";
    CompanyBoardMemberRole["supervisor"] = "SUPERVISOR";
})(CompanyBoardMemberRole = exports.CompanyBoardMemberRole || (exports.CompanyBoardMemberRole = {}));


/***/ }),
/* 104 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Task = void 0;
const typeorm_1 = __webpack_require__(20);
let Task = class Task {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Task.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 255 }),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45, name: 'task_type' }),
    __metadata("design:type", String)
], Task.prototype, "taskType", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'related_task' }),
    __metadata("design:type", Number)
], Task.prototype, "relatedTask", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true, name: 'due_date' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Task.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100, name: 'if_task_failed' }),
    __metadata("design:type", String)
], Task.prototype, "ifTaskFailed", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Task.prototype, "point", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'negative_point' }),
    __metadata("design:type", Number)
], Task.prototype, "negativePoint", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Task.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Task.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], Task.prototype, "approved", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 255 }),
    __metadata("design:type", String)
], Task.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 255 }),
    __metadata("design:type", String)
], Task.prototype, "punishment", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 500, name: 'page_url' }),
    __metadata("design:type", String)
], Task.prototype, "pageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 255, name: 'approve_condition' }),
    __metadata("design:type", String)
], Task.prototype, "approveCondition", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, name: 'approver_jobs_ids' }),
    __metadata("design:type", String)
], Task.prototype, "approverJobsId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'approver_personnel_id_fk' }),
    __metadata("design:type", Number)
], Task.prototype, "approverPersonnelId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45, name: 'approve_jobs_sequence' }),
    __metadata("design:type", String)
], Task.prototype, "approveJobsSequence", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'task_condition_id_fk' }),
    __metadata("design:type", Number)
], Task.prototype, "conditionId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'destination_record_id' }),
    __metadata("design:type", Number)
], Task.prototype, "destinationRecordId", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true, name: 'referable' }),
    __metadata("design:type", Number)
], Task.prototype, "referable", void 0);
Task = __decorate([
    (0, typeorm_1.Entity)({ name: 'tasks' })
], Task);
exports.Task = Task;


/***/ }),
/* 105 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskMember = void 0;
const typeorm_1 = __webpack_require__(20);
let TaskMember = class TaskMember {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TaskMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'task_id_fk' }),
    __metadata("design:type", Number)
], TaskMember.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'personnel_id_fk' }),
    __metadata("design:type", Number)
], TaskMember.prototype, "userId", void 0);
TaskMember = __decorate([
    (0, typeorm_1.Entity)({ name: 'tasks_member' })
], TaskMember);
exports.TaskMember = TaskMember;


/***/ }),
/* 106 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TableName = void 0;
const typeorm_1 = __webpack_require__(20);
let TableName = class TableName {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TableName.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 200 }),
    __metadata("design:type", String)
], TableName.prototype, "table_name", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 300 }),
    __metadata("design:type", String)
], TableName.prototype, "title", void 0);
TableName = __decorate([
    (0, typeorm_1.Entity)({ name: 'table_name' })
], TableName);
exports.TableName = TableName;


/***/ }),
/* 107 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ColumnName = void 0;
const typeorm_1 = __webpack_require__(20);
let ColumnName = class ColumnName {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ColumnName.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'table_name_id_fk' }),
    __metadata("design:type", Number)
], ColumnName.prototype, "tableId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 255, name: 'column_name' }),
    __metadata("design:type", String)
], ColumnName.prototype, "columnName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 255 }),
    __metadata("design:type", String)
], ColumnName.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 255 }),
    __metadata("design:type", String)
], ColumnName.prototype, "type", void 0);
ColumnName = __decorate([
    (0, typeorm_1.Entity)({ name: 'column_name' })
], ColumnName);
exports.ColumnName = ColumnName;


/***/ }),
/* 108 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskCondition = void 0;
const table_name_schema_1 = __webpack_require__(106);
const typeorm_1 = __webpack_require__(20);
let TaskCondition = class TaskCondition {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TaskCondition.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'table_name_id_fk' }),
    __metadata("design:type", Number)
], TaskCondition.prototype, "tableId", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true, name: '_condition' }),
    __metadata("design:type", String)
], TaskCondition.prototype, "condition", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 500 }),
    __metadata("design:type", String)
], TaskCondition.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], TaskCondition.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'seconds_after_create' }),
    __metadata("design:type", Number)
], TaskCondition.prototype, "secondsAfterCreate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 100, name: 'if_task_failed' }),
    __metadata("design:type", String)
], TaskCondition.prototype, "ifTaskFailed", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], TaskCondition.prototype, "point", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'negative_point' }),
    __metadata("design:type", Number)
], TaskCondition.prototype, "negativePoint", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 500, name: 'personnel_members' }),
    __metadata("design:type", String)
], TaskCondition.prototype, "personnelMembers", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 500, name: 'jobs' }),
    __metadata("design:type", String)
], TaskCondition.prototype, "jobs", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], TaskCondition.prototype, "enable", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 255, nullable: true }),
    __metadata("design:type", String)
], TaskCondition.prototype, "punishment", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 255 }),
    __metadata("design:type", String)
], TaskCondition.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 500, name: 'personnel_to_inform' }),
    __metadata("design:type", String)
], TaskCondition.prototype, "personnelToInform", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, name: 'sms_notification' }),
    __metadata("design:type", String)
], TaskCondition.prototype, "smsNotification", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 500, name: 'page_url' }),
    __metadata("design:type", String)
], TaskCondition.prototype, "pageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 255, name: 'approve_condition' }),
    __metadata("design:type", String)
], TaskCondition.prototype, "approveCondition", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, name: 'approver_jobs_ids', length: 255 }),
    __metadata("design:type", String)
], TaskCondition.prototype, "approverJobsId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45, name: 'approve_jobs_sequence' }),
    __metadata("design:type", String)
], TaskCondition.prototype, "approveJobsSequence", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'approver_personnel_id_fk' }),
    __metadata("design:type", Number)
], TaskCondition.prototype, "approverPersonnelId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'creator_id_fk' }),
    __metadata("design:type", Number)
], TaskCondition.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true, name: 'referable' }),
    __metadata("design:type", Number)
], TaskCondition.prototype, "referable", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => table_name_schema_1.TableName),
    (0, typeorm_1.JoinColumn)([
        {
            name: 'table_name_id_fk',
            referencedColumnName: 'id'
        }
    ]),
    __metadata("design:type", typeof (_a = typeof table_name_schema_1.TableName !== "undefined" && table_name_schema_1.TableName) === "function" ? _a : Object)
], TaskCondition.prototype, "tableInfo", void 0);
TaskCondition = __decorate([
    (0, typeorm_1.Entity)({ name: 'tasks_condition' })
], TaskCondition);
exports.TaskCondition = TaskCondition;


/***/ }),
/* 109 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TestTable = void 0;
const typeorm_1 = __webpack_require__(20);
let TestTable = class TestTable {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TestTable.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 255 }),
    __metadata("design:type", String)
], TestTable.prototype, "first_name", void 0);
TestTable = __decorate([
    (0, typeorm_1.Entity)({ name: 'test_table' })
], TestTable);
exports.TestTable = TestTable;


/***/ }),
/* 110 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksScheduleDaily = void 0;
const typeorm_1 = __webpack_require__(20);
let TasksScheduleDaily = class TasksScheduleDaily {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TasksScheduleDaily.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'tasks_condition_id_fk' }),
    __metadata("design:type", Number)
], TasksScheduleDaily.prototype, "conditionId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], TasksScheduleDaily.prototype, "hour", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], TasksScheduleDaily.prototype, "minute", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true, name: 'from_date' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], TasksScheduleDaily.prototype, "fromDate", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true, name: 'to_date' }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], TasksScheduleDaily.prototype, "toDate", void 0);
TasksScheduleDaily = __decorate([
    (0, typeorm_1.Entity)({ name: 'tasks_schedule_daily' })
], TasksScheduleDaily);
exports.TasksScheduleDaily = TasksScheduleDaily;


/***/ }),
/* 111 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksScheduleMonthly = void 0;
const typeorm_1 = __webpack_require__(20);
let TasksScheduleMonthly = class TasksScheduleMonthly {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TasksScheduleMonthly.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'tasks_condition_id_fk' }),
    __metadata("design:type", Number)
], TasksScheduleMonthly.prototype, "conditionId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], TasksScheduleMonthly.prototype, "day", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true, name: 'from_date' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], TasksScheduleMonthly.prototype, "fromDate", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true, name: 'to_date' }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], TasksScheduleMonthly.prototype, "toDate", void 0);
TasksScheduleMonthly = __decorate([
    (0, typeorm_1.Entity)({ name: 'tasks_schedule_monthly' })
], TasksScheduleMonthly);
exports.TasksScheduleMonthly = TasksScheduleMonthly;


/***/ }),
/* 112 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksScheduleYearly = void 0;
const typeorm_1 = __webpack_require__(20);
let TasksScheduleYearly = class TasksScheduleYearly {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TasksScheduleYearly.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'tasks_condition_id_fk' }),
    __metadata("design:type", Number)
], TasksScheduleYearly.prototype, "conditionId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, }),
    __metadata("design:type", Number)
], TasksScheduleYearly.prototype, "month", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], TasksScheduleYearly.prototype, "day", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true, name: 'from_date' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], TasksScheduleYearly.prototype, "fromDate", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true, name: 'to_date' }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], TasksScheduleYearly.prototype, "toDate", void 0);
TasksScheduleYearly = __decorate([
    (0, typeorm_1.Entity)({ name: 'tasks_schedule_yearly' })
], TasksScheduleYearly);
exports.TasksScheduleYearly = TasksScheduleYearly;


/***/ }),
/* 113 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksToInform = void 0;
const typeorm_1 = __webpack_require__(20);
let TasksToInform = class TasksToInform {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TasksToInform.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'tasks_id_fk' }),
    __metadata("design:type", Number)
], TasksToInform.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'personnel_id_fk' }),
    __metadata("design:type", Number)
], TasksToInform.prototype, "personnelId", void 0);
TasksToInform = __decorate([
    (0, typeorm_1.Entity)({ name: 'tasks_toinform' })
], TasksToInform);
exports.TasksToInform = TasksToInform;


/***/ }),
/* 114 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksScheduleWeekly = void 0;
const typeorm_1 = __webpack_require__(20);
let TasksScheduleWeekly = class TasksScheduleWeekly {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TasksScheduleWeekly.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'tasks_condition_id_fk' }),
    __metadata("design:type", Number)
], TasksScheduleWeekly.prototype, "conditionId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true, length: 45, name: 'day_name' }),
    __metadata("design:type", String)
], TasksScheduleWeekly.prototype, "dayName", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], TasksScheduleWeekly.prototype, "hour", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], TasksScheduleWeekly.prototype, "minute", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true, name: 'from_date' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], TasksScheduleWeekly.prototype, "fromDate", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true, name: 'to_date' }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], TasksScheduleWeekly.prototype, "toDate", void 0);
TasksScheduleWeekly = __decorate([
    (0, typeorm_1.Entity)({ name: 'tasks_schedule_weekly' })
], TasksScheduleWeekly);
exports.TasksScheduleWeekly = TasksScheduleWeekly;


/***/ }),
/* 115 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksSMSNotification = void 0;
const typeorm_1 = __webpack_require__(20);
let TasksSMSNotification = class TasksSMSNotification {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TasksSMSNotification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'personnel_id_fk' }),
    __metadata("design:type", Number)
], TasksSMSNotification.prototype, "personnelId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'tasks_id_fk' }),
    __metadata("design:type", Number)
], TasksSMSNotification.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], TasksSMSNotification.prototype, "percentage", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], TasksSMSNotification.prototype, "date", void 0);
TasksSMSNotification = __decorate([
    (0, typeorm_1.Entity)({ name: 'tasks_sms_notification' })
], TasksSMSNotification);
exports.TasksSMSNotification = TasksSMSNotification;


/***/ }),
/* 116 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskApprover = void 0;
const typeorm_1 = __webpack_require__(20);
let TaskApprover = class TaskApprover {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TaskApprover.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'personnel_id_fk', nullable: true }),
    __metadata("design:type", Number)
], TaskApprover.prototype, "personnelId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'task_id_fk' }),
    __metadata("design:type", Number)
], TaskApprover.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], TaskApprover.prototype, "approved", void 0);
TaskApprover = __decorate([
    (0, typeorm_1.Entity)({ name: 'tasks_approver' })
], TaskApprover);
exports.TaskApprover = TaskApprover;


/***/ }),
/* 117 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksNotMyDuty = void 0;
const typeorm_1 = __webpack_require__(20);
let TasksNotMyDuty = class TasksNotMyDuty {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TasksNotMyDuty.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'task_id_fk' }),
    __metadata("design:type", Number)
], TasksNotMyDuty.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true, name: 'personnel_id_fk' }),
    __metadata("design:type", Number)
], TasksNotMyDuty.prototype, "personnelId", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], TasksNotMyDuty.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], TasksNotMyDuty.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], TasksNotMyDuty.prototype, "approved", void 0);
TasksNotMyDuty = __decorate([
    (0, typeorm_1.Entity)({ name: 'tasks_notmyduty' })
], TasksNotMyDuty);
exports.TasksNotMyDuty = TasksNotMyDuty;


/***/ }),
/* 118 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DamageServiceModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const personnel_module_1 = __webpack_require__(10);
const damageService_controller_1 = __webpack_require__(119);
const damageService_schema_1 = __webpack_require__(72);
const damageService_service_1 = __webpack_require__(120);
let DamageServiceModule = class DamageServiceModule {
};
DamageServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            personnel_module_1.PersonnelModule,
            typeorm_1.TypeOrmModule.forFeature([
                damageService_schema_1.DamageService
            ])
        ],
        controllers: [damageService_controller_1.DamageServiceController],
        providers: [damageService_service_1.DamageServiceService],
        exports: [damageService_service_1.DamageServiceService]
    })
], DamageServiceModule);
exports.DamageServiceModule = DamageServiceModule;


/***/ }),
/* 119 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DamageServiceController = void 0;
const common_1 = __webpack_require__(4);
const auth_guards_1 = __webpack_require__(16);
const damageService_service_1 = __webpack_require__(120);
const create_dto_1 = __webpack_require__(121);
let DamageServiceController = class DamageServiceController {
    constructor(service) {
        this.service = service;
    }
    async create(body) {
        return await this.service.create(body);
    }
    async detail(id) {
        return await this.service.detail(Number(id));
    }
    async list(type, companyId, contractId) {
        return await this.service.list(type, Number(companyId), Number(contractId));
    }
    async edit(id, body) {
        return await this.service.edit(Number(id), body);
    }
    async delete(id) {
        return await this.service.delete(Number(id));
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_dto_1.CreateDamageServiceDTO !== "undefined" && create_dto_1.CreateDamageServiceDTO) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], DamageServiceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DamageServiceController.prototype, "detail", null);
__decorate([
    (0, common_1.Get)('/list/:type/:companyId/:contractId'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('companyId')),
    __param(2, (0, common_1.Param)('contractId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DamageServiceController.prototype, "list", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof create_dto_1.CreateDamageServiceDTO !== "undefined" && create_dto_1.CreateDamageServiceDTO) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], DamageServiceController.prototype, "edit", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DamageServiceController.prototype, "delete", null);
DamageServiceController = __decorate([
    (0, common_1.Controller)('damage-service'),
    __metadata("design:paramtypes", [typeof (_c = typeof damageService_service_1.DamageServiceService !== "undefined" && damageService_service_1.DamageServiceService) === "function" ? _c : Object])
], DamageServiceController);
exports.DamageServiceController = DamageServiceController;


/***/ }),
/* 120 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DamageServiceService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(20);
const damageService_schema_1 = __webpack_require__(72);
let DamageServiceService = class DamageServiceService {
    constructor(model) {
        this.model = model;
    }
    async create(dto) {
        try {
            const _dto = dto;
            _dto.hr_approved = dto.hr_approved == true ? 1 : 0;
            const entity = await this.model.createQueryBuilder()
                .insert()
                .values([
                Object.assign({ personnel_id_fk: Number(dto.personnel_id) }, _dto)
            ])
                .execute();
            return {
                id: entity.identifiers[0].id
            };
        }
        catch (err) {
            throw err;
        }
    }
    async detail(id) {
        try {
            return await this.model.createQueryBuilder()
                .where('id=:id', { id: id })
                .getOne();
        }
        catch (err) {
            throw err;
        }
    }
    async list(type, companyId, contractId) {
        try {
            const query = this.model.createQueryBuilder('t1')
                .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
                .select([
                't1.id as id',
                'concat(t2.first_name, " ", t2.last_name) as name',
                't2.national_number as national_number',
                't1.type_service_damage as type_service_damage',
                't1.date as date',
                `IF(t1.manager_approved = 1 , 'تایید نهایی', IF(t1.hr_admin_approved = 1, 'تایید مدیر منابع انسانی', IF(t1.project_admin_approved = 1, 'تایید مدیر پروژه', IF(hr_approved = 1, 'تایید منابع انسانی', 'هنوز به تایید هیچ بخشی نرسیده')))) as status`
            ])
                .where('t1.type = :type', { type: type });
            if (companyId != -1) {
                query.andWhere('t2.company_id_fk = :cid', {
                    cid: companyId
                });
            }
            if (contractId != -1) {
                query.andWhere('t2.contract_id_fk=:cid', {
                    cid: contractId
                });
            }
            return await query.getRawMany();
        }
        catch (err) {
            throw err;
        }
    }
    async edit(id, dto) {
        try {
            const _dto = Object.assign({}, dto);
            _dto.personnel_id_fk = Number(dto.personnel_id);
            delete _dto.personnel_id;
            return await this.model.createQueryBuilder()
                .update()
                .set(Object.assign({}, _dto))
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async delete(id) {
        try {
            return await this.model.createQueryBuilder()
                .delete()
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
};
DamageServiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(damageService_schema_1.DamageService)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], DamageServiceService);
exports.DamageServiceService = DamageServiceService;


/***/ }),
/* 121 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateDamageServiceDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class CreateDamageServiceDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['خدمت', 'خسارت']),
    __metadata("design:type", String)
], CreateDamageServiceDTO.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDamageServiceDTO.prototype, "personnel_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreateDamageServiceDTO.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDamageServiceDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDamageServiceDTO.prototype, "type_service_damage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDamageServiceDTO.prototype, "type_reward_penalty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDamageServiceDTO.prototype, "amount_reward_penalty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDamageServiceDTO.prototype, "hr_approved", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDamageServiceDTO.prototype, "project_admin_approved", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDamageServiceDTO.prototype, "manager_approved", void 0);
exports.CreateDamageServiceDTO = CreateDamageServiceDTO;


/***/ }),
/* 122 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MissionModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const personnel_module_1 = __webpack_require__(10);
const mission_schema_1 = __webpack_require__(76);
const mission_service_1 = __webpack_require__(123);
const misson_controller_1 = __webpack_require__(124);
let MissionModule = class MissionModule {
};
MissionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            personnel_module_1.PersonnelModule,
            typeorm_1.TypeOrmModule.forFeature([
                mission_schema_1.PersonnelMission
            ])
        ],
        controllers: [misson_controller_1.MissionController],
        providers: [mission_service_1.MissionService]
    })
], MissionModule);
exports.MissionModule = MissionModule;


/***/ }),
/* 123 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MissionService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(20);
const mission_schema_1 = __webpack_require__(76);
let MissionService = class MissionService {
    constructor(model) {
        this.model = model;
    }
    async create(dto) {
        try {
            const _dto = Object.assign({}, dto);
            delete _dto.personnel_id;
            _dto.personnel_id_fk = dto.personnel_id;
            return await this.model.createQueryBuilder()
                .insert()
                .values([
                Object.assign({}, _dto)
            ])
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async update(id, dto) {
        try {
            const _dto = Object.assign({}, dto);
            _dto.personnel_id_fk = dto.personnel_id;
            delete _dto.personnel_id;
            return await this.model.createQueryBuilder()
                .update()
                .set(Object.assign({}, _dto))
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async updateStatus(id, status) {
        try {
            return await this.model.createQueryBuilder()
                .update()
                .set({
                status: status
            })
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async delete(id) {
        try {
            return await this.model.createQueryBuilder()
                .delete()
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async detail(id) {
        try {
            return await this.model.createQueryBuilder('t1')
                .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
                .select([
                't1.*',
                't2.first_name as first_name',
                't2.last_name as last_name',
                't2.national_number as national_number',
            ])
                .where('t1.id = :id', { id: id })
                .getRawOne();
        }
        catch (err) {
            throw err;
        }
    }
    async list() {
        try {
            return await this.model.createQueryBuilder('t1')
                .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
                .select([
                't1.*',
                't2.first_name as first_name',
                't2.last_name as last_name',
                't2.national_number as national_number',
            ])
                .getRawMany();
        }
        catch (err) {
            throw err;
        }
    }
};
MissionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(mission_schema_1.PersonnelMission)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], MissionService);
exports.MissionService = MissionService;


/***/ }),
/* 124 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MissionController = void 0;
const common_1 = __webpack_require__(4);
const auth_guards_1 = __webpack_require__(16);
const create_mission_dto_1 = __webpack_require__(125);
const mission_service_1 = __webpack_require__(123);
let MissionController = class MissionController {
    constructor(service) {
        this.service = service;
    }
    async getDetail(id) {
        return await this.service.detail(Number(id));
    }
    async getList() {
        return await this.service.list();
    }
    async create(body) {
        return await this.service.create(body);
    }
    async update(id, body) {
        return await this.service.update(Number(id), body);
    }
    async delete(id) {
        return await this.service.delete(Number(id));
    }
};
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MissionController.prototype, "getDetail", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MissionController.prototype, "getList", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_mission_dto_1.CreateMissionDTO !== "undefined" && create_mission_dto_1.CreateMissionDTO) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], MissionController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof create_mission_dto_1.CreateMissionDTO !== "undefined" && create_mission_dto_1.CreateMissionDTO) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], MissionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MissionController.prototype, "delete", null);
MissionController = __decorate([
    (0, common_1.Controller)('mission'),
    __metadata("design:paramtypes", [typeof (_c = typeof mission_service_1.MissionService !== "undefined" && mission_service_1.MissionService) === "function" ? _c : Object])
], MissionController);
exports.MissionController = MissionController;


/***/ }),
/* 125 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateMissionDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class CreateMissionDTO {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMissionDTO.prototype, "personnel_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMissionDTO.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMissionDTO.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMissionDTO.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreateMissionDTO.prototype, "from_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], CreateMissionDTO.prototype, "to_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMissionDTO.prototype, "residency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMissionDTO.prototype, "vehicle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMissionDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMissionDTO.prototype, "status", void 0);
exports.CreateMissionDTO = CreateMissionDTO;


/***/ }),
/* 126 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimeOffModule = void 0;
const common_1 = __webpack_require__(4);
const platform_express_1 = __webpack_require__(11);
const typeorm_1 = __webpack_require__(9);
const multer_1 = __webpack_require__(12);
const timeoff_schema_1 = __webpack_require__(73);
const moment = __webpack_require__(52);
const path_1 = __webpack_require__(53);
const timeoff_controller_1 = __webpack_require__(127);
const timeoff_service_1 = __webpack_require__(129);
const personnel_module_1 = __webpack_require__(10);
let TimeOffModule = class TimeOffModule {
};
TimeOffModule = __decorate([
    (0, common_1.Module)({
        imports: [
            personnel_module_1.PersonnelModule,
            typeorm_1.TypeOrmModule.forFeature([
                timeoff_schema_1.TimeOff
            ]),
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: './uploads/timeoff',
                    filename: (req, file, cb) => {
                        cb(null, `${moment().utc(true).format('YYMMDDHHMMSSS')}${(0, path_1.extname)(file.originalname)}`);
                    }
                }),
                limits: {
                    fileSize: 31457280
                }
            })
        ],
        controllers: [timeoff_controller_1.TimeOffController],
        providers: [timeoff_service_1.TimeOffService]
    })
], TimeOffModule);
exports.TimeOffModule = TimeOffModule;


/***/ }),
/* 127 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimeOffController = void 0;
const common_1 = __webpack_require__(4);
const platform_express_1 = __webpack_require__(11);
const auth_guards_1 = __webpack_require__(16);
const create_timeoff_dto_1 = __webpack_require__(128);
const timeoff_service_1 = __webpack_require__(129);
const express_1 = __webpack_require__(39);
const delete_timeoff_dto_1 = __webpack_require__(130);
let TimeOffController = class TimeOffController {
    constructor(service) {
        this.service = service;
    }
    async create(body, file) {
        let _file = null;
        if (file) {
            _file = file.filename;
        }
        return await this.service.create(body, _file);
    }
    async update(id, body, req, file) {
        let _file = null;
        if (file) {
            _file = file.filename;
        }
        return await this.service.update(Number(id), req.user.id, body, _file);
    }
    async updateStatus(id, body) {
        if (!body.status) {
            throw new common_1.HttpException('status could not be found', 400);
        }
        return await this.service.updateStatus(Number(id), body.status);
    }
    async deleteMany(body, req) {
        return await this.service.deleteMany(body, req.user);
    }
    async detail(id, req) {
        return await this.service.detail(Number(id), req.user.id);
    }
    async list(req) {
        return await this.service.list(req.user);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_timeoff_dto_1.CreateTimeOffDTO !== "undefined" && create_timeoff_dto_1.CreateTimeOffDTO) === "function" ? _a : Object, typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], TimeOffController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_d = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _d : Object, typeof (_f = typeof Express !== "undefined" && (_e = Express.Multer) !== void 0 && _e.File) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], TimeOffController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('/status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TimeOffController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof delete_timeoff_dto_1.DeleteTimeOffDTO !== "undefined" && delete_timeoff_dto_1.DeleteTimeOffDTO) === "function" ? _g : Object, typeof (_h = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], TimeOffController.prototype, "deleteMany", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_j = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], TimeOffController.prototype, "detail", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], TimeOffController.prototype, "list", null);
TimeOffController = __decorate([
    (0, common_1.Controller)('time-off'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __metadata("design:paramtypes", [typeof (_l = typeof timeoff_service_1.TimeOffService !== "undefined" && timeoff_service_1.TimeOffService) === "function" ? _l : Object])
], TimeOffController);
exports.TimeOffController = TimeOffController;


/***/ }),
/* 128 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTimeOffDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class CreateTimeOffDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateTimeOffDTO.prototype, "personnel_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['استحقاقی', 'استعلاجی', 'تشویقی', 'بدون حقوق']),
    __metadata("design:type", String)
], CreateTimeOffDTO.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['روزانه', 'ساعتی']),
    __metadata("design:type", String)
], CreateTimeOffDTO.prototype, "request_type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreateTimeOffDTO.prototype, "from_date", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], CreateTimeOffDTO.prototype, "to_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTimeOffDTO.prototype, "description", void 0);
exports.CreateTimeOffDTO = CreateTimeOffDTO;


/***/ }),
/* 129 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimeOffService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(20);
const timeoff_schema_1 = __webpack_require__(73);
let TimeOffService = class TimeOffService {
    constructor(model) {
        this.model = model;
    }
    async create(dto, fileUrl) {
        try {
            const _dto = Object.assign({}, dto);
            _dto.personnel_id_fk = Number(dto.personnel_id);
            delete _dto.personnel_id;
            if (fileUrl) {
                _dto.file_url = fileUrl;
            }
            const timeOff = await this.model.createQueryBuilder()
                .insert()
                .values([
                _dto
            ])
                .execute();
            return timeOff.identifiers[0];
        }
        catch (err) {
            throw err;
        }
    }
    async update(id, userId, dto, fileUrl) {
        try {
            const timeOff = await this.model.createQueryBuilder()
                .select()
                .where('id = :id and personnel_id_fk = :pid', {
                id: id,
                pid: userId
            })
                .getOne();
            if (timeOff) {
                const _dto = Object.assign({}, dto);
                delete _dto.personnel_id;
                if (fileUrl) {
                    _dto.file_url = fileUrl;
                }
                return await this.model.createQueryBuilder()
                    .update()
                    .set(_dto)
                    .where('id = :id', { id: id })
                    .execute();
            }
            else {
                throw new common_1.HttpException('time off could not be found', 400);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async updateStatus(id, status) {
        try {
            return await this.model.createQueryBuilder()
                .update()
                .set({
                status: status
            })
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async deleteMany(dto, user) {
        try {
            if (user.isSuper) {
                dto.ids.forEach(async (id) => {
                    await this.model.createQueryBuilder()
                        .delete()
                        .where('id = :id and status is null', { id: id })
                        .execute();
                });
            }
            else {
                dto.ids.forEach(async (id) => {
                    await this.model.createQueryBuilder()
                        .delete()
                        .where('id = :id and status is null and personnel_id_fk= :pid', { id: id, pid: user.id })
                        .execute();
                });
            }
        }
        catch (err) {
            throw err;
        }
    }
    async detail(id, userId) {
        try {
            return await this.model.createQueryBuilder()
                .where('id = :id and personnel_id_fk = :pid', {
                id: id,
                pid: userId
            })
                .getOne();
        }
        catch (err) {
            throw err;
        }
    }
    async list(user) {
        try {
            if (user.isSuper) {
                return await this.model.createQueryBuilder('t1')
                    .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
                    .select([
                    't1.*',
                    'TIME_TO_SEC(TIMEDIFF(t1.to_date, t1.from_date)) as seconds',
                    't2.first_name as first_name',
                    't2.last_name as last_name',
                    't2.national_number as national_number'
                ])
                    .orderBy('t1.status', 'ASC')
                    .getRawMany();
            }
            else {
                return await this.model.createQueryBuilder('t1')
                    .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
                    .where('t1.personnel_id_fk = :pid', {
                    pid: user.id
                })
                    .select([
                    't1.*',
                    'TIME_TO_SEC(TIMEDIFF(t1.to_date, t1.from_date)) as seconds',
                    't2.first_name as first_name',
                    't2.last_name as last_name',
                    't2.national_number as national_number'
                ])
                    .orderBy('t1.status', 'ASC')
                    .getRawMany();
            }
        }
        catch (err) {
            throw err;
        }
    }
};
TimeOffService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(timeoff_schema_1.TimeOff)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], TimeOffService);
exports.TimeOffService = TimeOffService;


/***/ }),
/* 130 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteTimeOffDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class DeleteTimeOffDTO {
}
__decorate([
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], DeleteTimeOffDTO.prototype, "ids", void 0);
exports.DeleteTimeOffDTO = DeleteTimeOffDTO;


/***/ }),
/* 131 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContractProgressModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const contractProductionReport_module_1 = __webpack_require__(132);
const contractProgress_schema_1 = __webpack_require__(83);
const contractProgress_service_1 = __webpack_require__(134);
let ContractProgressModule = class ContractProgressModule {
};
ContractProgressModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                contractProgress_schema_1.ContractProgress
            ]),
            contractProductionReport_module_1.ContractProductionReportModule
        ],
        controllers: [],
        providers: [contractProgress_service_1.ContractProgressService],
        exports: [contractProgress_service_1.ContractProgressService]
    })
], ContractProgressModule);
exports.ContractProgressModule = ContractProgressModule;


/***/ }),
/* 132 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContractProductionReportModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const contractProductionReport_schema_1 = __webpack_require__(84);
const contractProductionReport_service_1 = __webpack_require__(133);
let ContractProductionReportModule = class ContractProductionReportModule {
};
ContractProductionReportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                contractProductionReport_schema_1.ContractProductionReport
            ])
        ],
        providers: [contractProductionReport_service_1.ContractProductionReportService],
        controllers: [],
        exports: [contractProductionReport_service_1.ContractProductionReportService]
    })
], ContractProductionReportModule);
exports.ContractProductionReportModule = ContractProductionReportModule;


/***/ }),
/* 133 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContractProductionReportService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(20);
const contractProductionReport_schema_1 = __webpack_require__(84);
let ContractProductionReportService = class ContractProductionReportService {
    constructor(model) {
        this.model = model;
    }
    async create(dto) {
        try {
            const _dto = dto;
            _dto.edit_by_admin = dto.edit_by_admin == true ? 1 : 0;
            return await this.model.createQueryBuilder()
                .insert()
                .values([
                Object.assign({}, _dto)
            ])
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async deleteByContractId(id) {
        try {
            return await this.model.createQueryBuilder()
                .delete()
                .where('contract_id_fk = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
};
ContractProductionReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contractProductionReport_schema_1.ContractProductionReport)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], ContractProductionReportService);
exports.ContractProductionReportService = ContractProductionReportService;


/***/ }),
/* 134 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContractProgressService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(20);
const contractProgress_schema_1 = __webpack_require__(83);
let ContractProgressService = class ContractProgressService {
    constructor(model) {
        this.model = model;
    }
    async create(dto) {
        try {
            return await this.model.createQueryBuilder()
                .insert()
                .values([
                Object.assign(Object.assign({}, dto), { status: null, edit_by_admin: 0 })
            ])
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async deleteAllByContractId(id) {
        try {
            await this.model.createQueryBuilder()
                .delete()
                .where('contract_id_fk = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
};
ContractProgressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contractProgress_schema_1.ContractProgress)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], ContractProgressService);
exports.ContractProgressService = ContractProgressService;


/***/ }),
/* 135 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContractModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const contractPeymanReport_module_1 = __webpack_require__(136);
const contractProductionReport_module_1 = __webpack_require__(132);
const contractProgress_module_1 = __webpack_require__(131);
const personnel_module_1 = __webpack_require__(10);
const contract_controller_1 = __webpack_require__(138);
const contract_schema_1 = __webpack_require__(86);
const contract_service_1 = __webpack_require__(139);
let ContractModule = class ContractModule {
};
ContractModule = __decorate([
    (0, common_1.Module)({
        imports: [
            personnel_module_1.PersonnelModule,
            contractProgress_module_1.ContractProgressModule,
            contractProductionReport_module_1.ContractProductionReportModule,
            contractPeymanReport_module_1.ContractPeymanReportModule,
            typeorm_1.TypeOrmModule.forFeature([
                contract_schema_1.Contract
            ])
        ],
        controllers: [contract_controller_1.ContractController],
        providers: [contract_service_1.ContractService]
    })
], ContractModule);
exports.ContractModule = ContractModule;


/***/ }),
/* 136 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContractPeymanReportModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const contractPeymanReport_schema_1 = __webpack_require__(85);
const contractPeymanReport_service_1 = __webpack_require__(137);
let ContractPeymanReportModule = class ContractPeymanReportModule {
};
ContractPeymanReportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                contractPeymanReport_schema_1.ContractPeymanReport
            ])
        ],
        controllers: [],
        providers: [contractPeymanReport_service_1.ContractPeymanReportService],
        exports: [contractPeymanReport_service_1.ContractPeymanReportService]
    })
], ContractPeymanReportModule);
exports.ContractPeymanReportModule = ContractPeymanReportModule;


/***/ }),
/* 137 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContractPeymanReportService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(20);
const contractPeymanReport_schema_1 = __webpack_require__(85);
let ContractPeymanReportService = class ContractPeymanReportService {
    constructor(model) {
        this.model = model;
    }
    async create(dto) {
        try {
            const _dto = dto;
            _dto.edit_by_admin = dto.edit_by_admin == true ? 1 : 0;
            return await this.model.createQueryBuilder()
                .insert()
                .values([
                Object.assign({}, _dto)
            ])
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async deleteAllByContractId(id) {
        try {
            return await this.model.createQueryBuilder()
                .delete()
                .where('contract_id_fk = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
};
ContractPeymanReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contractPeymanReport_schema_1.ContractPeymanReport)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], ContractPeymanReportService);
exports.ContractPeymanReportService = ContractPeymanReportService;


/***/ }),
/* 138 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContractController = void 0;
const common_1 = __webpack_require__(4);
const role_decorator_1 = __webpack_require__(14);
const roles_enum_1 = __webpack_require__(15);
const auth_guards_1 = __webpack_require__(16);
const contract_service_1 = __webpack_require__(139);
const create_dto_1 = __webpack_require__(140);
const update_dto_1 = __webpack_require__(141);
let ContractController = class ContractController {
    constructor(service) {
        this.service = service;
    }
    async createContract(body) {
        return await this.service.create(body);
    }
    async updateContract(id, body) {
        return await this.service.update(Number(id), body);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, role_decorator_1.Roles)(roles_enum_1.Role.contract_insert),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_dto_1.CreateContractDTO !== "undefined" && create_dto_1.CreateContractDTO) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "createContract", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, role_decorator_1.Roles)(roles_enum_1.Role.contract_edit, roles_enum_1.Role.contract_insert),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof update_dto_1.UpdateContractDTO !== "undefined" && update_dto_1.UpdateContractDTO) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "updateContract", null);
ContractController = __decorate([
    (0, common_1.Controller)('contract'),
    __metadata("design:paramtypes", [typeof (_c = typeof contract_service_1.ContractService !== "undefined" && contract_service_1.ContractService) === "function" ? _c : Object])
], ContractController);
exports.ContractController = ContractController;


/***/ }),
/* 139 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContractService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(20);
const contractProgress_service_1 = __webpack_require__(134);
const contract_schema_1 = __webpack_require__(86);
const moment = __webpack_require__(52);
const contractProductionReport_service_1 = __webpack_require__(133);
const contractPeymanReport_service_1 = __webpack_require__(137);
const personnel_service_1 = __webpack_require__(17);
const roles_enum_1 = __webpack_require__(15);
let ContractService = class ContractService {
    constructor(model, contractProgressService, contractProductionReportService, contractPeymanReportService, personnelService) {
        this.model = model;
        this.contractProgressService = contractProgressService;
        this.contractProductionReportService = contractProductionReportService;
        this.contractPeymanReportService = contractPeymanReportService;
        this.personnelService = personnelService;
    }
    async create(dto) {
        try {
            if (dto.contractor_id == dto.employer_id) {
                throw new common_1.HttpException('پیمانکار و کارفرما نمیتوانند یکی باشند', 400);
            }
            if (dto.workshop_code && dto.contractor_id) {
                const duplicates = await this.model.createQueryBuilder()
                    .where('workshop_code = :wc and contractor_id != :cid', {
                    wc: dto.workshop_code,
                    cid: dto.contractor_id
                })
                    .getCount();
                if (duplicates > 0) {
                    throw new common_1.HttpException('کد کارگاهی وارد شده قبلا برای شرکت دیگری ثبت شده است', 400);
                }
            }
            if (dto.row && dto.contractor_id && dto.workshop_code) {
                const duplicate = await this.model.createQueryBuilder()
                    .where('contractor_id = :cid and workshop_code = :wc and row= :r', {
                    cid: dto.contractor_id,
                    wc: dto.workshop_code,
                    r: dto.row
                })
                    .getCount();
                if (duplicate > 0) {
                    throw new common_1.HttpException('شماره پیمان وارد شده قبلا برای این شرکت ثبت شده است', 400);
                }
            }
            if (dto.contract_number && dto.contractor_id) {
                const duplicate = await this.model.createQueryBuilder()
                    .where('contractor_id = :cid && number = :n', {
                    cid: dto.contractor_id,
                    n: dto.contract_number
                })
                    .getCount();
                if (duplicate > 0) {
                    throw new common_1.HttpException('شماره قرارداد وارد شده قبلا در سامانه ثبت شده است', 400);
                }
            }
            const _dto = Object.assign({}, dto);
            _dto.number = dto.contract_number;
            delete _dto.contract_number;
            delete _dto.companyId;
            _dto.main_contract_id_fk = dto.main_contract_id;
            delete _dto.main_contract_id_fk;
            const contract = await this.model.createQueryBuilder()
                .insert()
                .values([_dto])
                .execute();
            const fromDate = moment(dto.start_date);
            const toDate = moment(dto.finish_date);
            const diff = toDate.diff(fromDate, 'days');
            for (let i = 0; i < diff; i++) {
                const date = moment(dto.start_date).utc(true).add(i, 'day').format('YYYY/MM/DD');
                await this.contractProgressService.create({
                    contract_id_fk: Number(contract.identifiers[0].id),
                    real_progress: 0,
                    program_progress: 0,
                    date: new Date(date)
                });
                if (dto.activity == 'mineral') {
                    await this.contractProductionReportService.create({
                        stone_tonnage: 0,
                        dust_tonnage: 0,
                        stone_load_quantity: 0,
                        dust_load_quantity: 0,
                        contract_id_fk: Number(contract.identifiers[0].id),
                        date: new Date(date),
                        edit_by_admin: false,
                        description: null,
                        status: null
                    });
                }
                if (dto.type == 'main_civil' || dto.type == 'main_non_civil') {
                    await this.contractPeymanReportService.create({
                        contract_id_fk: Number(contract.identifiers[0].id),
                        date: new Date(date),
                        disabled_car_no_tier_quantity: 0,
                        disabled_car_no_part_quantity: 0,
                        active_car_quantity: 0,
                        ready_to_work_factor: 0,
                        ready_to_work_car_quantity: 0,
                        status: null,
                        edit_by_admin: null,
                        description: null
                    });
                }
            }
            if (dto.manager_id) {
                await this.personnelService.insertPersonnelAccess({
                    companyId: dto.companyId,
                    personnelId: dto.manager_id,
                    access: roles_enum_1.Role.contract_progress_add_edit,
                    contractId: Number(contract.identifiers[0].id)
                });
                await this.personnelService.insertPersonnelAccess({
                    companyId: dto.companyId,
                    personnelId: dto.manager_id,
                    access: roles_enum_1.Role.contract_progress_approve,
                    contractId: Number(contract.identifiers[0].id)
                });
                if (dto.activity == 'mineral') {
                    await this.personnelService.insertPersonnelAccess({
                        companyId: dto.companyId,
                        personnelId: dto.manager_id,
                        access: roles_enum_1.Role.contract_production_report_add_edit,
                        contractId: Number(contract.identifiers[0].id)
                    });
                    await this.personnelService.insertPersonnelAccess({
                        companyId: dto.companyId,
                        personnelId: dto.manager_id,
                        access: roles_enum_1.Role.contract_production_report_approve,
                        contractId: Number(contract.identifiers[0].id)
                    });
                }
                if (dto.type == 'main_civil' || dto.type == 'main_non_civil') {
                    await this.personnelService.insertPersonnelAccess({
                        companyId: dto.companyId,
                        personnelId: dto.manager_id,
                        access: roles_enum_1.Role.contract_peyman_report_add_edit,
                        contractId: Number(contract.identifiers[0].id)
                    });
                    await this.personnelService.insertPersonnelAccess({
                        companyId: dto.companyId,
                        personnelId: dto.manager_id,
                        access: roles_enum_1.Role.contract_peyman_report_approve,
                        contractId: Number(contract.identifiers[0].id)
                    });
                    await this.personnelService.insertPersonnelAccess({
                        companyId: dto.companyId,
                        personnelId: dto.manager_id,
                        access: roles_enum_1.Role.contract_dashboard_report,
                        contractId: Number(contract.identifiers[0].id)
                    });
                }
            }
            return {
                contractId: Number(contract.identifiers[0].id)
            };
        }
        catch (err) {
            throw err;
        }
    }
    async update(id, dto) {
        try {
            if (dto.contractor_id == dto.employer_id) {
                throw new common_1.HttpException("پیمانکار و کارفرما نمیتوانند یکی باشند", 400);
            }
            if (id == dto.main_contract_id) {
                throw new common_1.HttpException("قرار داد با قرارداد اصلی مشابه هست", 400);
            }
            const mainContracts = await this.model.createQueryBuilder()
                .where('main_contract_id_fk = :mcid', { mcid: id })
                .getCount();
            if (mainContracts > 0) {
                if (dto.contractor_id != dto.old_contractor_id) {
                    throw new common_1.HttpException("امکان تغییر پیمانکار در این قرارداد وجود ندارد", 400);
                }
            }
            const oldContract = await this.model.createQueryBuilder()
                .where('id = :id', { id: id })
                .getRawOne();
            await this.model.createQueryBuilder()
                .update()
                .set(dto)
                .where('id = :id', { id: id })
                .execute();
            await this.contractProgressService.deleteAllByContractId(id);
            await this.contractProductionReportService.deleteByContractId(id);
            await this.contractPeymanReportService.deleteAllByContractId(id);
            const fromDate = moment(dto.start_date);
            const toDate = moment(dto.finish_date);
            const diff = toDate.diff(fromDate, 'days');
            for (let i = 0; i < diff + 1; i++) {
                const d = moment(dto.start_date).utc(true).add(i, 'day').format('YYYY/MM/DD');
                await this.contractProgressService.create({
                    contract_id_fk: id,
                    date: new Date(d),
                    real_progress: 0,
                    program_progress: 0
                });
                if (dto.activity === 'mineral') {
                    await this.contractProductionReportService.create({
                        contract_id_fk: id,
                        stone_tonnage: 0,
                        stone_load_quantity: 0,
                        dust_load_quantity: 0,
                        dust_tonnage: 0,
                        date: new Date(d),
                        edit_by_admin: false,
                        status: null,
                        description: null
                    });
                }
                if (dto.type === 'main_non_civil' || dto.type === 'main_civil') {
                    await this.contractPeymanReportService.create({
                        contract_id_fk: id,
                        date: new Date(d),
                        disabled_car_no_part_quantity: 0,
                        disabled_car_no_tier_quantity: 0,
                        active_car_quantity: 0,
                        ready_to_work_car_quantity: 0,
                        ready_to_work_factor: 0,
                        edit_by_admin: null,
                        description: null,
                        status: null
                    });
                }
            }
            await this.personnelService.deletePersonnelAccess(oldContract.manager_id, [
                'contract/progress-add-edit',
                'contract/progress-approve',
                'contract/production-report-add-edit',
                'contract/production-report-approve',
                'contract/peyman-report-add-edit',
                'contract/peyman-report-approve',
                'contract/dashboard-report'
            ]);
            if (dto.manager_id) {
                await this.personnelService.insertPersonnelAccess({
                    access: 'contract/progress-approve',
                    personnelId: dto.manager_id,
                    contractId: id,
                    companyId: dto.contractor_id
                });
                await this.personnelService.insertPersonnelAccess({
                    access: 'contract/production-report-add-edit',
                    personnelId: dto.manager_id,
                    contractId: id,
                    companyId: dto.contractor_id
                });
                await this.personnelService.insertPersonnelAccess({
                    access: 'contract/production-report-approve',
                    personnelId: dto.manager_id,
                    contractId: id,
                    companyId: dto.contractor_id
                });
                await this.personnelService.insertPersonnelAccess({
                    access: 'contract/peyman-report-add-edit',
                    personnelId: dto.manager_id,
                    contractId: id,
                    companyId: dto.contractor_id
                });
                await this.personnelService.insertPersonnelAccess({
                    access: 'contract/peyman-report-approve',
                    personnelId: dto.manager_id,
                    contractId: id,
                    companyId: dto.contractor_id
                });
                await this.personnelService.insertPersonnelAccess({
                    access: 'contract/dashboard-report',
                    personnelId: dto.manager_id,
                    contractId: id,
                    companyId: dto.contractor_id
                });
            }
        }
        catch (err) {
            throw err;
        }
    }
};
ContractService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contract_schema_1.Contract)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof contractProgress_service_1.ContractProgressService !== "undefined" && contractProgress_service_1.ContractProgressService) === "function" ? _b : Object, typeof (_c = typeof contractProductionReport_service_1.ContractProductionReportService !== "undefined" && contractProductionReport_service_1.ContractProductionReportService) === "function" ? _c : Object, typeof (_d = typeof contractPeymanReport_service_1.ContractPeymanReportService !== "undefined" && contractPeymanReport_service_1.ContractPeymanReportService) === "function" ? _d : Object, typeof (_e = typeof personnel_service_1.PersonnelService !== "undefined" && personnel_service_1.PersonnelService) === "function" ? _e : Object])
], ContractService);
exports.ContractService = ContractService;


/***/ }),
/* 140 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateContractDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class CreateContractDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateContractDTO.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContractDTO.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContractDTO.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateContractDTO.prototype, "contract_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContractDTO.prototype, "employer", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContractDTO.prototype, "contract_number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContractDTO.prototype, "contractor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateContractDTO.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateContractDTO.prototype, "finish_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateContractDTO.prototype, "initial_amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContractDTO.prototype, "workshop_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContractDTO.prototype, "row", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContractDTO.prototype, "supervision", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateContractDTO.prototype, "manager_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateContractDTO.prototype, "employer_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateContractDTO.prototype, "boss_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContractDTO.prototype, "contractor_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateContractDTO.prototype, "contractor_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateContractDTO.prototype, "main_contract_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContractDTO.prototype, "activity", void 0);
exports.CreateContractDTO = CreateContractDTO;


/***/ }),
/* 141 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateContractDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class UpdateContractDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], UpdateContractDTO.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateContractDTO.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateContractDTO.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateContractDTO.prototype, "contract_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContractDTO.prototype, "employer", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContractDTO.prototype, "contract_number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContractDTO.prototype, "contractor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateContractDTO.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateContractDTO.prototype, "finish_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateContractDTO.prototype, "initial_amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContractDTO.prototype, "workshop_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContractDTO.prototype, "row", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContractDTO.prototype, "supervision", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateContractDTO.prototype, "manager_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateContractDTO.prototype, "employer_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateContractDTO.prototype, "boss_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContractDTO.prototype, "contractor_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateContractDTO.prototype, "contractor_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateContractDTO.prototype, "main_contract_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContractDTO.prototype, "activity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateContractDTO.prototype, "old_contractor_id", void 0);
exports.UpdateContractDTO = UpdateContractDTO;


/***/ }),
/* 142 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HseModule = void 0;
const common_1 = __webpack_require__(4);
const hse_service_1 = __webpack_require__(143);
const hse_controller_1 = __webpack_require__(147);
const personnel_module_1 = __webpack_require__(10);
const typeorm_1 = __webpack_require__(9);
const question_schema_1 = __webpack_require__(87);
const checklist_schema_1 = __webpack_require__(90);
const checklist_questions_schema_1 = __webpack_require__(91);
const allocate_question_schema_1 = __webpack_require__(92);
const vehicle_module_1 = __webpack_require__(157);
const hse_audit_schema_1 = __webpack_require__(94);
const audit_question_schema_1 = __webpack_require__(95);
const jobs_module_1 = __webpack_require__(160);
let HseModule = class HseModule {
};
HseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            personnel_module_1.PersonnelModule,
            vehicle_module_1.VehicleModule,
            jobs_module_1.JobsModule,
            typeorm_1.TypeOrmModule.forFeature([
                question_schema_1.HSEQuestion,
                checklist_schema_1.HSEChecklist,
                checklist_questions_schema_1.HSEChecklistQuestion,
                allocate_question_schema_1.HSEAllocateQuestion,
                hse_audit_schema_1.HSEAudit,
                audit_question_schema_1.HSEAuditQuestion
            ])
        ],
        controllers: [hse_controller_1.HseController],
        providers: [hse_service_1.HseService],
        exports: [hse_service_1.HseService]
    })
], HseModule);
exports.HseModule = HseModule;


/***/ }),
/* 143 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HseService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const hse_group_enum_1 = __webpack_require__(144);
const randomnumber_1 = __webpack_require__(66);
const typeorm_2 = __webpack_require__(20);
const checklist_questions_schema_1 = __webpack_require__(91);
const checklist_schema_1 = __webpack_require__(90);
const question_schema_1 = __webpack_require__(87);
const allocate_question_schema_1 = __webpack_require__(92);
const moment = __webpack_require__(52);
const vehicle_service_1 = __webpack_require__(145);
const hse_audit_schema_1 = __webpack_require__(94);
const audit_question_schema_1 = __webpack_require__(95);
const jobs_service_1 = __webpack_require__(146);
let HseService = class HseService {
    constructor(repo, hseChecklistRepo, hseChecklistQuestionRepo, hseAllocteQuestionRepo, hseAuditRepo, hseAuditQuestionRepo, vehicleService, jobsService) {
        this.repo = repo;
        this.hseChecklistRepo = hseChecklistRepo;
        this.hseChecklistQuestionRepo = hseChecklistQuestionRepo;
        this.hseAllocteQuestionRepo = hseAllocteQuestionRepo;
        this.hseAuditRepo = hseAuditRepo;
        this.hseAuditQuestionRepo = hseAuditQuestionRepo;
        this.vehicleService = vehicleService;
        this.jobsService = jobsService;
    }
    async createQuestion(dto) {
        try {
            let questionCode = new randomnumber_1.RandomNumber(1000, 9999).generate().toString();
            switch (dto.group) {
                case hse_group_enum_1.HSEGroup.VEHICLE:
                    questionCode = `50${questionCode.toString()}`;
                    break;
                case hse_group_enum_1.HSEGroup.ENVIRONMENT:
                    questionCode = `80${questionCode.toString()}`;
                    break;
                default:
                    questionCode = `10${questionCode.toString()}`;
                    break;
            }
            const _dto = Object.assign({}, dto);
            _dto.code = questionCode;
            _dto.is_reverse = dto.isReverse;
            return await this.repo.createQueryBuilder()
                .insert()
                .values([_dto])
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async updateQuestion(id, dto) {
        try {
            const _dto = dto;
            _dto.is_reverse = dto.isReverse;
            delete _dto.isReverse;
            return await this.repo.createQueryBuilder()
                .update()
                .set(_dto)
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async listQuestions() {
        try {
            return this.repo.createQueryBuilder()
                .getMany();
        }
        catch (err) {
            throw err;
        }
    }
    async deleteQuestion(id) {
        try {
            await this.hseAllocteQuestionRepo.createQueryBuilder()
                .delete()
                .where('question_id_fk = :qid', { qid: id })
                .execute();
            await this.hseChecklistQuestionRepo.createQueryBuilder()
                .delete()
                .where('question_id_fk = :qid', { qid: id })
                .execute();
            return await this.repo.createQueryBuilder()
                .delete()
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async createCheckList(dto) {
        try {
            let code = new randomnumber_1.RandomNumber(100, 999).generate().toString();
            if (dto.environmentId) {
                const dup = await this.hseChecklistRepo.createQueryBuilder()
                    .select()
                    .where('environment_id_fk = :eid and enable = :status and type = :type', { eid: dto.environmentId, status: 1, type: dto.type }).getCount();
                if (dup > 0) {
                    throw new common_1.HttpException('envrionment id does already have a public checklist', 400);
                }
                code = `80${code}`;
            }
            if (dto.jobsId) {
                const dup = await this.hseChecklistRepo.createQueryBuilder()
                    .select()
                    .where('jobs_id_fk = :jid and enable = :status and type = :type', { jid: dto.jobsId, status: 1, type: dto.type }).getCount();
                if (dup > 0) {
                    throw new common_1.HttpException('job id does already have a public checklist', 400);
                }
                code = `10${code}`;
            }
            if (dto.vehicleTypeId) {
                const dup = await this.hseChecklistRepo.createQueryBuilder()
                    .select()
                    .where('vehicle_type_id_fk = :vid and enable = :status and type  = :type', { vid: dto.vehicleTypeId, status: 1, type: dto.type }).getCount();
                if (dup > 0) {
                    throw new common_1.HttpException('vehicle type does already have a public checklist', 400);
                }
                code = `50${code}`;
            }
            const checklist = await this.hseChecklistRepo.createQueryBuilder()
                .insert()
                .values([
                {
                    group: dto.group,
                    environment_id_fk: dto.environmentId,
                    jobs_id_fk: dto.jobsId,
                    vehicle_type_id_fk: dto.vehicleTypeId,
                    enable: 0,
                    code: +code,
                    comment: dto.comment,
                    type: dto.type,
                    minimum_point: dto.minimumPoint
                }
            ])
                .execute();
            for (let i = 0; i < dto.questions.length; i++) {
                await this.hseChecklistQuestionRepo.createQueryBuilder()
                    .insert()
                    .values([
                    {
                        checklist_id_fk: checklist.identifiers[0].id,
                        question_id_fk: dto.questions[i].questionId,
                        weight_factor: dto.questions[i].weight_factor,
                        description: dto.questions[i].description,
                        critical: dto.questions[i].critical
                    }
                ])
                    .execute();
            }
            return checklist;
        }
        catch (err) {
            throw err;
        }
    }
    async findAllCheckList() {
        try {
            const query = (0, typeorm_2.createQueryBuilder)(checklist_schema_1.HSEChecklist, 't1')
                .leftJoinAndSelect('vehicle_type', 't2', 't1.vehicle_type_id_fk = t2.id')
                .leftJoinAndSelect('jobs', 't3', 't1.jobs_id_fk = t3.id')
                .select([
                't1.*',
                't3.title as job',
                't2.title as vehicleType'
            ]);
            const list = await query.getRawMany();
            for (let i = 0; i < list.length; i++) {
                const count = await this.hseChecklistQuestionRepo.createQueryBuilder()
                    .where('checklist_id_fk = :cid', { cid: list[i].id })
                    .getCount();
                list[i].questionCount = count;
            }
            return list;
        }
        catch (err) {
            throw err;
        }
    }
    async findCheckList(id) {
        try {
            const checklist = await this.hseChecklistRepo.createQueryBuilder()
                .where('id = :id', { id: id })
                .getOne();
            const questions = (0, typeorm_2.createQueryBuilder)(checklist_schema_1.HSEChecklist, 't1')
                .leftJoinAndSelect('hse_checklist_question', 't3', 't1.id = t3.checklist_id_fk')
                .leftJoinAndSelect('hse_question', 't2', 't3.question_id_fk = t2.id')
                .select([
                't1.minimum_point as minimum_point',
                't2.id as id',
                't2.group as _group',
                't2.question as question',
                't2.id as questionId',
                't2.type as type',
                't2.code as code',
                't3.weight_factor as weight_factor',
                't3.critical as critical',
                't3.requirements as requirements',
                't3.description as description',
                't2.is_reverse as is_reverse'
            ])
                .groupBy('t2.id')
                .andWhere('t1.id = :id', { id: id });
            const questionsList = await questions.getRawMany();
            return {
                checklist: checklist,
                questions: questionsList
            };
        }
        catch (err) {
            throw err;
        }
    }
    async findTypesForHSE() {
        try {
            let vtypes = await this.hseChecklistRepo.createQueryBuilder()
                .where('not(vehicle_type_id_fk is null) and enable=1')
                .select(['vehicle_type_id_fk'])
                .getRawMany();
            vtypes = vtypes.map(item => {
                return item.vehicle_type_id_fk;
            });
            let list = await this.vehicleService.findAllTypesForHSE(vtypes);
            return list;
        }
        catch (Err) {
            throw Err;
        }
    }
    async findJobsForHSE() {
        try {
            let jobs = await this.hseChecklistRepo.createQueryBuilder()
                .where('not(jobs_id_fk is null) and enable = 1')
                .select(['jobs_id_fk'])
                .getRawMany();
            jobs = jobs.map(item => {
                return item.jobs_id_fk;
            });
            const list = await this.jobsService.findAllJobsForHSE(jobs);
            return list;
        }
        catch (err) {
            throw err;
        }
    }
    async updateChecklist(id, dto) {
        try {
            const _dto = Object.assign({}, dto);
            let questions = [];
            if (_dto.questions) {
                questions = _dto.questions;
                delete _dto.questions;
            }
            if (questions.length > 0) {
                await this.hseChecklistQuestionRepo.createQueryBuilder()
                    .delete()
                    .where('checklist_id_fk = :cid', { cid: id })
                    .execute();
                for (let i = 0; i < questions.length; i++) {
                    await this.hseChecklistQuestionRepo.createQueryBuilder()
                        .insert()
                        .values([
                        {
                            checklist_id_fk: id,
                            question_id_fk: questions[i].questionId,
                            weight_factor: questions[i].weight_factor,
                            critical: questions[i].critical,
                            requirements: questions[i].requirements,
                            description: questions[i].description
                        }
                    ])
                        .execute();
                }
            }
            if (_dto.jobsId) {
                _dto.jobs_id_fk = _dto.jobsId;
                delete _dto.jobsId;
            }
            if (_dto.personnelId) {
                _dto.personnel_id_fk = _dto.personnelId;
                delete _dto.personnelId;
            }
            if (_dto.environmentId) {
                _dto.environment_id_fk = _dto.environmentId;
                delete _dto.environmentId;
            }
            if (_dto.vehicleTypeId) {
                _dto.vehicle_type_id_fk = _dto.vehicleTypeId;
                delete _dto.vehicleTypeId;
            }
            if (_dto.minimumPoint) {
                _dto.minimum_point = _dto.minimumPoint;
                delete _dto.minimumPoint;
            }
            return await this.hseChecklistRepo.createQueryBuilder()
                .update()
                .set(_dto)
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async deleteChecklist(id) {
        try {
            return await this.hseChecklistRepo.createQueryBuilder()
                .delete()
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async getQuestionByCode(code) {
        try {
            return await this.repo.createQueryBuilder()
                .select()
                .where('code = :code', { code: code })
                .getOne();
        }
        catch (err) {
            throw err;
        }
    }
    async copyQuestionsFromList(fromListId, toListId) {
        try {
        }
        catch (err) {
            throw err;
        }
    }
    async createAllocate(dto) {
        try {
            for (let i = 0; i < dto.questionIds.length; i++) {
                const count = await this.repo.createQueryBuilder()
                    .where('id = :id', { id: dto.questionIds[i] })
                    .getCount();
                if (count > 0) {
                    await this.hseAllocteQuestionRepo.createQueryBuilder()
                        .delete()
                        .where('question_id_fk = :qid and (personnel_id_fk = :pid or vehicle_id_fk=:vid or environment_id_fk=:eid)', {
                        pid: dto.personnelId,
                        qid: dto.questionIds[i],
                        vid: dto.vehicleId,
                        eid: dto.environmentId
                    })
                        .execute();
                    await this.hseAllocteQuestionRepo.createQueryBuilder()
                        .insert()
                        .values([
                        {
                            question_id_fk: dto.questionIds[i],
                            personnel_id_fk: dto.personnelId,
                            vehicle_id_fk: dto.vehicleId,
                            environment_id_fk: dto.environmentId,
                            from_date: dto.fromDate,
                            to_date: dto.toDate,
                            weight_factor: dto.weightFactor,
                            critical: dto.critical,
                            requirements: dto.requirements,
                            description: dto.description
                        }
                    ])
                        .execute();
                }
            }
        }
        catch (err) {
            throw err;
        }
    }
    async updateAllocate(id, dto) {
        try {
            const _dto = {};
            for (let key in dto) {
                switch (key) {
                    case 'questionId':
                        _dto.question_id_fk = dto[key];
                        break;
                    case 'personnelId':
                        _dto.personnel_id_fk = dto[key];
                        break;
                    case 'vehicleId':
                        _dto.vehicle_id_fk = dto[key];
                        break;
                    case 'environmentId':
                        _dto.environment_id_fk = dto[key];
                        break;
                    case 'toDate':
                        _dto.to_date = dto[key];
                        break;
                    case 'fromDate':
                        _dto.from_date = dto[key];
                        break;
                    case 'weightFactor':
                        _dto.weight_factor = dto[key];
                        break;
                    default:
                        _dto[key] = dto[key];
                }
            }
            return await this.hseAllocteQuestionRepo.createQueryBuilder()
                .update()
                .set(_dto)
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async deleteAllocate(id) {
        return await this.hseAllocteQuestionRepo.createQueryBuilder()
            .delete()
            .where('id = :id', { id: id })
            .execute();
    }
    async findAllocatesOf(personnelId, vehicleId, environmentId) {
        try {
            let where = '';
            if (personnelId) {
                where = `personnel_id_fk=${personnelId}`;
            }
            else if (vehicleId) {
                where = `vehicle_id_fk=${vehicleId}`;
            }
            else if (environmentId) {
                where = `environment_id_fk=${environmentId}`;
            }
            const list = (0, typeorm_2.createQueryBuilder)(allocate_question_schema_1.HSEAllocateQuestion, 't1')
                .leftJoinAndSelect('hse_question', 't2', 't1.question_id_fk=t2.id')
                .where(where)
                .select([
                't1.id as id',
                't1.from_date as from_date',
                't1.to_date as to_date',
                't1.weight_factor as weight_factor',
                't1.critical as critical',
                't1.requirements as requirements',
                't1.description as description',
                't2.question as question',
                't2.id as question_id_fk'
            ])
                .getRawMany();
            return list;
        }
        catch (err) {
            throw err;
        }
    }
    async getHSEQuestions(dto) {
        try {
            let commonQuestions = [];
            let exclusiveQuestions = [];
            if (dto.personnelId) {
                exclusiveQuestions = await this._getExQuestions(dto.personnelId, 'personnel');
            }
            if (dto.vehicleId) {
                exclusiveQuestions = await this._getExQuestions(dto.vehicleId, 'vehicle');
                commonQuestions = await this._getCommonQuestions(dto.vehicleId, 'vehicle');
            }
            return {
                commonQuestions: commonQuestions,
                exclusiveQuestions: exclusiveQuestions
            };
        }
        catch (err) {
            throw err;
        }
    }
    _getExQuestions(id, type) {
        return new Promise(async (resolve, _) => {
            let list = [];
            if (type === 'personnel') {
                list = await await (0, typeorm_2.createQueryBuilder)(allocate_question_schema_1.HSEAllocateQuestion, 't1')
                    .leftJoinAndSelect('hse_question', 't2', 't1.question_id_fk = t2.id')
                    .where('DATE(t1.from_date) <= :today and DATE(t1.to_date) >= :today and personnel_id_fk= :pid', {
                    today: moment().utc(true).format('YYYY-MM-DD 00:00:00'),
                    pid: id
                })
                    .select([
                    't1.question_id_fk as question_id',
                    't1.weight_factor as weight_factor',
                    't1.critical as critical',
                    't1.requirements as requirements',
                    't1.description as description',
                    't2.group as _group',
                    't2.question as question',
                    't2.type as type',
                    't2.code as code'
                ]).getRawMany();
            }
            else if (type === 'vehicle') {
                list = await await (0, typeorm_2.createQueryBuilder)(allocate_question_schema_1.HSEAllocateQuestion, 't1')
                    .leftJoinAndSelect('hse_question', 't2', 't1.question_id_fk = t2.id')
                    .where('DATE(t1.from_date) <= :today and DATE(t1.to_date) >= :today and vehicle_id_fk= :vid', {
                    today: moment().utc(true).format('YYYY-MM-DD 00:00:00'),
                    vid: id
                })
                    .select([
                    't1.question_id_fk as question_id',
                    't1.weight_factor as weight_factor',
                    't1.critical as critical',
                    't1.requirements as requirements',
                    't1.description as description',
                    't2.group as _group',
                    't2.question as question',
                    't2.type as type',
                    't2.code as code'
                ]).getRawMany();
            }
            else if (type === 'environment') {
            }
            resolve(list);
        });
    }
    _getCommonQuestions(id, type) {
        return new Promise(async (resolve, _) => {
            const vehicle = await this.vehicleService.findAllWithSearch({ id: id });
            if (vehicle.length > 0) {
                const list = (0, typeorm_2.createQueryBuilder)(checklist_schema_1.HSEChecklist, 't1')
                    .leftJoinAndSelect('hse_checklist_question', 't2', 't1.id = t2.checklist_id_fk')
                    .leftJoinAndSelect('hse_question', 't3', 't2.question_id_fk = t3.id')
                    .where('t1.vehicle_type_id_fk = :vtid and t1.enable = :enable', {
                    vtid: vehicle[0].type_id_fk,
                    enable: 1
                })
                    .select([
                    't1.code as checklist_code',
                    't2.weight_factor as weight_factor',
                    't2.critical as critical',
                    't2.requirements as requirements',
                    't2.description as description',
                    't3.id as question_id',
                    't3.question as question',
                    't3.group as _group',
                    't3.type as type',
                    't3.code as code'
                ])
                    .getRawMany();
                resolve(list);
            }
            else {
                resolve([]);
            }
        });
    }
    async createAudit(userId, dto) {
        try {
            const audit = await this.hseAuditRepo.createQueryBuilder()
                .insert()
                .values([
                {
                    personnel_id_fk: dto.personnel_id_fk,
                    vehicle_id_fk: dto.vehicle_id_fk,
                    environment_id_fk: dto.environment_id_fk,
                    troubleshooter_id_fk: dto.troubleshooter_id_fk,
                    audit_date: dto.date,
                    description: dto.description,
                    operator_id_fk: userId,
                    draft: 1,
                    date: moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                    minimum_point: dto.minimumPoint
                }
            ])
                .execute();
            const insertObjs = [];
            for (let i = 0; i < dto.questions.length; i++) {
                const question = dto.questions[i];
                insertObjs.push({
                    audit_id_fk: audit.identifiers[0].id,
                    question: question.question,
                    question_id_fk: question.questionId,
                    answer: question.isNotRelated === true ? null : question.answer,
                    critical: question.critical,
                    weight_factor: question.weight_factor,
                    requirements: question.requirements,
                    description: question.description,
                    group: question.group,
                    type: question.type,
                    code: question.code,
                    is_not_related: question.isNotRelated,
                    operator_description: question.operatorDescription,
                    is_reverse: question.isReverse
                });
            }
            if (insertObjs.length > 0) {
                await this.hseAuditQuestionRepo.createQueryBuilder()
                    .insert()
                    .values(insertObjs)
                    .execute();
            }
            return audit;
        }
        catch (err) {
            throw err;
        }
    }
    async updateHse(id, userId, dto) {
        try {
            const hse = await this.hseAuditRepo.createQueryBuilder()
                .where('id = :id', { id: id })
                .getOne();
            if (hse.draft == 0) {
                throw new common_1.HttpException('hse is finalized and could not be edited', 400);
            }
            const _dto = {
                personnel_id_fk: dto.personnel_id_fk,
                vehicle_id_fk: dto.vehicle_id_fk,
                environment_id_fk: dto.environment_id_fk,
                troubleshooter_id_fk: dto.troubleshooter_id_fk,
                audit_date: dto.date,
                description: dto.description,
                operator_id_fk: userId,
                draft: dto.draft
            };
            await this.hseAuditRepo.createQueryBuilder()
                .update()
                .set(_dto)
                .where('id = :id', { id: id })
                .execute();
            await this.hseAuditQuestionRepo.createQueryBuilder()
                .delete()
                .where('audit_id_fk = :aid', { aid: id })
                .execute();
            const insertObjs = [];
            for (let i = 0; i < dto.questions.length; i++) {
                const question = dto.questions[i];
                insertObjs.push({
                    audit_id_fk: id,
                    question: question.question,
                    question_id_fk: question.questionId,
                    answer: question.isNotRelated == true ? null : question.answer,
                    critical: question.critical,
                    weight_factor: question.weight_factor,
                    requirements: question.requirements,
                    description: question.description,
                    group: question.group,
                    type: question.type,
                    code: question.code,
                    is_not_related: question.isNotRelated,
                    operator_description: question.operatorDescription,
                    is_reverse: question.isReverse
                });
            }
            if (insertObjs.length > 0) {
                await this.hseAuditQuestionRepo.createQueryBuilder()
                    .insert()
                    .values(insertObjs)
                    .execute();
            }
        }
        catch (err) {
            throw err;
        }
    }
    async findHse(id, userId) {
        try {
            const hse = await (0, typeorm_2.createQueryBuilder)('hse_audit', 't1')
                .leftJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
                .leftJoinAndSelect('vehicle', 't3', 't1.vehicle_id_fk = t3.id')
                .leftJoinAndSelect('personnel', 't4', 't1.operator_id_fk = t4.id')
                .where('t1.id = :id', { id: id })
                .select([
                't1.id as id',
                't1.personnel_id_fk as personnel_id_fk',
                't1.vehicle_id_fk as vehicle_id_fk',
                't1.environment_id_fk as environment_id_fk',
                't1.audit_date as audit_date',
                't1.minimum_point as minimum_point',
                't1.description as description',
                't1.date as date',
                't1.draft as draft',
                't2.image_url as image_url',
                't2.first_name as first_name',
                't2.last_name as last_name',
                't2.national_number as national_number',
                't3.organization_code as organization_code',
                't3.plaque1 as plaque1',
                't3.plaque2 as plaque2',
                't3.plaque3 as plaque3',
                't3.plaque4 as plaque4',
                't4.first_name as operator_first_name',
                't4.last_name as operator_last_name'
            ])
                .getRawOne();
            const questions = await this.hseAuditQuestionRepo.createQueryBuilder()
                .where('audit_id_fk = :aid', { aid: id })
                .getMany();
            return {
                audit: hse,
                questions: questions
            };
        }
        catch (err) {
            throw err;
        }
    }
    async listMyHSE(userId) {
        try {
            const list = await (0, typeorm_2.createQueryBuilder)('hse_audit', 't1')
                .leftJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
                .leftJoinAndSelect('vehicle', 't3', 't1.vehicle_id_fk = t3.id')
                .leftJoinAndSelect('personnel', 't4', 't1.operator_id_fk = t4.id')
                .where('t1.operator_id_fk = :pid', { pid: userId })
                .select([
                't1.id as id',
                't1.audit_date as audit_date',
                't1.description as description',
                't1.date as date',
                't1.draft as draft',
                't1.minimum_point as minimum_point',
                't2.first_name as first_name',
                't2.last_name as last_name',
                't2.national_number as national_number',
                't3.organization_code as organization_code',
                't3.plaque1 as plaque1',
                't3.plaque2 as plaque2',
                't3.plaque3 as plaque3',
                't3.plaque4 as plaque4',
                't4.first_name as operator_first_name',
                't4.last_name as operator_last_name',
                't4.id as operator_id'
            ])
                .getRawMany();
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (item.draft === 0) {
                    const questions = await this.hseAuditQuestionRepo.createQueryBuilder()
                        .where('audit_id_fk = :aid', { aid: item.id })
                        .getMany();
                    let userTotalPoint = 0;
                    let auditTotalPoint = 0;
                    let isCritical = false;
                    questions.forEach(question => {
                        if (question.answer) {
                            const criticals = question.critical.split(',');
                            if (criticals.indexOf(question.answer) > -1) {
                                isCritical = true;
                            }
                            else {
                                userTotalPoint += Number(parseInt(question.answer) * question.weight_factor);
                                auditTotalPoint += Number(4 * question.weight_factor);
                            }
                        }
                    });
                    const percentage = (userTotalPoint / auditTotalPoint) * 100;
                    if (isCritical) {
                        item.percentage = null;
                        item.permit = false;
                    }
                    else {
                        item.percentage = isCritical ? null : percentage;
                        item.permit = percentage > item.minimum_point ? true : false;
                    }
                    isCritical = false;
                }
            }
            return list;
        }
        catch (err) {
            throw err;
        }
    }
    async deleteAudit(id, userId) {
        try {
            return await this.hseAuditRepo.createQueryBuilder()
                .delete()
                .where('id = :id and draft = :draft and operator_id_fk = :oid', { id: id, draft: 1, oid: userId })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
};
HseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(question_schema_1.HSEQuestion)),
    __param(1, (0, typeorm_1.InjectRepository)(checklist_schema_1.HSEChecklist)),
    __param(2, (0, typeorm_1.InjectRepository)(checklist_questions_schema_1.HSEChecklistQuestion)),
    __param(3, (0, typeorm_1.InjectRepository)(allocate_question_schema_1.HSEAllocateQuestion)),
    __param(4, (0, typeorm_1.InjectRepository)(hse_audit_schema_1.HSEAudit)),
    __param(5, (0, typeorm_1.InjectRepository)(audit_question_schema_1.HSEAuditQuestion)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object, typeof (_f = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _f : Object, typeof (_g = typeof vehicle_service_1.VehicleService !== "undefined" && vehicle_service_1.VehicleService) === "function" ? _g : Object, typeof (_h = typeof jobs_service_1.JobsService !== "undefined" && jobs_service_1.JobsService) === "function" ? _h : Object])
], HseService);
exports.HseService = HseService;


/***/ }),
/* 144 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HSEGroup = void 0;
var HSEGroup;
(function (HSEGroup) {
    HSEGroup["ENVIRONMENT"] = "environment";
    HSEGroup["INDIVIDUAL"] = "individual";
    HSEGroup["VEHICLE"] = "vehicle";
})(HSEGroup = exports.HSEGroup || (exports.HSEGroup = {}));


/***/ }),
/* 145 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VehicleService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(20);
const vehicle_type_schema_1 = __webpack_require__(89);
const vehicle_schema_1 = __webpack_require__(93);
let VehicleService = class VehicleService {
    constructor(typeRepo, vehicleRepo) {
        this.typeRepo = typeRepo;
        this.vehicleRepo = vehicleRepo;
    }
    create(createVehicleDto) {
        return 'This action adds a new vehicle';
    }
    findAll() {
        return `This action returns all vehicle`;
    }
    findOne(id) {
        return `This action returns a #${id} vehicle`;
    }
    update(id, updateVehicleDto) {
        return `This action updates a #${id} vehicle`;
    }
    remove(id) {
        return `This action removes a #${id} vehicle`;
    }
    async findAllTypes() {
        try {
            return await this.typeRepo.createQueryBuilder()
                .getMany();
        }
        catch (err) {
            throw err;
        }
    }
    async findAllTypesForHSE(ids) {
        try {
            if (ids.length == 0) {
                return await this.typeRepo.createQueryBuilder()
                    .getMany();
            }
            else {
                return await this.typeRepo.createQueryBuilder()
                    .where('not(id in (:...arr))', { arr: ids })
                    .getMany();
            }
        }
        catch (err) {
            throw err;
        }
    }
    async findAllWithSearch(param) {
        try {
            if (Object.keys(param).length > 0) {
                return await this.vehicleRepo.createQueryBuilder()
                    .where(`${Object.keys(param)[0]} = :value`, { value: param[Object.keys(param)[0]] })
                    .getMany();
            }
            else {
                return await this.vehicleRepo.createQueryBuilder()
                    .select()
                    .getMany();
            }
        }
        catch (err) {
            throw err;
        }
    }
};
VehicleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_type_schema_1.VehicleType)),
    __param(1, (0, typeorm_1.InjectRepository)(vehicle_schema_1.Vehicle)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], VehicleService);
exports.VehicleService = VehicleService;


/***/ }),
/* 146 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobsService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(20);
const job_schema_1 = __webpack_require__(88);
const job_chart_schema_1 = __webpack_require__(100);
const job_chart_node_schema_1 = __webpack_require__(101);
const job_permission_schema_1 = __webpack_require__(96);
const job_shift_schema_1 = __webpack_require__(98);
const job_shift_pattern_schema_1 = __webpack_require__(99);
const job_tamin_code_schema_1 = __webpack_require__(97);
let JobsService = class JobsService {
    constructor(repo, jobPermissionRepo, jobTaminCodeRepo, jobShiftRepo, jobShiftPatternRepo, jobChartRepo, jobChartNodeRepo) {
        this.repo = repo;
        this.jobPermissionRepo = jobPermissionRepo;
        this.jobTaminCodeRepo = jobTaminCodeRepo;
        this.jobShiftRepo = jobShiftRepo;
        this.jobShiftPatternRepo = jobShiftPatternRepo;
        this.jobChartRepo = jobChartRepo;
        this.jobChartNodeRepo = jobChartNodeRepo;
        this._insertNodes = (async (nodes, parentId, chartId) => {
            try {
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    const newNode = await this.jobChartNodeRepo.createQueryBuilder()
                        .insert()
                        .values([
                        {
                            parent_id_fk: parentId != chartId ? parentId : null,
                            title: node.title,
                            jobs_tamin_code_id_fk: node.jobs_tamin_code_id_fk,
                            count: node.count,
                            chart_id_fk: chartId
                        }
                    ])
                        .execute();
                    if (node.nodes != null && node.nodes.length > 0) {
                        await this._insertNodes(node.nodes, newNode.identifiers[0].id, chartId);
                    }
                }
            }
            catch (err) {
                throw err;
            }
        });
        this.makeTree = ((nodes, parentId) => {
            return nodes
                .filter((node) => node.parent_id_fk === parentId)
                .reduce((tree, node) => [
                ...tree,
                Object.assign(Object.assign({}, node), { nodes: this.makeTree(nodes, node.id) }),
            ], []);
        });
    }
    async create(dto) {
        try {
            const dups = await this.repo.createQueryBuilder()
                .where('title = :title', { title: dto.title })
                .getCount();
            if (dups === 0) {
                await this.repo.createQueryBuilder()
                    .insert()
                    .values([
                    Object.assign(Object.assign({}, dto), { status: 1 })
                ])
                    .execute();
            }
            else {
                throw new common_1.HttpException(`${dto.title} already exists`, 400);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async findAll(params) {
        if (params.page && params.size) {
            const list = await this.repo.createQueryBuilder()
                .take(params.size)
                .skip(params.page)
                .getMany();
            const total = await this.repo.createQueryBuilder()
                .getCount();
            return {
                list: list,
                total: total
            };
        }
        return await this.repo.createQueryBuilder()
            .where('status = :status', { status: 1 })
            .getMany();
    }
    async findAllJobsForHSE(ids) {
        try {
            if (ids.length == 0) {
                return await this.repo.createQueryBuilder()
                    .getMany();
            }
            else {
                return await this.repo.createQueryBuilder()
                    .where('not(id in (:...arr))', { arr: ids })
                    .getMany();
            }
        }
        catch (err) {
            throw err;
        }
    }
    async findOne(id) {
        try {
            return await this.repo.createQueryBuilder()
                .where('id = :id', { id: id })
                .getOne();
        }
        catch (err) {
            throw err;
        }
    }
    async update(id, dto) {
        try {
            console.log(dto);
            return await this.repo.createQueryBuilder()
                .update()
                .set(dto)
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async remove(id) {
        try {
            return await this.repo.createQueryBuilder()
                .delete()
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async createPermission(dto) {
        try {
            const values = [];
            const valid = await this.repo.createQueryBuilder()
                .where('id = :id', { id: dto.jobId })
                .getCount();
            if (valid > 0) {
                await this.jobPermissionRepo.createQueryBuilder()
                    .delete()
                    .where('jobs_id_fk = :id', { id: dto.jobId })
                    .execute();
                for (let i = 0; i < dto.permissions.length; i++) {
                    values.push({
                        jobs_id_fk: dto.jobId,
                        permission: dto.permissions[i]
                    });
                }
                await this.jobPermissionRepo.createQueryBuilder()
                    .insert()
                    .values(values)
                    .execute();
            }
            else {
                throw new common_1.HttpException('job id is not valid', 400);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async findPermissions(jobId) {
        try {
            return await this.jobPermissionRepo.createQueryBuilder()
                .where('jobs_id_fk = :id', { id: jobId })
                .getMany();
        }
        catch (err) {
            throw err;
        }
    }
    async createJobTaminCode(dto) {
        try {
            const valid = await this.repo.createQueryBuilder()
                .where('id = :id', { id: dto.jobId })
                .getCount();
            if (valid > 0) {
                await this.jobTaminCodeRepo.createQueryBuilder()
                    .delete()
                    .where('jobs_id_fk = :jid', { jid: dto.jobId })
                    .execute();
                const values = [];
                for (let i = 0; i < dto.codes.length; i++) {
                    values.push({
                        jobs_id_fk: dto.jobId,
                        code: dto.codes[i]
                    });
                }
                await this.jobTaminCodeRepo.createQueryBuilder()
                    .insert()
                    .values(values)
                    .execute();
            }
            else {
                throw new common_1.HttpException('job id is not valid', 400);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async findTaminCodes(jobId) {
        try {
            return await (0, typeorm_2.createQueryBuilder)('jobs_tamin_code', 't1')
                .leftJoinAndSelect('jobs', 't2', 't1.jobs_id_fk = t2.id')
                .where('t1.jobs_id_fk = :jid', { jid: jobId })
                .select([
                't1.id as id',
                't1.jobs_id_fk as jobs_id_fk',
                't1.code as code',
                't2.title as title'
            ])
                .getRawMany();
        }
        catch (err) {
            throw err;
        }
    }
    async createJobsShift(dto) {
        try {
            const shift = await this.jobShiftRepo.createQueryBuilder()
                .insert()
                .values([
                {
                    title: dto.title,
                    enabled: dto.enabled == true ? 1 : 0,
                    time_off_days: dto.numberOfTimeOffDays,
                    timespan: dto.timespan,
                    calculate_public_holidays: dto.calculatePublicHolidays == true ? 1 : 0,
                    calculate_extra_work: dto.calculateExtraWork == true ? 1 : 0,
                    calculate_off_work: dto.calculateOffWork == true ? 1 : 0,
                    calculate_friday: dto.calculateFriday == true ? 1 : 0,
                    calculate_night: dto.calculateNight == true ? 1 : 0,
                    public_holidays_are_off: dto.publicHolidaysAreOff == true ? 1 : 0,
                }
            ])
                .execute();
            const values = [];
            for (let i = 0; i < dto.patterns.length; i++) {
                values.push({
                    shift_id_fk: shift.identifiers[0].id,
                    status: dto.patterns[i].status,
                    days: dto.patterns[i].days,
                    from_time: dto.patterns[i].from,
                    to_time: dto.patterns[i].to
                });
            }
            await this.jobShiftPatternRepo.createQueryBuilder()
                .insert()
                .values(values)
                .execute();
            return shift;
        }
        catch (err) {
            throw err;
        }
    }
    async updateJobShift(id, dto) {
        try {
            const _dto = {};
            if (dto.title) {
                _dto.title = dto.title;
            }
            if (dto.enabled) {
                _dto.enabled = dto.enabled;
            }
            ;
            if (dto.numberOfTimeOffDays) {
                _dto.time_off_days = dto.numberOfTimeOffDays;
            }
            ;
            if (dto.timespan) {
                _dto.timespan = dto.timespan;
            }
            ;
            if (dto.calculatePublicHolidays) {
                _dto.calculate_public_holidays = dto.calculatePublicHolidays;
            }
            ;
            if (dto.calculateExtraWork) {
                _dto.calculate_extra_work = dto.calculateExtraWork;
            }
            ;
            if (dto.publicHolidaysAreOff) {
                _dto.public_holidays_are_off = dto.publicHolidaysAreOff;
            }
            ;
            if (dto.calculateNight) {
                _dto.calculate_night = dto.calculateNight;
            }
            ;
            if (dto.calculateFriday) {
                _dto.calculate_friday = dto.calculateFriday;
            }
            ;
            await this.jobShiftRepo.createQueryBuilder()
                .update()
                .where('id = :id', { id: id })
                .set(_dto)
                .execute();
            if (dto.patterns) {
                await this.jobShiftPatternRepo.createQueryBuilder()
                    .delete()
                    .where('shift_id_fk = :sid', { sid: id })
                    .execute();
                const values = [];
                for (let i = 0; i < dto.patterns.length; i++) {
                    values.push({
                        shift_id_fk: id,
                        status: dto.patterns[i].status,
                        days: dto.patterns[i].days,
                        from_time: dto.patterns[i].from,
                        to_time: dto.patterns[i].to
                    });
                }
                await this.jobShiftPatternRepo.createQueryBuilder()
                    .insert()
                    .values(values)
                    .execute();
            }
        }
        catch (err) {
            throw err;
        }
    }
    async deleteJobShift(id) {
        try {
            await this.jobShiftRepo.createQueryBuilder()
                .delete()
                .where('id = :id', { id: id })
                .execute();
            await this.jobShiftPatternRepo.createQueryBuilder()
                .delete()
                .where('shift_id_fk = :jid', { jid: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async findAllShifts() {
        try {
            const shifts = await await this.jobShiftRepo.createQueryBuilder().getMany();
            for (let i = 0; i < shifts.length; i++) {
                const patterns = await this.jobShiftPatternRepo.createQueryBuilder().where('shift_id_fk= :sid', { sid: shifts[i].id }).getMany();
                shifts[i].patterns = patterns;
            }
            return shifts;
        }
        catch (err) {
            throw err;
        }
    }
    async shiftDetails(id) {
        try {
            const shift = await this.jobShiftRepo.createQueryBuilder()
                .where('id = :id', { id: id })
                .getOne();
            const patterns = await this.jobShiftPatternRepo.createQueryBuilder()
                .where('shift_id_fk = :sid', { sid: id })
                .getMany();
            return {
                shift: shift,
                patterns: patterns
            };
        }
        catch (err) {
            throw err;
        }
    }
    async jobTitle(dto) {
        try {
            console.log(dto.codes.toString());
            const output = {};
            const jobs = await (0, typeorm_2.createQueryBuilder)('jobs_tamin_code', 't1')
                .leftJoinAndSelect('jobs', 't2', 't1.jobs_id_fk = t2.id')
                .where('t1.code IN (:...code)', { code: dto.codes })
                .select([
                't1.code as code',
                't2.title as title'
            ])
                .getRawMany();
            jobs.forEach(item => {
                output[`${item.code}`] = item.title;
            });
            return output;
        }
        catch (err) {
            throw err;
        }
    }
    async createJobChart(dto) {
        try {
            const _dto = Object.assign({}, dto);
            delete _dto.nodes;
            const jobChart = await this.jobChartRepo.createQueryBuilder()
                .insert()
                .values([_dto])
                .execute();
            if (dto.nodes != null && dto.nodes.length > 0) {
                await this._insertNodes(dto.nodes, jobChart.identifiers[0].id, jobChart.identifiers[0].id);
            }
            return jobChart;
        }
        catch (err) {
            throw err;
        }
    }
    async updateJobChart(id, dto) {
        try {
            const _dto = dto;
            _dto.enable = dto.enable == true ? 1 : 0;
            return await this.jobChartRepo.createQueryBuilder()
                .update()
                .set(_dto)
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async updateJobChartNode(id, dto) {
        try {
            return await this.jobChartNodeRepo.createQueryBuilder()
                .update()
                .set(dto)
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async listOfCharts() {
        try {
            return await this.jobChartRepo.createQueryBuilder()
                .select()
                .getMany();
        }
        catch (err) {
            throw err;
        }
    }
    async chartDetail(id) {
        try {
            const chart = await this.jobChartRepo.createQueryBuilder()
                .where('id = :id', { id: id })
                .getOne();
            if (chart) {
                const nodes = await this.jobChartNodeRepo.createQueryBuilder()
                    .where('chart_id_fk = :cid', { cid: id })
                    .getMany();
                chart.nodes = this.makeTree(nodes, null);
                return chart;
            }
            else {
                throw new common_1.HttpException('chart not found', 400);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async deleteNodeChart(id) {
        try {
            await this.jobChartNodeRepo.createQueryBuilder()
                .delete()
                .where('id = :id', { id: id })
                .execute();
            await this.jobChartNodeRepo.createQueryBuilder()
                .delete()
                .where('parent_id_fk = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async deleteChart(id) {
        try {
            await this.jobChartRepo.createQueryBuilder()
                .delete()
                .where('id = :id', { id: id })
                .execute();
            await this.jobChartNodeRepo.createQueryBuilder()
                .delete()
                .where('chart_id_fk = :cid', { cid: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async addChildToNode(nodeId, child) {
        try {
            const node = await this.jobChartNodeRepo.createQueryBuilder()
                .where('id = :id', { id: nodeId })
                .getOne();
            console.log(child);
            if (node) {
                return await this.jobChartNodeRepo.createQueryBuilder()
                    .insert()
                    .values([
                    {
                        count: child.count,
                        jobs_tamin_code_id_fk: child.jobs_tamin_code_id_fk,
                        title: child.title,
                        parent_id_fk: nodeId,
                        chart_id_fk: node.chart_id_fk
                    }
                ])
                    .execute();
            }
            else {
                throw new common_1.HttpException('node could not be found', 400);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async findPersonnelShift(personnelId) {
        try {
            const list = await (0, typeorm_2.createQueryBuilder)('personnel_shift', 't1')
                .innerJoinAndSelect('jobs_shift', 't2', 't1.jobs_shift_id_fk = t2.id')
                .where('t1.personnel_id_fk = :pid', { pid: personnelId })
                .select([
                't2.*',
                't1.start_date as start_date',
                't1.end_date as end_date'
            ])
                .getRawMany();
            return list;
        }
        catch (err) {
            throw err;
        }
    }
    async regenerateFromExistingChart(id) {
        try {
            const chart = await this.jobChartRepo.createQueryBuilder()
                .where('id = :id', { id: id })
                .getOne();
            if (chart) {
                const chartNodes = await this.jobChartNodeRepo.createQueryBuilder()
                    .where('chart_id_fk = :cid', { cid: chart.id })
                    .getMany();
                const _newChart = chart;
                delete _newChart.id;
                const newChart = await this.jobChartRepo.createQueryBuilder()
                    .insert()
                    .values([
                    _newChart
                ])
                    .execute();
                const addedNodes = [];
                for (let i = 0; i < chartNodes.length; i++) {
                    const node = chartNodes[i];
                    let newNode = null;
                    if (node.parent_id_fk == null) {
                        let nId = node.id;
                        delete node.id;
                        node.chart_id_fk = newChart.identifiers[0].id;
                        newNode = await this.jobChartNodeRepo.createQueryBuilder()
                            .insert()
                            .values([Object.assign({}, node)])
                            .execute();
                        addedNodes.push({
                            oldId: nId,
                            oldParentId: node.parent_id_fk,
                            newId: newNode.identifiers[0].id
                        });
                    }
                    else {
                        const found = addedNodes.find(x => x.oldId === node.parent_id_fk);
                        if (found) {
                            newNode = await this.jobChartNodeRepo.createQueryBuilder()
                                .insert()
                                .values([
                                {
                                    chart_id_fk: newChart.identifiers[0].id,
                                    title: node.title,
                                    parent_id_fk: found.newId,
                                    count: node.count,
                                    jobs_tamin_code_id_fk: node.jobs_tamin_code_id_fk
                                }
                            ])
                                .execute();
                            addedNodes.push({
                                oldId: node.id,
                                oldParentId: node.parent_id_fk,
                                newId: newNode.identifiers[0].id
                            });
                        }
                        else {
                            console.log('not found ---------');
                            console.log(node);
                            console.log('--------');
                        }
                    }
                    newNode = null;
                }
                return newChart;
            }
            else {
                throw new common_1.HttpException('chart could not be found', 400);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async findJobInCompanyChart(jobId) {
        try {
            return await (0, typeorm_2.createQueryBuilder)('jobs_chart_node', 't1')
                .innerJoinAndSelect('jobs_chart', 't2', 't1.chart_id_fk = t2.id')
                .innerJoinAndSelect('company', 't3', 't2.company_id_fk = t3.id')
                .innerJoinAndSelect('jobs_tamin_code', 't4', 't1.jobs_tamin_code_id_fk = t4.id')
                .innerJoinAndSelect('jobs', 't5', 't4.jobs_id_fk = t5.id')
                .groupBy('t3.id')
                .where('t4.jobs_id_fk = :id', { id: jobId })
                .select([
                't3.id as id',
                't3.name as title'
            ])
                .getRawMany();
        }
        catch (err) {
            throw err;
        }
    }
};
JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_schema_1.Job)),
    __param(1, (0, typeorm_1.InjectRepository)(job_permission_schema_1.JobPermission)),
    __param(2, (0, typeorm_1.InjectRepository)(job_tamin_code_schema_1.JobsTaminCode)),
    __param(3, (0, typeorm_1.InjectRepository)(job_shift_schema_1.JobsShift)),
    __param(4, (0, typeorm_1.InjectRepository)(job_shift_pattern_schema_1.JobsShiftPattern)),
    __param(5, (0, typeorm_1.InjectRepository)(job_chart_schema_1.JobChart)),
    __param(6, (0, typeorm_1.InjectRepository)(job_chart_node_schema_1.JobChartNode)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object, typeof (_f = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _f : Object, typeof (_g = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _g : Object])
], JobsService);
exports.JobsService = JobsService;


/***/ }),
/* 147 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HseController = void 0;
const common_1 = __webpack_require__(4);
const hse_service_1 = __webpack_require__(143);
const create_question_dto_1 = __webpack_require__(148);
const auth_guards_1 = __webpack_require__(16);
const create_checklist_dto_1 = __webpack_require__(150);
const update_checklist_dto_1 = __webpack_require__(152);
const create_allocate_question_dto_1 = __webpack_require__(153);
const update_allocate_question_dto_1 = __webpack_require__(154);
const get_questions_dto_1 = __webpack_require__(155);
const create_audit_dto_1 = __webpack_require__(156);
const express_1 = __webpack_require__(39);
let HseController = class HseController {
    constructor(hseService) {
        this.hseService = hseService;
    }
    listOfTypes() {
        return this.hseService.findTypesForHSE();
    }
    listOfJobs() {
        return this.hseService.findJobsForHSE();
    }
    createQuestion(body) {
        return this.hseService.createQuestion(body);
    }
    updateQuestion(body, id) {
        return this.hseService.updateQuestion(+id, body);
    }
    listQuestions() {
        return this.hseService.listQuestions();
    }
    getQuestionByCode(code) {
        return this.hseService.getQuestionByCode(code);
    }
    deleteQuestion(id) {
        return this.hseService.deleteQuestion(+id);
    }
    createChecklist(body) {
        return this.hseService.createCheckList(body);
    }
    async findAllChecklist() {
        return await this.hseService.findAllCheckList();
    }
    findPublicChecklist(id) {
        return this.hseService.findCheckList(+id);
    }
    updatePublicChecklist(id, body) {
        return this.hseService.updateChecklist(+id, body);
    }
    deletePublicChecklist(id) {
        return this.hseService.deleteChecklist(+id);
    }
    allocate(body) {
        return this.hseService.createAllocate(body);
    }
    findAllocate(params) {
        const { pid, vid, eid } = params;
        if (pid != undefined) {
            return this.hseService.findAllocatesOf(+pid, null, null);
        }
        else if (vid != undefined) {
            return this.hseService.findAllocatesOf(null, +vid, null);
        }
        else if (eid != undefined) {
            return this.hseService.findAllocatesOf(null, null, +eid);
        }
    }
    updateAllocate(id, body) {
        return this.hseService.updateAllocate(+id, body);
    }
    deleteAllocate(id) {
        return this.hseService.deleteAllocate(+id);
    }
    getQuestions(body) {
        return this.hseService.getHSEQuestions(body);
    }
    createAudit(req, body) {
        return this.hseService.createAudit(req.user.id, body);
    }
    updateAudit(id, req, body) {
        return this.hseService.updateHse(+id, req.user.id, body);
    }
    findAudit(id, req) {
        return this.hseService.findHse(+id, req.user.id);
    }
    listMyAudits(req) {
        return this.hseService.listMyHSE(req.user.id);
    }
    deleteMyAudit(req, id) {
        return this.hseService.deleteAudit(+id, req.user.id);
    }
};
__decorate([
    (0, common_1.Get)('/types'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HseController.prototype, "listOfTypes", null);
__decorate([
    (0, common_1.Get)('/jobs'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HseController.prototype, "listOfJobs", null);
__decorate([
    (0, common_1.Post)('/question'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_question_dto_1.HSECreateQuestionDTO !== "undefined" && create_question_dto_1.HSECreateQuestionDTO) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "createQuestion", null);
__decorate([
    (0, common_1.Patch)('/question/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_question_dto_1.HSECreateQuestionDTO !== "undefined" && create_question_dto_1.HSECreateQuestionDTO) === "function" ? _b : Object, String]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "updateQuestion", null);
__decorate([
    (0, common_1.Get)('/question'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HseController.prototype, "listQuestions", null);
__decorate([
    (0, common_1.Get)('/question/bycode/:code'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "getQuestionByCode", null);
__decorate([
    (0, common_1.Delete)('/question/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "deleteQuestion", null);
__decorate([
    (0, common_1.Post)('/checklist'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_checklist_dto_1.HSECreateChecklistDTO !== "undefined" && create_checklist_dto_1.HSECreateChecklistDTO) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "createChecklist", null);
__decorate([
    (0, common_1.Get)('/checklist'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HseController.prototype, "findAllChecklist", null);
__decorate([
    (0, common_1.Get)('/checklist/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "findPublicChecklist", null);
__decorate([
    (0, common_1.Patch)('/checklist/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof update_checklist_dto_1.HSEUpdateChecklistDTO !== "undefined" && update_checklist_dto_1.HSEUpdateChecklistDTO) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "updatePublicChecklist", null);
__decorate([
    (0, common_1.Delete)('/checklist/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "deletePublicChecklist", null);
__decorate([
    (0, common_1.Post)('/allocate'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof create_allocate_question_dto_1.HSECreateAllocateQuestion !== "undefined" && create_allocate_question_dto_1.HSECreateAllocateQuestion) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "allocate", null);
__decorate([
    (0, common_1.Get)('/allocate'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "findAllocate", null);
__decorate([
    (0, common_1.Patch)('/allocate/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof update_allocate_question_dto_1.HSEUpdateAllocateQuestion !== "undefined" && update_allocate_question_dto_1.HSEUpdateAllocateQuestion) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "updateAllocate", null);
__decorate([
    (0, common_1.Delete)('/allocate/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "deleteAllocate", null);
__decorate([
    (0, common_1.Post)('/audit/questions'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof get_questions_dto_1.HSEGetQuestionsDTO !== "undefined" && get_questions_dto_1.HSEGetQuestionsDTO) === "function" ? _g : Object]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "getQuestions", null);
__decorate([
    (0, common_1.Post)('/audit'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _h : Object, typeof (_j = typeof create_audit_dto_1.CreateHSEAuditDTO !== "undefined" && create_audit_dto_1.CreateHSEAuditDTO) === "function" ? _j : Object]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "createAudit", null);
__decorate([
    (0, common_1.Patch)('/audit/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_k = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _k : Object, typeof (_l = typeof create_audit_dto_1.CreateHSEAuditDTO !== "undefined" && create_audit_dto_1.CreateHSEAuditDTO) === "function" ? _l : Object]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "updateAudit", null);
__decorate([
    (0, common_1.Get)('/audit/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_m = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _m : Object]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "findAudit", null);
__decorate([
    (0, common_1.Get)('/audit'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _o : Object]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "listMyAudits", null);
__decorate([
    (0, common_1.Delete)('/audit/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_p = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _p : Object, String]),
    __metadata("design:returntype", void 0)
], HseController.prototype, "deleteMyAudit", null);
HseController = __decorate([
    (0, common_1.Controller)('hse'),
    __metadata("design:paramtypes", [typeof (_q = typeof hse_service_1.HseService !== "undefined" && hse_service_1.HseService) === "function" ? _q : Object])
], HseController);
exports.HseController = HseController;


/***/ }),
/* 148 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HSECreateQuestionDTO = void 0;
const class_validator_1 = __webpack_require__(42);
const hse_rate_type_enum_1 = __webpack_require__(149);
class HSECreateQuestionDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HSECreateQuestionDTO.prototype, "group", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HSECreateQuestionDTO.prototype, "question", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(hse_rate_type_enum_1.HSERateType),
    __metadata("design:type", String)
], HSECreateQuestionDTO.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HSECreateQuestionDTO.prototype, "isReverse", void 0);
exports.HSECreateQuestionDTO = HSECreateQuestionDTO;


/***/ }),
/* 149 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HSERateType = void 0;
var HSERateType;
(function (HSERateType) {
    HSERateType["RATE"] = "rate";
    HSERateType["CRITICAL_TO_PERFECT"] = "critical/perfect";
    HSERateType["NOTHING_TO_MORE"] = "nothing/more";
    HSERateType["MEASUREMENT"] = "measurement";
    HSERateType["YES_NO"] = "yes/no";
    HSERateType["WELL_FAULTY"] = "well/fault";
    HSERateType["LOW_HIGH"] = "low/high";
})(HSERateType = exports.HSERateType || (exports.HSERateType = {}));


/***/ }),
/* 150 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HSECheckListQuestionDTO = exports.HSECreateChecklistDTO = void 0;
const class_transformer_1 = __webpack_require__(41);
const class_validator_1 = __webpack_require__(42);
const hse_group_enum_1 = __webpack_require__(144);
const hse_checklist_type_enum_1 = __webpack_require__(151);
class HSECreateChecklistDTO {
}
__decorate([
    (0, class_validator_1.IsEnum)(hse_group_enum_1.HSEGroup),
    __metadata("design:type", String)
], HSECreateChecklistDTO.prototype, "group", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSECreateChecklistDTO.prototype, "environmentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSECreateChecklistDTO.prototype, "jobsId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSECreateChecklistDTO.prototype, "vehicleTypeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HSECreateChecklistDTO.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => HSECheckListQuestionDTO),
    __metadata("design:type", Array)
], HSECreateChecklistDTO.prototype, "questions", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(hse_checklist_type_enum_1.HSEChecklistType),
    __metadata("design:type", String)
], HSECreateChecklistDTO.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSECreateChecklistDTO.prototype, "minimumPoint", void 0);
exports.HSECreateChecklistDTO = HSECreateChecklistDTO;
class HSECheckListQuestionDTO {
}
__decorate([
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(3),
    __metadata("design:type", Number)
], HSECheckListQuestionDTO.prototype, "weight_factor", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSECheckListQuestionDTO.prototype, "questionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HSECheckListQuestionDTO.prototype, "critical", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HSECheckListQuestionDTO.prototype, "requirements", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HSECheckListQuestionDTO.prototype, "description", void 0);
exports.HSECheckListQuestionDTO = HSECheckListQuestionDTO;


/***/ }),
/* 151 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HSEChecklistType = void 0;
var HSEChecklistType;
(function (HSEChecklistType) {
    HSEChecklistType["PUBLIC"] = "public";
})(HSEChecklistType = exports.HSEChecklistType || (exports.HSEChecklistType = {}));


/***/ }),
/* 152 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HSEUpdateChecklistDTO = void 0;
const class_transformer_1 = __webpack_require__(41);
const class_validator_1 = __webpack_require__(42);
const hse_checklist_type_enum_1 = __webpack_require__(151);
const hse_group_enum_1 = __webpack_require__(144);
const create_checklist_dto_1 = __webpack_require__(150);
class HSEUpdateChecklistDTO {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(hse_group_enum_1.HSEGroup),
    __metadata("design:type", String)
], HSEUpdateChecklistDTO.prototype, "group", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSEUpdateChecklistDTO.prototype, "environmentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSEUpdateChecklistDTO.prototype, "jobsId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSEUpdateChecklistDTO.prototype, "vehicleTypeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HSEUpdateChecklistDTO.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_checklist_dto_1.HSECheckListQuestionDTO),
    __metadata("design:type", Array)
], HSEUpdateChecklistDTO.prototype, "questions", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(hse_checklist_type_enum_1.HSEChecklistType),
    __metadata("design:type", String)
], HSEUpdateChecklistDTO.prototype, "type", void 0);
exports.HSEUpdateChecklistDTO = HSEUpdateChecklistDTO;


/***/ }),
/* 153 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HSECreateAllocateQuestion = void 0;
const class_validator_1 = __webpack_require__(42);
class HSECreateAllocateQuestion {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], HSECreateAllocateQuestion.prototype, "questionIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSECreateAllocateQuestion.prototype, "personnelId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSECreateAllocateQuestion.prototype, "vehicleId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSECreateAllocateQuestion.prototype, "environmentId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], HSECreateAllocateQuestion.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], HSECreateAllocateQuestion.prototype, "toDate", void 0);
__decorate([
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(3),
    __metadata("design:type", Number)
], HSECreateAllocateQuestion.prototype, "weightFactor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HSECreateAllocateQuestion.prototype, "requirements", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HSECreateAllocateQuestion.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HSECreateAllocateQuestion.prototype, "critical", void 0);
exports.HSECreateAllocateQuestion = HSECreateAllocateQuestion;


/***/ }),
/* 154 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HSEUpdateAllocateQuestion = void 0;
const class_validator_1 = __webpack_require__(42);
const hse_rate_type_enum_1 = __webpack_require__(149);
class HSEUpdateAllocateQuestion {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSEUpdateAllocateQuestion.prototype, "questionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSEUpdateAllocateQuestion.prototype, "personnelId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSEUpdateAllocateQuestion.prototype, "vehicleId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSEUpdateAllocateQuestion.prototype, "environmentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], HSEUpdateAllocateQuestion.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], HSEUpdateAllocateQuestion.prototype, "toDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(3),
    __metadata("design:type", Number)
], HSEUpdateAllocateQuestion.prototype, "weightFactor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HSEUpdateAllocateQuestion.prototype, "requirements", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HSEUpdateAllocateQuestion.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(hse_rate_type_enum_1.HSERateType),
    __metadata("design:type", String)
], HSEUpdateAllocateQuestion.prototype, "critical", void 0);
exports.HSEUpdateAllocateQuestion = HSEUpdateAllocateQuestion;


/***/ }),
/* 155 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HSEGetQuestionsDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class HSEGetQuestionsDTO {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSEGetQuestionsDTO.prototype, "personnelId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSEGetQuestionsDTO.prototype, "vehicleId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSEGetQuestionsDTO.prototype, "environmentId", void 0);
exports.HSEGetQuestionsDTO = HSEGetQuestionsDTO;


/***/ }),
/* 156 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HSEAuditQuestionDTO = exports.CreateHSEAuditDTO = void 0;
const class_transformer_1 = __webpack_require__(41);
const class_validator_1 = __webpack_require__(42);
class CreateHSEAuditDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreateHSEAuditDTO.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHSEAuditDTO.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHSEAuditDTO.prototype, "vehicle_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHSEAuditDTO.prototype, "environment_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHSEAuditDTO.prototype, "troubleshooter_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHSEAuditDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => HSEAuditQuestionDTO),
    __metadata("design:type", Array)
], CreateHSEAuditDTO.prototype, "questions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateHSEAuditDTO.prototype, "draft", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHSEAuditDTO.prototype, "minimumPoint", void 0);
exports.CreateHSEAuditDTO = CreateHSEAuditDTO;
class HSEAuditQuestionDTO {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HSEAuditQuestionDTO.prototype, "questionId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HSEAuditQuestionDTO.prototype, "question", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HSEAuditQuestionDTO.prototype, "answer", void 0);
__decorate([
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(3),
    __metadata("design:type", Number)
], HSEAuditQuestionDTO.prototype, "weight_factor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HSEAuditQuestionDTO.prototype, "critical", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HSEAuditQuestionDTO.prototype, "requirements", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HSEAuditQuestionDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HSEAuditQuestionDTO.prototype, "group", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HSEAuditQuestionDTO.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HSEAuditQuestionDTO.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], HSEAuditQuestionDTO.prototype, "isNotRelated", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HSEAuditQuestionDTO.prototype, "operatorDescription", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HSEAuditQuestionDTO.prototype, "isReverse", void 0);
exports.HSEAuditQuestionDTO = HSEAuditQuestionDTO;


/***/ }),
/* 157 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VehicleModule = void 0;
const common_1 = __webpack_require__(4);
const vehicle_service_1 = __webpack_require__(145);
const vehicle_controller_1 = __webpack_require__(158);
const typeorm_1 = __webpack_require__(9);
const vehicle_type_schema_1 = __webpack_require__(89);
const personnel_module_1 = __webpack_require__(10);
const vehicle_schema_1 = __webpack_require__(93);
let VehicleModule = class VehicleModule {
};
VehicleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            personnel_module_1.PersonnelModule,
            typeorm_1.TypeOrmModule.forFeature([
                vehicle_schema_1.Vehicle,
                vehicle_type_schema_1.VehicleType
            ])
        ],
        controllers: [vehicle_controller_1.VehicleController],
        providers: [vehicle_service_1.VehicleService],
        exports: [vehicle_service_1.VehicleService]
    })
], VehicleModule);
exports.VehicleModule = VehicleModule;


/***/ }),
/* 158 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VehicleController = void 0;
const common_1 = __webpack_require__(4);
const vehicle_service_1 = __webpack_require__(145);
const create_vehicle_dto_1 = __webpack_require__(159);
const auth_guards_1 = __webpack_require__(16);
let VehicleController = class VehicleController {
    constructor(vehicleService) {
        this.vehicleService = vehicleService;
    }
    create(createVehicleDto) {
        return this.vehicleService.create(createVehicleDto);
    }
    findAllType() {
        return this.vehicleService.findAllTypes();
    }
    findWithSearch(params) {
        return this.vehicleService.findAllWithSearch(params);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_vehicle_dto_1.CreateVehicleDto !== "undefined" && create_vehicle_dto_1.CreateVehicleDto) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], VehicleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/type'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehicleController.prototype, "findAllType", null);
__decorate([
    (0, common_1.Get)('/find'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VehicleController.prototype, "findWithSearch", null);
VehicleController = __decorate([
    (0, common_1.Controller)('vehicle'),
    __metadata("design:paramtypes", [typeof (_b = typeof vehicle_service_1.VehicleService !== "undefined" && vehicle_service_1.VehicleService) === "function" ? _b : Object])
], VehicleController);
exports.VehicleController = VehicleController;


/***/ }),
/* 159 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateVehicleDto = void 0;
class CreateVehicleDto {
}
exports.CreateVehicleDto = CreateVehicleDto;


/***/ }),
/* 160 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobsModule = void 0;
const common_1 = __webpack_require__(4);
const jobs_service_1 = __webpack_require__(146);
const jobs_controller_1 = __webpack_require__(161);
const typeorm_1 = __webpack_require__(9);
const job_schema_1 = __webpack_require__(88);
const personnel_module_1 = __webpack_require__(10);
const job_permission_schema_1 = __webpack_require__(96);
const job_tamin_code_schema_1 = __webpack_require__(97);
const job_shift_schema_1 = __webpack_require__(98);
const job_shift_pattern_schema_1 = __webpack_require__(99);
const job_chart_schema_1 = __webpack_require__(100);
const job_chart_node_schema_1 = __webpack_require__(101);
let JobsModule = class JobsModule {
};
JobsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            personnel_module_1.PersonnelModule,
            typeorm_1.TypeOrmModule.forFeature([
                job_schema_1.Job,
                job_permission_schema_1.JobPermission,
                job_tamin_code_schema_1.JobsTaminCode,
                job_shift_schema_1.JobsShift,
                job_shift_pattern_schema_1.JobsShiftPattern,
                job_chart_schema_1.JobChart,
                job_chart_node_schema_1.JobChartNode
            ])
        ],
        controllers: [jobs_controller_1.JobsController],
        providers: [jobs_service_1.JobsService],
        exports: [jobs_service_1.JobsService]
    })
], JobsModule);
exports.JobsModule = JobsModule;


/***/ }),
/* 161 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobsController = void 0;
const common_1 = __webpack_require__(4);
const jobs_service_1 = __webpack_require__(146);
const create_job_dto_1 = __webpack_require__(162);
const update_job_dto_1 = __webpack_require__(163);
const auth_guards_1 = __webpack_require__(16);
const create_job_permission_dto_1 = __webpack_require__(164);
const create_job_tamincode_dto_1 = __webpack_require__(165);
const create_jobs_shift_dto_1 = __webpack_require__(166);
const update_jobs_shift_dto_1 = __webpack_require__(167);
const job_title_dto_1 = __webpack_require__(168);
const create_job_chart_dto_1 = __webpack_require__(169);
const update_job_chart_dto_1 = __webpack_require__(171);
const update_job_chart_node_dto_1 = __webpack_require__(172);
const create_job_chart_node_dto_1 = __webpack_require__(170);
let JobsController = class JobsController {
    constructor(jobsService) {
        this.jobsService = jobsService;
    }
    create(createJobDto) {
        return this.jobsService.create(createJobDto);
    }
    findAll(params) {
        return this.jobsService.findAll(params);
    }
    findShifts() {
        return this.jobsService.findAllShifts();
    }
    findJobsInCompanyChart(id) {
        return this.jobsService.findJobInCompanyChart(+id);
    }
    detailOfChart(id) {
        return this.jobsService.chartDetail(+id);
    }
    listOfCharts() {
        console.log('here');
        return this.jobsService.listOfCharts();
    }
    findOne(id) {
        return this.jobsService.findOne(+id);
    }
    update(id, updateJobDto) {
        return this.jobsService.update(+id, updateJobDto);
    }
    remove(id) {
        return this.jobsService.remove(+id);
    }
    createJobPermission(body) {
        return this.jobsService.createPermission(body);
    }
    listJobsPermissions(id) {
        return this.jobsService.findPermissions(+id);
    }
    createJobTaminCode(body) {
        return this.jobsService.createJobTaminCode(body);
    }
    findJobTaminCode(id) {
        return this.jobsService.findTaminCodes(+id);
    }
    createJobShift(body) {
        return this.jobsService.createJobsShift(body);
    }
    updateJobShift(id, body) {
        return this.jobsService.updateJobShift(+id, body);
    }
    deleteJobShift(id) {
        return this.jobsService.deleteJobShift(+id);
    }
    findShiftDetail(id) {
        return this.jobsService.shiftDetails(+id);
    }
    findPersonnelShift(id) {
        return this.jobsService.findPersonnelShift(+id);
    }
    regenerateFromAnExistingChart(id) {
        return this.jobsService.regenerateFromExistingChart(+id);
    }
    jobTitle(body) {
        return this.jobsService.jobTitle(body);
    }
    createJobChart(dto) {
        return this.jobsService.createJobChart(dto);
    }
    updateJobChartNode(id, body) {
        return this.jobsService.updateJobChartNode(+id, body);
    }
    updateJobChart(id, body) {
        return this.jobsService.updateJobChart(+id, body);
    }
    deleteChart(id) {
        return this.jobsService.deleteChart(+id);
    }
    deleteChartNode(id) {
        return this.jobsService.deleteNodeChart(+id);
    }
    addChildToNode(nid, body) {
        return this.jobsService.addChildToNode(+nid, body);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_job_dto_1.CreateJobDto !== "undefined" && create_job_dto_1.CreateJobDto) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/shift'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findShifts", null);
__decorate([
    (0, common_1.Get)('/:jobId/in-company-chart'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findJobsInCompanyChart", null);
__decorate([
    (0, common_1.Get)('/chart/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "detailOfChart", null);
__decorate([
    (0, common_1.Get)('/chart'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "listOfCharts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof update_job_dto_1.UpdateJobDto !== "undefined" && update_job_dto_1.UpdateJobDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('/permission'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_job_permission_dto_1.CreateJobPermissionDTO !== "undefined" && create_job_permission_dto_1.CreateJobPermissionDTO) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "createJobPermission", null);
__decorate([
    (0, common_1.Get)('/permission/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "listJobsPermissions", null);
__decorate([
    (0, common_1.Post)('/tamin'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof create_job_tamincode_dto_1.CreateJobTaminCodeDTO !== "undefined" && create_job_tamincode_dto_1.CreateJobTaminCodeDTO) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "createJobTaminCode", null);
__decorate([
    (0, common_1.Get)('/tamin/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findJobTaminCode", null);
__decorate([
    (0, common_1.Post)('/shift'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof create_jobs_shift_dto_1.CreateJobsShiftDTO !== "undefined" && create_jobs_shift_dto_1.CreateJobsShiftDTO) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "createJobShift", null);
__decorate([
    (0, common_1.Patch)('/shift/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof update_jobs_shift_dto_1.UpdateJobsShiftDTO !== "undefined" && update_jobs_shift_dto_1.UpdateJobsShiftDTO) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "updateJobShift", null);
__decorate([
    (0, common_1.Delete)('/shift/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "deleteJobShift", null);
__decorate([
    (0, common_1.Get)('/shift/detail/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findShiftDetail", null);
__decorate([
    (0, common_1.Get)('/shift/personnel/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findPersonnelShift", null);
__decorate([
    (0, common_1.Get)('/shift/copy/from/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "regenerateFromAnExistingChart", null);
__decorate([
    (0, common_1.Post)('/title'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof job_title_dto_1.JobTitleDTO !== "undefined" && job_title_dto_1.JobTitleDTO) === "function" ? _g : Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "jobTitle", null);
__decorate([
    (0, common_1.Post)('/chart'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof create_job_chart_dto_1.CreateJobChartDTO !== "undefined" && create_job_chart_dto_1.CreateJobChartDTO) === "function" ? _h : Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "createJobChart", null);
__decorate([
    (0, common_1.Patch)('/chart/node/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_j = typeof update_job_chart_node_dto_1.UpdateJobChartNodeDTO !== "undefined" && update_job_chart_node_dto_1.UpdateJobChartNodeDTO) === "function" ? _j : Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "updateJobChartNode", null);
__decorate([
    (0, common_1.Patch)('/chart/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_k = typeof update_job_chart_dto_1.UpdateJobChartDTO !== "undefined" && update_job_chart_dto_1.UpdateJobChartDTO) === "function" ? _k : Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "updateJobChart", null);
__decorate([
    (0, common_1.Delete)('/chart/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "deleteChart", null);
__decorate([
    (0, common_1.Delete)('/chart/node/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "deleteChartNode", null);
__decorate([
    (0, common_1.Patch)('/chart/node/add-child/:nodeId'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('nodeId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_l = typeof create_job_chart_node_dto_1.CreateJobChartNodeDTO !== "undefined" && create_job_chart_node_dto_1.CreateJobChartNodeDTO) === "function" ? _l : Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "addChildToNode", null);
JobsController = __decorate([
    (0, common_1.Controller)('jobs'),
    __metadata("design:paramtypes", [typeof (_m = typeof jobs_service_1.JobsService !== "undefined" && jobs_service_1.JobsService) === "function" ? _m : Object])
], JobsController);
exports.JobsController = JobsController;


/***/ }),
/* 162 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateJobDto = void 0;
const class_validator_1 = __webpack_require__(42);
class CreateJobDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "title", void 0);
exports.CreateJobDto = CreateJobDto;


/***/ }),
/* 163 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateJobDto = void 0;
const mapped_types_1 = __webpack_require__(50);
const create_job_dto_1 = __webpack_require__(162);
class UpdateJobDto extends (0, mapped_types_1.PartialType)(create_job_dto_1.CreateJobDto) {
}
exports.UpdateJobDto = UpdateJobDto;


/***/ }),
/* 164 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateJobPermissionDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class CreateJobPermissionDTO {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateJobPermissionDTO.prototype, "jobId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateJobPermissionDTO.prototype, "permissions", void 0);
exports.CreateJobPermissionDTO = CreateJobPermissionDTO;


/***/ }),
/* 165 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateJobTaminCodeDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class CreateJobTaminCodeDTO {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateJobTaminCodeDTO.prototype, "codes", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateJobTaminCodeDTO.prototype, "jobId", void 0);
exports.CreateJobTaminCodeDTO = CreateJobTaminCodeDTO;


/***/ }),
/* 166 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobShiftPatternDTO = exports.CreateJobsShiftDTO = void 0;
const class_transformer_1 = __webpack_require__(41);
const class_validator_1 = __webpack_require__(42);
class CreateJobsShiftDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateJobsShiftDTO.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateJobsShiftDTO.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateJobsShiftDTO.prototype, "numberOfTimeOffDays", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['day', 'week', 'month', 'year']),
    __metadata("design:type", String)
], CreateJobsShiftDTO.prototype, "timespan", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateJobsShiftDTO.prototype, "calculatePublicHolidays", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateJobsShiftDTO.prototype, "calculateExtraWork", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateJobsShiftDTO.prototype, "calculateOffWork", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateJobsShiftDTO.prototype, "calculateNight", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateJobsShiftDTO.prototype, "calculateFriday", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateJobsShiftDTO.prototype, "publicHolidaysAreOff", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => JobShiftPatternDTO),
    __metadata("design:type", Array)
], CreateJobsShiftDTO.prototype, "patterns", void 0);
exports.CreateJobsShiftDTO = CreateJobsShiftDTO;
class JobShiftPatternDTO {
}
__decorate([
    (0, class_validator_1.IsEnum)(['work', 'rest']),
    __metadata("design:type", String)
], JobShiftPatternDTO.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], JobShiftPatternDTO.prototype, "days", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JobShiftPatternDTO.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JobShiftPatternDTO.prototype, "to", void 0);
exports.JobShiftPatternDTO = JobShiftPatternDTO;


/***/ }),
/* 167 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateJobsShiftDTO = void 0;
const class_transformer_1 = __webpack_require__(41);
const class_validator_1 = __webpack_require__(42);
const create_jobs_shift_dto_1 = __webpack_require__(166);
class UpdateJobsShiftDTO {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateJobsShiftDTO.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateJobsShiftDTO.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateJobsShiftDTO.prototype, "numberOfTimeOffDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['day', 'week', 'month', 'year']),
    __metadata("design:type", String)
], UpdateJobsShiftDTO.prototype, "timespan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateJobsShiftDTO.prototype, "calculatePublicHolidays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateJobsShiftDTO.prototype, "calculateExtraWork", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateJobsShiftDTO.prototype, "calculateOffWork", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateJobsShiftDTO.prototype, "calculateNight", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateJobsShiftDTO.prototype, "publicHolidaysAreOff", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateJobsShiftDTO.prototype, "calculateFriday", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_jobs_shift_dto_1.JobShiftPatternDTO),
    __metadata("design:type", Array)
], UpdateJobsShiftDTO.prototype, "patterns", void 0);
exports.UpdateJobsShiftDTO = UpdateJobsShiftDTO;


/***/ }),
/* 168 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JobTitleDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class JobTitleDTO {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], JobTitleDTO.prototype, "codes", void 0);
exports.JobTitleDTO = JobTitleDTO;


/***/ }),
/* 169 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateJobChartDTO = void 0;
const class_transformer_1 = __webpack_require__(41);
const class_validator_1 = __webpack_require__(42);
const create_job_chart_node_dto_1 = __webpack_require__(170);
class CreateJobChartDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateJobChartDTO.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateJobChartDTO.prototype, "contract_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateJobChartDTO.prototype, "enable", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreateJobChartDTO.prototype, "apply_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJobChartDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateJobChartDTO.prototype, "company_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_job_chart_node_dto_1.CreateJobChartNodeDTO),
    __metadata("design:type", Array)
], CreateJobChartDTO.prototype, "nodes", void 0);
exports.CreateJobChartDTO = CreateJobChartDTO;


/***/ }),
/* 170 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateJobChartNodeDTO = void 0;
const class_transformer_1 = __webpack_require__(41);
const class_validator_1 = __webpack_require__(42);
class CreateJobChartNodeDTO {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateJobChartNodeDTO.prototype, "count", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateJobChartNodeDTO.prototype, "jobs_tamin_code_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateJobChartNodeDTO.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateJobChartNodeDTO),
    __metadata("design:type", Array)
], CreateJobChartNodeDTO.prototype, "nodes", void 0);
exports.CreateJobChartNodeDTO = CreateJobChartNodeDTO;


/***/ }),
/* 171 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateJobChartDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class UpdateJobChartDTO {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateJobChartDTO.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateJobChartDTO.prototype, "contract_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateJobChartDTO.prototype, "enable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], UpdateJobChartDTO.prototype, "apply_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateJobChartDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateJobChartDTO.prototype, "company_id_fk", void 0);
exports.UpdateJobChartDTO = UpdateJobChartDTO;


/***/ }),
/* 172 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateJobChartNodeDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class UpdateJobChartNodeDTO {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateJobChartNodeDTO.prototype, "count", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateJobChartNodeDTO.prototype, "jobs_tamin_code_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateJobChartNodeDTO.prototype, "title", void 0);
exports.UpdateJobChartNodeDTO = UpdateJobChartNodeDTO;


/***/ }),
/* 173 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompanyModule = void 0;
const common_1 = __webpack_require__(4);
const company_service_1 = __webpack_require__(174);
const company_controller_1 = __webpack_require__(175);
const typeorm_1 = __webpack_require__(9);
const company_borad_member_schema_1 = __webpack_require__(102);
const personnel_module_1 = __webpack_require__(10);
let CompanyModule = class CompanyModule {
};
CompanyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            personnel_module_1.PersonnelModule,
            typeorm_1.TypeOrmModule.forFeature([
                company_borad_member_schema_1.CompanyBoardMember
            ])
        ],
        controllers: [company_controller_1.CompanyController],
        providers: [company_service_1.CompanyService]
    })
], CompanyModule);
exports.CompanyModule = CompanyModule;


/***/ }),
/* 174 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompanyService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(20);
const company_borad_member_schema_1 = __webpack_require__(102);
let CompanyService = class CompanyService {
    constructor(boardMemberRepo) {
        this.boardMemberRepo = boardMemberRepo;
    }
    create(createCompanyDto) {
        return 'This action adds a new company';
    }
    findAll() {
        return `This action returns all company`;
    }
    findOne(id) {
        return `This action returns a #${id} company`;
    }
    update(id, updateCompanyDto) {
        return `This action updates a #${id} company`;
    }
    remove(id) {
        return `This action removes a #${id} company`;
    }
    async createBoardMember(dto) {
        try {
            const _dto = dto;
            _dto.enabled = dto.enabled == true ? 1 : 0;
            if (dto.signature_rights) {
                dto.signature_rights = dto.signature_rights.toString();
            }
            return await this.boardMemberRepo.createQueryBuilder()
                .insert()
                .values([_dto])
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async updateBoardMember(id, dto) {
        const _dto = dto;
        _dto.enabled = dto.enabled == true ? 1 : 0;
        if (dto.signature_rights) {
            dto.signature_rights = dto.signature_rights.toString();
        }
        return await this.boardMemberRepo.createQueryBuilder()
            .update()
            .set(Object.assign({}, _dto))
            .where('id = :id', { id: id })
            .execute();
    }
    async findBoardMembers(id) {
        const list = await (0, typeorm_2.createQueryBuilder)('company_board_member', 't1')
            .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
            .where('t1.company_id_fk = :cid', { cid: id })
            .select([
            't1.id as id',
            't1.from_date as from_date',
            't1.to_date as to_date',
            't1.role as role',
            't1.enabled as enabled',
            't1.signature_rights as signature_rights',
            't1.description as description',
            't2.id as personnel_id',
            't2.first_name as first_name',
            't2.last_name as last_name',
            't2.national_number as national_number'
        ])
            .getRawMany();
        return list;
    }
    async deleteBoardMember(id) {
        try {
            return await this.boardMemberRepo.createQueryBuilder()
                .delete()
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async boardMemberByPersonnelId(id) {
        try {
            return await (0, typeorm_2.createQueryBuilder)('company_board_member', 't1')
                .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
                .where('t1.personnel_id_fk = :pid', { pid: id })
                .select([
                't1.id as id',
                't1.from_date as from_date',
                't1.to_date as to_date',
                't1.role as role',
                't1.signature_rights as signature_rights',
                't1.description as description',
                't2.id as personnel_id',
                't2.first_name as first_name',
                't2.last_name as last_name',
                't2.national_number as national_number'
            ])
                .getRawOne();
        }
        catch (err) {
            throw err;
        }
    }
    async boardMemberDetail(id) {
        try {
            return await (0, typeorm_2.createQueryBuilder)('company_board_member', 't1')
                .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
                .where('t1.id = :id', { id: id })
                .select([
                't1.id as id',
                't1.from_date as from_date',
                't1.to_date as to_date',
                't1.role as role',
                't1.signature_rights as signature_rights',
                't1.description as description',
                't1.enabled as enabled',
                't2.id as personnel_id',
                't2.first_name as first_name',
                't2.last_name as last_name',
                't2.national_number as national_number'
            ])
                .getOne();
        }
        catch (err) {
            throw err;
        }
    }
};
CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_borad_member_schema_1.CompanyBoardMember)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], CompanyService);
exports.CompanyService = CompanyService;


/***/ }),
/* 175 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompanyController = void 0;
const common_1 = __webpack_require__(4);
const auth_guards_1 = __webpack_require__(16);
const company_service_1 = __webpack_require__(174);
const create_board_member_dto_1 = __webpack_require__(176);
const create_company_dto_1 = __webpack_require__(178);
const update_board_member_dto_1 = __webpack_require__(179);
const update_company_dto_1 = __webpack_require__(180);
let CompanyController = class CompanyController {
    constructor(companyService) {
        this.companyService = companyService;
    }
    create(createCompanyDto) {
        return this.companyService.create(createCompanyDto);
    }
    findAll() {
        return this.companyService.findAll();
    }
    findOne(id) {
        return this.companyService.findOne(+id);
    }
    update(id, updateCompanyDto) {
        return this.companyService.update(+id, updateCompanyDto);
    }
    remove(id) {
        return this.companyService.remove(+id);
    }
    addBoardMember(body) {
        return this.companyService.createBoardMember(body);
    }
    updateBoardMember(body, id) {
        return this.companyService.updateBoardMember(+id, body);
    }
    findBoardMembers(id) {
        return this.companyService.findBoardMembers(+id);
    }
    async findBoardMembersById(id) {
        return await this.companyService.boardMemberDetail(+id);
    }
    findBoardMembersByPerson(id) {
        return this.companyService.boardMemberByPersonnelId(+id);
    }
    deleteBoardMember(id) {
        return this.companyService.deleteBoardMember(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_company_dto_1.CreateCompanyDto !== "undefined" && create_company_dto_1.CreateCompanyDto) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof update_company_dto_1.UpdateCompanyDto !== "undefined" && update_company_dto_1.UpdateCompanyDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('/board-members'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_board_member_dto_1.CreateBoardMemberDTO !== "undefined" && create_board_member_dto_1.CreateBoardMemberDTO) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "addBoardMember", null);
__decorate([
    (0, common_1.Patch)('/board-members/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof update_board_member_dto_1.UpdateBoardMemberDTO !== "undefined" && update_board_member_dto_1.UpdateBoardMemberDTO) === "function" ? _d : Object, String]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "updateBoardMember", null);
__decorate([
    (0, common_1.Get)('/board-members/by-company/:company_id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('company_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findBoardMembers", null);
__decorate([
    (0, common_1.Get)('/board-members/by-id/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "findBoardMembersById", null);
__decorate([
    (0, common_1.Get)('/board-members/by-person/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findBoardMembersByPerson", null);
__decorate([
    (0, common_1.Delete)('/board-members/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "deleteBoardMember", null);
CompanyController = __decorate([
    (0, common_1.Controller)('company'),
    __metadata("design:paramtypes", [typeof (_e = typeof company_service_1.CompanyService !== "undefined" && company_service_1.CompanyService) === "function" ? _e : Object])
], CompanyController);
exports.CompanyController = CompanyController;


/***/ }),
/* 176 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateBoardMemberDTO = void 0;
const class_validator_1 = __webpack_require__(42);
const company_board_member_enum_1 = __webpack_require__(103);
const signature_rights_enum_1 = __webpack_require__(177);
class CreateBoardMemberDTO {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBoardMemberDTO.prototype, "company_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBoardMemberDTO.prototype, "personnel_id_fk", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(company_board_member_enum_1.CompanyBoardMemberRole),
    __metadata("design:type", typeof (_a = typeof company_board_member_enum_1.CompanyBoardMemberRole !== "undefined" && company_board_member_enum_1.CompanyBoardMemberRole) === "function" ? _a : Object)
], CreateBoardMemberDTO.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBoardMemberDTO.prototype, "from_date", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBoardMemberDTO.prototype, "to_date", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(signature_rights_enum_1.SignatureRight, { each: true }),
    __metadata("design:type", String)
], CreateBoardMemberDTO.prototype, "signature_rights", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBoardMemberDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBoardMemberDTO.prototype, "enabled", void 0);
exports.CreateBoardMemberDTO = CreateBoardMemberDTO;


/***/ }),
/* 177 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignatureRight = void 0;
var SignatureRight;
(function (SignatureRight) {
    SignatureRight["official_documents"] = "OFFICIAL_DOCUMENTS";
    SignatureRight["commercial_documents"] = "COMMERCIAL_DOCUMENTS";
})(SignatureRight = exports.SignatureRight || (exports.SignatureRight = {}));


/***/ }),
/* 178 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCompanyDto = void 0;
const class_validator_1 = __webpack_require__(42);
class CreateCompanyDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "name", void 0);
exports.CreateCompanyDto = CreateCompanyDto;


/***/ }),
/* 179 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateBoardMemberDTO = void 0;
const mapped_types_1 = __webpack_require__(50);
const create_board_member_dto_1 = __webpack_require__(176);
class UpdateBoardMemberDTO extends (0, mapped_types_1.PartialType)(create_board_member_dto_1.CreateBoardMemberDTO) {
}
exports.UpdateBoardMemberDTO = UpdateBoardMemberDTO;


/***/ }),
/* 180 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCompanyDto = void 0;
const mapped_types_1 = __webpack_require__(50);
const create_company_dto_1 = __webpack_require__(178);
class UpdateCompanyDto extends (0, mapped_types_1.PartialType)(create_company_dto_1.CreateCompanyDto) {
}
exports.UpdateCompanyDto = UpdateCompanyDto;


/***/ }),
/* 181 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TableNameModule = void 0;
const common_1 = __webpack_require__(4);
const table_name_service_1 = __webpack_require__(182);
const table_name_controller_1 = __webpack_require__(183);
const typeorm_1 = __webpack_require__(9);
const table_name_schema_1 = __webpack_require__(106);
const column_name_schema_1 = __webpack_require__(107);
let TableNameModule = class TableNameModule {
};
TableNameModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                table_name_schema_1.TableName,
                column_name_schema_1.ColumnName
            ])
        ],
        controllers: [table_name_controller_1.TableNameController],
        providers: [table_name_service_1.TableNameService],
        exports: [table_name_service_1.TableNameService]
    })
], TableNameModule);
exports.TableNameModule = TableNameModule;


/***/ }),
/* 182 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TableNameService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(20);
const column_name_schema_1 = __webpack_require__(107);
const table_name_schema_1 = __webpack_require__(106);
let TableNameService = class TableNameService {
    constructor(repo, columnRepo) {
        this.repo = repo;
        this.columnRepo = columnRepo;
        this.dbName = process.env.DBNAME;
    }
    async create(createTableNameDto) {
        try {
            const dup = await this.repo.createQueryBuilder()
                .where('table_name = :tn', { tn: createTableNameDto.table_name })
                .getCount();
            if (dup > 0) {
                throw new common_1.HttpException('table name already exists', 400);
            }
            return await this.repo.createQueryBuilder()
                .insert()
                .values([createTableNameDto])
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async findAll() {
        try {
            return await this.repo.createQueryBuilder()
                .getMany();
        }
        catch (err) {
            throw err;
        }
    }
    async findOne(id) {
        try {
            return await this.repo.createQueryBuilder()
                .where('id = :id', { id: id })
                .getOne();
        }
        catch (err) {
            throw err;
        }
    }
    async update(id, updateTableNameDto) {
        return await this.repo.createQueryBuilder()
            .update()
            .set(updateTableNameDto)
            .where('id = :id', { id: id })
            .execute();
    }
    async remove(id) {
        return await this.repo.createQueryBuilder()
            .delete()
            .where('id = :id', { id: id })
            .execute();
    }
    async getDatabaseTables() {
        try {
            const currentNames = await this.repo.find({ select: ['table_name'] });
            let tableNames = '';
            currentNames.forEach(item => {
                tableNames += `'${item.table_name}',`;
            });
            if (tableNames.length > 0) {
                tableNames = tableNames.substring(0, tableNames.length - 1);
            }
            const tableExceptions = ['audit', 'tasks', 'tasks_log'];
            let exceptionNames = '';
            tableExceptions.forEach(item => {
                exceptionNames += `'${item}',`;
            });
            exceptionNames = exceptionNames.substring(0, exceptionNames.length - 1);
            this.queryRunner = (0, typeorm_2.getConnection)().createQueryRunner();
            const cmd = `show tables where Tables_in_${this.dbName} not in(${tableNames}) and Tables_in_${this.dbName} not in (${exceptionNames})`;
            const list = await this.queryRunner.query(cmd);
            await this.queryRunner.release();
            return list;
        }
        catch (err) {
            throw err;
        }
    }
    async fieldsOfTable(tableName) {
        try {
            const table = await this.repo.createQueryBuilder()
                .where('table_name = :tn', { tn: tableName })
                .getOne();
            let phrase = '';
            if (table) {
                const columns = await this.columnRepo.createQueryBuilder()
                    .where('table_name_id_fk = :tid', { tid: table.id })
                    .getMany();
                columns.forEach(item => {
                    phrase += `'${item.columnName}',`;
                });
                if (phrase.length > 0) {
                    phrase = phrase.substring(0, phrase.length - 1);
                }
            }
            this.queryRunner = (0, typeorm_2.getConnection)().createQueryRunner();
            let cmd = `show fields from ${tableName}`;
            if (phrase != '') {
                cmd = `show fields from ${tableName} where Field not in(${phrase})`;
            }
            const list = await this.queryRunner.query(cmd);
            this.queryRunner.release();
            return list;
        }
        catch (err) {
            throw err;
        }
    }
    async createColumnName(dto) {
        try {
            const dup = await this.columnRepo.createQueryBuilder()
                .where('table_name_id_fk = :id and column_name = :cname', { id: dto.tableId, cname: dto.columnName })
                .getCount();
            if (dup > 0) {
                throw new common_1.HttpException('Column name already exists', 400);
            }
            return await this.columnRepo.createQueryBuilder()
                .insert()
                .values([dto])
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async findColumnNameByTableId(id) {
        try {
            return await this.columnRepo.createQueryBuilder()
                .where('table_name_id_fk = :tid', { tid: id })
                .getMany();
        }
        catch (err) {
            throw err;
        }
    }
    async updateColumnName(id, dto) {
        try {
            return await this.columnRepo.createQueryBuilder()
                .update()
                .set(dto)
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async deleteColumnName(id) {
        try {
            return await this.columnRepo.createQueryBuilder()
                .delete()
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async findColumnNameDetail(id) {
        try {
            return await this.columnRepo.createQueryBuilder()
                .where('id = :id', { id: id })
                .getOne();
        }
        catch (err) {
            throw err;
        }
    }
    async getTableIdByName(name) {
        try {
            return this.repo.createQueryBuilder()
                .where('table_name = :tn', { tn: name })
                .getOne();
        }
        catch (err) {
            throw err;
        }
    }
};
TableNameService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(table_name_schema_1.TableName)),
    __param(1, (0, typeorm_1.InjectRepository)(column_name_schema_1.ColumnName)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], TableNameService);
exports.TableNameService = TableNameService;


/***/ }),
/* 183 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TableNameController = void 0;
const common_1 = __webpack_require__(4);
const table_name_service_1 = __webpack_require__(182);
const create_table_name_dto_1 = __webpack_require__(184);
const update_table_name_dto_1 = __webpack_require__(185);
const create_column_name_dto_1 = __webpack_require__(186);
const update_column_name_dto_1 = __webpack_require__(187);
let TableNameController = class TableNameController {
    constructor(tableNameService) {
        this.tableNameService = tableNameService;
    }
    create(createTableNameDto) {
        return this.tableNameService.create(createTableNameDto);
    }
    columnsOfTable(table) {
        return this.tableNameService.fieldsOfTable(table);
    }
    findDBTables() {
        return this.tableNameService.getDatabaseTables();
    }
    findAll() {
        return this.tableNameService.findAll();
    }
    findOne(id) {
        return this.tableNameService.findOne(+id);
    }
    update(id, updateTableNameDto) {
        return this.tableNameService.update(+id, updateTableNameDto);
    }
    remove(id) {
        return this.tableNameService.remove(+id);
    }
    createColumnName(body) {
        return this.tableNameService.createColumnName(body);
    }
    updateColumnName(id, body) {
        return this.tableNameService.updateColumnName(+id, body);
    }
    deleteColumnName(id) {
        return this.tableNameService.deleteColumnName(+id);
    }
    getColumnsOfTableId(id) {
        return this.tableNameService.findColumnNameByTableId(+id);
    }
    getColumnDetail(id) {
        return this.tableNameService.findColumnNameDetail(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_table_name_dto_1.CreateTableNameDto !== "undefined" && create_table_name_dto_1.CreateTableNameDto) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], TableNameController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/db/:table/fields'),
    __param(0, (0, common_1.Param)('table')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TableNameController.prototype, "columnsOfTable", null);
__decorate([
    (0, common_1.Get)('/db/tables'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TableNameController.prototype, "findDBTables", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TableNameController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TableNameController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof update_table_name_dto_1.UpdateTableNameDto !== "undefined" && update_table_name_dto_1.UpdateTableNameDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], TableNameController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TableNameController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('/column'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_column_name_dto_1.CreateColumnNameDTO !== "undefined" && create_column_name_dto_1.CreateColumnNameDTO) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], TableNameController.prototype, "createColumnName", null);
__decorate([
    (0, common_1.Patch)('/column/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof update_column_name_dto_1.UpdateColumnNameDTO !== "undefined" && update_column_name_dto_1.UpdateColumnNameDTO) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], TableNameController.prototype, "updateColumnName", null);
__decorate([
    (0, common_1.Delete)('/column/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TableNameController.prototype, "deleteColumnName", null);
__decorate([
    (0, common_1.Get)('/column/table/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TableNameController.prototype, "getColumnsOfTableId", null);
__decorate([
    (0, common_1.Get)('/column/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TableNameController.prototype, "getColumnDetail", null);
TableNameController = __decorate([
    (0, common_1.Controller)('table-name'),
    __metadata("design:paramtypes", [typeof (_e = typeof table_name_service_1.TableNameService !== "undefined" && table_name_service_1.TableNameService) === "function" ? _e : Object])
], TableNameController);
exports.TableNameController = TableNameController;


/***/ }),
/* 184 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTableNameDto = void 0;
const class_validator_1 = __webpack_require__(42);
class CreateTableNameDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTableNameDto.prototype, "table_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTableNameDto.prototype, "title", void 0);
exports.CreateTableNameDto = CreateTableNameDto;


/***/ }),
/* 185 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateTableNameDto = void 0;
const mapped_types_1 = __webpack_require__(50);
const create_table_name_dto_1 = __webpack_require__(184);
class UpdateTableNameDto extends (0, mapped_types_1.PartialType)(create_table_name_dto_1.CreateTableNameDto) {
}
exports.UpdateTableNameDto = UpdateTableNameDto;


/***/ }),
/* 186 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateColumnNameDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class CreateColumnNameDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateColumnNameDTO.prototype, "columnName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateColumnNameDTO.prototype, "tableId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateColumnNameDTO.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateColumnNameDTO.prototype, "type", void 0);
exports.CreateColumnNameDTO = CreateColumnNameDTO;


/***/ }),
/* 187 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateColumnNameDTO = void 0;
const mapped_types_1 = __webpack_require__(50);
const create_column_name_dto_1 = __webpack_require__(186);
class UpdateColumnNameDTO extends (0, mapped_types_1.PartialType)(create_column_name_dto_1.CreateColumnNameDTO) {
}
exports.UpdateColumnNameDTO = UpdateColumnNameDTO;


/***/ }),
/* 188 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksModule = void 0;
const common_1 = __webpack_require__(4);
const tasks_service_1 = __webpack_require__(189);
const tasks_controller_1 = __webpack_require__(202);
const typeorm_1 = __webpack_require__(9);
const task_schema_1 = __webpack_require__(104);
const personnel_module_1 = __webpack_require__(10);
const task_member_schema_1 = __webpack_require__(105);
const task_condition_schema_1 = __webpack_require__(108);
const task_subscriber_subscriber_1 = __webpack_require__(213);
const test_table_schema_1 = __webpack_require__(109);
const queue_module_1 = __webpack_require__(215);
const task_schedule_daily_schema_1 = __webpack_require__(110);
const task_schedule_monthly_schema_1 = __webpack_require__(111);
const tasks_schedule_yearly_schema_1 = __webpack_require__(112);
const task_toinform_schema_1 = __webpack_require__(113);
const task_schedule_weekly_schema_1 = __webpack_require__(114);
const task_sms_notification_schema_1 = __webpack_require__(115);
const task_approver_schema_1 = __webpack_require__(116);
const jobs_module_1 = __webpack_require__(160);
const task_notmyduty_schema_1 = __webpack_require__(117);
const task_event_listener_1 = __webpack_require__(217);
let TasksModule = class TasksModule {
};
TasksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                task_schema_1.Task,
                task_member_schema_1.TaskMember,
                task_condition_schema_1.TaskCondition,
                test_table_schema_1.TestTable,
                task_schedule_daily_schema_1.TasksScheduleDaily,
                task_schedule_weekly_schema_1.TasksScheduleWeekly,
                task_schedule_monthly_schema_1.TasksScheduleMonthly,
                tasks_schedule_yearly_schema_1.TasksScheduleYearly,
                task_toinform_schema_1.TasksToInform,
                task_sms_notification_schema_1.TasksSMSNotification,
                task_approver_schema_1.TaskApprover,
                task_notmyduty_schema_1.TasksNotMyDuty
            ]),
            personnel_module_1.PersonnelModule,
            jobs_module_1.JobsModule,
            (0, common_1.forwardRef)(() => queue_module_1.QueueModule)
        ],
        controllers: [tasks_controller_1.TasksController],
        providers: [tasks_service_1.TasksService, task_subscriber_subscriber_1.TaskSubscriber, task_event_listener_1.TasksEventListener],
        exports: [tasks_service_1.TasksService]
    })
], TasksModule);
exports.TasksModule = TasksModule;


/***/ }),
/* 189 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(20);
const task_schema_1 = __webpack_require__(104);
const moment = __webpack_require__(52);
const task_type_enum_1 = __webpack_require__(190);
const task_status_enum_1 = __webpack_require__(191);
const task_member_schema_1 = __webpack_require__(105);
const task_failed_enum_1 = __webpack_require__(192);
const task_condition_schema_1 = __webpack_require__(108);
const task_kartabl_status_enum_1 = __webpack_require__(193);
const task_schedule_daily_schema_1 = __webpack_require__(110);
const task_schedule_monthly_schema_1 = __webpack_require__(111);
const tasks_schedule_yearly_schema_1 = __webpack_require__(112);
const task_toinform_schema_1 = __webpack_require__(113);
const task_schedule_weekly_schema_1 = __webpack_require__(114);
const task_priority_enum_1 = __webpack_require__(194);
const task_punishment_enum_1 = __webpack_require__(195);
const task_done_condition_enum_1 = __webpack_require__(196);
const tasks_sms_notification_enum_1 = __webpack_require__(197);
const queue_service_1 = __webpack_require__(198);
const task_sms_notification_schema_1 = __webpack_require__(115);
const personnel_service_1 = __webpack_require__(17);
const task_approve_sequence_enum_1 = __webpack_require__(201);
const task_approver_schema_1 = __webpack_require__(116);
const jobs_service_1 = __webpack_require__(146);
const task_notmyduty_schema_1 = __webpack_require__(117);
let TasksService = class TasksService {
    constructor(taskRepo, taskMemberRepo, taskConditionRepo, tasksScheduleDailyRepo, tasksScheduleWeeklyRepo, tasksScheduleMonthlyRepo, tasksScheduleYearlyRepo, tasksToInformRepo, tasksSMSNotificationRepo, taskApproverRepo, taskNotMyDutyRepo, queueService, personnelService, jobsService) {
        this.taskRepo = taskRepo;
        this.taskMemberRepo = taskMemberRepo;
        this.taskConditionRepo = taskConditionRepo;
        this.tasksScheduleDailyRepo = tasksScheduleDailyRepo;
        this.tasksScheduleWeeklyRepo = tasksScheduleWeeklyRepo;
        this.tasksScheduleMonthlyRepo = tasksScheduleMonthlyRepo;
        this.tasksScheduleYearlyRepo = tasksScheduleYearlyRepo;
        this.tasksToInformRepo = tasksToInformRepo;
        this.tasksSMSNotificationRepo = tasksSMSNotificationRepo;
        this.taskApproverRepo = taskApproverRepo;
        this.taskNotMyDutyRepo = taskNotMyDutyRepo;
        this.queueService = queueService;
        this.personnelService = personnelService;
        this.jobsService = jobsService;
        this.myTasks = ((userId) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const list = await (0, typeorm_2.createQueryBuilder)('tasks', 't1')
                        .innerJoinAndSelect('tasks_member', 't2', 't1.id = t2.task_id_fk')
                        .leftJoinAndSelect('tasks_condition', 't3', 't1.task_condition_id_fk = t3.id')
                        .where('t2.personnel_id_fk = :id and t1.status <> :status', {
                        id: userId,
                        status: task_status_enum_1.TaskStatus.DONE
                    })
                        .select([
                        't1.id as id',
                        't1.title as title',
                        't1.task_type as taskType',
                        't1.related_task as relatedTask',
                        't1.due_date as dueDate',
                        't1.if_task_failed as ifTaskFailed',
                        't1.point as point',
                        't1.negative_point as negativePoint',
                        't1.status as status',
                        't1.created_at as created_at',
                        't1.description as description',
                        't1.status as status',
                        't1.priority as priority',
                        't1.punishment as punishment',
                        't3.referable as referable',
                        't1.page_url as pageurl'
                    ])
                        .getRawMany();
                    resolve(list);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
        this.toApproveTasks = ((userId) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const list = await (0, typeorm_2.createQueryBuilder)('tasks', 't1')
                        .innerJoinAndSelect('tasks_member', 't2', 't1.id = t2.task_id_fk')
                        .innerJoinAndSelect('tasks_approver', 't3', 't3.task_id_fk = t1.id')
                        .leftJoinAndSelect('tasks_condition', 't4', 't1.task_condition_id_fk = t4.id')
                        .where('t1.status = :status and (t1.approved is null or t1.approved = 0) and t3.personnel_id_fk = :pid and t3.approved=0', {
                        status: task_status_enum_1.TaskStatus.DONE,
                        pid: userId
                    })
                        .groupBy('t1.id')
                        .select([
                        't1.id as id',
                        't1.title as title',
                        't1.task_type as taskType',
                        't1.related_task as relatedTask',
                        't1.due_date as dueDate',
                        't1.if_task_failed as ifTaskFailed',
                        't1.point as point',
                        't1.negative_point as negativePoint',
                        't1.status as status',
                        't1.created_at as created_at',
                        't1.description as description',
                        't1.status as status',
                        't1.priority as priority',
                        't1.punishment as punishment',
                        't4.referable as referable',
                        't1.page_url as pageurl'
                    ])
                        .getRawMany();
                    resolve(list);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
        this.myDoneTasks = ((userId) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const list = await (0, typeorm_2.createQueryBuilder)('tasks', 't1')
                        .innerJoinAndSelect('tasks_member', 't2', 't1.id = t2.task_id_fk')
                        .leftJoinAndSelect('tasks_condition', 't3', 't1.task_condition_id_fk = t3.id')
                        .where('t2.personnel_id_fk = :id and t1.status = :status and t1.approved = 1', {
                        id: userId,
                        status: task_status_enum_1.TaskStatus.DONE
                    })
                        .select([
                        't1.id as id',
                        't1.title as title',
                        't1.task_type as taskType',
                        't1.related_task as relatedTask',
                        't1.due_date as dueDate',
                        't1.if_task_failed as ifTaskFailed',
                        't1.point as point',
                        't1.negative_point as negativePoint',
                        't1.status as status',
                        't1.created_at as created_at',
                        't1.description as description',
                        't1.status as status',
                        't1.priority as priority',
                        't1.punishment as punishment',
                        't3.referable as referable',
                        't1.page_url as pageurl'
                    ])
                        .getRawMany();
                    resolve(list);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
        this.myNotDoneTasks = ((userId) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const list = await (0, typeorm_2.createQueryBuilder)('tasks', 't1')
                        .innerJoinAndSelect('tasks_member', 't2', 't1.id = t2.task_id_fk')
                        .leftJoinAndSelect('tasks_condition', 't3', 't1.task_condition_id_fk = t3.id')
                        .where('t2.personnel_id_fk = :id and t1.status <> :status and (t1.approved = 0 or t1.approved is null) and t1.if_task_failed = :failed', {
                        id: userId,
                        status: task_status_enum_1.TaskStatus.DONE,
                        failed: task_failed_enum_1.FailedTaskType.KILL
                    })
                        .select([
                        't1.id as id',
                        't1.title as title',
                        't1.task_type as taskType',
                        't1.related_task as relatedTask',
                        't1.due_date as dueDate',
                        't1.if_task_failed as ifTaskFailed',
                        't1.point as point',
                        't1.negative_point as negativePoint',
                        't1.status as status',
                        't1.created_at as created_at',
                        't1.description as description',
                        't1.status as status',
                        't1.priority as priority',
                        't1.punishment as punishment',
                        't3.referable as referable',
                        't1.page_url as pageurl'
                    ])
                        .getRawMany();
                    resolve(list);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
        this.myRedirectedTasks = ((userId) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const list = await (0, typeorm_2.createQueryBuilder)('tasks', 't1')
                        .innerJoinAndSelect('tasks_forward', 't2', 't1.id = t2.task_id_fk')
                        .leftJoinAndSelect('tasks_condition', 't3', 't1.task_condition_id_fk = t3.id')
                        .where('t2.personnel_id_fk = :id and t1.status <> :status and (t1.approved = 0 or t1.approved is null)', {
                        id: userId,
                        status: task_status_enum_1.TaskStatus.DONE,
                    })
                        .select([
                        't1.id as id',
                        't1.title as title',
                        't1.task_type as taskType',
                        't1.related_task as relatedTask',
                        't1.due_date as dueDate',
                        't1.if_task_failed as ifTaskFailed',
                        't1.point as point',
                        't1.negative_point as negativePoint',
                        't1.status as status',
                        't1.created_at as created_at',
                        't1.description as description',
                        't1.status as status',
                        't1.priority as priority',
                        't1.punishment as punishment',
                        't3.referable as referable',
                        't1.page_url as pageurl'
                    ])
                        .getRawMany();
                    resolve(list);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
        this.toInfoTasks = (() => {
            return new Promise(async (resolve, reject) => {
                try {
                    const list = await (0, typeorm_2.createQueryBuilder)('tasks', 't1')
                        .innerJoinAndSelect('tasks_member', 't2', 't1.id = t2.task_id_fk')
                        .leftJoinAndSelect('tasks_condition', 't3', 't1.task_condition_id_fk = t3.id')
                        .where('t1.status <> :status', {
                        status: task_status_enum_1.TaskStatus.DONE
                    })
                        .select([
                        't1.id as id',
                        't1.title as title',
                        't1.task_type as taskType',
                        't1.related_task as relatedTask',
                        't1.due_date as dueDate',
                        't1.if_task_failed as ifTaskFailed',
                        't1.point as point',
                        't1.negative_point as negativePoint',
                        't1.status as status',
                        't1.created_at as created_at',
                        't1.description as description',
                        't1.status as status',
                        't1.priority as priority',
                        't1.punishment as punishment',
                        't3.referable as referable',
                        't1.page_url as pageurl'
                    ])
                        .getRawMany();
                    resolve(list);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
        this.inProgress = (async (userId) => {
            return await (0, typeorm_2.createQueryBuilder)('tasks_member', 't1')
                .innerJoinAndSelect('tasks', 't2', 't1.task_id_fk = t2.id')
                .leftJoinAndSelect('tasks_condition', 't3', 't1.task_condition_id_fk = t3.id')
                .where('t1.personnel_id_fk = :uid and t2.status = :status and (t2.approved = 0 or t2.approved is null)', {
                uid: userId,
                status: task_status_enum_1.TaskStatus.DONE
            })
                .select(['t2.id as id',
                't2.title as title',
                't2.task_type as taskType',
                't2.related_task as relatedTask',
                't2.due_date as dueDate',
                't2.if_task_failed as ifTaskFailed',
                't2.point as point',
                't2.negative_point as negativePoint',
                't2.status as status',
                't2.created_at as created_at',
                't2.description as description',
                't2.status as status',
                't2.priority as priority',
                't2.punishment as punishment',
                't3.referable as referable',
                't2.page_url as pageurl'
            ])
                .getRawMany();
        });
        this.notMyDuty = (async (userId) => {
            return await (0, typeorm_2.createQueryBuilder)('tasks_notmyduty', 't1')
                .innerJoinAndSelect('tasks', 't2', 't1.task_id_fk = t2.id')
                .where('t2.created_by = :uid', {
                uid: userId
            })
                .select([
                't2.id as id',
                't2.title as title',
                't2.task_type as taskType',
                't2.related_task as relatedTask',
                't2.due_date as dueDate',
                't2.if_task_failed as ifTaskFailed',
                't2.point as point',
                't2.negative_point as negativePoint',
                't2.status as status',
                't2.created_at as created_at',
                't2.description as description',
                't2.status as status',
                't2.priority as priority',
                't2.punishment as punishment',
                't2.page_url as pageurl'
            ])
                .getRawMany();
        });
        this.updateTaskBasedOnSpecificJobs = (async (task) => {
            if (task.approverJobsId) {
                const members = await this.personnelService.findPersonnelofJobs(task.approverJobsId.split(',').map(Number));
                if (task.approveJobsSequence === task_approve_sequence_enum_1.TaskApproveSequence.LINEAR) {
                    this.taskApproverRepo.insert({
                        personnelId: members[0].personnel_id_fk,
                        taskId: task.id,
                        approved: 0
                    });
                }
                else {
                    const insert = [];
                    for (let i = 0; i < members.length; i++) {
                        const member = members[i];
                        insert.push({
                            personnelId: member.personnel_id_fk,
                            taskId: task.id,
                            approved: 0
                        });
                    }
                    this.taskApproverRepo.createQueryBuilder()
                        .insert()
                        .values(insert)
                        .execute();
                }
            }
        });
        this.updateTaskBasedOnCreator = (async (task) => {
            if (task.conditionId) {
                const condition = await this.taskConditionRepo.findOne({ where: { id: task.conditionId } });
                await this.taskApproverRepo.insert({
                    personnelId: condition.creatorId,
                    taskId: task.id,
                    approved: 0
                });
            }
            else if (task.created_by != -1) {
                await this.taskApproverRepo.insert({
                    personnelId: task.created_by,
                    taskId: task.id,
                    approved: 0
                });
            }
            return 'task sent to creator for approval';
        });
        this.approveTaskBasedOnSpecificJob = (async (task, userId) => {
            const usersCanApprove = await this.personnelService.findPersonnelofJobs(task.approverJobsId.split(',').map(Number));
            if (usersCanApprove.find(x => x.personnel_id_fk == userId) == undefined) {
                throw new common_1.NotFoundException(`you are not able to approve task #${task.id}`);
            }
            const userCanApprove = await this.taskApproverRepo.findOne({
                where: {
                    taskId: task.id,
                    personnelId: userId,
                    approved: 0
                }
            });
            if (userCanApprove === undefined) {
                throw new common_1.NotFoundException('you are not able to approve at this stage');
            }
            await this.taskApproverRepo.createQueryBuilder()
                .where('id = :id', { id: userCanApprove.id })
                .update()
                .set({ approved: 1 })
                .execute();
            if (task.approveJobsSequence === task_approve_sequence_enum_1.TaskApproveSequence.LINEAR) {
                const index = usersCanApprove.findIndex(x => x.personnel_id_fk === userId);
                const nextPerson = usersCanApprove[index + 1];
                if (nextPerson != undefined) {
                    await this.taskApproverRepo.createQueryBuilder()
                        .insert()
                        .values([
                        {
                            taskId: task.id,
                            personnelId: nextPerson.personnel_id_fk,
                            approved: 0
                        }
                    ])
                        .execute();
                }
            }
            else if (task.approveJobsSequence === task_approve_sequence_enum_1.TaskApproveSequence.PARALLEL) {
                await this.taskApproverRepo.createQueryBuilder()
                    .update()
                    .where('task_id_fk = :tid', { tid: task.id })
                    .set({
                    approved: 1
                })
                    .execute();
            }
            const approveCount = await this.taskApproverRepo.count({
                where: {
                    taskId: task.id,
                    approved: 1
                }
            });
            if (approveCount == usersCanApprove.length) {
                await this.taskRepo.createQueryBuilder()
                    .update()
                    .set({
                    approved: 1,
                    status: task_status_enum_1.TaskStatus.DONE
                })
                    .execute();
                return `${task.id} closed`;
            }
        });
        this.approveTaskBasedOnSuperAdmin = (async (task, userId) => {
            const entity = await this.taskApproverRepo.findOne({
                where: {
                    personnelId: userId,
                    taskId: task.id,
                    approved: 0
                }
            });
            if (entity) {
                await this.taskApproverRepo.createQueryBuilder()
                    .update()
                    .where('task_id_fk = :id', { id: task.id })
                    .set({
                    approved: 1
                })
                    .execute();
                await this.taskRepo.createQueryBuilder()
                    .update()
                    .where('id = :id', { id: task.id })
                    .set({
                    approved: 1
                })
                    .execute();
            }
            else {
                throw new common_1.NotFoundException('task could not be found');
            }
        });
        this.updateTaskBasedOnSpecificPerson = (async (task) => {
            await this.taskApproverRepo.createQueryBuilder()
                .insert()
                .values([
                {
                    taskId: task.id,
                    personnelId: task.approverPersonnelId,
                    approved: 0
                }
            ])
                .execute();
        });
        this.updateTaskBasedOnSuperAdmin = (async (task) => {
            const superAdmins = await this.personnelService.getSuperAdmins();
            superAdmins.forEach(admin => {
                this.taskApproverRepo.createQueryBuilder()
                    .insert()
                    .values([{
                        personnelId: admin.id,
                        taskId: task.id,
                        approved: 0
                    }])
                    .execute();
            });
        });
        this.checkTaskWithCondition = (async (task) => {
            const condition = await (0, typeorm_2.createQueryBuilder)('tasks_condition', 't1')
                .innerJoinAndSelect('table_name', 't2', 't1.table_name_id_fk = t2.id')
                .where('t1.id = :id', { id: task.conditionId })
                .getRawOne();
            if (!condition) {
                throw new common_1.NotFoundException('condition could not be found');
            }
            const checkCondition = await (0, typeorm_2.createQueryBuilder)(condition.t2_table_name, 't1')
                .where(`t1.${condition.t1__condition} and t1.id = ${task.destinationRecordId}`)
                .getOne();
            if (checkCondition == null) {
                await this.taskRepo.createQueryBuilder()
                    .update()
                    .set({
                    approved: 1,
                    status: task_status_enum_1.TaskStatus.DONE
                })
                    .where('id = :id', { id: task.id })
                    .execute();
                return `task #${task.id} closed.`;
            }
            else {
                throw new common_1.HttpException('condition is still exists, task could not be closed', 400);
            }
        });
        this.caluclateTaskPoint = (async (taskId) => {
            try {
            }
            catch (err) {
                return 0;
            }
        });
    }
    async create(dto, userId, destinationRecordId, conditionId) {
        try {
            if (!dto.status)
                dto.status = task_status_enum_1.TaskStatus.NEW;
            if (!dto.ifTaskFailed)
                dto.ifTaskFailed = task_failed_enum_1.FailedTaskType.DELAYED;
            const _dto = Object.assign({}, dto);
            let sms = [];
            if (dto.smsNotification && dto.smsNotification.length > 0) {
                sms = dto.smsNotification;
                delete dto.smsNotification;
            }
            if (dto.approverJobsId) {
                _dto.approverJobsId = dto.approverJobsId.toString();
            }
            const newTask = await this.taskRepo.createQueryBuilder()
                .insert()
                .values([
                Object.assign(Object.assign({}, _dto), { created_at: moment().utc(true).format('YYYY/MM/DD HH:mm:ss'), created_by: userId, destinationRecordId: destinationRecordId, conditionId: conditionId })
            ])
                .execute();
            dto.members.forEach(async (member) => {
                await this.taskMemberRepo.createQueryBuilder()
                    .insert()
                    .values([
                    {
                        taskId: newTask.identifiers[0].id,
                        userId: member
                    }
                ])
                    .execute();
            });
            if (dto.personnelToInform) {
                const insertToInform = [];
                dto.personnelToInform.forEach(toInform => {
                    insertToInform.push({
                        taskId: newTask.identifiers[0].id,
                        personnelId: toInform
                    });
                });
                if (insertToInform.length > 0) {
                    await this.tasksToInformRepo.createQueryBuilder()
                        .insert()
                        .values(insertToInform)
                        .execute();
                }
            }
            this.handleSms(sms, dto.members, newTask.identifiers[0].id);
            return newTask;
        }
        catch (err) {
            throw err;
        }
    }
    async createTaskToInformPersonnel(taskId, personnel) {
        try {
            const insert = [];
            for (let i = 0; i < personnel.length; i++) {
                insert.push({
                    personnel_id_fk: personnel[i],
                    taskId: taskId
                });
            }
            return await this.tasksToInformRepo.createQueryBuilder()
                .insert()
                .values(insert)
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async updateTask(id, dto, userId) {
        try {
            const task = await this.taskRepo.findOne({ where: { id: id } });
            const _dto = Object.assign({}, dto);
            delete _dto.approved;
            await this.taskRepo.createQueryBuilder()
                .update()
                .set(Object.assign(Object.assign({}, _dto), { status: task.conditionId ? task_status_enum_1.TaskStatus.NEW : dto.status }))
                .where('id = :id', { id: id })
                .execute();
            if (_dto.status === task_status_enum_1.TaskStatus.DONE) {
                if (task.conditionId) {
                    return await this.checkTaskWithCondition(task);
                }
                switch (task.approveCondition) {
                    case task_done_condition_enum_1.TaskDoneCondition.SPECIFIC_JOB:
                        this.updateTaskBasedOnSpecificJobs(task);
                        break;
                    case task_done_condition_enum_1.TaskDoneCondition.BY_REFERRAL:
                        this.updateTaskBasedOnCreator(task);
                        break;
                    case task_done_condition_enum_1.TaskDoneCondition.SPECIFIC_PERSON:
                        this.updateTaskBasedOnSpecificPerson(task);
                        break;
                    case task_done_condition_enum_1.TaskDoneCondition.NONE:
                        await this.taskRepo.createQueryBuilder()
                            .update()
                            .set({
                            approved: 1,
                            status: task_status_enum_1.TaskStatus.DONE
                        })
                            .where('id = :id', { id: id })
                            .execute();
                        break;
                    case task_done_condition_enum_1.TaskDoneCondition.SUPER_ADMIN:
                        this.updateTaskBasedOnSuperAdmin(task);
                        break;
                }
            }
        }
        catch (err) {
            throw err;
        }
    }
    async myOpenTasks(userId) {
        try {
            return await (0, typeorm_2.createQueryBuilder)('tasks', 't1')
                .innerJoinAndSelect('tasks_member', 't2', 't1.id = t2.task_id_fk')
                .where('t2.personnel_id_fk = :id and t1.status <> :status', {
                id: userId,
                status: task_status_enum_1.TaskStatus.DONE
            })
                .select([
                't1.id as id',
                't1.title as title',
                't1.task_type as taskType',
                't1.related_task as relatedTask',
                't1.due_date as dueDate',
                't1.if_task_failed as ifTaskFailed',
                't1.point as point',
                't1.negative_point as negativePoint',
                't1.status as status',
                't1.created_at as created_at',
                't1.description as description'
            ])
                .getRawMany();
        }
        catch (err) {
            throw err;
        }
    }
    async createTaskCondition(userId, dto) {
        try {
            const dup = await this.taskConditionRepo.createQueryBuilder()
                .where('table_name_id_fk = :id and _condition = :condition', {
                id: dto.tableId,
                condition: dto.condition
            })
                .getCount();
            if (dup > 0) {
                throw new common_1.HttpException('condition already exists', 400);
            }
            const _dto = Object.assign(Object.assign({}, dto), { creatorId: userId });
            if (dto.personnelMembers) {
                _dto.personnelMembers = dto.personnelMembers.toString();
                delete _dto.jobs;
            }
            if (dto.jobs) {
                delete _dto.personnelMembers;
                _dto.jobs = dto.jobs.toString();
            }
            if (dto.personnelToInform) {
                _dto.personnelToInform = dto.personnelToInform.toString();
            }
            if (dto.smsNotification) {
                _dto.smsNotification = dto.smsNotification.toString();
            }
            if (dto.approverJobsId) {
                _dto.approverJobsId = dto.approverJobsId.toString();
            }
            const newCondition = await this.taskConditionRepo.createQueryBuilder()
                .insert()
                .values([_dto])
                .execute();
            if (dto.dailySchedule) {
                for (let i = 0; i < dto.dailySchedule.length; i++) {
                    const item = dto.dailySchedule[i];
                    await this.tasksScheduleDailyRepo.createQueryBuilder()
                        .insert()
                        .values([
                        {
                            conditionId: newCondition.identifiers[0].id,
                            hour: item.hour,
                            minute: item.minute,
                            fromDate: item.fromDate ? moment(item.fromDate).utc(false).toDate() : null,
                            toDate: item.toDate ? moment(item.toDate).utc(false).toDate() : null
                        }
                    ])
                        .execute();
                }
            }
            if (dto.weeklySchedule) {
                delete _dto.weeklySchedule;
                const ws = [];
                dto.weeklySchedule.forEach(item => {
                    ws.push({
                        conditionId: newCondition.identifiers[0].id,
                        dayName: item.dayName,
                        hour: item.hour,
                        minute: item.minute,
                        fromDate: item.fromDate ? moment(item.fromDate).utc(false).toDate() : null,
                        toDate: item.toDate ? moment(item.toDate).utc(false).toDate() : null
                    });
                });
                await this.tasksScheduleWeeklyRepo.createQueryBuilder()
                    .insert()
                    .values(ws)
                    .execute();
            }
            if (dto.monthlySchedule) {
                const ms = [];
                dto.monthlySchedule.forEach(item => {
                    ms.push({
                        conditionId: newCondition.identifiers[0].id,
                        day: item.day,
                        fromDate: item.fromDate ? moment(item.fromDate).utc(false).toDate() : null,
                        toDate: item.toDate ? moment(item.toDate).utc(false).toDate() : null
                    });
                });
                await this.tasksScheduleMonthlyRepo.createQueryBuilder()
                    .insert()
                    .values(ms)
                    .execute();
            }
            if (dto.yearlySchedule) {
                const ys = [];
                dto.yearlySchedule.forEach(item => {
                    ys.push({
                        conditionId: newCondition.identifiers[0].id,
                        month: item.month,
                        day: item.day,
                        fromDate: item.fromDate ? moment(item.fromDate).utc(false).toDate() : null,
                        toDate: item.toDate ? moment(item.toDate).utc(false).toDate() : null
                    });
                });
                await this.tasksScheduleYearlyRepo.createQueryBuilder()
                    .insert()
                    .values(ys)
                    .execute();
            }
            return newCondition;
        }
        catch (err) {
            throw err;
        }
    }
    async updateTaskCondition(id, dto) {
        try {
            const _dto = Object.assign({}, dto);
            if (dto.personnelMembers) {
                _dto.personnelMembers = dto.personnelMembers.toString();
                delete _dto.jobs;
            }
            if (dto.jobs) {
                delete _dto.personnelMembers;
                _dto.jobs = dto.jobs.toString();
            }
            if (dto.personnelToInform) {
                _dto.personnelToInform = dto.personnelToInform.toString();
                delete dto.personnelToInform;
            }
            if (dto.personnelToInform) {
                _dto.personnelToInform = dto.personnelToInform.toString();
            }
            if (dto.dailySchedule) {
                delete _dto.dailySchedule;
                await this.tasksScheduleDailyRepo.createQueryBuilder()
                    .delete()
                    .where('tasks_condition_id_fk = :tid', { tid: id })
                    .execute();
                for (let i = 0; i < dto.dailySchedule.length; i++) {
                    const item = dto.dailySchedule[i];
                    await this.tasksScheduleDailyRepo.createQueryBuilder()
                        .insert()
                        .values([
                        {
                            conditionId: id,
                            hour: item.hour,
                            minute: item.minute,
                            fromDate: item.fromDate ? moment(item.fromDate).utc(false).toDate() : null,
                            toDate: item.toDate ? moment(item.toDate).utc(false).toDate() : null
                        }
                    ])
                        .execute();
                }
            }
            if (dto.weeklySchedule) {
                delete _dto.weeklySchedule;
                await this.tasksScheduleWeeklyRepo.createQueryBuilder()
                    .delete()
                    .where('tasks_condition_id_fk = :id', { id: id })
                    .execute();
                const ws = [];
                dto.weeklySchedule.forEach(item => {
                    ws.push({
                        conditionId: id,
                        dayName: item.dayName,
                        hour: item.hour,
                        minute: item.minute,
                        fromDate: item.fromDate ? moment(item.fromDate).utc(false).toDate() : null,
                        toDate: item.toDate ? moment(item.toDate).utc(false).toDate() : null
                    });
                });
                await this.tasksScheduleWeeklyRepo.createQueryBuilder()
                    .insert()
                    .values(ws)
                    .execute();
            }
            if (dto.monthlySchedule) {
                await this.tasksScheduleMonthlyRepo.createQueryBuilder()
                    .delete()
                    .where('tasks_condition_id_fk = :id', { id: id })
                    .execute();
                const ms = [];
                dto.monthlySchedule.forEach(item => {
                    ms.push({
                        conditionId: id,
                        day: item.day,
                        fromDate: item.fromDate ? moment(item.fromDate).utc(false).toDate() : null,
                        toDate: item.toDate ? moment(item.toDate).utc(false).toDate() : null
                    });
                });
                await this.tasksScheduleMonthlyRepo.createQueryBuilder()
                    .insert()
                    .values(ms)
                    .execute();
            }
            if (dto.yearlySchedule) {
                await this.tasksScheduleYearlyRepo.createQueryBuilder()
                    .delete()
                    .where('tasks_condition_id_fk = :id', { id: id })
                    .execute();
                const ys = [];
                dto.yearlySchedule.forEach(item => {
                    ys.push({
                        conditionId: id,
                        month: item.month,
                        day: item.day,
                        fromDate: item.fromDate ? moment(item.fromDate).utc(false).toDate() : null,
                        toDate: item.toDate ? moment(item.toDate).utc(false).toDate() : null
                    });
                });
                await this.tasksScheduleYearlyRepo.createQueryBuilder()
                    .insert()
                    .values(ys)
                    .execute();
            }
            if (dto.smsNotification) {
                _dto.smsNotification = dto.smsNotification.toString();
            }
            return await this.taskConditionRepo.createQueryBuilder()
                .update()
                .set(_dto)
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async deleteTaskCondition(id) {
        try {
            return await this.taskConditionRepo.createQueryBuilder()
                .delete()
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async getTaskConditions() {
        try {
            const list = await (0, typeorm_2.createQueryBuilder)('tasks_condition', 't1')
                .leftJoinAndSelect('table_name', 't2', 't1.table_name_id_fk = t2.id')
                .select([
                't1.id as id',
                't1.table_name_id_fk as tableId',
                't1._condition as _condition',
                't1.title as title',
                't1.description as description',
                't1.if_task_failed as ifTaskFailed',
                't1.point as point',
                't1.negativePoint as negativePoint',
                't1.personnel_members as personnelMembers',
                't2.table_name as tableName',
                't2.title as tableTitle',
                't1.seconds_after_create as secondsAfterCreate',
                't1.enable as enable',
                't1.jobs as jobs'
            ])
                .orderBy('id', 'DESC')
                .getRawMany();
            return list;
        }
        catch (err) {
            throw err;
        }
    }
    async getTaskConditionDetail(id) {
        const condition = await this.taskConditionRepo.findOne({
            where: {
                id: id
            },
            relations: ['tableInfo']
        });
        const dailySchedule = await this.tasksScheduleDailyRepo.createQueryBuilder()
            .where('tasks_condition_id_fk = :cid', { cid: id })
            .getMany();
        dailySchedule.forEach(item => {
            if (item.fromDate) {
                item.fromDate = moment(item.fromDate).utc(true).toDate();
            }
            if (item.toDate) {
                item.toDate = moment(item.toDate).utc(true).toDate();
            }
        });
        const weeklySchedule = await this.tasksScheduleWeeklyRepo.createQueryBuilder()
            .where('tasks_condition_id_fk = :id', { id: id })
            .getMany();
        weeklySchedule.forEach(item => {
            if (item.fromDate) {
                item.fromDate = moment(item.fromDate).utc(true).toDate();
            }
            if (item.toDate) {
                item.toDate = moment(item.toDate).utc(true).toDate();
            }
        });
        const monthlySchedule = await this.tasksScheduleMonthlyRepo.createQueryBuilder()
            .where('tasks_condition_id_fk = :id', { id: id })
            .getMany();
        monthlySchedule.forEach(item => {
            if (item.fromDate) {
                item.fromDate = moment(item.fromDate).utc(true).toDate();
            }
            if (item.toDate) {
                item.toDate = moment(item.toDate).utc(true).toDate();
            }
        });
        const yearlySchedule = await this.tasksScheduleYearlyRepo.createQueryBuilder()
            .where('tasks_condition_id_fk = :id', { id: id })
            .getMany();
        yearlySchedule.forEach(item => {
            if (item.fromDate) {
                item.fromDate = moment(item.fromDate).utc(true).toDate();
            }
            if (item.toDate) {
                item.toDate = moment(item.toDate).utc(true).toDate();
            }
        });
        return {
            condition: condition,
            daily: dailySchedule,
            weekly: weeklySchedule,
            monthly: monthlySchedule,
            yearly: yearlySchedule
        };
    }
    async getTableConditionsByTableId(tableId) {
        try {
            return this.taskConditionRepo.createQueryBuilder()
                .where('table_name_id_fk = :tid', { tid: tableId })
                .getMany();
        }
        catch (err) {
            throw err;
        }
    }
    async kartabl(userId, status) {
        try {
            switch (status) {
                case task_kartabl_status_enum_1.KartablTastStatus.MYTASKS:
                    return await this.myTasks(userId);
                case task_kartabl_status_enum_1.KartablTastStatus.TOAPPROVE:
                    return await this.toApproveTasks(userId);
                case task_kartabl_status_enum_1.KartablTastStatus.DONE:
                    return await this.myDoneTasks(userId);
                case task_kartabl_status_enum_1.KartablTastStatus.NOTDONE:
                    return await this.myNotDoneTasks(userId);
                case task_kartabl_status_enum_1.KartablTastStatus.REDIRECTED:
                    return await this.myRedirectedTasks(userId);
                case task_kartabl_status_enum_1.KartablTastStatus.TOINFO:
                    return await this.toInfoTasks();
                case task_kartabl_status_enum_1.KartablTastStatus.INPROGRESS:
                    return await this.inProgress(userId);
                case task_kartabl_status_enum_1.KartablTastStatus.NOTMYDUTY:
                    return await this.notMyDuty(userId);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async checkDailyScheduleTasks(hour, minute) {
        try {
            const today = moment().utc(true).format('YYYY-MM-DD HH:mm:ss');
            const dailyTasks = await (0, typeorm_2.createQueryBuilder)('tasks_schedule_daily', 't1')
                .innerJoinAndSelect('tasks_condition', 't2', 't1.tasks_condition_id_fk = t2.id')
                .where('t1.hour = :h and t1.minute = :m and (t1.from_date <= :fd or t1.from_date is null) and (t1.to_date >= :td or t1.to_date is null)', {
                h: hour,
                m: minute,
                fd: today,
                td: today
            })
                .select(['t2'])
                .getRawMany();
            if (dailyTasks.length > 0) {
                dailyTasks.forEach(task => {
                    const dto = {
                        title: task.t2_title,
                        description: task.t2_title,
                        taskType: task_type_enum_1.TaskType.INDEPENDENT,
                        relatedTask: null,
                        dueDate: moment().utc(false).add(+task.t2_days_after_create, 'days').toDate(),
                        ifTaskFailed: task.t2_if_task_failed,
                        point: task.t2_point,
                        negativePoint: task.t2_negative_point,
                        status: task_status_enum_1.TaskStatus.NEW,
                        members: task.t2_personnel_members.split(','),
                        priority: task.t2_priority ? task.t2_priority : task_priority_enum_1.TaskPriority.NORMAL,
                        punishment: task.t2_punishment ? task.t2_punishment : task_punishment_enum_1.TaskPunishment.NONE,
                        pageUrl: task.t2_page_url,
                        approveCondition: task.t2_approve_condition ? task.t2_approve_condition : task_done_condition_enum_1.TaskDoneCondition.NONE,
                        approverJobsId: task.t2_approver_jobs_ids != null ? task.t2_approver_jobs_ids.toString().split(',').map(Number) : null,
                        approveJobsSequence: task.t2_approve_jobs_sequence,
                        approverPersonnelId: task.t2_approver_personnel_id_fk,
                        personnelToInform: task.t2_personnel_to_inform != null ? task.t2_personnel_to_inform.split(',').map(Number) : null,
                        smsNotification: task.t2_sms_notification != null ? task.t2_sms_notification.split(',') : null,
                        referable: task.t2_referable
                    };
                    this.create(dto, -1);
                });
            }
        }
        catch (err) {
            console.log(`error on checkDailyScheduleTasks, error is: 
      
      ${err}`);
        }
    }
    async checkWeeklyScheduleTasks(dayName, hour, minute) {
        try {
            const today = moment().utc(true).format('YYYY-MM-DD HH:mm:ss');
            const weeklyTasks = await (0, typeorm_2.createQueryBuilder)('tasks_schedule_weekly', 't1')
                .innerJoinAndSelect('tasks_condition', 't2', 't1.tasks_condition_id_fk = t2.id')
                .where('day_name = :dn and hour=:hour and minute=:minute and (from_date <= :fd or from_date is null) and (to_date >= :td or to_date is null)', {
                dn: dayName,
                fd: today,
                td: today,
                minute: minute,
                hour: hour
            })
                .select('t2')
                .getRawMany();
            weeklyTasks.forEach(task => {
                const dto = {
                    title: task.t2_title,
                    description: task.t2_title,
                    taskType: task_type_enum_1.TaskType.INDEPENDENT,
                    relatedTask: null,
                    dueDate: moment().utc(false).add(+task.t2_days_after_create, 'days').toDate(),
                    ifTaskFailed: task.t2_if_task_failed,
                    point: task.t2_point,
                    negativePoint: task.t2_negative_point,
                    status: task_status_enum_1.TaskStatus.NEW,
                    members: task.t2_personnel_members.split(','),
                    priority: task.t2_priority ? task.t2_priority : task_priority_enum_1.TaskPriority.NORMAL,
                    punishment: task.t2_punishment ? task.t2_punishment : task_punishment_enum_1.TaskPunishment.NONE,
                    pageUrl: task.t2_page_url,
                    approveCondition: task.t2_approve_condition ? task.t2_approve_condition : task_done_condition_enum_1.TaskDoneCondition.NONE,
                    approverJobsId: task.t2_approver_jobs_ids.toString().split(',').map(Number),
                    approveJobsSequence: task.t2_approve_jobs_sequence,
                    approverPersonnelId: task.t2_approver_personnel_id_fk,
                    personnelToInform: task.t2_personnel_to_inform != null ? task.t2_personnel_to_inform.split(',').map(Number) : null,
                    smsNotification: task.t2_sms_notification ? task.t2_sms_notification.split(',') : null,
                    referable: task.t2_referable
                };
                this.create(dto, -1);
            });
        }
        catch (err) {
            console.log(`error occured checkWeeklyScheduleTasks
      
      error: ${err}`);
        }
    }
    async checkMonthlyScheduleTasks(day) {
        try {
            const today = moment().utc(true).format('YYYY-MM-DD HH:mm:ss');
            const monthlyTasks = await (0, typeorm_2.createQueryBuilder)('tasks_schedule_monthly', 't1')
                .innerJoinAndSelect('tasks_condition', 't2', 't1.tasks_condition_id_fk = t2.id')
                .where('day = :d and (from_date <= :fd or from_date is null) and (to_date >= :td or to_date is null)', {
                d: day,
                fd: today,
                td: today
            })
                .select('t2')
                .getRawMany();
            monthlyTasks.forEach(task => {
                const dto = {
                    title: task.t2_title,
                    description: task.t2_title,
                    taskType: task_type_enum_1.TaskType.INDEPENDENT,
                    relatedTask: null,
                    dueDate: moment().utc(false).add(+task.t2_days_after_create, 'days').toDate(),
                    ifTaskFailed: task.t2_if_task_failed,
                    point: task.t2_point,
                    negativePoint: task.t2_negative_point,
                    status: task_status_enum_1.TaskStatus.NEW,
                    members: task.t2_personnel_members.split(','),
                    priority: task.t2_priority ? task.t2_priority : task_priority_enum_1.TaskPriority.NORMAL,
                    punishment: task.t2_punishment ? task.t2_punishment : task_punishment_enum_1.TaskPunishment.NONE,
                    pageUrl: task.t2_page_url,
                    approveCondition: task.t2_approve_condition ? task.t2_approve_condition : task_done_condition_enum_1.TaskDoneCondition.NONE,
                    approverJobsId: task.t2_approver_jobs_ids.toString().split(',').map(Number),
                    approveJobsSequence: task.t2_approve_jobs_sequence,
                    approverPersonnelId: task.t2_approver_personnel_id_fk,
                    personnelToInform: task.t2_personnel_to_inform != null ? task.t2_personnel_to_inform.split(',').map(Number) : null,
                    smsNotification: task.t2_sms_notification ? task.t2_sms_notification.split(',') : null,
                    referable: task.t2_referable
                };
                this.create(dto, -1);
            });
        }
        catch (err) {
            console.log(`error on checkMonthlyScheduleTasks 
      
      error: ${err}`);
        }
    }
    async checkYearlyScheduleTasks(day, month) {
        try {
            const today = moment().utc(true).format('YYYY-MM-DD HH:mm:ss');
            const yearlyTasks = await (0, typeorm_2.createQueryBuilder)('tasks_schedule_yearly', 't1')
                .innerJoinAndSelect('tasks_condition', 't2', 't1.tasks_condition_id_fk = t2.id')
                .where('day=:d and month=:m and (from_date <= :fd or from_date is null) and (to_date >= :td or to_date is null)', {
                d: day,
                m: month,
                fd: today,
                td: today
            })
                .select('t2')
                .getRawMany();
            yearlyTasks.forEach(task => {
                const dto = {
                    title: task.t2_title,
                    description: task.t2_title,
                    taskType: task_type_enum_1.TaskType.INDEPENDENT,
                    relatedTask: null,
                    dueDate: moment().utc(false).add(+task.t2_days_after_create, 'days').toDate(),
                    ifTaskFailed: task.t2_if_task_failed,
                    point: task.t2_point,
                    negativePoint: task.t2_negative_point,
                    status: task_status_enum_1.TaskStatus.NEW,
                    members: task.t2_personnel_members.split(','),
                    priority: task.t2_priority ? task.t2_priority : task_priority_enum_1.TaskPriority.NORMAL,
                    punishment: task.t2_punishment ? task.t2_punishment : task_punishment_enum_1.TaskPunishment.NONE,
                    pageUrl: task.t2_page_url,
                    approveCondition: task.t2_approve_condition ? task.t2_approve_condition : task_done_condition_enum_1.TaskDoneCondition.NONE,
                    approverJobsId: task.t2_approver_jobs_ids.toString().split(',').map(Number),
                    approveJobsSequence: task.t2_approve_jobs_sequence,
                    approverPersonnelId: task.t2_approver_personnel_id_fk,
                    personnelToInform: task.t2_personnel_to_inform != null ? task.t2_personnel_to_inform.split(',').map(Number) : null,
                    smsNotification: task.t2_sms_notification ? task.t2_sms_notification.split(',') : null,
                    referable: task.t2_referable
                };
                this.create(dto, -1);
            });
        }
        catch (err) {
            console.log(`error on checkYearlyScheduleTasks 
      
      error: ${err}`);
        }
    }
    async findAllTasksSMSNotification(date) {
        try {
            const list = await (0, typeorm_2.createQueryBuilder)('tasks_sms_notification', 't1')
                .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
                .where('DATE_FORMAT(t1.date, :df) = :date', {
                df: '%Y-%m-%d %H:%i',
                date: date
            })
                .select(['t2.mobile1 as mobile', 't1.percentage as percentage', 't1.tasks_id_fk as taskId', 't2.first_name as firstName', 't2.last_name as lastName'])
                .getRawMany();
            return list;
        }
        catch (err) {
            throw err;
        }
    }
    async approveTask(id, userId) {
        const task = await this.taskRepo.findOne({ where: { id: id } });
        if (task.approved == 1 && task.status === task_status_enum_1.TaskStatus.DONE) {
            return `${id} closed`;
        }
        if (task) {
            if (task.approveCondition === task_done_condition_enum_1.TaskDoneCondition.SPECIFIC_JOB) {
                return await this.approveTaskBasedOnSpecificJob(task, userId);
            }
            else if (task.approveCondition === task_done_condition_enum_1.TaskDoneCondition.SUPER_ADMIN) {
                return await this.approveTaskBasedOnSuperAdmin(task, userId);
            }
            else {
                const approveEntity = await this.taskApproverRepo.findOne({
                    where: {
                        personnelId: userId,
                        taskId: id,
                        approved: 0
                    }
                });
                if (approveEntity) {
                    await this.taskApproverRepo.createQueryBuilder()
                        .update()
                        .where('id = :id', { id: approveEntity.id })
                        .set({
                        approved: 1
                    })
                        .execute();
                    await this.taskRepo.createQueryBuilder()
                        .update()
                        .set({
                        approved: 1
                    })
                        .where('id = :id', { id: id })
                        .execute();
                    return 'task has been approved';
                }
                else {
                    throw new common_1.NotFoundException('task has not been found');
                }
            }
        }
        else {
            throw new common_1.NotFoundException('task could not be found');
        }
    }
    async handleSms(sendCondition, members, taskId) {
        try {
            for (let i = 0; i < sendCondition.length; i++) {
                const condition = sendCondition[i];
                switch (condition) {
                    case tasks_sms_notification_enum_1.TasksSMSNotificationType.START:
                        this.queueService.smsSendAfterTaskCreated({
                            members: members,
                            taskId: taskId
                        });
                        break;
                    case tasks_sms_notification_enum_1.TasksSMSNotificationType.PERCENT25:
                        this.queueService.smsSendOn25Percent({
                            taskId: taskId,
                            members: members
                        });
                        break;
                    case tasks_sms_notification_enum_1.TasksSMSNotificationType.PERCENT50:
                        this.queueService.smsSendOn50Percent({
                            taskId: taskId,
                            members: members
                        });
                        break;
                    case tasks_sms_notification_enum_1.TasksSMSNotificationType.PERCENT75:
                        this.queueService.smsSendOn75Percent({
                            taskId: taskId,
                            members: members
                        });
                        break;
                    case tasks_sms_notification_enum_1.TasksSMSNotificationType.PERCENT90:
                        this.queueService.smsSendOn90Percent({
                            taskId: taskId,
                            members: members
                        });
                        break;
                }
            }
        }
        catch (err) {
            throw err;
        }
    }
    async setSMSNotificationForMembersOf(taskId, members, percentage) {
        try {
            const sendSMSObject = await this.calculatePercentage(percentage, taskId);
            const insert = [];
            for (let i = 0; i < members.length; i++) {
                const member = members[i];
                insert.push({
                    personnelId: +member,
                    date: sendSMSObject.sendDate,
                    taskId: taskId,
                    percentage: percentage
                });
            }
            this.tasksSMSNotificationRepo.createQueryBuilder()
                .insert()
                .values(insert)
                .execute();
        }
        catch (err) {
        }
    }
    async calculatePercentage(percentage, taskId) {
        try {
            const task = await this.taskRepo.createQueryBuilder()
                .where('id = :id and status <> :status', { id: taskId, status: task_status_enum_1.TaskStatus.DONE })
                .getOne();
            if (task && task.dueDate && task.created_at) {
                const fromDate = moment(task.created_at).utc(true);
                const toDate = moment(task.dueDate).utc(true);
                const duration = moment.duration(toDate.diff(fromDate)).asSeconds();
                const sendDate = moment(fromDate).utc(false).add(Math.round((percentage * 0.01) * duration), 'seconds').format('YYYY/MM/DD HH:mm:ss');
                return {
                    startDate: task.created_at,
                    seconds: Math.round((percentage * 0.01) * duration),
                    sendDate: sendDate
                };
            }
            else {
                throw new Error('task does not have either dueDate / created_at to calculate the percentage');
            }
        }
        catch (err) {
            throw err;
        }
    }
    async taskDetail(id) {
        try {
            const task = await this.taskRepo.findOne({
                where: {
                    id: id
                }
            });
            if (task) {
                const membersArray = [];
                const members = await this.taskMemberRepo.find({
                    where: {
                        taskId: task.id
                    }
                });
                for (let i = 0; i < members.length; i++) {
                    const member = members[i];
                    const personnel = await this.personnelService.findPersonnelById(member.userId);
                    membersArray.push({
                        id: personnel.id,
                        firstName: personnel.first_name,
                        lastName: personnel.last_name,
                        mobile: personnel.mobile1,
                        nationalCode: personnel.national_number
                    });
                }
                const toInformArray = [];
                const toInforms = await this.tasksToInformRepo.find({
                    where: {
                        taskId: task.id
                    }
                });
                for (let i = 0; i < toInforms.length; i++) {
                    const personnel = await this.personnelService.findPersonnelById(toInforms[i].personnelId);
                    if (personnel) {
                        toInformArray.push({
                            id: personnel.id,
                            firstName: personnel.first_name,
                            lastName: personnel.last_name,
                            mobile: personnel.mobile1,
                            nationalCode: personnel.national_number
                        });
                    }
                }
                const notMyDuty = await this.taskNotMyDutyRepo.findOne({
                    where: {
                        taskId: task.id
                    }
                });
                return {
                    task: task,
                    members: membersArray,
                    membersToInform: toInformArray,
                    notMyDuty: notMyDuty
                };
            }
            else {
                throw new common_1.NotFoundException('task could not be found');
            }
        }
        catch (err) {
            throw err;
        }
    }
    async createNotMyDuty(dto, userId) {
        try {
            const notMyDuty = await this.taskNotMyDutyRepo.createQueryBuilder()
                .insert()
                .values([
                Object.assign(Object.assign({}, dto), { date: moment().utc(true).format('YYYY/MM/DD HH:mm:ss'), personnelId: userId, approved: null })
            ])
                .execute();
            await this.taskMemberRepo.createQueryBuilder()
                .delete()
                .where('task_id_fk = :tid and personnel_id_fk = :pid', {
                tid: dto.taskId,
                pid: userId
            })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }
    async approveNotMyDuty(taskId, approve, userId) {
        try {
            const entity = await (0, typeorm_2.createQueryBuilder)('tasks_notmyduty', 't1')
                .innerJoinAndSelect('tasks', 't2', 't1.task_id_fk = t2.id')
                .innerJoinAndSelect('tasks_condition', 't3', 't2.task_condition_id_fk = t3.id')
                .where('t1.task_id_fk = :tid and t3.creator_id_fk = :creator and t1.approved is null', {
                tid: taskId,
                creator: userId
            })
                .getRawOne();
            if (entity) {
                await this.taskNotMyDutyRepo.createQueryBuilder()
                    .update()
                    .set({
                    approved: approve == true ? 1 : 0
                })
                    .execute();
            }
            else {
                throw new common_1.NotFoundException('task could not be found');
            }
        }
        catch (err) {
            throw err;
        }
    }
};
TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_schema_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(task_member_schema_1.TaskMember)),
    __param(2, (0, typeorm_1.InjectRepository)(task_condition_schema_1.TaskCondition)),
    __param(3, (0, typeorm_1.InjectRepository)(task_schedule_daily_schema_1.TasksScheduleDaily)),
    __param(4, (0, typeorm_1.InjectRepository)(task_schedule_weekly_schema_1.TasksScheduleWeekly)),
    __param(5, (0, typeorm_1.InjectRepository)(task_schedule_monthly_schema_1.TasksScheduleMonthly)),
    __param(6, (0, typeorm_1.InjectRepository)(tasks_schedule_yearly_schema_1.TasksScheduleYearly)),
    __param(7, (0, typeorm_1.InjectRepository)(task_toinform_schema_1.TasksToInform)),
    __param(8, (0, typeorm_1.InjectRepository)(task_sms_notification_schema_1.TasksSMSNotification)),
    __param(9, (0, typeorm_1.InjectRepository)(task_approver_schema_1.TaskApprover)),
    __param(10, (0, typeorm_1.InjectRepository)(task_notmyduty_schema_1.TasksNotMyDuty)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object, typeof (_f = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _f : Object, typeof (_g = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _g : Object, typeof (_h = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _h : Object, typeof (_j = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _j : Object, typeof (_k = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _k : Object, typeof (_l = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _l : Object, typeof (_m = typeof queue_service_1.QueueService !== "undefined" && queue_service_1.QueueService) === "function" ? _m : Object, typeof (_o = typeof personnel_service_1.PersonnelService !== "undefined" && personnel_service_1.PersonnelService) === "function" ? _o : Object, typeof (_p = typeof jobs_service_1.JobsService !== "undefined" && jobs_service_1.JobsService) === "function" ? _p : Object])
], TasksService);
exports.TasksService = TasksService;


/***/ }),
/* 190 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskType = void 0;
var TaskType;
(function (TaskType) {
    TaskType["INDEPENDENT"] = "independent";
    TaskType["CHAINED"] = "chained";
})(TaskType = exports.TaskType || (exports.TaskType = {}));


/***/ }),
/* 191 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskStatus = void 0;
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["NEW"] = "new";
    TaskStatus["INPROGRESS"] = "inprogress";
    TaskStatus["DONE"] = "done";
})(TaskStatus = exports.TaskStatus || (exports.TaskStatus = {}));


/***/ }),
/* 192 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FailedTaskType = void 0;
var FailedTaskType;
(function (FailedTaskType) {
    FailedTaskType["KILL"] = "kill";
    FailedTaskType["DELAYED"] = "delayed";
})(FailedTaskType = exports.FailedTaskType || (exports.FailedTaskType = {}));


/***/ }),
/* 193 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KartablTastStatus = void 0;
var KartablTastStatus;
(function (KartablTastStatus) {
    KartablTastStatus["MYTASKS"] = "mytasks";
    KartablTastStatus["TOINFO"] = "toinfo";
    KartablTastStatus["INPROGRESS"] = "inprogress";
    KartablTastStatus["DONE"] = "done";
    KartablTastStatus["NOTDONE"] = "notdone";
    KartablTastStatus["REDIRECTED"] = "redirected";
    KartablTastStatus["TOAPPROVE"] = "toapprove";
    KartablTastStatus["NOTMYDUTY"] = "notmyduty";
})(KartablTastStatus = exports.KartablTastStatus || (exports.KartablTastStatus = {}));


/***/ }),
/* 194 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskPriority = void 0;
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["NORMAL"] = "normal";
    TaskPriority["HIGH"] = "high";
})(TaskPriority = exports.TaskPriority || (exports.TaskPriority = {}));


/***/ }),
/* 195 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskPunishment = void 0;
var TaskPunishment;
(function (TaskPunishment) {
    TaskPunishment["NONE"] = "none";
    TaskPunishment["DECLINE_CONTRACT"] = "decline_contract";
    TaskPunishment["SUSPENSION"] = "suspension";
    TaskPunishment["CASH_PENALTY"] = "cashe_penalty";
    TaskPunishment["DISCIPLINARY_COMMITEE"] = "disciplinary_committee";
    TaskPunishment["NEGATIVE_POINT"] = "negative_point";
})(TaskPunishment = exports.TaskPunishment || (exports.TaskPunishment = {}));


/***/ }),
/* 196 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskDoneCondition = void 0;
var TaskDoneCondition;
(function (TaskDoneCondition) {
    TaskDoneCondition["NONE"] = "none";
    TaskDoneCondition["SPECIFIC_JOB"] = "specific_job";
    TaskDoneCondition["SUPER_ADMIN"] = "super_admin";
    TaskDoneCondition["BY_REFERRAL"] = "by_referral";
    TaskDoneCondition["SPECIFIC_PERSON"] = "specific_person";
})(TaskDoneCondition = exports.TaskDoneCondition || (exports.TaskDoneCondition = {}));


/***/ }),
/* 197 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksSMSNotificationType = void 0;
var TasksSMSNotificationType;
(function (TasksSMSNotificationType) {
    TasksSMSNotificationType["START"] = "onstart";
    TasksSMSNotificationType["PERCENT25"] = "on25percent";
    TasksSMSNotificationType["PERCENT50"] = "on50percent";
    TasksSMSNotificationType["PERCENT75"] = "on75percent";
    TasksSMSNotificationType["PERCENT90"] = "on90percent";
})(TasksSMSNotificationType = exports.TasksSMSNotificationType || (exports.TasksSMSNotificationType = {}));


/***/ }),
/* 198 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueueService = void 0;
const bull_1 = __webpack_require__(199);
const common_1 = __webpack_require__(4);
const bull_2 = __webpack_require__(200);
let QueueService = class QueueService {
    constructor(mainQueue) {
        this.mainQueue = mainQueue;
    }
    createTasksConditions(data) {
        this.mainQueue.add('task-condition', data);
    }
    smsSendAfterTaskCreated(data) {
        this.mainQueue.add('send-sms-after-task-created', data);
    }
    smsSendOn25Percent(data) {
        this.mainQueue.add('send-sms-after-25percent-of-task', data);
    }
    smsSendOn50Percent(data) {
        this.mainQueue.add('send-sms-after-50percent-of-task', data);
    }
    smsSendOn75Percent(data) {
        this.mainQueue.add('send-sms-after-75percent-of-task', data);
    }
    smsSendOn90Percent(data) {
        this.mainQueue.add('send-sms-after-90percent-of-task', data);
    }
    checkForTasksSMS(data) {
        this.mainQueue.add('check-for-tasks-sms', data);
    }
};
QueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('mainQueue')),
    __metadata("design:paramtypes", [typeof (_a = typeof bull_2.Queue !== "undefined" && bull_2.Queue) === "function" ? _a : Object])
], QueueService);
exports.QueueService = QueueService;


/***/ }),
/* 199 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/bull");;

/***/ }),
/* 200 */
/***/ ((module) => {

"use strict";
module.exports = require("bull");;

/***/ }),
/* 201 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskApproveSequence = void 0;
var TaskApproveSequence;
(function (TaskApproveSequence) {
    TaskApproveSequence["LINEAR"] = "linear";
    TaskApproveSequence["PARALLEL"] = "parallel";
})(TaskApproveSequence = exports.TaskApproveSequence || (exports.TaskApproveSequence = {}));


/***/ }),
/* 202 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksController = void 0;
const common_1 = __webpack_require__(4);
const tasks_service_1 = __webpack_require__(189);
const create_task_dto_1 = __webpack_require__(203);
const update_task_dto_1 = __webpack_require__(204);
const auth_guards_1 = __webpack_require__(16);
const express_1 = __webpack_require__(39);
const create_condition_dto_1 = __webpack_require__(205);
const update_condition_dto_1 = __webpack_require__(211);
const task_kartabl_status_enum_1 = __webpack_require__(193);
const create_not_my_duty_dto_1 = __webpack_require__(212);
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    taskDetail(id) {
        return this.tasksService.taskDetail(+id);
    }
    kartabl(req, status) {
        return this.tasksService.kartabl(req.user.id, status);
    }
    create(body, req) {
        return this.tasksService.create(body, req.user.id);
    }
    updateTask(id, body, req) {
        return this.tasksService.updateTask(+id, body, req.user.id);
    }
    myOpenTasks(req) {
        return this.tasksService.myOpenTasks(req.user.id);
    }
    createNewTaskCondition(req, body) {
        return this.tasksService.createTaskCondition(req.user.id, body);
    }
    listOfConditions() {
        return this.tasksService.getTaskConditions();
    }
    listOfCompanyTaskConditions(id) {
        return this.tasksService.getTaskConditionDetail(+id);
    }
    updateCondition(id, body) {
        return this.tasksService.updateTaskCondition(+id, body);
    }
    deleteCondition(id) {
        return this.tasksService.deleteTaskCondition(+id);
    }
    async approveTask(req, id) {
        return await this.tasksService.approveTask(+id, req.user.id);
    }
    async createNotMyDuty(body, req) {
        return await this.tasksService.createNotMyDuty(body, req.user.id);
    }
    async updateNotMyDuty(id, req, approve) {
        if (approve === 'true' || approve === 'false') {
            const _approve = approve === 'true' ? true : false;
            return await this.tasksService.approveNotMyDuty(+id, _approve, req.user.id);
        }
        else {
            throw new common_1.NotFoundException('url not found');
        }
    }
};
__decorate([
    (0, common_1.Get)('/detail/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "taskDetail", null);
__decorate([
    (0, common_1.Get)('/kartabl/:status'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _a : Object, typeof (_b = typeof task_kartabl_status_enum_1.KartablTastStatus !== "undefined" && task_kartabl_status_enum_1.KartablTastStatus) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "kartabl", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_task_dto_1.CreateTaskDTO !== "undefined" && create_task_dto_1.CreateTaskDTO) === "function" ? _c : Object, typeof (_d = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof update_task_dto_1.UpdateTaskDTO !== "undefined" && update_task_dto_1.UpdateTaskDTO) === "function" ? _e : Object, typeof (_f = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Get)('/open'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _g : Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "myOpenTasks", null);
__decorate([
    (0, common_1.Post)('/condition'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _h : Object, typeof (_j = typeof create_condition_dto_1.CreateTaskConditionDTO !== "undefined" && create_condition_dto_1.CreateTaskConditionDTO) === "function" ? _j : Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "createNewTaskCondition", null);
__decorate([
    (0, common_1.Get)('/condition'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "listOfConditions", null);
__decorate([
    (0, common_1.Get)('/condition/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "listOfCompanyTaskConditions", null);
__decorate([
    (0, common_1.Patch)('/condition/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_k = typeof update_condition_dto_1.UpdateTaskConditionDTO !== "undefined" && update_condition_dto_1.UpdateTaskConditionDTO) === "function" ? _k : Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "updateCondition", null);
__decorate([
    (0, common_1.Delete)('/condition/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "deleteCondition", null);
__decorate([
    (0, common_1.Patch)('/approve/:id'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _l : Object, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "approveTask", null);
__decorate([
    (0, common_1.Post)('not-my-duty'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof create_not_my_duty_dto_1.CreateTaskNotMyDutyDTO !== "undefined" && create_not_my_duty_dto_1.CreateTaskNotMyDutyDTO) === "function" ? _m : Object, typeof (_o = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _o : Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "createNotMyDuty", null);
__decorate([
    (0, common_1.Patch)('not-my-duty/:taskId/:approve'),
    (0, common_1.UseGuards)(auth_guards_1.Authorized),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('approve')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_p = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _p : Object, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "updateNotMyDuty", null);
TasksController = __decorate([
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [typeof (_q = typeof tasks_service_1.TasksService !== "undefined" && tasks_service_1.TasksService) === "function" ? _q : Object])
], TasksController);
exports.TasksController = TasksController;


/***/ }),
/* 203 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTaskDTO = void 0;
const class_validator_1 = __webpack_require__(42);
const task_approve_sequence_enum_1 = __webpack_require__(201);
const task_done_condition_enum_1 = __webpack_require__(196);
const task_failed_enum_1 = __webpack_require__(192);
const task_priority_enum_1 = __webpack_require__(194);
const task_punishment_enum_1 = __webpack_require__(195);
const task_status_enum_1 = __webpack_require__(191);
const task_type_enum_1 = __webpack_require__(190);
const tasks_sms_notification_enum_1 = __webpack_require__(197);
class CreateTaskDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTaskDTO.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTaskDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(task_type_enum_1.TaskType),
    __metadata("design:type", String)
], CreateTaskDTO.prototype, "taskType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTaskDTO.prototype, "relatedTask", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreateTaskDTO.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(task_failed_enum_1.FailedTaskType),
    __metadata("design:type", String)
], CreateTaskDTO.prototype, "ifTaskFailed", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTaskDTO.prototype, "point", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTaskDTO.prototype, "negativePoint", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(task_status_enum_1.TaskStatus),
    __metadata("design:type", String)
], CreateTaskDTO.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreateTaskDTO.prototype, "members", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(task_priority_enum_1.TaskPriority),
    __metadata("design:type", String)
], CreateTaskDTO.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(task_punishment_enum_1.TaskPunishment),
    __metadata("design:type", String)
], CreateTaskDTO.prototype, "punishment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTaskDTO.prototype, "pageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(task_done_condition_enum_1.TaskDoneCondition),
    __metadata("design:type", String)
], CreateTaskDTO.prototype, "approveCondition", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreateTaskDTO.prototype, "approverJobsId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(task_approve_sequence_enum_1.TaskApproveSequence),
    __metadata("design:type", String)
], CreateTaskDTO.prototype, "approveJobsSequence", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTaskDTO.prototype, "approverPersonnelId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreateTaskDTO.prototype, "personnelToInform", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(tasks_sms_notification_enum_1.TasksSMSNotificationType, { each: true }),
    __metadata("design:type", Array)
], CreateTaskDTO.prototype, "smsNotification", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], CreateTaskDTO.prototype, "referable", void 0);
exports.CreateTaskDTO = CreateTaskDTO;


/***/ }),
/* 204 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateTaskDTO = void 0;
const mapped_types_1 = __webpack_require__(50);
const create_task_dto_1 = __webpack_require__(203);
class UpdateTaskDTO extends (0, mapped_types_1.PartialType)(create_task_dto_1.CreateTaskDTO) {
}
exports.UpdateTaskDTO = UpdateTaskDTO;


/***/ }),
/* 205 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTaskConditionDTO = void 0;
const class_transformer_1 = __webpack_require__(41);
const class_validator_1 = __webpack_require__(42);
const task_approve_sequence_enum_1 = __webpack_require__(201);
const task_done_condition_enum_1 = __webpack_require__(196);
const task_failed_enum_1 = __webpack_require__(192);
const task_priority_enum_1 = __webpack_require__(194);
const task_punishment_enum_1 = __webpack_require__(195);
const tasks_sms_notification_enum_1 = __webpack_require__(197);
const create_condition_schedule_daily_dto_1 = __webpack_require__(206);
const create_condition_schedule_monthly_dto_1 = __webpack_require__(207);
const create_condition_schedule_weekly_dto_1 = __webpack_require__(208);
const create_condition_schedule_yearly_dto_1 = __webpack_require__(210);
class CreateTaskConditionDTO {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTaskConditionDTO.prototype, "tableId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTaskConditionDTO.prototype, "condition", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTaskConditionDTO.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTaskConditionDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTaskConditionDTO.prototype, "secondsAfterCreate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(task_failed_enum_1.FailedTaskType),
    __metadata("design:type", String)
], CreateTaskConditionDTO.prototype, "ifTaskFailed", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTaskConditionDTO.prototype, "point", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTaskConditionDTO.prototype, "negativePoint", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTaskConditionDTO.prototype, "personnelMembers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTaskConditionDTO.prototype, "personnelToInform", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTaskConditionDTO.prototype, "jobs", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], CreateTaskConditionDTO.prototype, "enable", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(task_priority_enum_1.TaskPriority),
    __metadata("design:type", String)
], CreateTaskConditionDTO.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(task_punishment_enum_1.TaskPunishment),
    __metadata("design:type", String)
], CreateTaskConditionDTO.prototype, "punishment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_condition_schedule_daily_dto_1.CreateConditionScheduleDaily),
    __metadata("design:type", Array)
], CreateTaskConditionDTO.prototype, "dailySchedule", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_condition_schedule_weekly_dto_1.CreateConditionScheduleWeekly),
    __metadata("design:type", Array)
], CreateTaskConditionDTO.prototype, "weeklySchedule", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => create_condition_schedule_monthly_dto_1.CreateConditionScheduleMonthly),
    __metadata("design:type", Array)
], CreateTaskConditionDTO.prototype, "monthlySchedule", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => create_condition_schedule_yearly_dto_1.CreateConditionScheduleYearly),
    __metadata("design:type", Array)
], CreateTaskConditionDTO.prototype, "yearlySchedule", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(tasks_sms_notification_enum_1.TasksSMSNotificationType, { each: true }),
    __metadata("design:type", typeof (_a = typeof tasks_sms_notification_enum_1.TasksSMSNotificationType !== "undefined" && tasks_sms_notification_enum_1.TasksSMSNotificationType) === "function" ? _a : Object)
], CreateTaskConditionDTO.prototype, "smsNotification", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTaskConditionDTO.prototype, "pageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreateTaskConditionDTO.prototype, "approverJobsId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(task_approve_sequence_enum_1.TaskApproveSequence),
    __metadata("design:type", String)
], CreateTaskConditionDTO.prototype, "approveJobsSequence", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(task_done_condition_enum_1.TaskDoneCondition),
    __metadata("design:type", String)
], CreateTaskConditionDTO.prototype, "approveCondition", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Number)
], CreateTaskConditionDTO.prototype, "approvePersonnelId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], CreateTaskConditionDTO.prototype, "referable", void 0);
exports.CreateTaskConditionDTO = CreateTaskConditionDTO;


/***/ }),
/* 206 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateConditionScheduleDaily = void 0;
const class_validator_1 = __webpack_require__(42);
class CreateConditionScheduleDaily {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(23),
    __metadata("design:type", Number)
], CreateConditionScheduleDaily.prototype, "hour", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsEnum)([0, 15, 30, 45]),
    __metadata("design:type", Number)
], CreateConditionScheduleDaily.prototype, "minute", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateConditionScheduleDaily.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateConditionScheduleDaily.prototype, "toDate", void 0);
exports.CreateConditionScheduleDaily = CreateConditionScheduleDaily;


/***/ }),
/* 207 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateConditionScheduleMonthly = void 0;
const class_validator_1 = __webpack_require__(42);
class CreateConditionScheduleMonthly {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(31),
    __metadata("design:type", Number)
], CreateConditionScheduleMonthly.prototype, "day", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateConditionScheduleMonthly.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateConditionScheduleMonthly.prototype, "toDate", void 0);
exports.CreateConditionScheduleMonthly = CreateConditionScheduleMonthly;


/***/ }),
/* 208 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateConditionScheduleWeekly = void 0;
const class_validator_1 = __webpack_require__(42);
const week_days_enum_1 = __webpack_require__(209);
class CreateConditionScheduleWeekly {
}
__decorate([
    (0, class_validator_1.IsEnum)(week_days_enum_1.WeekDays),
    __metadata("design:type", typeof (_a = typeof week_days_enum_1.WeekDays !== "undefined" && week_days_enum_1.WeekDays) === "function" ? _a : Object)
], CreateConditionScheduleWeekly.prototype, "dayName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(23),
    __metadata("design:type", Number)
], CreateConditionScheduleWeekly.prototype, "hour", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsEnum)([0, 15, 30, 45]),
    __metadata("design:type", Number)
], CreateConditionScheduleWeekly.prototype, "minute", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateConditionScheduleWeekly.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateConditionScheduleWeekly.prototype, "toDate", void 0);
exports.CreateConditionScheduleWeekly = CreateConditionScheduleWeekly;


/***/ }),
/* 209 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WeekDays = void 0;
var WeekDays;
(function (WeekDays) {
    WeekDays["SATURDAY"] = "Saturday";
    WeekDays["SUNDAY"] = "Sunday";
    WeekDays["MONDAY"] = "Monday";
    WeekDays["TUESDAY"] = "Tuesday";
    WeekDays["WEDNESDAY"] = "Wednesday";
    WeekDays["THURSDAY"] = "Thursday";
    WeekDays["FRIDAY"] = "Friday";
})(WeekDays = exports.WeekDays || (exports.WeekDays = {}));


/***/ }),
/* 210 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateConditionScheduleYearly = void 0;
const class_validator_1 = __webpack_require__(42);
class CreateConditionScheduleYearly {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(31),
    __metadata("design:type", Number)
], CreateConditionScheduleYearly.prototype, "day", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], CreateConditionScheduleYearly.prototype, "month", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateConditionScheduleYearly.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateConditionScheduleYearly.prototype, "toDate", void 0);
exports.CreateConditionScheduleYearly = CreateConditionScheduleYearly;


/***/ }),
/* 211 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateTaskConditionDTO = void 0;
const mapped_types_1 = __webpack_require__(50);
const create_condition_dto_1 = __webpack_require__(205);
class UpdateTaskConditionDTO extends (0, mapped_types_1.PartialType)(create_condition_dto_1.CreateTaskConditionDTO) {
}
exports.UpdateTaskConditionDTO = UpdateTaskConditionDTO;


/***/ }),
/* 212 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTaskNotMyDutyDTO = void 0;
const class_validator_1 = __webpack_require__(42);
class CreateTaskNotMyDutyDTO {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTaskNotMyDutyDTO.prototype, "taskId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTaskNotMyDutyDTO.prototype, "description", void 0);
exports.CreateTaskNotMyDutyDTO = CreateTaskNotMyDutyDTO;


/***/ }),
/* 213 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskSubscriber = void 0;
const common_1 = __webpack_require__(4);
const event_emitter_1 = __webpack_require__(214);
const typeorm_1 = __webpack_require__(9);
const queue_service_1 = __webpack_require__(198);
const typeorm_2 = __webpack_require__(20);
let TaskSubscriber = class TaskSubscriber {
    constructor(connection, eventEmitter, queueService) {
        this.connection = connection;
        this.eventEmitter = eventEmitter;
        this.queueService = queueService;
        this.tasksTables = [];
        this.createQueue = ((event) => {
            const body = event.entity;
            const tableName = event.metadata.givenTableName;
            const columns = [];
            event.metadata.ownColumns.forEach(column => {
                const m = {
                    propertiesMap: column.entityMetadata.propertiesMap,
                    propertyName: column.propertyName,
                    databaseName: column.databaseName
                };
                columns.push(m);
            });
            this.queueService.createTasksConditions({
                body: body,
                tableName: tableName,
                columns: columns
            });
        });
        connection.subscribers.push(this);
        this.tasksTables = [
            'tasks',
            'tasks_approver',
            'tasks_forward',
            'tasks_member',
            'tasks_notmyduty',
            'tasks_point'
        ];
    }
    async afterUpdate(event) {
        if (this.tasksTables.indexOf(event.metadata.givenTableName) > -1) {
            const data = {
                tableName: event.metadata.givenTableName,
                payload: event.entity
            };
            this.eventEmitter.emit('tasks.update', data);
        }
        this.createQueue(event);
    }
    async afterInsert(event) {
        if (this.tasksTables.indexOf(event.metadata.givenTableName) > -1) {
            const data = {
                tableName: event.metadata.givenTableName,
                payload: event.entity
            };
            this.eventEmitter.emit('tasks.insert', data);
        }
        this.createQueue(event);
    }
    async afterRemove(event) {
        if (this.tasksTables.indexOf(event.metadata.givenTableName) > -1) {
            const data = {
                tableName: event.metadata.givenTableName,
                payload: event.entity
            };
            this.eventEmitter.emit('tasks.remove', data);
        }
    }
};
TaskSubscriber = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectConnection)()),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Connection !== "undefined" && typeorm_2.Connection) === "function" ? _a : Object, typeof (_b = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _b : Object, typeof (_c = typeof queue_service_1.QueueService !== "undefined" && queue_service_1.QueueService) === "function" ? _c : Object])
], TaskSubscriber);
exports.TaskSubscriber = TaskSubscriber;


/***/ }),
/* 214 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/event-emitter");;

/***/ }),
/* 215 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueueModule = void 0;
const bull_1 = __webpack_require__(199);
const common_1 = __webpack_require__(4);
const personnel_module_1 = __webpack_require__(10);
const table_name_module_1 = __webpack_require__(181);
const tasks_module_1 = __webpack_require__(188);
const queue_processor_1 = __webpack_require__(216);
const queue_service_1 = __webpack_require__(198);
let QueueModule = class QueueModule {
};
QueueModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.registerQueue({
                name: 'mainQueue'
            }),
            table_name_module_1.TableNameModule,
            (0, common_1.forwardRef)(() => tasks_module_1.TasksModule),
            personnel_module_1.PersonnelModule
        ],
        providers: [queue_service_1.QueueService, queue_processor_1.QueueProcessor],
        exports: [queue_service_1.QueueService]
    })
], QueueModule);
exports.QueueModule = QueueModule;


/***/ }),
/* 216 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueueProcessor = void 0;
const bull_1 = __webpack_require__(199);
const common_1 = __webpack_require__(4);
const bull_2 = __webpack_require__(200);
const table_name_service_1 = __webpack_require__(182);
const tasks_service_1 = __webpack_require__(189);
const typeorm_1 = __webpack_require__(20);
const queue_service_1 = __webpack_require__(198);
const moment = __webpack_require__(52);
const task_status_enum_1 = __webpack_require__(191);
const task_type_enum_1 = __webpack_require__(190);
const personnel_service_1 = __webpack_require__(17);
const task_priority_enum_1 = __webpack_require__(194);
const task_punishment_enum_1 = __webpack_require__(195);
const nimaadsms_1 = __webpack_require__(67);
let QueueProcessor = class QueueProcessor {
    constructor(queueService, tableNameService, tasksService, personnelService) {
        this.queueService = queueService;
        this.tableNameService = tableNameService;
        this.tasksService = tasksService;
        this.personnelService = personnelService;
    }
    async handleTasksConditions(job) {
        try {
            if (job.data.tableName) {
                const tableEntity = await this.tableNameService.getTableIdByName(job.data.tableName);
                if (tableEntity) {
                    const tableCondition = await this.tasksService.getTableConditionsByTableId(tableEntity.id);
                    if (tableCondition && tableCondition.length > 0) {
                        let tableNames = [];
                        let tableValues = [];
                        const qr = await (0, typeorm_1.getConnection)().createQueryRunner();
                        for (let i = 0; i < tableCondition.length; i++) {
                            const item = tableCondition[i];
                            const arr = item.condition.split(/<|=|>/);
                            tableNames.push(arr[0].trim());
                            tableValues.push(arr[arr.length - 1]);
                            const cmd = `select ${[...new Set(tableNames)].toString()} from ${job.data.tableName} where ${item.condition} order by id desc limit 1;`;
                            const list = await qr.query(cmd);
                            let membersArray = [];
                            if (list.length > 0) {
                                if (item.personnelMembers) {
                                    membersArray = item.personnelMembers.split(',').map(Number);
                                }
                                else if (item.jobs != null) {
                                    const jobs = item.jobs.split(',');
                                    jobs.forEach(async (job) => {
                                        const members = await this.personnelService.findPersonnelOfJob(+job);
                                        members.forEach(member => {
                                            membersArray.push(member.personnel_id_fk);
                                        });
                                    });
                                    membersArray = [...new Set(membersArray)];
                                }
                                if (membersArray.length > 0) {
                                    const createTaskDTO = {
                                        title: item.title,
                                        description: item.description,
                                        dueDate: moment().utc(true).add(item.secondsAfterCreate, 'seconds').toDate(),
                                        ifTaskFailed: item.ifTaskFailed,
                                        point: item.point,
                                        negativePoint: item.negativePoint,
                                        members: membersArray,
                                        status: task_status_enum_1.TaskStatus.NEW,
                                        relatedTask: null,
                                        taskType: task_type_enum_1.TaskType.INDEPENDENT,
                                        priority: item.priority != null ? item.priority : task_priority_enum_1.TaskPriority.NORMAL,
                                        punishment: item.punishment != null ? item.punishment : task_punishment_enum_1.TaskPunishment.NONE,
                                        pageUrl: item.pageUrl,
                                        approveCondition: item.approveCondition,
                                        approverJobsId: item.approverJobsId != null ? item.approverJobsId.split(',').map(Number) : null,
                                        approverPersonnelId: item.approverPersonnelId,
                                        personnelToInform: item.personnelToInform != null ? item.personnelToInform.split(',').map(Number) : null,
                                        smsNotification: item.smsNotification ? item.smsNotification.split(',') : null,
                                        approveJobsSequence: item.approveJobsSequence,
                                        referable: item.referable
                                    };
                                    const newTask = await this.tasksService.create(createTaskDTO, -1, +job.data.body.id, item.id);
                                    if (item.personnelToInform) {
                                        const personnels = item.personnelToInform.toString().split(',').map(Number);
                                        await this.tasksService.createTaskToInformPersonnel(newTask.identifiers[0].id, personnels);
                                    }
                                }
                            }
                        }
                        await qr.release();
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    async handleSendSMS(job) {
        try {
            if (job.data.members && job.data.taskId) {
                for (let i = 0; i < job.data.members.length; i++) {
                    const personnel = await this.personnelService.findPersonnelById(+job.data.members[i]);
                    if (personnel) {
                        new nimaadsms_1.NimaadSMS().sendCreatedTask(personnel.mobile1, +job.data.taskId, `${personnel.first_name} ${personnel.last_name}`);
                    }
                }
            }
        }
        catch (err) {
            throw err;
        }
    }
    async handleSendSMSOn25PercentOfTask(job) {
        try {
            if (job.data.taskId && job.data.members) {
                const taskId = +job.data.taskId;
                this.tasksService.setSMSNotificationForMembersOf(taskId, job.data.members, 25);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async handleSendSMSOn50PercentOfTask(job) {
        try {
            if (job.data.taskId && job.data.members) {
                const taskId = +job.data.taskId;
                this.tasksService.setSMSNotificationForMembersOf(taskId, job.data.members, 50);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async handleSendSMSOn75PercentOfTask(job) {
        try {
            if (job.data.taskId && job.data.members) {
                const taskId = +job.data.taskId;
                this.tasksService.setSMSNotificationForMembersOf(taskId, job.data.members, 75);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async handleSendSMSOn90PercentOfTask(job) {
        try {
            if (job.data.taskId && job.data.members) {
                const taskId = +job.data.taskId;
                this.tasksService.setSMSNotificationForMembersOf(taskId, job.data.members, 90);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async checkForTasksSMS(job) {
        try {
            if (job.data.date) {
                const list = await this.tasksService.findAllTasksSMSNotification(job.data.date);
                list.forEach(item => {
                    new nimaadsms_1.NimaadSMS().sendTaskPercentage(+item.percentage, item.mobile, +item.taskId, null);
                });
            }
        }
        catch (err) {
            throw err;
        }
    }
};
__decorate([
    (0, bull_1.Process)('task-condition'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof bull_2.Job !== "undefined" && bull_2.Job) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], QueueProcessor.prototype, "handleTasksConditions", null);
__decorate([
    (0, bull_1.Process)('send-sms-after-task-created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof bull_2.Job !== "undefined" && bull_2.Job) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], QueueProcessor.prototype, "handleSendSMS", null);
__decorate([
    (0, bull_1.Process)('send-sms-after-25percent-of-task'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof bull_2.Job !== "undefined" && bull_2.Job) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], QueueProcessor.prototype, "handleSendSMSOn25PercentOfTask", null);
__decorate([
    (0, bull_1.Process)('send-sms-after-50percent-of-task'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof bull_2.Job !== "undefined" && bull_2.Job) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], QueueProcessor.prototype, "handleSendSMSOn50PercentOfTask", null);
__decorate([
    (0, bull_1.Process)('send-sms-after-75percent-of-task'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof bull_2.Job !== "undefined" && bull_2.Job) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], QueueProcessor.prototype, "handleSendSMSOn75PercentOfTask", null);
__decorate([
    (0, bull_1.Process)('send-sms-after-90percent-of-task'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof bull_2.Job !== "undefined" && bull_2.Job) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], QueueProcessor.prototype, "handleSendSMSOn90PercentOfTask", null);
__decorate([
    (0, bull_1.Process)('check-for-tasks-sms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof bull_2.Job !== "undefined" && bull_2.Job) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], QueueProcessor.prototype, "checkForTasksSMS", null);
QueueProcessor = __decorate([
    (0, bull_1.Processor)('mainQueue'),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => tasks_service_1.TasksService))),
    __metadata("design:paramtypes", [typeof (_h = typeof queue_service_1.QueueService !== "undefined" && queue_service_1.QueueService) === "function" ? _h : Object, typeof (_j = typeof table_name_service_1.TableNameService !== "undefined" && table_name_service_1.TableNameService) === "function" ? _j : Object, typeof (_k = typeof tasks_service_1.TasksService !== "undefined" && tasks_service_1.TasksService) === "function" ? _k : Object, typeof (_l = typeof personnel_service_1.PersonnelService !== "undefined" && personnel_service_1.PersonnelService) === "function" ? _l : Object])
], QueueProcessor);
exports.QueueProcessor = QueueProcessor;


/***/ }),
/* 217 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksEventListener = void 0;
const event_emitter_1 = __webpack_require__(214);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(20);
const task_schema_1 = __webpack_require__(104);
let TasksEventListener = class TasksEventListener {
    constructor(repo) {
        this.repo = repo;
    }
    handleTaskCreateEvent(payload) {
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)('tasks.insert'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TasksEventListener.prototype, "handleTaskCreateEvent", null);
TasksEventListener = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(task_schema_1.Task)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], TasksEventListener);
exports.TasksEventListener = TasksEventListener;


/***/ }),
/* 218 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CronModule = void 0;
const common_1 = __webpack_require__(4);
const schedule_1 = __webpack_require__(219);
const tasks_module_1 = __webpack_require__(188);
const queue_module_1 = __webpack_require__(215);
const cron_service_1 = __webpack_require__(220);
let CronModule = class CronModule {
};
CronModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            tasks_module_1.TasksModule,
            queue_module_1.QueueModule
        ],
        providers: [cron_service_1.CronService],
        exports: [cron_service_1.CronService]
    })
], CronModule);
exports.CronModule = CronModule;


/***/ }),
/* 219 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/schedule");;

/***/ }),
/* 220 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CronService = void 0;
const common_1 = __webpack_require__(4);
const schedule_1 = __webpack_require__(219);
const moment = __webpack_require__(52);
const tasks_service_1 = __webpack_require__(189);
const queue_service_1 = __webpack_require__(198);
let CronService = class CronService {
    constructor(tasksService, queueService) {
        this.tasksService = tasksService;
        this.queueService = queueService;
    }
    every15MinutesScheduler() {
        const hour = +moment().utc(true).format('HH');
        const minute = +moment().utc(true).format('mm');
        const dayName = moment().utc(true).format('dddd');
        console.log(`every 15 minutes scheduler ran at: ${hour}:${minute}`);
        this.tasksService.checkDailyScheduleTasks(hour, minute);
        this.tasksService.checkWeeklyScheduleTasks(dayName, hour, minute);
    }
    every1HourSchedule() {
        const hour = +moment().utc(true).format('HH');
        const minute = +moment().utc(true).format('mm');
        const dayName = moment().utc(true).format('dddd');
        console.log(`every 1hour scheduler ran at: ${hour}:${minute}`);
        this.tasksService.checkDailyScheduleTasks(hour, minute);
        this.tasksService.checkWeeklyScheduleTasks(dayName, hour, minute);
    }
    every1MinuteSchedule() {
        console.log('cron on every minute ran ...');
        const date = moment().utc(true).format('YYYY-MM-DD HH:mm');
        this.queueService.checkForTasksSMS({
            date: date
        });
    }
    everyDayAt730Schedule() {
        const day = +moment().utc(true).format('DD');
        const month = +moment().utc(true).format('MM');
        console.log('every day at 7:30 scheduler ran');
        this.tasksService.checkMonthlyScheduleTasks(day);
    }
};
__decorate([
    (0, schedule_1.Cron)('15,30,45 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CronService.prototype, "every15MinutesScheduler", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CronService.prototype, "every1HourSchedule", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CronService.prototype, "every1MinuteSchedule", null);
__decorate([
    (0, schedule_1.Cron)('30 7 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CronService.prototype, "everyDayAt730Schedule", null);
CronService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof tasks_service_1.TasksService !== "undefined" && tasks_service_1.TasksService) === "function" ? _a : Object, typeof (_b = typeof queue_service_1.QueueService !== "undefined" && queue_service_1.QueueService) === "function" ? _b : Object])
], CronService);
exports.CronService = CronService;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("654c3df7ff06865b6eea")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises;
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: currentChildModule !== moduleId,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				registeredStatusHandlers[i].call(null, newStatus);
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 					blockingPromises.push(promise);
/******/ 					waitForBlockingPromises(function () {
/******/ 						setStatus("ready");
/******/ 					});
/******/ 					return promise;
/******/ 				case "prepare":
/******/ 					blockingPromises.push(promise);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises.length === 0) return fn();
/******/ 			var blocker = blockingPromises;
/******/ 			blockingPromises = [];
/******/ 			return Promise.all(blocker).then(function () {
/******/ 				return waitForBlockingPromises(fn);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			setStatus("check");
/******/ 			return __webpack_require__.hmrM().then(function (update) {
/******/ 				if (!update) {
/******/ 					setStatus(applyInvalidatedModules() ? "ready" : "idle");
/******/ 					return null;
/******/ 				}
/******/ 		
/******/ 				setStatus("prepare");
/******/ 		
/******/ 				var updatedModules = [];
/******/ 				blockingPromises = [];
/******/ 				currentUpdateApplyHandlers = [];
/******/ 		
/******/ 				return Promise.all(
/******/ 					Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 						promises,
/******/ 						key
/******/ 					) {
/******/ 						__webpack_require__.hmrC[key](
/******/ 							update.c,
/******/ 							update.r,
/******/ 							update.m,
/******/ 							promises,
/******/ 							currentUpdateApplyHandlers,
/******/ 							updatedModules
/******/ 						);
/******/ 						return promises;
/******/ 					},
/******/ 					[])
/******/ 				).then(function () {
/******/ 					return waitForBlockingPromises(function () {
/******/ 						if (applyOnUpdate) {
/******/ 							return internalApply(applyOnUpdate);
/******/ 						} else {
/******/ 							setStatus("ready");
/******/ 		
/******/ 							return updatedModules;
/******/ 						}
/******/ 					});
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error("apply() is only allowed in ready status");
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				setStatus("abort");
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			// handle errors in accept handlers and self accepted module load
/******/ 			if (error) {
/******/ 				setStatus("fail");
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw error;
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			if (queuedInvalidatedModules) {
/******/ 				return internalApply(options).then(function (list) {
/******/ 					outdatedModules.forEach(function (moduleId) {
/******/ 						if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 					});
/******/ 					return list;
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			setStatus("idle");
/******/ 			return Promise.resolve(outdatedModules);
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			0: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		
/******/ 		// no chunk loading
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var update = require("./" + __webpack_require__.hu(chunkId));
/******/ 			var updatedModules = update.modules;
/******/ 			var runtime = update.runtime;
/******/ 			for(var moduleId in updatedModules) {
/******/ 				if(__webpack_require__.o(updatedModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = updatedModules[moduleId];
/******/ 					if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.requireHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					module.hot._selfAccepted &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.require = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.require = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.requireHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						!__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						__webpack_require__.o(installedChunks, chunkId) &&
/******/ 						installedChunks[chunkId] !== undefined
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			return Promise.resolve().then(function() {
/******/ 				return require("./" + __webpack_require__.hmrF());
/******/ 			}).catch(function(err) { if(err.code !== "MODULE_NOT_FOUND") throw err; });
/******/ 		}
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__(0);
/******/ 	var __webpack_exports__ = __webpack_require__(3);
/******/ 	
/******/ })()
;