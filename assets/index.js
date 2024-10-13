const search = document.querySelector('.search');
const searchBtn = document.querySelector('.search_btn');
const meals = document.querySelector('.meals');
const main = document.querySelector('main');
const reciptContent = document.querySelector('.recipt_content');
const recipts = document.querySelector('.recipts');
const closeBtn = document.querySelector('.close_btn');

async function fetchRecipts(query){
    try{
        let jsonData = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        data = await jsonData.json();
        if(!jsonData.ok){
             throw new Error('something went wrong')
        }
        return data;
    }catch(e){
        console.log(e);
    }
}

function getReciptContent(meal){
    let regex = /[\w+]+$/;
    let match = meal.strYoutube.match(regex);
    reciptContent.innerHTML = `
        <iframe height="400" src="https://www.youtube.com/embed/${match[0]}" frameborder="0" allowfullscreen></iframe>
    `;
    let ol = document.createElement('ol');
    Object.keys(meal).forEach((key)=>{
        if(key.match(/strIngredient+\d+/) && meal[key]){
            ol.innerHTML += `
                <li>${meal[key]}</li>
            `;
        }
    });
    reciptContent.appendChild(ol);
}


searchBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    if(meals.innerHTML != null){
        meals.innerHTML = ""; 
    }
    fetchRecipts(search.value.trim())
    .then((d)=>{
        const fragment = document.createDocumentFragment();
        d.meals.forEach( el => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="${el.strMealThumb}" loading="lazy" alt="pic">
                <div class="content">
                    <div class="food_name">${el.strMeal}</div>
                    <div class="details">
                        <p>${el.strCategory} / ${el.strArea}</p>
                    </div>
                </div>
            `;
            const viewBtn = document.createElement('button');
            viewBtn.textContent = "view";
            viewBtn.classList.add("view_btn");
            card.appendChild(viewBtn);

            
            // Add the event listener
            viewBtn.addEventListener('click', e => {
                e.preventDefault();
                recipts.style.display = "block";
                getReciptContent(el);
            });
            fragment.appendChild(card);  
        });
        meals.append(fragment);
    }).catch((e)=>{
        console.log(`Error: ${e}`);
        document.write('something went wrong')
    });
    main.style.display = "none";
});


//remove popup
function removePopup(){
    recipts.style.display = "none";
    closeBtn.removeEventListener('click', function(e){
        e.preventDefault();
        removePopup();
    });
}
closeBtn.addEventListener('click', function(e){
    e.preventDefault();
    removePopup();
});




