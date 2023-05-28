const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const validator = require('validator');

const userModel = mongoose.model('user', { name: String,
                                           password: String,
                                           email: String });

class User {
  constructor(body) {
    this.body = body;
    this.errors = { email: false,
                    invalidEmail: false,
                    password: false,
                    passwordLength: false };
    this.user;
    this.salt = bcrypt.genSaltSync(12);
  }

  async register() {

    // Verifica se o email é válido
    if(!validator.isEmail(this.body.email)) {
      this.errors.invalidEmail = true;
    }

    // Verifica se o email ja existe
    if(await userModel.findOne({ email: this.body.email })) {
      this.errors.email = true;
    }
    
    // Verifica se a senha possui mais de 6 caracteres
    if(this.body.password.length < 6) {
      this.errors.passwordLength = true;
    }

    if(this.errors.invalidEmail || this.errors.passwordLength || this.errors.email) return;

    this.body = { name: this.body.name,
                  password: bcrypt.hashSync(this.body.password, this.salt),
                  email: this.body.email };

    const data = new userModel(this.body);
    await data.save();
    return { name: data.name, id: data.id };

  }

  async login() {

    // Verifica se o email é cadastrado
    if(!await userModel.findOne({ email: this.body.email })) {
      return this.errors.email = true;
    }

    this.user = await userModel.findOne({ email: this.body.email });

    // Verifica se as senhas combinam
    if(!bcrypt.compareSync(this.body.password, this.user.password)) {
      this.errors.senha = true;
    }

  }

  static async getUser(id) {
    return await userModel.findById(id);
  }

}

module.exports = User