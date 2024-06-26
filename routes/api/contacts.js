const express = require("express");
const router = express.Router();
const {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../models/contacts");
const {
  contactSchema,
  contactShemaUpdate,
  favoriteShemaUpdate,
  contactIdSchema,
} = require("../../middleware/validation");

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

    const { error: bodyError } = contactShemaUpdate.validate(req.body);
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

router.patch("/:contactId/favorite", async (req, res) => {
  try {
    const { error: idError } = contactIdSchema.validate(req.params.contactId);
    if (!idError) {
      return res.status(400).json({ message: idError.details[0].message });
    }

    const { error, value } = favoriteShemaUpdate.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "Missing field favorite" });
    }

    const updatedContact = await updateStatusContact(
      req.params.contactId,
      value
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating favorite status:", error);
  }
});

module.exports = router;

