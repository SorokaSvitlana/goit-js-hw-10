import './css/styles.css';

import fetchCountries from './fetchCountries';

import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const searchBox = document.querySelector('#search-box');
const listCountryEl = document.querySelector('.country-list');
const infoCountryEl = document.querySelector('.country-info');
let markup = '';
const DEBOUNCE_DELAY = 300;

searchBox.addEventListener('input', debounce(onSearch), DEBOUNCE_DELAY)

function onSearch (e) {
    e.preventDefault();
    const inputValue = searchBox.value.trim();
    clearHTML();
    if (inputValue === '') {
        return;
      }

    fetchCountries(inputValue).then(onCheck).catch(onError)

    function onCheck (countries) {
        if (!countries) {
        return;
        }
        if (countries.length > 10) {
        Notiflix.Notify.info( '"Too many matches found. Please enter a more specific name."');
        return;
         }
        if (countries.length > 1) {
        return renderCountriesList(countries);
        }
        if (countries.length === 1) {
        return renderCountryList(countries);
        }
    }
      
function renderCountriesList(countries) {
    markup = countries
    .map(country => {
      return `<li class='item'><img class="country-flag" src=${country.flags.svg} width="30"/><p class="country-name">${country.name.common}</p></li>`;
    }).join('');
  return listCountryEl.insertAdjacentHTML('afterbegin', markup);
}

function renderCountryList(countryData) {
    markup = countryData
    .map(country => {
      return `<span><img class="country-flag" src=${
        country.flags.svg
      } width="30"/></span><p class="country-name">${
        country.name.common
      }</p>
        <ul class="country-list"><li class="country-list__item"><p class="country-list__text">Capital: ${
          country.capital
        }</p></li><li class="country-list__item"><p class="country-list__text">Population: ${
        country.population
      }</p></li><li class="country-list__item"><p class="country-list__text">Languages: ${Object.values(
        country.languages
      ).join(', ')}</p></li></ul>`;
    })
    .join('');

  return infoCountryEl.insertAdjacentHTML('afterbegin', markup); 
  } }

  function onError() {
   return Notiflix.Notify.failure('Oops, there is no country with that name');
  }

  function clearHTML() {
    infoCountryEl.innerHTML = '';
    listCountryEl.innerHTML = '';
  }