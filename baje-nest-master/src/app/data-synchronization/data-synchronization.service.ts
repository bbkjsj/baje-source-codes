import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSynchronizationSchema } from "./schemas/data-synchronization.schema";
import { Repository } from "typeorm";
import { DateProvider } from "../../common/helpers/date-provider";

@Injectable()
export class DataSynchronizationService {

  constructor(
    @InjectRepository(DataSynchronizationSchema)
    private readonly dataSyncRepository: Repository<DataSynchronizationSchema>,
  ) {
  }

  getDateTime(): string {
    return DateProvider.today();
  }
}
