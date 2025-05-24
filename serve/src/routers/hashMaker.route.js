import express from "express";

import hashMakerController from "../controllers/hashMaker.controller.js";

const hashMakerRouter = express.Router();

hashMakerRouter.post("/", hashMakerController.generate); // create
console.log("HashMaker Router Loaded!");
export default hashMakerRouter;
