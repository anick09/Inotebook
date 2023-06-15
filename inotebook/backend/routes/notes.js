const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//ROUTE 1: Fetch all notes of user GET "/api/notes/fetchallnotes"(login required)
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ "Ineternal Server Error": err.message });
  }
});

//ROUTE 2: Add a new note... POST "/api/notes/addnote"(login required)
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter valid title").isLength({ min: 3 }),
    body("description", "Enter valid description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ "Ineternal Server Error": err.message });
    }
  }
);

//ROUTE 3: Update a note PUT "api/notes/update/:id" (Login required)
router.put("/update/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  //Create a newNote object
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  //Find the note to be updated and update it
  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).send("Note not found");
  }

  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
  }

  note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json({ note });
});

//ROUTE 4: Delete a note DELETE "api/notes/delete/:id" (Login required)
router.delete("/delete/:id", fetchuser, async (req, res) => {
  try {
    //Find the note to be deleted and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note not found");
    }

    //Allow deletion only if user is correct
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ "Ineternal Server Error": err.message });
  }
});

module.exports = router;
