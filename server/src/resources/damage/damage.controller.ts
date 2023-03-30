import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/damage/damage.validation';
import DamageService from '@/resources/damage/damage.service';

class DamageController implements Controller {
    public path = '/damage';
    public router = Router();
    private DamageService = new DamageService();

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
                point_id,
                entity_id,
                C
            } = req.body;
  
            const damage = await this.DamageService.create(
                point_id,
                entity_id,
                C
            );

            res.status(201).json({ data: damage });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

}

export default DamageController;
