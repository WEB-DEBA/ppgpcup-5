const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    phone: String,
    city: String,
    district: { type: String, default: "Kendrapara" },
    jerseyNumber: Number,
    role: String,
    battingStyle: String,
    bowlingStyle: String,
    teamName: String,
    playerPhoto: String,
    status: { type: String, default: "Approved" }
}, { timestamps: true });

module.exports = mongoose.model("Player", playerSchema);