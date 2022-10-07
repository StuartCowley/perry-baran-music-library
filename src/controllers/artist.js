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