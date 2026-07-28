const validator = require("validator");
const bcrypt = require("bcrypt");

const validate = (data) => {
  const { firstName, lastName, emailId, password } = data;
  if (!firstName || !lastName) {
    throw new Error("Invalid name");
  } else if (
    (firstName.length < 4 || firstName.length > 50) &&
    (lastName.length < 4 || lastName.length > 50)
  ) {
    throw new Error("name character should be in the limit of 5 to 49");
  } else if (validator.isEmail(emailId) === false) {
    throw new Error("Invalid EmailID: " + emailId);
  } else if (validator.isStrongPassword(password) === false) {
    throw new Error("Enter a strong password!");
  }
};

const validateEditFields = (data) => {
  const acceptedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "about",
    "age",
    "gender",
  ];
  const value = Object.keys(data).every((field) =>
    acceptedEditFields.includes(field),
  );
  return value;
};

const validatePasswordChange = async (data, user) => {
  const currentPassword = user.password;
  const comparePassword = await bcrypt.compare(data.password, currentPassword);
  if (comparePassword) {
    throw new Error("Matches the current Password, give a new password!");
  } else if (validator.isStrongPassword(data.password) == false) {
    throw new Error("Password not strong enough!");
  }
};

module.exports = { validate, validateEditFields, validatePasswordChange };
