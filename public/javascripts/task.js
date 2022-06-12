const setTagAsDone = async (element, id) => {
  event.preventDefault();
  try {
    //para chamar o back-end
    let headers = new Headers({ "Content-Type": "application/json" });
    //chamando o elemento e passado para o checked
    let body = JSON.stringify({ task: { done: element.checked } });

    let response = await fetch(`/tasks/${id}?_method=put`, {
      headers: headers,
      body: body,
      method: "PUT",
    });
//pegar a resposta do back-end
    let data = await response.json();
    let task = data.task;
    //para pegar o elemento
    let parent = element.parentNode;

    if (task.done) {
      element.checked = true;
      //recolocar as classes
      parent.classList.add("has-text-success");
      parent.classList.add("is-italic");
    } else {
      element.checked = false;
      //remover as classes
      parent.classList.remove("has-text-success");
      parent.classList.remove("is-italic");
    }
  } catch (error) {
    console.log(error);
    alert("Erro ao atualizar a tarefa");
  }
};
