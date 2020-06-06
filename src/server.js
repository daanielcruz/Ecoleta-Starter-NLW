const express = require("express");
const server = express();
const db = require("./database/db.js");

// template engine
const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
    express: server,
    noCache: true
});


// configura/roteia a pasta 'public' -->
server.use(express.static("public"));


// post -->
server.use(express.urlencoded({extended: true}));

// req: requisição --> res: resposta --> '/' index -->
server.get("/", (req, res ) => {
   return res.render("index.html");
});

// req: requisição --> res: resposta --> create-point -->
server.get("/create-point", (req, res ) => {

   return res.render("create-point.html")
});


// post: empurra dados
server.post("/create-point", (req, res ) => {

        const query = `
     INSERT INTO places (
         image,
         name,
         address,
         address2,
         state,
         city,
         items
     ) VALUES ( ?, ?, ?, ?, ?, ?, ? );    
 `;

    const values = [
       req.body.image,
       req.body.name,
       req.body.address,
       req.body.address2,
       req.body.state,
       req.body.city,
       req.body.items
      ];

    function afterInsertData(err){
        if(err){
             console.log(err);
             return res.send("Erro no cadastro!");
        }
        console.log("Cadastrado com sucesso!");
        console.log(this);

      
        return res.render("create-point.html", { saved: true });
    };

    db.run(query, values, afterInsertData);

 
});

// req: requisição --> res: resposta --> search-results -->
server.get("/search", (req, res ) => {

   const search = req.query.search

   if(search == ""){
      return res.render("search-results.html", { total: 0 });
   } 

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
    if(err){
        return console.log(err);
    }

    const total = rows.length;

    return res.render("search-results.html", {places: rows, total: total });
   });
});





// turn on -->
server.listen(3000);