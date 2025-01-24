const router = require('express').Router();
const { sendEmail } = require('./mail.service');
const sql = require('mssql');
const { config } = require('./mssql.db');

// Get comments with assigned assignee name
router.get('/comments', async (req, res) => {
    let connection;
    try {
        connection = await sql.connect(config);
        const result = await connection.query(`
            SELECT c.id,c.text,c.likes, COALESCE(a.name, '') AS assignedTo 
            FROM comments c 
            LEFT JOIN assignees a ON a.id = c.assignedTo
        `);
        res.json({
            message: 'Comments retrieved successfully',
            comments: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to retrieve comments',
            error: err.message
        });
    } finally {
        connection?.close();
    }
});

// Add a new comment
router.post('/comments', async (req, res) => {
    const { commentText } = req.body;
    let connection;
    try {
        connection = await sql.connect(config);
        const insertQuery = `
            INSERT INTO comments (text) 
            VALUES (@commentText)
        `;
        const result = await connection.request()
            .input('commentText', sql.NVarChar, commentText)
            .query(insertQuery);

        res.status(201).json({
            message: 'Comment added successfully',
            comments: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to add comment',
            error: err.message
        });
    } finally {
        connection?.close();
    }
});

// Like a comment
router.patch('/comments/:id/like', async (req, res) => {
    const commentId = req.params.id;
    let connection;
    try {
        connection = await sql.connect(config);
        const updateQuery = `
            UPDATE comments 
            SET likes = likes + 1 
            WHERE id = @commentId
        `;
        await connection.request()
            .input('commentId', sql.Int, commentId)
            .query(updateQuery);

        res.status(200).json({
            message: 'Like updated successfully'
        });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to update like count',
            error: err.message
        });
    } finally {
        connection?.close();
    }
});

// Assign a comment to an assignee
router.patch('/comments/:id/assign', async (req, res) => {
    const commentId = req.params.id;
    const { assignedTo, comment } = req.body;
    let connection;
    try {
        connection = await sql.connect(config);
        const updateQuery = `
            UPDATE comments 
            SET assignedTo = @assignedTo 
            WHERE id = @commentId
        `;
        await connection.request()
            .input('assignedTo', sql.Int, assignedTo)
            .input('commentId', sql.Int, commentId)
            .query(updateQuery);

        const selectQuery = 'SELECT * FROM assignees WHERE id = @assignedTo';
        const assigneeResult = await connection.request()
            .input('assignedTo', sql.Int, assignedTo)
            .query(selectQuery);

        const assignee = assigneeResult.recordset[0];
        if (!assignee) {
            res.status(404).json({
                message: 'Assignee not found',
                error: 'No assignee with the given ID'
            });
            return;
        }

        sendEmail(assignee.email, comment);

        res.status(200).json({
            message: 'Assignee updated and email sent successfully',
            assignee: assignee
        });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to assign comment',
            error: err.message
        });
    } finally {
        connection?.close();
    }
});

// Get list of assignees
router.get('/assignees', async (req, res) => {
    let connection;
    try {
        connection = await sql.connect(config);
        const query = 'SELECT id, name FROM assignees';
        const result = await connection.query(query);

        res.json({
            message: 'Assignees retrieved successfully',
            assignees: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to retrieve assignees',
            error: err.message
        });
    } finally {
        connection?.close();
    }
});

module.exports = { router };
