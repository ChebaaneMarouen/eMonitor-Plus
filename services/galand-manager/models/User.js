const { Model, Schema } = require("@localPackages/model");
const validator = require("validator");

function LowerCaseString(str) {
  return String(str).toLocaleLowerCase();
}

function TitleCase(str) {
  return String(str).replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

const bcrypt = require("bcrypt");
module.exports = (function () {
  const UserSchema = new Schema({
    fName: {
      type: TitleCase,
      default: "pas de prenom",
    },
    lName: {
      type: TitleCase,
      default: "pas de nom",
    },
    email: {
      type: LowerCaseString,
      required: true,
      mapping: "keyword",
    },
    invitedBy: String,
    status: {
      type: Number,
      default: -1,
    },
    lastModified: {
      type: Number,
      mapping: "date",
    },
    created: {
      type: Number,
      mapping: "date",
    },
    lastLogin: {
      type: Number,
      mapping: "date"
    },
    password: {
      type: String,
      mapping: "keyword",
    },
    phone: String,
    role: {
      type: String,
      mapping: "keyword",
    },
    company: String,
  });

  UserSchema.pre("save", function (next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user._isModified("password")) return next();
    console.log("PASSWORD IS MODIFIED  !!");

    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(String(user.password), salt, function (err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
      });
    });
  });

  UserSchema.pre("save", function (next) {
    const user = this;
    if (!user.created) {
      user.created = Date.now();
    }
    if(!user.lastLogin){
      user.lastLogin = Date.now();
    }
    user.lastModified = Date.now();
    next();
  });
  UserSchema.methods.getRole = function () {
    const user = this;
    switch (user.roles) {
      case 0:
        return "journalist";
      case 1:
        return "monitor";
      case 2:
        return "superMonitor";
      case 3:
        return "decider";
      case 4:
        return "admin";
      default:
        return "";
    }
  };
  UserSchema.validations = [
    function emailIsValid(user) {
      // special case for admin
      if (user.email !== "admin" && !validator.isEmail(user.email)) {
        throw new Error("MESSAGE_EMAIL_ADDRESS_IS_NOT_VALID");
      }
    },
    function validPhoneNumber(user) {
      if (user.phone && !validator.isMobilePhone(user.phone)) {
        throw new Error("MESSAGE_PHONE_NUMBER_IS_NOT_VALID");
      }
    },
  ];

  UserSchema.methods.comparePassword = function (candidatePassword) {
    const user = this;
    return new Promise((resolve, reject) => {
      bcrypt.compare(String(candidatePassword), String(user.password), function (err, isMatch) {
        if (err) return reject(err);
        return resolve(isMatch);
      });
    });
  };
  return new Model("users", UserSchema, "elasticsearch");
})();
