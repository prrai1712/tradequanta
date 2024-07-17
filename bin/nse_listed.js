"use strict";
const { log } = console; // Renamed print to log for consistency
const csvFilePath = './equity1.csv';
const csv = require('csvtojson');
const mongoose = require('mongoose');

const NSE_COMPANIES = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // Ensure 'code' is required and unique
    name: { type: String, required: true, unique: true }, // Ensure 'name' is required and unique
    series: { type: String },
    date_of_listing: { type: String },
    paid_up_value: { type: String },
    market_lot: { type: String },
    ISIN_number: { type: String, unique: true },
    face_value: { type: String }
});

const NSE_Model = mongoose.model('nse_listed', NSE_COMPANIES);

const load_companies = async function () {
    try {
        const uri = "mongodb://0.0.0.0:27017/mydb";
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        log('Connected to database');

        const data = await csv().fromFile(csvFilePath);
        await NSE_Model.insertMany(data); // Ensure the CSV columns are correctly mapped to the schema fields
        log('All companies inserted to database');
    } catch (error) {
        log('Error:', error);
        process.exit(1); // Exit with non-zero status code indicating failure
    }
}

load_companies();
