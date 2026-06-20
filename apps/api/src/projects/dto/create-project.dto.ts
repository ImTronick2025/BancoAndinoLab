import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import type { CloudProvider } from '@cap/model';

const PROVIDERS: CloudProvider[] = ['azure', 'aws', 'gcp', 'on-prem'];

export class CreateProjectDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsIn(PROVIDERS)
  provider?: CloudProvider;
}
