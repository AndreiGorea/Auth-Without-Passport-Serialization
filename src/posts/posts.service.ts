import { ClassSerializerInterceptor, Injectable, UseInterceptors } from "@nestjs/common";
import { CreatePostDto } from './dto/create-post.dto';
import { Posts } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private postRepository: Repository<Posts>,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  async create(createPostDto: CreatePostDto): Promise<Posts> {
    const newPost = await this.postRepository.create(createPostDto);
    return await this.postRepository.save(newPost);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(): Promise<Posts[]> {
    return await this.postRepository.find();
  }
}