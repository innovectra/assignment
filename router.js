const router = require('express').Router();
const { db } = require('./db');
const { sendEmail } = require('./mail.service');
router.get('/comments', (req, res) => {
    db.all('SELECT c.*, COALESCE(a.name, \'\') AS assignedTo FROM comments c left join assignees a on a.id=c.assignedTo', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ comments: rows });
    });
});

router.post('/comments', (req, res) => {
    const { commentText } = req.body;

    const insertQuery = 'INSERT INTO comments (text) VALUES (?)';
    db.run(insertQuery, [commentText], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.status(201).json({
            id: this.lastID,
            commentText,
            likes: 0,
            assignedTo: '',
        });
    });
});
router.patch('/comments/:id/like', (req, res) => {
    const commentId = req.params.id;

    const updateQuery = 'UPDATE comments SET likes = likes + 1 WHERE id = ?';
    db.run(updateQuery, [commentId], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json({
            message: 'Like updated successfully',
        });
    });
});
router.patch('/comments/:id/assign', (req, res) => {
    const commentId = req.params.id;
    const { assignedTo, comment } = req.body;
    const updateQuery = 'UPDATE comments SET assignedTo = ? WHERE id = ?';

    db.run(updateQuery, [assignedTo, commentId], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const selectQuery = 'SELECT * FROM assignees WHERE id = ?';
        db.get(selectQuery, [assignedTo], function (err, assignee) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            if (!assignee) {
                res.status(404).json({ error: 'Assignee not found' });
                return;
            }

            sendEmail(assignee.email, comment);

            res.status(200).json({
                message: 'Assignee updated successfully',
                assignee: assignee,
            });
        });
    });
});


router.get('/assignees', (req, res) => {
    const query = 'SELECT id,name FROM assignees';

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ assignees: rows });
    });
});
module.exports = { router };