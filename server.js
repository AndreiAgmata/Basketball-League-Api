const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const BasketballDB = require("./models/league");
const db = new BasketballDB();
const HTTP_PORT = process.env.PORT || 8080;

dotenv.config();

let connectionString = process.env.MONGO_URL;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

//Players //Players //Players //Players //Players //Players

app.post("/api/player", (req, res) => {
  db.addNewPlayer(req.body)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(() => {
      res.status(500).json({ message: `an error occurred ${err}` });
    });
});

app.get("/api/players", (req, res) => {
  db.getAllPlayers(req.query.page, req.query.perPage, req.query.teamName)
    .then(data => {
      res.json(data);
    })
    .catch(() => {
      res.status(500).json({ message: `an error occurred ${err}` });
    });
});

app.get("/api/player/:id", (req, res) => {
  db.getPlayerById(req.params.id)
    .then(data => {
      res.json(data);
    })
    .catch(() => {
      res.status(500).json({ message: `an error occurred ${err}` });
    });
});

app.put("/api/player/:id", (req, res) => {
  db.updatePlayerById(req.body, req.params.id)
    .then(msg => {
      res.json({ message: msg });
    })
    .catch(() => {
      res.status(500).json({ message: `an error occurred ${err}` });
    });
});

app.delete("/api/player/:id", (req, res) => {
  db.deletePlayerById(req.params.id)
    .then(msg => {
      res.json({ message: msg });
    })
    .catch(() => {
      res.status(500).json({ message: `an error occurred ${err}` });
    });
});

// Teams // Teams // Teams // Teams // Teams // Teams

app.post("/api/team", (req, res) => {
  db.addNewTeam(req.body)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(() => {
      res.status(500).json({ message: `an error occurred ${err}` });
    });
});

app.get("/api/teams", (req, res) => {
  db.getAllTeams(req.query.page, req.query.perPage)
    .then(data => {
      res.json(data);
    })
    .catch(() => {
      res.status(500).json({ message: `an error occurred ${err}` });
    });
});

app.get("/api/team/:id", (req, res) => {
  db.getTeamById(req.params.id)
    .then(data => {
      res.json(data);
    })
    .catch(() => {
      res.status(500).json({ message: `an error occurred ${err}` });
    });
});

app.put("/api/team/:id", (req, res) => {
  db.updateTeamById(req.body, req.params.id)
    .then(msg => {
      res.json({ message: msg });
    })
    .catch(() => {
      res.status(500).json({ message: `an error occurred ${err}` });
    });
});

app.delete("/api/team/:id", (req, res) => {
  db.deleteTeamById(req.params.id)
    .then(msg => {
      res.json({ message: msg });
    })
    .catch(() => {
      res.status(500).json({ message: `an error occurred ${err}` });
    });
});

app.use((req, res) => {
  res.status(404).send("Resource not found");
});

db.initialize(connectionString)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
