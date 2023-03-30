import DamageModel from '@/resources/damage/damage.model';
import Damage from '@/resources/damage/damage.interface';

class DamageService {
    private damage = DamageModel;

    public async create(
        point_id: number,
        entity_id: number,
        C: number
    ): Promise<Damage | Error> {
        try {
            const damage = await this.damage.create({
                point_id: point_id,
                entity_id: entity_id,
                C: entity_id
            });
    
            return damage;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default DamageService;
