const express = require("express");
const router = express.Router();


module.exports = router;

router.get("/phantomEntering",(req,res)=>{
    res.send("Hello! my liege");
})