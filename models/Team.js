const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    shortName: String,
    captain: String,
    logo: String,
    city: { type: String, default: "Kendrapara" },
    status: { type: String, default: "Active" }
}, { timestamps: true });

module.exports = mongoose.model("Team", teamSchema);