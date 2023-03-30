import Joi from 'joi';

const create = Joi.object({
    name_A: Joi.string().required()
});



export default {
    create
};
