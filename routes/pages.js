
const express = require("express");
const router = express.Router();

const Player = require("../models/Player");
const Team = require("../models/Team");
const Match = require("../models/Match");
const TournamentNotice = require("../models/TournamentNotice");
const PointsTable = require("../models/PointsTable");

// HOME PAGE
router.get("/", async (req, res) => {
    try {
        const [players, teams, matches, points, notices] = await Promise.all([
            Player.find().sort({ createdAt: -1 }).limit(6).lean(),
            Team.find().sort({ createdAt: -1 }).limit(6).lean(),
            Match.find().sort({ createdAt: -1 }).limit(6).lean(),
            PointsTable.find().sort({ points: -1, nrr: -1 }).limit(10).lean(),
            TournamentNotice.find({ active: true })
                .sort({ createdAt: -1 }).limit(5).lean()
        ]);

        const [playerCount, teamCount, matchCount] = await Promise.all([
            Player.countDocuments(),
            Team.countDocuments(),
            Match.countDocuments()
        ]);

        res.render("index", {
            players,
            teams,
            matches,
            points,
            notices,
            playerCount,
            teamCount,
            matchCount
        });

    } catch (error) {
        console.error("Homepage Error:", error);
        res.status(500).send("Unable to load homepage");
    }
});

// PLAYERS PAGE
// PLAYERS PAGE
router.get("/players", async (req, res) => {
    try {
        const search = req.query.search || "";

        const filter = search
            ? {
                $or: [
                    { fullName: { $regex: search, $options: "i" } },
                    { city: { $regex: search, $options: "i" } },
                    { district: { $regex: search, $options: "i" } },
                    { teamName: { $regex: search, $options: "i" } }
                ]
            }
            : {};

        const [players, totalPlayers] = await Promise.all([
            Player.find(filter).sort({ createdAt: -1 }).lean(),
            Player.countDocuments()
        ]);

        res.render("players", {
            players,
            totalPlayers,
            search
        });

    } catch (error) {
        console.error("Players Error:", error);
        res.status(500).send("Unable to load players");
    }
});

// TEAMS PAGE
router.get("/teams", async (req, res) => {
    try {
        const teams = await Team.find()
            .sort({ createdAt: -1 })
            .lean();

        res.render("teams", { teams });

    } catch (error) {
        console.error("Teams Error:", error);
        res.status(500).send("Unable to load teams");
    }
});

router.post("/teams", async (req, res) => {
    try {
        const name = String(req.body.name || "").trim();
        const logo = String(req.body.logo || "").trim();
        const captain = String(req.body.captain || "").trim();

        if (!name) {
            return res.status(400).send("Team name is required.");
        }

        await Team.create({
            name,
            logo: logo || "",
            captain: captain || ""
        });

        return res.redirect("/teams");

    } catch (error) {
        console.error("Add Team Error:", error);
        return res.status(500).send("Unable to add team. Check Team model fields.");
    }
});


router.post("/teams/:id/delete", async (req, res) => {
    try {
        const mongoose = require("mongoose");

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Invalid Team ID");
        }

        const deletedTeam = await Team.findByIdAndDelete(req.params.id);

        if (!deletedTeam) {
            return res.status(404).send("Team not found");
        }

        res.redirect("/teams");

    } catch (error) {
        console.error("Remove Team Error:", error);
        res.status(500).send("Unable to remove team");
    }
});

// MATCHES PAGE
router.get("/matches", async (req, res) => {
    try {
        const matches = await Match.find()
            .sort({ createdAt: -1 })
            .lean();

        res.render("matches", { matches });

    } catch (error) {
        console.error("Matches Error:", error);
        res.status(500).send("Unable to load matches");
    }
});

// POINTS TABLE PAGE
router.get("/points", async (req, res) => {
    try {
        const points = await PointsTable.find()
            .sort({ points: -1, nrr: -1 })
            .lean();

        res.render("points", { points });

    } catch (error) {
        console.error("Points Error:", error);
        res.status(500).send("Unable to load points table");
    }
});

// NOTICES PAGE
router.get("/notices", async (req, res) => {
    try {
        const notices = await TournamentNotice.find({ active: true })
            .sort({ createdAt: -1 })
            .lean();

        res.render("notices", { notices });

    } catch (error) {
        console.error("Notices Error:", error);
        res.status(500).send("Unable to load notices");
    }
});

// REGISTRATION PAGE
router.get("/register", (req, res) => {
    res.render("register");
});


router.post("/teams/:id/delete", async (req, res) => {
    try {
        const mongoose = require("mongoose");

        const teamId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(teamId)) {
            return res.status(400).send("Invalid Team ID");
        }

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).send("Team not found");
        }

        await Team.findByIdAndDelete(teamId);

        return res.redirect("/teams");

    } catch (error) {
        console.error("DELETE TEAM ERROR:", error);
        return res.status(500).send("Unable to delete team");
    }
});

module.exports = router;
