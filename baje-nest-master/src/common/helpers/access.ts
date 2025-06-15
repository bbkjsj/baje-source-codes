import { IAuthAccess } from "../../app/auth/interfaces";
import { Injectable } from "@nestjs/common";


export class Access {

  private userAccessList: IAuthAccess[] = [];

  constructor(access: IAuthAccess[]) {
    this.userAccessList = access;
  }

  isInBajeAccessLevel(accessValue: string): boolean {
    for(const access of this.userAccessList) {
      if(access.access === accessValue && access.accessLevel === 'baje') {
        return true;
      }
    }
    return false;
  }

  hasAccess(requiredAccess: string) {
    for(const access of this.userAccessList) {
      if(access.access === requiredAccess) {
        return true;
      }
    }
    return false;
  }
}