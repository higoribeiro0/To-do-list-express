const express = require("express");
const router = express.Router();
//router permite criar rotas em diferentes arquivos e depois levar para o app.js

const Checklist = require("../models/checklist");
const Task = require("../models/task");

//-------------- ROTA GET : LER TODOS OS CHECKLISTS ------------
router.get("/", async (req, res) => {
  try {
    let checklists = await Checklist.find({});
    console.log(`${checklists.length} checklists were found`);
    // res.status(200).json(checklists);
    //ao invés de devolver um json, vamos devolver a view
    //primeiro passo o endereço, depois essa váriável que contem a resposta da request
    res.status(200).render("checklists/index", { checklists: checklists });
  } catch (error) {
    // res.status(500).json(error);
    // novamente, troco a resposta em JSON (que víamos no postman), por uma view, com essa variável
    res
      .status(500)
      .render("pages/error", { error: "Erro ao exibir as Listas de Tarefas" });
  }
});

//-------------- ROTA VIEW : CRIAR VIEW DA PÁGINA DE NOVO CHECKLIST ------------
router.get("/new", async (req, res) => {
  try {
    //como essa é a tela new, nao vamos ter nenhum checklist sendo carregado, mas o mongoose pode criar um objeto vazio que não vai ser salvo para que possamos carregar o schema (a estrutura), para isso usamos o new Checklist(), sem informações.
    let checklist = new Checklist();
    res.status(200).render("checklists/new", { checklist: checklist });
  } catch (error) {
    res
      .status(500)
      .render("pages/error", { error: "Erro ao carregar o formulário" });
  }
});

//-------------- ROTA POST : CRIAR NOVO CHECKLIST ------------
router.post("/", async (req, res) => {
  let { name } = req.body.checklist;
  //primeiro eu vou criar um checklist sem salvá-lo
  let checklist = new Checklist({ name });
  try {
    //aqui dentro do try eu vou tentar salvar o checklist
    await checklist.save();
    console.log("Checklist was successfully created");
    res.redirect("checklists");
  } catch (error) {
    //criando o checklist fora, eu posso acessá-lo agora, para devolvê-lo se houver algum erro, e recarregar o formulário.
    res
      .status(422)
      .render("checklists/new", { checklist: { ...checklist, error } });
  }
});

//-------------- ROTA GET : LER UM CHECKLIST ESPECÍFICO USANDO ID ------------
router.get("/:id", async (req, res) => {
  try {
    let checklist = await Checklist.findById(req.params.id).populate("tasks");

    // res.status(200).json(checklist);
    res.status(200).render("checklists/show", {
      checklist: checklist,
    });
  } catch (error) {
    // res.status(500).json(error);
    res.status(500).render("pages/error", { error: "Erro ao exibir tarefa" });
  }
});

//-------------- ROTA VIEW : CRIAR VIEW DA PÁGINA DE EDIÇÃO DE CHECKLIST ------------
router.get("/:id/edit", async (req, res) => {
  try {
    let checklist = await Checklist.findById(req.params.id);
    //populate ele agrega o array de tasks na checklist
    res.status(200).render("checklists/edit", { checklist: checklist });
  } catch (error) {
    res.status(500).render("pages/error", {
      error: "Erro ao carregar o formulário de tarefas",
    });
  }
});

//-------------- ROTA PUT : EDITAR UMA CHECKLIST ------------
router.put("/:id", async (req, res) => {
  let { name } = req.body.checklist;
  //esse checklist vem de dentro do formulário
  let checklist = await Checklist.findById(req.params.id);
  //novamente, procurando o checklist fora do try, pois se der erro, eu posso colocá-lo no catch
  try {
    await checklist.updateOne({ name });
    res.redirect("/checklists");
    console.log("checklist successfully edited");
  } catch (error) {
    let errors = error.errors;
    res
      .status(422)
      .render("checklists/edit", { checklist: { ...checklist, errors } });
  }
});

//-----------ROTA DELETE--------------

router.delete("/:id", async (req, res) => {
  try {
    let checklist = await Checklist.findByIdAndRemove(req.params.id);
    console.log(`${checklist.name} was removed`);
    res.redirect("/checklists");
  } catch (error) {
    res.status(500).render("pages/error", { error: "Erro ao exibir tarefa" });
  }
});

module.exports = router;
