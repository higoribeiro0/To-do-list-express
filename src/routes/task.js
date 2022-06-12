const express = require("express");
//primeira rota é para rotas que dependem do id do checklist
const checklistDepententRouter = express.Router();
//segunda é para rotas independentes do checklist
const simpleRouter = express.Router();

const Checklist = require("../models/checklist");
const Task = require("../models/task");

//----------ROTA VIEW : CRIAR VIEW DA PAGINA DE CRIAÇÃO DE TASKS--------
checklistDepententRouter.get("/:id/tasks/new", async (req, res) => {
  try {
    let task = new Task();
    res
      .status(200)
      .render("tasks/new", { checklistId: req.params.id, task: task });
  } catch (error) {
    res
      .status(422)
      .render("pages/error", { errors: "erro ao carregar o formulário" });
  }
});

//----------ROTA POST : CRIAR UMA NOVA TAREFA--------
checklistDepententRouter.post("/:id/tasks", async (req, res) => {
  let { name } = req.body.task;
  //criar nova task com o nome, sem salvar
  let task = new Task({ name, checklist: req.params.id });
  try {
    //salvar a task
    await task.save();
    //agora é necessário colocar essa tarefa dentro do array de tasks do checklist, para isso, primeiro buscamos o checklist
    let checklist = await Checklist.findById(req.params.id);
    //damos o push no array de tasks
    checklist.tasks.push(task);
    //salvamos o checklist
    await checklist.save();
    console.log("Task successfully created");
    res.redirect(`/checklists/${req.params.id}`);
  } catch (error) {
    es.status(422).render(`/checklists/${req.params.id}/tasks/new`, {
      task: { ...task, error },
      checklistId: req.params.id,
    });
  }
});

//-----------ROTA DELETE : DELETAR UMA TAREFA------------
simpleRouter.delete("/:id", async (req, res) => {
  try {
    let task = await Task.findByIdAndDelete(req.params.id);
    let checklist = await Checklist.findById(task.checklist);
    let taskToRemove = checklist.tasks.indexOf(task.id);
    checklist.tasks.splice(taskToRemove, 1);
    checklist.save();
    res.redirect(`/checklists/${checklist.id}`);
  } catch (error) {
    res
      .status(422)
      .render("pages/error", { errors: "erro ao deletar a tarefa" });
  }
});

//-----------ROTA PUT : CONCLUIR UMA TAREFA--------------
simpleRouter.put("/:id", async (req, res) => {
  let task = await Task.findById(req.params.id);
  try {
    task.set(req.body.task);
    await task.save();
    res.status(200).json({ task });
  } catch (error) {
    let errors = error.errors;
    res.status(422).json({ task: { ...errors } });
  }
});

module.exports = {
  checklistDependent: checklistDepententRouter,
  simple: simpleRouter,
};
