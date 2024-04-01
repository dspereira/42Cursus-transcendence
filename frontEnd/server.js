const express = require("express");
const path = require("path");

const app = express();

// app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")));

app.use("/", express.static(path.resolve(__dirname, "frontend")));

// app.use("/static", express.static(path.resolve(__dirname, "frontend", "static"), {
//     setHeaders: (res, filePath) => {
//         const contentType = getFileContentType(filePath);
//         if (contentType) {
//             res.set("Content-Type", contentType);
//         }
//     }
// }));

// // Function to determine the Content-Type header based on file extension
// function getFileContentType(filePath) {
//     const extension = path.extname(filePath).toLowerCase();
//     switch (extension) {
//         case ".png":
//             return "image/png";
//         case ".jpg":
//         case ".jpeg":
//             return "image/jpeg";
//         case ".gif":
//             return "image/gif";
//         default:
//             return null;
//     }
// }

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});

app.listen(process.env.PORT || 8080, () => console.log("Server running..."));