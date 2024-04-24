const Contact = require("./Contact");

const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    console.error("Error reading contacts data:", error);
    return [];
  }
};

const getContactById = async (contactId) => {
  try {
    return await Contact.findById(contactId);
  } catch (error) {
    console.error("Error finding contact by ID:", error);
    return null;
  }
};

const removeContact = async (contactId) => {
  try {
    return await Contact.deleteOne({ _id: contactId });
  } catch (error) {
    console.error("Error removing contact:", error);
    return [];
  }
};

const addContact = async (body) => {
  try {
    const newContact = await new Contact(body);
    return newContact;
  } catch (error) {
    console.error("Error adding new contact:", error);
    return null;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });
    return updatedContact;
  } catch (error) {
    console.error("Error updating contact:", error);
    return null;
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return null;
    }
    contact.favorite = body.favorite;

    const updatedContact = await contact.save();

    return updatedContact;
  } catch (error) {
    console.error("Error updating favorite status:", error);
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
