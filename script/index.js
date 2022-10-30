const cardContainer = document.querySelector('.cards');
const btnOpenPopup = document.querySelector('#add');
const btnOpenPopupLogin = document.querySelector('#login');
const formAddCat = document.querySelector('#popup-form-cat');
const formLogin = document.querySelector("#popup-form-login");

const popupAddCat = new Popup('popup-add-cats');
popupAddCat.setEventListener();

const popupLogin = new Popup('popup-login');
popupLogin.setEventListener();

function serializeForm(elems){
    const formData = {};

    elems.forEach(input =>{
        if(input.type === 'submit') return;
        if(input.type !== 'checkbox'){
            formData[input.name] = input.value;
        };
        if(input.type === 'checkbox'){
            formData[input.name] = input.checked;
        };
    })
    return formData;
}

function createCat(dataCat){
    const cardInstance = new Card(dataCat, '#card-template');
    const newCardElement = cardInstance.getElement();
    cardContainer.append(newCardElement);
}

const elemsFormCat = [...formAddCat.elements];


function addFormCat(l){
    l.preventDefault();
    const elemsFormCat = [...formAddCat.elements];
    const dataFromForm = serializeForm(elemsFormCat);
    
    console.log(dataFromForm);

    api.addNewCat(dataFromForm)
        .then(() =>{
            createCat(dataFromForm);
            popupAddCat.close();
        })
}

function FormLogin(l){
    l.preventDefault();
    const elemsFormCat = [...formLogin.elements];
    const dataFromForm = serializeForm(elemsFormCat);
    
    console.log(dataFromForm);

    Cookies.set('email', `email=${dataFromForm.email}`);
    btnOpenPopup.classList.remove("visually-hidden");
    popupLogin.close();
}

function setDataRefresh(minutes){
    const setTime = new Date(new Date().getTime() + minutes * 60000)
    localStorage.setItem('catsRefresh', setTime)
}

function checkLocalStorage(){
    const localData = JSON.parse(localStorage.getItem('cats'));
    const getTimeExpires = localStorage.getItem('catsRefresh');

    if(localData && localData.length && (new Date() < new Date(getTimeExpires))){
        localData.forEach(function(catData){
            createCat(catData);
        })
    }else {
        api.getAllCats()
            .then(({ data }) =>{
                data.forEach(function(catData){
                    createCat(catData);
                })
                localStorage.setItem('cats', JSON.stringify(data))
                setDataRefresh(5)
            })
    }

}
checkLocalStorage();



btnOpenPopup.addEventListener('click', ()=> popupAddCat.open());
btnOpenPopupLogin.addEventListener('click', ()=> popupLogin.open());

formAddCat.addEventListener('submit', addFormCat)
formLogin.addEventListener('submit', FormLogin);

const isAuth = Cookies.get('email');

if (!isAuth) {
  popupLogin.open();
  btnOpenPopup.classList.add("visually-hidden");
}

console.log(isAuth);


/*
const cardsContainer = document.querySelector(".cards");
const btnOpenPopupForm = document.querySelector("#add");
const btnOpenPopupLogin = document.querySelector("#login");
const formCatAdd = document.querySelector("#popup-form-cat");
const formLogin = document.querySelector("#popup-form-login");

const popupAddCat = new Popup("popup-add-cats");
popupAddCat.setEventListener();

const popupLogin = new Popup("popup-login");
popupLogin.setEventListener();

function serializeForm(elements) {
  const formData = {};

  elements.forEach((input) => {
    if (input.type === "submit") return;

    if (input.type !== "checkbox") {
      formData[input.name] = input.value;
    }

    if (input.type === "checkbox") {
      formData[input.name] = input.checked;
    }
  });

  return formData;
}

function createCat(dataCat) {
  const cardInstance = new Card(dataCat, "#card-template");
  const newCardElement = cardInstance.getElement();
  cardsContainer.append(newCardElement);
}

function handleFormAddCat(e) {
  e.preventDefault();
  const elementsFormCat = [...formCatAdd.elements];
  const dataFromForm = serializeForm(elementsFormCat);

  console.log(dataFromForm);
  //собрать данные из формы
  //создать карточку из данных
  //добавить карточку на страницу
  api.addNewCat(dataFromForm).then(() => {
    createCat(dataFromForm);
    updateLocalStorage(dataFromForm, { type: "ADD_CAT" });
    popupAddCat.close();
  });
}

function handleFormLogin(e) {
  e.preventDefault();
  const elementsFormCat = [...formLogin.elements];
  const dataFromForm = serializeForm(elementsFormCat);
  console.log(dataFromForm);
  Cookies.set("email", `email=${dataFromForm.email}`);
  btnOpenPopupForm.classList.remove("visually-hidden");
  popupLogin.close();
}

function setDataRefresh(minutes) {
  const setTime = new Date(new Date().getTime() + minutes * 60000);
  localStorage.setItem("catsRefresh", setTime);
  return setTime;
}

function checkLocalStorage() {
  const localData = JSON.parse(localStorage.getItem("cats"));
  const getTimeExpires = localStorage.getItem("catsRefresh");

  if (localData && localData.length && new Date() < new Date(getTimeExpires)) {
    localData.forEach(function (catData) {
      createCat(catData);
    });
  } else {
    api.getAllCats().then(({ data }) => {
      data.forEach(function (catData) {
        createCat(catData);
      });

      updateLocalStorage(data, { type: "ALL_CATS" });
    });
  }
}

function updateLocalStorage(data, action) {
  // {type: 'ADD_CAT'} {type: 'ALL_CATS'}
  const oldStorage = JSON.parse(localStorage.getItem("cats"));

  switch (action.type) {
    case "ADD_CAT":
      oldStorage.push(data);
      localStorage.setItem("cats", JSON.stringify(oldStorage));
      return;
    case "ALL_CATS":
      localStorage.setItem("cats", JSON.stringify(data));
      setDataRefresh(60);
      return;
    case "DELETE_CAT":
      const newStorage = oldStorage.filter((cat) => cat.id !== data.id);
      localStorage.setItem("cats", JSON.stringify(newStorage));

      return;
    default:
      break;
  }
}

checkLocalStorage();

btnOpenPopupForm.addEventListener("click", () => popupAddCat.open());
btnOpenPopupLogin.addEventListener("click", () => popupLogin.open());
formCatAdd.addEventListener("submit", handleFormAddCat);
formLogin.addEventListener("submit", handleFormLogin);

const isAuth = Cookies.get("email");

if (!isAuth) {
  popupLogin.open();
  btnOpenPopupForm.classList.add("visually-hidden");
}

console.log(isAuth);

// document.cookie = 'email=maxim_91@inbox.ru;samesite=strict;max-age=360;';
// document.cookie = 'name=Вася;samesite=strict;max-age=360;';

// Cookies.set('password', '1234567', {expires: 7})
// Cookies.remove('password')

// console.log(Cookies.get('name'));

// localStorage.setItem('name', JSON.stringify({name: 'Вася'}))
// localStorage.setItem('lastname', JSON.stringify({name: 'Вася'}))

// console.log(JSON.parse(localStorage.getItem('name')));
// localStorage.setItem('name', JSON.stringify({name: 'Максим'}))
*/