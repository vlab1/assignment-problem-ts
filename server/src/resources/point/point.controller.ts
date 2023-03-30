import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/point/point.validation';
import PointService from '@/resources/point/point.service';

class PointController implements Controller {
    public path = '/point';
    public router = Router();
    private PointService = new PointService();

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
                name_B
            } = req.body;

    
            const point = await this.PointService.create(
                name_B
            );

            res.status(201).json({ data: point });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

}

export default PointController;
