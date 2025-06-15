import {SetMetadata} from "@nestjs/common";
import { APIAuthRole } from '../enums/api-auth-role-type.enum';

export const API_ROLES_KEY = 'api-roles';
export const APIRoles = (...roles: APIAuthRole[]) => SetMetadata(API_ROLES_KEY, roles);