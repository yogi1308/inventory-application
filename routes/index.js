const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    res.render("index", { title: "Library Inventory"
        // , messages: messages
    })
})

module.exports = router