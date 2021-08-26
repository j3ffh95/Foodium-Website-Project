const searchButton = document.getElementById("search-btn"),
  searchInput = document.getElementById("search-form"),
  mealListGridContainer = document.getElementById("meal"),
  mealDetailsBody = document.querySelector(".meal-details-body"),
  recipeCloseBtn = document.getElementById("recipe-close-btn");


searchInput.addEventListener("submit", getMealList);
searchButton.addEventListener("click", getMealList);
mealListGridContainer.addEventListener("click", getRecipeForMeal);
recipeCloseBtn.addEventListener("click", () => {
  mealDetailsBody.parentElement.classList.remove("showRecipe");
});

// This function will get all meals that matches with the ingredient that the user input
function getMealList(e) {
  e.preventDefault();
  let searchInputTxt = document.getElementById("search-input").value.trim();
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
  )
    .then(response => response.json())
    .then(data => {
      console.log(data.meals)
      let html = "";
      if (data.meals) {
        data.meals.forEach(meal => {
          html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-image">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">How to</a>
                        </div>
                    </div>
                `;
        });
        mealListGridContainer.classList.remove("notFound");
      } else {
        html =
          "Unfortunely no meal was found, Try searching for another ingredient.";
        mealListGridContainer.classList.add("notFound");
      }

      mealListGridContainer.innerHTML = html;
    });
}

// This function will get the meal from api
function getRecipeForMeal(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then(response => response.json())
      .then(data => showMealModal(data.meals));
  }
}

// This function will make the modal window and insert information from the api.
function showMealModal(meal) {
  meal = meal[0];
  console.log(meal)
  let html = `
        <h2 class = "recipe-title">Hot to make <i>${meal.strMeal}</i></h2>
        <p class = "recipe-category">Category: ${meal.strCategory}</p>
        <p class = "recipe-category">Area: ${meal.strArea}</p>
        <p class = "recipe-category">Tags: ${meal.strTags}</p>
        <p class = "recipe-category"><a href="${meal.strSource}" target="_blank">Read More</a></p>
        <div class = "recipe-meal-image">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
        <a href = "${meal.strYoutube}" target = "_blank"><i class="fab fa-youtube"></i> See Video in YouTube <i class="fab fa-youtube"></i></a>
    </div>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        
       
    `;
  mealDetailsBody.innerHTML = html;
  mealDetailsBody.parentElement.classList.add("showRecipe");
}
