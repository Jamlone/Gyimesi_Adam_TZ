-- A meglévő lekérdezések

-- 1. 
SELECT k.id, k.cim, k.kiadasi_ev, k.oldalszam, k.kolcsonozheto,
       m.nev AS mufaj_nev
FROM konyvek k
JOIN mufajok m ON k.mufaj_id = m.id
ORDER BY k.kiadasi_ev ASC;

-- 2. 
SELECT * FROM konyvek
WHERE kolcsonozheto = 1 AND kiadasi_ev < 2000;

-- 3.
SELECT * FROM konyvek
WHERE cim LIKE ?;          

-- 4.
SELECT m.nev AS mufaj_nev,
       COUNT(k.id) AS konyvek_szama,
       ROUND(AVG(k.oldalszam), 1) AS atlagos_oldalszam
FROM mufajok m
JOIN konyvek k ON k.mufaj_id = m.id
GROUP BY m.id, m.nev
ORDER BY m.id;

-- 5. 
SELECT cim, kiadasi_ev, oldalszam
FROM konyvek
WHERE oldalszam > 400
ORDER BY oldalszam DESC;

-- Az órán megírt lekérdezések

--1.
SELECT k.id, k.cim, k.kiadasi_ev, k.oldalszam, k.kolcsonozheto,
       m.nev AS mufaj_nev
FROM konyvek k
JOIN mufajok m ON k.mufaj_id = m.id
WHERE k.id = ?;

--2.
SELECT id, nev FROM mufajok ORDER BY nev;

--3.
UPDATE konyvek
SET mufaj_id = ?, cim = ?, kiadasi_ev = ?, oldalszam = ?, kolcsonozheto = ?
WHERE id = ?;

--4.
UPDATE mufajok SET nev = ? WHERE id = ?;

--5.
INSERT INTO konyvek (mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto)
VALUES (?, ?, ?, ?, ?);

--6.
INSERT INTO mufajok (nev) VALUES (?);

