import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.resolve("public/index.html"));
});

app.get("/api/maps-key", (req, res) => {
    res.json({
        key: process.env.GOOGLE_MAPS_API_KEY
    });
});

app.use(express.static("public"));


// Get property data based on query parameters.

app.get("/get-property", (req, res) => {
    const {
        "most-popular": mostPopular,
        "highest-price": highestPrice,
        "lowest-price": lowestPrice,
        limit
    } = req.query;

    console.log(req.query);

    // Prevent multiple property filters from being selected at once.
    const selectedFilters = [
        mostPopular,
        highestPrice,
        lowestPrice
    ].filter(value => value === "true");

    if (selectedFilters.length > 1) {
        return res.status(400).json({
            error: "Only one property filter can be selected at a time."
        });
    }

    // Most Popular is the default dataset.
    let fileName = "most_popular.json";

    if (highestPrice === "true") {
        fileName = "highest_price.json";
    } else if (lowestPrice === "true") {
        fileName = "lowest_price.json";
    } else if (mostPopular === "true") {
        fileName = "most_popular.json";
    }

    const data = fs.readFileSync(`data/${fileName}`, "utf-8");
    const jsonData = JSON.parse(data);

    let properties = jsonData.Result.Items;

    if (limit !== undefined) {
        const parsedLimit = Number(limit);

        if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
            return res.status(400).json({
                error: "limit must be a positive integer."
            });
        }

        properties = properties.slice(0, parsedLimit);
    }

    res.json(properties);
});



// get images from public/images folder and return the first 10 images as an array of image paths. 

app.get("/images", (req, res) => {
    const files = fs.readdirSync("public/images");

    const images = files
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
        .slice(0, 10)
        .map(file => `/images/${file}`);

    res.json(images);
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});