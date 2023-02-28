import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { Posts } from './entities/post.entity';
import {
  instanceToInstance,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth-guard';
import { PostSerializer } from '../serializers/post.serializer';
import { Role } from '../enums/user-role';
import { RolesDecorator } from '../decorators/role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserDecorator } from '../decorators/user.decorator';
import { AuthPayload } from '../interfaces/auth-paylod.interface';
import { PostResponseInterceptor } from '../interceptors/serialize.interceptor';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBadRequestResponse()
  @ApiCreatedResponse({ type: Posts })
  @Post()
  async createPost(@Body() body: CreatePostDto): Promise<Posts> {
    return this.postsService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBadRequestResponse()
  @UseInterceptors(PostResponseInterceptor)
  @Get()
  async findAll(): Promise<PostSerializer[]> {
    return await this.postsService.findAll();
  }
}
