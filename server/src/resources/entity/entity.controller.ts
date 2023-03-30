import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/entity/entity.validation';
import EntityService from '@/resources/entity/entity.service';

class EntityController implements Controller {
    public path = '/entity';
    public router = Router();
    private EntityService = new EntityService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/create`,
            validationMiddleware(validate.create),
            this.create
        );
    }

     private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {
                name_A
            } = req.body;
  
            const entity = await this.EntityService.create(
                name_A
            );

            res.status(201).json({ data: entity });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

}

export default EntityController;
