import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ChatRequestDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsNumber()
  maxResults?: number;

  @IsOptional()
  @IsString()
  systemPrompt?: string;
}

export class DocumentDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class AddDocumentsRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documents: DocumentDto[];

  @IsOptional()
  @IsString()
  source?: string;
}

export class AddTextsRequestDto {
  @IsArray()
  @IsString({ each: true })
  texts: string[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  metadata?: Record<string, any>[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ids?: string[];
}

// Response DTOs
export class SourceDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ChatResponseDto {
  @IsString()
  answer: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SourceDto)
  sources: SourceDto[];

  @IsString()
  timestamp: string;
}

export class DocumentWithScoreDto {
  @ValidateNested()
  @Type(() => DocumentDto)
  document: DocumentDto;

  @IsNumber()
  score: number;
}

export class ChatWithScoresResponseDto {
  @IsString()
  answer: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentWithScoreDto)
  sources: DocumentWithScoreDto[];

  @IsString()
  timestamp: string;
}

export class AddDocumentsResponseDto {
  @IsArray()
  @IsString({ each: true })
  documentIds: string[];

  @IsNumber()
  count: number;

  @IsString()
  timestamp: string;
}

export class AddTextsResponseDto {
  @IsArray()
  @IsString({ each: true })
  textIds: string[];

  @IsNumber()
  count: number;

  @IsString()
  timestamp: string;
}

export class RagStatsResponseDto {
  @IsNumber()
  documentCount: number;

  @IsString()
  collectionName: string;
}
