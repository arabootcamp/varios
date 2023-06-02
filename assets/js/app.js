const styleVisibility = (type, id, value) => {
  if (type == "query") document.querySelector(id).style.visibility = value;
  if (type == "id") document.getElementById(id).style.visibility = value;
}

const getValue = (id) => document.getElementById(id).value.trim();

const URLBASE = "http://api.openweathermap.org/data/2.5/weather"

const kelvinToCelsius = kelvin => (kelvin-273.15).toFixed(2);

//https://api.openweathermap.org/data/2.5/weather?q=santiago,MX&appid=e0c15b8e93223e5c828fbf46a5d20e5f
const getURL = (city, countryCode) => `${URLBASE}/?q=${city},${countryCode}&appid=e0c15b8e93223e5c828fbf46a5d20e5f`;

const paintDom = (main)=>{
  styleVisibility("id", "formulario", "hidden");
  const res = document.getElementById("resultado");
  res.innerHTML = `<p><strong>temp:</strong> ${main.temp} - <strong>temp_min:</strong> ${main.temp_min} - <strong>temp_max:</strong> ${main.temp_max}</p>`;
  styleVisibility("id", "resultado", "visible");
}

const getDataFromAPI = async (city, countryCode) => {
  let url = getURL(city, countryCode);
  styleVisibility("query", ".contentSpinnerLoading", "visible");
  styleVisibility("id", "formulario", "hidden");
  try {
     let response = await fetch(url);
     if(!response.ok) throw new Error(response.statusText);
     let data = await response.json();
     const main = {
      temp: kelvinToCelsius(data.main.temp),
      temp_min: kelvinToCelsius(data.main.temp_min),
      temp_max: kelvinToCelsius(data.main.temp_max)
     }
     paintDom(main);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `${error}`,
    })
    styleVisibility("id", "formulario", "visible");
  }
  finally{
    styleVisibility("query", ".contentSpinnerLoading", "hidden");
  }
};

const submitHandler = (evt) => {
  evt.preventDefault();
  //se obtienen selectores
  const city = getValue("ciudad");
  const countryCode = getValue("pais");

  //Si los campos son vacios mandamos alerta
  if (city == "" || countryCode == "") {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debes completar los campos!',
    })
    return;
  }
  //Si los campos se completaron consulto a la api
  getDataFromAPI(city,countryCode); 
}

//cuando se carga el dom
document.addEventListener('DOMContentLoaded', () => {
  // Código JavaScript que se ejecutará cuando el documento esté cargado
  //oculto el spinner y respuesta
  styleVisibility("query", ".contentSpinnerLoading", "hidden");
  styleVisibility("id", "resultado", "hidden");
  //escuchar el evento submit
  document.getElementById("formulario").addEventListener("submit", submitHandler);
});