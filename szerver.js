const express = require("express");
const mysql = require("mysql2");
const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "konyvtar_db",
    port: 3307
});


app.get("/konyvek/elerheto", (req, res) => {

    db.query(
        "SELECT * FROM konyvek WHERE kolcsonozheto = 1 AND kiadasi_ev > 2000",
        (err, result) => {

            if (err) {
                return res.status(500).json({ hiba: "Hiba történt" });
            }

            res.json(result);
        }
    );
});


app.get("/konyvek/kereses/:szoveg", (req, res) => {

    const szoveg = req.params.szoveg;

    db.query(
        "SELECT * FROM konyvek WHERE cim LIKE ? OR szerzo LIKE ?",
        [`%${szoveg}%`, `%${szoveg}%`],
        (err, result) => {

            if (err) {
                return res.status(500).json({ hiba: "Hiba történt" });
            }

            res.json(result);
        }
    );
});


app.get("/konyvek/hosszuak", (req, res) => {

    db.query(
        "SELECT * FROM konyvek WHERE oldalszam > 500",
        (err, result) => {

            if (err) {
                return res.status(500).json({ hiba: "Hiba történt" });
            }

            res.json(result);
        }
    );
});

app.get("/mufajok/statisztika", (req, res) => {

    db.query(
        "SELECT mufaj, COUNT(*) AS darab FROM konyvek GROUP BY mufaj",
        (err, result) => {

            if (err) {
                return res.status(500).json({ hiba: "Hiba történt" });
            }

            res.json(result);
        }
    );
});


app.get("/konyvek", (req, res) => {

    db.query(
        "SELECT * FROM konyvek",
        (err, result) => {

            if (err) {
                return res.status(500).json({ hiba: "Hiba történt" });
            }

            res.json(result);
        }
    );
});

app.listen(3000, () => {
    console.log("Szerver fut: http://localhost:3000");
});