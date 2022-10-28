const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Boris Labianca",
  key: process.env.MAILGUN_API_KEY,
});

app.post("/form", async (req, res) => {
  try {
    console.log(req.body);
    const messageData = {
      from: `${req.body.firstname} ${req.body.lastname} <${req.body.email}>`,
      to: process.env.EMAIL,
      subject: req.body.subject,
      text: req.body.message,
    };

    const result = await client.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(400).json({ message: "La page est introuvable" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
