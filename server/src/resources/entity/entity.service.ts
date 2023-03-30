import EntityModel from '@/resources/entity/entity.model';
import Entity from '@/resources/entity/entity.interface';

class EntityService {
    private entity = EntityModel;

    public async create(
        name_A: string
    ): Promise<Entity | Error> {
        try {
            const entity = await this.entity.create({
                name_A: name_A
            });
    
            return entity;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default EntityService;
