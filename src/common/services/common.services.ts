import { HttpException } from '@nestjs/common';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { OperationService } from './trace.service';
import { Logger } from '../helpers/logger.handler';
import { ResponseDto } from '../dtos/response.dto';

export class CommonService<T> {
  logger = new Logger(CommonService.name);
  protected readonly entityManager: EntityManager;
  constructor(
    entityManager: EntityManager,
    private readonly repository: Repository<T>,
  ) {
    this.entityManager = entityManager;
  }

  private setTrace() {
    const trace: string = OperationService.getTrace();
    this.logger.setRequestTrace(trace);
    return trace;
  }

  private throwHttpException(errorMessage: any) {
    throw new HttpException(errorMessage.message, errorMessage.status, {
      cause: errorMessage.cause,
    });
  }

  private handleError(error: any, errorMessage: any) {
    throw new HttpException(errorMessage.message, errorMessage.status, {
      cause: {
        cod: errorMessage.code,
        stack: error.message == errorMessage.message ? error.message : error,
      },
    });
  }

  private async findEntityById(
    repository: Repository<any>,
    id: number,
    errorMessage: any,
  ) {
    const entity = await repository.findOneBy({ id });
    if (!entity) {
      this.throwHttpException(errorMessage);
    }
    return entity;
  }

  async create(createEntity: any, entityDto: any, errorMessage: any) {
    const trace = this.setTrace();
    try {
      const entity = this.repository.create(createEntity);
      const data: T | T[] = await this.entityManager.save(entity);
      return ResponseDto.format(trace, entityDto(data));
    } catch (error) {
      this.handleError(error, errorMessage);
    }
  }

  async findAll(
    entityDto: (data: T) => any,
    options: {
      where?: FindOptionsWhere<T>;
      order?: any;
      relations?: string[];
      pageSize?: number;
      page?: number;
    },
    errorMessage?: string,
  ) {
    const trace = this.setTrace();
    try {
      const { where, order, relations, pageSize, page } = options;
      const skip = page && pageSize ? (page - 1) * pageSize : undefined;
      const take = pageSize;
      const [data, count] = await this.repository.findAndCount({
        where,
        order,
        skip,
        take,
        relations,
      });
      const listDto = data.map((item) => entityDto(item));
      const totalPages = count ? Math.ceil(count / pageSize) : undefined;
      return pageSize
        ? ResponseDto.format(trace, { data: listDto, totalPages })
        : ResponseDto.format(trace, listDto);
    } catch (error) {
      this.handleError(error, errorMessage);
    }
  }

  async findOne(id: number, entityDto: (data: T) => any, errorMessage: any) {
    const trace = this.setTrace();
    try {
      const data = await this.findEntityById(this.repository, id, errorMessage);
      return ResponseDto.format(trace, entityDto(data));
    } catch (error) {
      this.handleError(error, errorMessage);
    }
  }

  async findOneRelations(
    entityDto: (data: T) => any,
    repository: Repository<any>,
    where: FindOptionsWhere<T> | any,
    relations: string[],
    errorMessage: any,
  ) {
    const trace = this.setTrace();
    try {
      const data = await repository.findOne({ where, relations });
      if (!data) {
        this.throwHttpException(errorMessage);
      }
      return ResponseDto.format(trace, entityDto(data));
    } catch (error) {
      this.handleError(error, errorMessage);
    }
  }

  async update(
    id: number,
    updateEntity: any,
    entityDto: (data: T) => any,
    errorMessage: any,
  ) {
    const trace = this.setTrace();
    try {
      let dataToUpdate = await this.findEntityById(
        this.repository,
        id,
        errorMessage,
      );
      dataToUpdate = Object.assign(dataToUpdate, updateEntity);
      const data: T = await this.entityManager.save(dataToUpdate);
      return ResponseDto.format(
        trace,
        entityDto
          ? entityDto(data)
          : { status: 200, message: 'Se actualizó correctamente' },
      );
    } catch (error) {
      this.handleError(error, errorMessage);
    }
  }

  async remove(id: number, entityDto: (data: T) => any, errorMessage: any) {
    const trace = this.setTrace();
    try {
      const data = await this.findEntityById(this.repository, id, errorMessage);
      await this.repository.remove(data);
      return ResponseDto.format(trace, entityDto(data));
    } catch (error) {
      this.handleError(error, errorMessage);
    }
  }
}
