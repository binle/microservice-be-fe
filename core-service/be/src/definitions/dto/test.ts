import { DataProperty } from '@bakku/platform';

export class Car {
  @DataProperty({ description: 'name of car', type: 'string', validation: { isRequired: true } })
  name: string;

  @DataProperty({ description: 'expired of car', type: 'date', validation: { isRequired: true } })
  expired: Date;
}
