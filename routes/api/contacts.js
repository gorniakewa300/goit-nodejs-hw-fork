const express = require("express");
const Joi = require("joi");
const router = express.Router();
const {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string().min(7).max(19).required(),
});

const contactIdSchema = Joi.string()
  .guid({ version: ["uuidv4"] })
  .required();

router.get("/", async (req, res, next) => {
  try {
    const allContacts = await listContacts();
    res.json(allContacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { error: idError } = contactIdSchema.validate(req.params.contactId);
    if (!idError) {
      return res.status(400).json({ message: idError.details[0].message });
    }
    const result = await removeContact(req.params.contactId);
    if (result) {
      res.status(200).json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error: idError } = contactIdSchema.validate(req.params.contactId);
    if (!idError) {
      return res.status(400).json({ message: idError.details[0].message });
    }

    const { error: bodyError } = contactSchema.validate(req.body);
    if (bodyError) {
      return res.status(400).json({ message: bodyError.details[0].message });
    }

    const updatedContact = await updateContact(req.params.contactId, req.body);
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
