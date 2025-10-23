const router = require("express").Router();
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");

// GET /api/comments - Alle Kommentare holen
router.get("/", async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/comments/:id - Kommentar löschen
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    // Validate id early
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid id" });
    }

    try {
        // Attempt deletion
        /**
         * The deleted comment document returned by Comment.findByIdAndDelete(id).
         *
         * If a comment with the specified id existed, this contains the deleted document's data.
         * If no comment was found, the value is null.
         *
         * @type {{ _id: import('mongoose').Types.ObjectId | string, content?: string, author?: import('mongoose').Types.ObjectId | string, createdAt?: Date, updatedAt?: Date } | null}
         */
        const deletedComment = await Comment.findByIdAndDelete(id);

        if (!deletedComment) {
            // No document found with that id
            return res.status(404).json({ error: "Not found" });
        }

        // Success
        return res.json({ success: true });
    } catch (err) {
        console.error("Error deleting comment:", err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
