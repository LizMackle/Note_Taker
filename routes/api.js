const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const dbPath = path.join(__dirname, "..", "db", "db.json");

/**
 * 
 * @returns {Array}
 */

function retrieveNotes(){
    return JSON.parse(fs.readFileSync(dbPath, "utf-8") || "[]");
}

function saveNotes(notes) {
    fs.writeFileSync(dbPath, JSON.stringify(notes), "utf-8");
}

router.get("/notes", (req, res) => {
    const notes = retrieveNotes();
    console.log(notes);
    res.json(notes); // send them back
});


router.post("/notes", (req, res) => {
    const { title, text } = req.body;
    console.log(title, text);
    // creates a new note in db json
    const newNote = {
        id: uuid.v4(),
        title: title,
        text: text,
    };
    // get all the existing notes in db json
    const existingNotes = retrieveNotes();
    // add new note to existing
    existingNotes.push(newNote);
    // save note
    saveNotes(existingNotes);
    // send back
    res.json(newNote);
});

router.delete("/notes:id", (req, res) => {
    const notes = retrieveNotes();
    // filters to target note
    const filtered = notes.filter((note) => note.id !== req.params.id);
    // resave
    saveNotes(filtered);
    // send back
    res.json({
        data: "ok",
    })
});

module.exports = router;