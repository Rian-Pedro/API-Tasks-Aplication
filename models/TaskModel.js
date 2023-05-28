const mongoose = require('mongoose');


const taskModel = mongoose.model('task', { title: String,
                                           dt_start: String,
                                           dt_to_end: String,
                                           id_maker: String });

class Task {
  constructor(body) {
    this.body = body;
    this.task;
    this.erros = { date: false,
                   title: false }
  }

  async post() {
    this.task = new taskModel(this.body);
    this.task.save();
  }

  static async getTasks(id) {

    return await taskModel.find({ id_maker: id });

  }
}

module.exports = Task;