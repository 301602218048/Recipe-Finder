const searchForm = document.querySelector('form');
const searchInput = document.querySelector('#search');
const buttonclk = document.querySelector('#submit');
const resultsList = document.querySelector('#results');

let i;
let searchValue;

buttonclk.addEventListener('click', (e) => {
    e.preventDefault();
    resultsList.innerHTML = '';
    i=0;
    searchRecipes();
})

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    resultsList.innerHTML = '';
    i=0;
    searchRecipes();
})

window.addEventListener('scroll', () => {
    if(window.scrollY + window.innerHeight + 5 >= document.documentElement.scrollHeight){
        loadmore();
    }
})

function check(value){
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(value);
}

async function searchRecipes() {
    resultsList.innerHTML = `<h2 style="text-align: center;">Fetching Recipes...</h2>`;
    searchValue = searchInput.value.trim();
    if(searchValue === '' || check(searchValue) || !isNaN(searchValue)){
        resultsList.innerHTML = `<h2 style="text-align: center;">Please enter the Ingredients...</h2>`
    }else{
        const response = await fetch(`https://api.edamam.com/search?q=${searchValue}&app_id=591eba74&app_key=
        c37179d3df254f7b58f8271fcda1f1c5&from=${i}&to=${i+10}`);
        const data = await response.json();
        console.log(data);
        displayRecipes(data.hits);
    }
}

function displayRecipes(recipes) {
    let html = '';
    recipes.forEach((recipe) => {
        html += `
        <div id="${i}">
            <div>
                <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
                <h3>${recipe.recipe.label}</h3>
                <ul>
                    ${recipe.recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
            <div class="bookmark">
                <a href="${recipe.recipe.url}" target="_blank">View Full Recipe</a>
                <button class="buk" id="icon${i++}"><i class="fa-solid fa-bookmark" style="color: white;"></i></button>
            </div>
        </div> 
        `
    })

    if(i<=10) resultsList.innerHTML = html;
    else resultsList.innerHTML += html;

    const bookmk = document.querySelectorAll('.buk');
    bookmk.forEach((button) => {
        button.addEventListener('click', () => {
            const bookid = button.getAttribute('id');
            let num = bookid.replace(/^\D+/g, '');
            JSON.stringify(num);
            const bmk = document.querySelectorAll('.fa-solid');
            console.log(bmk[num].style.color);
            if(localStorage.getItem(num)){
                bmk[num].style.color = 'white';
                localStorage.removeItem(num);
            }
            else{
                const divselect = document.getElementById(num);
                let html = divselect.innerHTML;
                bmk[num].style.color = 'black';
                localStorage.setItem(num, html);
            }
        })
    })
}

async function loadmore(){
    const response = await fetch(`https://api.edamam.com/search?q=${searchValue}&app_id=591eba74&app_key=
    c37179d3df254f7b58f8271fcda1f1c5&from=${i}&to=${i+10}`);
    console.log("Fetched more");
    const data = await response.json();
    displayRecipes(data.hits);
}