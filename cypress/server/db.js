const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const filePath = path.join(__dirname, "db.json");

module.exports = function seed(data) {
  const url = "/api/save.php";

  axios
    .post(url, data)
    .then(function (response) {
      console.log(response);
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};
