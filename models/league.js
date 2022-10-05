const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  firstName: String,
  lastName: String,
  jerseyNumber: Number,
  position: String,
  teamName: String,
});

const teamSchema = new Schema({
  teamName: String,
  location: String,
});

module.exports = class BasketballDB {
  constructor() {
    this.Player = null;
  }

  // Pass the connection string to `initialize()`
  initialize(connectionString) {
    return new Promise((resolve, reject) => {
      const db = mongoose.createConnection(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      db.once("error", err => {
        reject(err);
      });
      db.once("open", () => {
        this.Player = db.model("players", playerSchema);
        this.Team = db.model("teams", teamSchema);
        resolve();
      });
    });
  }

  async addNewPlayer(data) {
    const newPlayer = new this.Player(data);
    await newPlayer.save();
    return newPlayer;
  }

  getAllPlayers(page, perPage, teamName) {
    let findBy = teamName ? { teamName: teamName } : {};

    if (+page && +perPage) {
      return this.Player.find(findBy)
        .sort({ firstName: 1 })
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .exec();
    }

    return Promise.reject(
      new Error("page and perPage query parameters must be valid numbers")
    );
  }

  getPlayerById(id) {
    return this.Player.findOne({ _id: id }).exec();
  }

  updatePlayerById(data, id) {
    return this.Player.updateOne({ _id: id }, { $set: data }).exec();
  }

  deletePlayerById(id) {
    return this.Player.deleteOne({ _id: id }).exec();
  }

  async addNewTeam(data) {
    const newTeam = new this.Team(data);
    await newTeam.save();
    return newTeam;
  }

  getAllTeams(page, perPage) {
    if (+page && +perPage) {
      return this.Team.find()
        .sort({ teamName: 1 })
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .exec();
    }
    return Promise.reject(
      new Error("page and perPage query parameters must be valid numbers")
    );
  }

  getTeamById(id) {
    return this.Team.findOne({ teamName: id }).exec();
  }

  updateTeamById(id, data) {
    return this.Team.updateOne({ _id: id }, { $set: data }).exec();
  }

  deleteTeamById(id) {
    return this.Team.deleteOne({ teamName: id }).exec();
  }
};
