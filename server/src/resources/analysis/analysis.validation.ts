import Joi from 'joi';

const analysis = Joi.object({
    columns:  Joi.array().items(Joi.string()).required(),
    rows:  Joi.array().items(Joi.string()).required(),
    data: Joi.array().items(Joi.array().items(Joi.number())).required(),
});

const delete0 = Joi.object({
    columns:  Joi.array().items(Joi.string().valid(null, "", '')).required(),
    rows:  Joi.array().items(Joi.string().valid(null, "", '')).required(),
    data: Joi.array().items(Joi.array().items(Joi.number().valid(0))).required(),
});


export default {
    analysis ,
    delete0
};
