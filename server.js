const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/tasks", (req, res) => {
    db.all("SELECT * FROM tasks", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post("/tasks", (req, res) => {
    const { text, completed } = req.body;
    db.run("INSERT INTO tasks (text, completed) VALUES (?, ?)", [text, completed ? 1 : 0], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, text, completed: !!completed });
    });
});

app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    db.run("UPDATE tasks SET completed = ? WHERE id = ?", [completed ? 1 : 0, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM tasks WHERE id = ?", [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).send();
    });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
