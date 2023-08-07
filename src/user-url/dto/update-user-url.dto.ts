import { PartialType } from '@nestjs/mapped-types';
import { CreateUserUrlDto } from './create-user-url.dto';

export class UpdateUserUrlDto extends PartialType(CreateUserUrlDto) {}
