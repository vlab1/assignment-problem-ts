import Joi from 'joi';

const create = Joi.object({
    name_B: Joi.string().required()
});



export default {
    create
};
