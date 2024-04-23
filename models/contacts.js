const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const dataFile = "models/contacts.json";
const data = fs.readFile(dataFile, "utf8");

const listContacts = async () => {
  try {
    return JSON.parse(await data);
  } catch (error) {
    console.error("Error reading contacts data:", error);
    return [];
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = JSON.parse(await data);
    return contacts.find((contact) => contact.id === contactId);
  } catch (error) {
    console.error("Error finding contact by ID:", error);
    return null;
  }
};

const removeContact = async (contactId) => {
  try {
    let contacts = JSON.parse(await data);
    contacts = contacts.filter((contact) => contact.id !== contactId);
    await fs.writeFile(dataFile, JSON.stringify(contacts, null, 2));
    return contacts;
  } catch (error) {
    console.error("Error removing contact:", error);
    return [];
  }
};

const addContact = async (body) => {
  try {
    const data = await listContacts();
    const newContact = { id: nanoid(), ...body };
    data.push(newContact);
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
    return newContact;
  } catch (error) {
    console.error("Error adding new contact:", error);
    return null;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const data = await listContacts();
    const index = data.findIndex((contact) => contact.id === contactId);
    if (index === -1) return null;
    const updatedContact = { ...data[index], ...body };
    data[index] = updatedContact;
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
    return updatedContact;
  } catch (error) {
    console.error("Error updating contact:", error);
    return null;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
