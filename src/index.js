const spicyDetails = document.querySelector("#spice-blend-detail")
const spicyIngredients = document.querySelector(".ingredients-list")
const updateSpiceForm = document.querySelector("#update-form")
const addIngredientForm = document.querySelector("#ingredient-form")
const spicyImages = document.querySelector("#spice-images")

function getSpiceBlend(id){
  fetch(`http://localhost:3000/spiceblends/${id}`)
  .then(resp => resp.json())
  .then(spice => renderSpice(spice))
}

function getAllSpiceBlends(){
  fetch('http://localhost:3000/spiceblends')
  .then(resp => resp.json())
  .then(spices => spices.forEach(spice => renderAllSpices(spice)))
}

function renderAllSpices(spice){
  let img = document.createElement('img')
  img.src = spice.image 
  spicyImages.append(img)

  img.addEventListener('click', () => {
    getSpiceBlend(spice.id)
  })
}

function renderSpice(spice){
  spicyIngredients.innerHTML = ""
  spicyDetails.children[0].src = spice.image
  spicyDetails.children[1].textContent = spice.title
  updateSpiceForm.dataset.id = spice.id
  addIngredientForm.dataset.id = spice.id

  spice.ingredients.forEach(ingredient => {
    let li = document.createElement('li')
    li.textContent = ingredient.name
    spicyIngredients.append(li)
  })
}

function updateTitle(title){
  const id = updateSpiceForm.dataset.id
  console.log(id)
  spicyDetails.children[1].textContent = title
  fetch(`http://localhost:3000/spiceblends/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({title})
  })
  .then(resp => resp.json())
}

function addNewIngredient(name){
  let li = document.createElement('li')
  li.textContent = name
  spicyIngredients.append(li)
  const spiceblendId = parseInt(addIngredientForm.dataset.id)

  fetch(`http://localhost:3000/ingredients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({name, spiceblendId})
  })
  .then(resp => resp.json())
}


updateSpiceForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const title = event.target.title.value
  updateTitle(title)
})

addIngredientForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const name = event.target.name.value 
  addNewIngredient(name)
})

// initial fetch to get first spice
getSpiceBlend(1)

// get all spices for top bar
getAllSpiceBlends()