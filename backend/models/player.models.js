import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    name: String,
    nationality: String,
    age: Number,
    role: String,
    stats: {
        matches_played: Number,
        batting: {
            total_runs: Number,
            average: Number,
            strike_rate: Number,
            highest_score: Number,
        },
        bowling: {
            wickets_taken: Number,
            average: Number,
            economy_rate: Number,
            best_figures: String,
        },
    },
    auction_details: {
        base_price: Number,
        sold_price: Number,
        team: String,
    },
    history: [
        {
            season: String,
            team: String,
            price: Number,
        },
    ],
});

const Player = mongoose.model("Player", playerSchema);

export default Player;
