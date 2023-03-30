import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import PointController from '@/resources/point/point.controller';
import EntityController from '@/resources/entity/entity.controller';
import DamageController from '@/resources/damage/damage.controller';
import AnalysisController from '@/resources/analysis/analysis.controller';

validateEnv();

const app = new App(
    [
        new PointController(),
        new EntityController(),
        new DamageController(),
        new AnalysisController()
    ],
    Number(process.env.PORT)
);

app.listen();
app.close();