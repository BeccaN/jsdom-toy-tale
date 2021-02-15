let addToy = false;
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");

document.addEventListener("DOMContentLoaded", () => {
  //My Code
  const toyCollection = document.querySelector("#toy-collection")

  fetch ("http://localhost:3000/toys")
    .then(resp => resp.json())
    .then(toys => {
      let toysHTML = toys.map(function(toy){
        return `
        <div class="card">
          <h2>${toy.name}</h2>
          <img src=${toy.image}" />
          <p>${toy.likes} Likes </p>
          <button data-id="${toy.id}" class="like-btn">Like <3</button>
          <button data-id="${toy.id}" class="dlt-btn">Delete</button>
        </div>
        `
      })
      toyCollection.innerHTML = toysHTML.join('')
      //selecting an element in the elements tab assigns it to '$0', which can then be called in the console
    })
  
  toyFormContainer.addEventListener("submit", function(event){
    event.preventDefault()
    const toyName = event.target.name.value
    const toyImage = event.target.image.value

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json" 
      },
      body: JSON.stringify({
        name: toyName,
        image: toyImage,
        likes: 0
      })
    })
    .then(resp => resp.json())
    .then( newToy => {
      let newToyHTML = `
        <div class="card">
          <h2>${newToy.name}</h2>
          <img src=${newToy.image}" />
          <p>${newToy.likes} Likes </p>
          <button data-id="${newToy.id}" class="like-btn">Like <3</button>
          <button data-id="${newToy.id}" class="dlt-btn">Delete</button>
        </div>
      `
      toyCollection.innerHTML += newToyHTML
      //.reset() can reset the text input fields to be blank again
    })
  })

  toyCollection.addEventListener("click", (e) => {
    // like button event - we optimistically updated the DOM first then the db
    if (e.target.className === "like-btn") {
      let currentLikes = parseInt(e.target.previousElementSibling.innerText)
      let newLikes = currentLikes + 1 
      e.target.previousElementSibling.innerText = newLikes + " likes"
      //.dataset is super cool and important 
      fetch(`http://localhost:3000/toys/${e.target.dataset.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          likes: newLikes
        })
      })
    }

    // delete button event - we are pessimistically updating db before DOM
    if (e.target.className === "dlt-btn") {
      //update DB
      fetch(`http://localhost:3000/toys/${e.target.dataset.id}`, {
        method: "DELETE"
      })
      //update DOM
      .then(resp => {
        e.target.parentElement.remove()
      })
    }
  })

  //FLATIRON CODE
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

});
