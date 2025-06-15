import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "vehicle"})
export class Vehicle {

    @PrimaryGeneratedColumn({ type: 'int'})
    id: number;

    @Column('varchar', {nullable: true, length: 45})
    status: string | null;

    @Column("varchar", { name: "organization_code", nullable: true, length: 100 })
    organizationCode: string | null;

    @Column("int", { name: "type_id_fk", nullable: true })
    typeId: number | null;

    @Column("int", { name: "system_id_fk", nullable: true })
    systemId: number | null;

    @Column("int", { name: "style_id_fk", nullable: true })
    styleId: number | null;

    @Column("varchar", { name: "plaque1", nullable: true, length: 2 })
    plaque1: string | null;

    @Column("varchar", { name: "plaque2", nullable: true, length: 1 })
    plaque2: string | null;

    @Column("varchar", { name: "plaque3", nullable: true, length: 3 })
    plaque3: string | null;

    @Column("varchar", { name: "plaque4", nullable: true, length: 2 })
    plaque4: string | null;

    @Column("varchar", { name: "engine_number", nullable: true, length: 200 })
    engineNumber: string | null;

    @Column("varchar", { name: "chassis_number", nullable: true, length: 200 })
    chassisNumber: string | null;

    @Column("varchar", { name: "vin_number", nullable: true, length: 200 })
    vinNumber: string | null;

    @Column("varchar", { name: "serial_number", nullable: true, length: 200 })
    serialNumber: string | null;

    @Column("varchar", { name: "made_year", nullable: true, length: 5 })
    madeYear: string | null;

    @Column("varchar", { name: "color", nullable: true, length: 45 })
    color: string | null;

    @Column("varchar", { name: "gearbox", nullable: true, length: 10 })
    gearBox: string | null;

    @Column("double", { name: "price", nullable: true})
    price: number | null;

    @Column("int", { name: "environment_id_fk", nullable: true })
    environmentId: number | null;

    @Column("text", { name: "description", nullable: true })
    description: string | null;

    @Column("varchar", { name: "card_url", nullable: true, length: 200 })
    cardUrl: string | null;

    @Column("varchar", { name: "green_card_url", nullable: true, length: 200 })
    greenCardUrl: string | null;

    @Column("varchar", {
        name: "ownership_document_url",
        nullable: true,
        length: 200,
      })
    ownershipDocumentUrl: string | null;

    @Column('int', { name:'owner_id_fk', nullable: true })
    ownerId: number | null;

    @Column('varchar', { nullable: true , length: 45, name: 'owner_type'})
    ownerType: string | null;

    @Column('varchar', { nullable: true, length: 45, name: 'date_type'})
    dateType: string;
}