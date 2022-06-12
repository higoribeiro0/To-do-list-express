const express = require("express");
const checklistRouter = require("./src/routes/checklist");
const taskRouter = require("./src/routes/task");
const rootRouter = require("./src/routes/index");
const methodOverride = require("method-override");

require("./config/database");
const path = require("path");
//essa biblioteca permite o express achar o caminho das views

const app = express();
//todos os métodos do servidor estarão dentro de app

app.use(express.json());
//esse middleware verifica se tem um JSON disponível no body da requisiçao

//___VIEW CONFIGS___

app.set("views", path.join(__dirname, "src/views"));
//aqui estou dizendo pro app que o caminho para as views é o caminho até aqui, + o caminho até a pasta das views
app.set("view engine", "ejs");
//dizendo pro app que as views serao feitas usando EJS

//___MIDDLEWARES___

app.use(express.urlencoded({ extended: true }));
//middleware do express que permite pegar dados do form

app.use(express.static(path.join(__dirname, "public")));
//dando o endereço de arquivos estáticos

app.use(methodOverride("_method", { methods: ["POST", "GET"] }));
//esse middleware permite o HTML a fazer formulários de PUT, e DELETE. Originalmente ele só permite GET e POST. _method é a chamada que iremos usar

//___ROUTERS___

//esse primeiro argumento coloca um endereço padrao pra todas as rotas dentro desse router... entao as rotas dentro dele nao precisarão ter /checklists no seu caminho.
app.use("/", rootRouter);
app.use("/checklists", checklistRouter);
app.use("/checklists", taskRouter.checklistDependent);
app.use("/tasks", taskRouter.simple);

//___PORT CONFIG___

//set the port for the server
app.listen(3000, () => {
  console.log("Servidor foi iniciado");
});
