import Joi from 'joi';

const create = Joi.object({
    point_id: Joi.number().required(),
    entity_id: Joi.number().required(),
    C: Joi.number().required()
});



export default {
    create
};
