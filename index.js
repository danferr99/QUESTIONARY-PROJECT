const express = require("express");
const app = express();
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");


// CONEXÃO Database


connection
    .authenticate()
    .then(() =>{

console.log("DATABASE CONNECTION SUCCESS!")

    })
    .catch((msgErro) =>{

    console.log(msgErro);
    
    })




app.set ('view engine','ejs');
app.use (express.static('public'));

//Body Parser

app.use(express.urlencoded({
    
    extended: false
    
    }));
app.use(express.json());


//Rotas
app.get("/", (req, res) => {
//SELECT * ALL FROM PERGUNTAS
Pergunta.findAll({ raw : true, order :[ 

    ['id','DESC'] //ASC = CRESCENTE // DESC = DECRESCENTE

]}).then(perguntas =>{
    res.render("index",{

        perguntas : perguntas 


        });

    });

});


app.get("/perguntar", (req, res) => {

res.render("perguntar");


});

app.post("/salvarPergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    
    Pergunta.create({

        titulo : titulo,
        descricao : descricao,

    }).then(() => {

        res.redirect("/");

    });
    
    

});


app.get("/perguntar/:id", (req,res)=> {

    var id = req.params.id;
    Pergunta.findOne({

    where : { id: id}

    }).then(pergunta => {

    if(pergunta != undefined){ // Pergunta encontrada!

       
        Resposta.findAll({

            where: { perguntaId : pergunta.id},
            order :[ [ 'id' ,'DESC'] ]

        }).then(respostas => {

            res.render("pergunta",{
                pergunta : pergunta,
                respostas : respostas,
    

        });
       
    });
    
    }else{ // Não encontrada!

res.redirect("/");

    }
    
    
});
    
});


app.post("/responder",(req,res) => {

    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

Resposta.create({
    
    corpo :corpo,
    perguntaId : perguntaId,

    }).then(() =>{

res.redirect("/perguntar/" + perguntaId);

    });
});


app.listen(8080,() => {console.log("APP RODANDO!"); });