const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string().min(7).max(19).required(),
  favorite: Joi.boolean(),
});

const contactShemaUpdate = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string().min(7).max(19),
  favorite: Joi.boolean(),
});

const favoriteShemaUpdate = Joi.object({
  favorite: Joi.boolean().required(),
});

const contactIdSchema = Joi.string()
  .guid({ version: ["uuidv4"] })
  .required();

const authSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  password: Joi.string().required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

module.exports = {
  contactSchema,
  contactShemaUpdate,
  favoriteShemaUpdate,
  contactIdSchema,
  authSchema,
};