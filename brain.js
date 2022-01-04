let todolista = [];

function rewrite(list){
    let lista = document.getElementById("lista");
    lista.innerHTML = "";
    list.forEach(element => {
        show(element);
    });
}

function show(element){
    let lista = document.getElementById("lista");
    let li = document.createElement("li");
    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = element.done == true || element.done == "1";
    checkBox.addEventListener("input", ()=>{
        let todoItem = {
            id:element.id,
            text:element.text,
            done:!( element.done == true || element.done == "1"),
        }
        fetch("http://localhost:8080/todos/" + todoItem.id,{
            method:"PUT",
            body: JSON.stringify(todoItem)
        }).then((res)=>{
            if(res.ok){
                element.done = todoItem.done;
            }
            else{
                //TODO MÓDOSÍTÁS CSAK EGY ELEMRE
            }
        });
    });
    li.innerHTML = element.text;
    li.prepend(checkBox);
    lista.appendChild(li);
}

async function dataFetch(show = false){
    try{
        let response = await fetch("http://localhost:8080/todos");
        if(!response.ok){
            throw new Error("HTTP hiba: "+response.statusText);
        }
        let eredmeny = await response.json();
        if(show){
            rewrite(eredmeny);
        }
        else{
            return eredmeny;
        }
    } catch (err){
        window.alert("Hiba: "+err.message);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    dataFetch(true);
    document.getElementById("todoButton").addEventListener("click", ()=>{
        let todoText = document.getElementById("todoText").value;
        let todoItem = {
            text:todoText,
            done:false
        }
        fetch("http://localhost:8080/todos", {
            method: "POST",
            body: JSON.stringify(todoItem),
        }).then((response)=>{
            if(response.ok){
                window.alert("Siker");
                show(todoItem);
            }
            else{
                throw new Error(response.statusText);
            }
        }).catch((err)=>{
            window.alert("Hiba: "+err.message);
        });
    })
});
