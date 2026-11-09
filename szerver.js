const express = require("express");
const mysql = require("mysql2");
const app = express();
app.use(express.json()); 

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "konyvtar_db",
    port: 3307,
    decimalNumbers: true 
});

function lekerdez(res, sql, params = []) {
    db.query(sql, params, (err, result) => {
        if (err) {
            return res.status(500).json({ hiba: "Hiba történt" });
        }
        res.json(result);
    });
}


app.get("/konyvek", (req, res) => {
    lekerdez(res, `
        SELECT k.id, k.cim, k.kiadasi_ev, k.oldalszam, k.kolcsonozheto,
               m.nev AS mufaj_nev
        FROM konyvek k
        JOIN mufajok m ON k.mufaj_id = m.id
        ORDER BY k.kiadasi_ev ASC
    `);
});


app.get("/konyvek/elerheto", (req, res) => {
    lekerdez(res, `
        SELECT * FROM konyvek
        WHERE kolcsonozheto = 1 AND kiadasi_ev < 2000
    `);
});


app.get("/konyvek/kereses/:szoveg", (req, res) => {
    lekerdez(res,
        "SELECT * FROM konyvek WHERE cim LIKE ?",
        [`%${req.params.szoveg}%`]
    );
});


app.get("/mufajok/statisztika", (req, res) => {
    lekerdez(res, `
        SELECT m.nev AS mufaj_nev,
               COUNT(k.id) AS konyvek_szama,
               ROUND(AVG(k.oldalszam), 1) AS atlagos_oldalszam
        FROM mufajok m
        JOIN konyvek k ON k.mufaj_id = m.id
        GROUP BY m.id, m.nev
        ORDER BY m.id
    `);
});


app.get("/konyvek/hosszuak", (req, res) => {
    lekerdez(res, `
        SELECT cim, kiadasi_ev, oldalszam
        FROM konyvek
        WHERE oldalszam > 400
        ORDER BY oldalszam DESC
    `);
});

app.get("/konyvek/:id", (req, res) => {
    db.query(`
        SELECT k.id, k.cim, k.kiadasi_ev, k.oldalszam, k.kolcsonozheto,
               m.nev AS mufaj_nev
        FROM konyvek k
        JOIN mufajok m ON k.mufaj_id = m.id
        WHERE k.id = ?
    `, [req.params.id], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ hiba: "Hiba történt" });
        }
        if (result.length === 0) {
            return res.status(404).json({ hiba: "A könyv nem található" });
        }
        res.json(result[0]);
    });
});

app.post("/konyvek", (req, res) => {
    const { mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto } = req.body;

    db.query(
        `INSERT INTO konyvek (mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto)
         VALUES (?, ?, ?, ?, ?)`,
        [mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto],
        (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ hiba: "Hiba történt" });
            }
            res.status(201).json({ id: result.insertId, uzenet: "Könyv felvéve" });
        }
    );
});

app.delete("/konyvek/:id", (req, res) => {
    db.query("DELETE FROM konyvek WHERE id = ?", [req.params.id], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ hiba: "Hiba történt" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ hiba: "A könyv nem található" });
        }
        res.json({ uzenet: "Könyv törölve" });
    });
});

app.listen(3000, () => {
    console.log("Szerver fut: http://localhost:3000");
});