import PointModel from '@/resources/point/point.model';
import Point from '@/resources/point/point.interface';

class PointService {
    private point = PointModel;

    public async create(
        name_B: string
    ): Promise<Point | Error> {
        try {
            const point = await this.point.create({
                name_B: name_B
            });
    
            return point;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default PointService;
