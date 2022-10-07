const getDb = require('../services/db');

exports.post = async (req, res) => {
    const db = await getDb();
    const { name, genre } = req.body;

    try {
        await db.query(`INSERT INTO Artist (name, genre) VALUES (?, ?)`, [
            name,
            genre
        ]);
        res.status(201).send();
    } catch (err) {
        res.status(500).json(err);
    }

    db.close();
};

exports.get = async (req, res) => {
    const db = await getDb();
    try {
        const [artists] = await db.query('SELECT * FROM Artist');
        res.status(200).json(artists);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getById = async (req, res) => {
    const db = await getDb();
    const { artistId } = req.params;
    
    const [[artist]] = await db.query('SELECT * FROM Artist WHERE id=?', [
        artistId
    ]);
    
    if (artist) {
        res.status(200).json(artist);
    } else {
        res.status(404).send();
    }
    
    db.close();
};