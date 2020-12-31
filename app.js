const api = {
    key: "1f5bd50610bdcdf3db53eb50b5d07139",
    baseurl: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

const hilow = document.querySelector('.day-card .hi-low');
const temp = document.querySelector('.day-card .current .temp');
const dayCards = document.querySelector('.day-cards');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let sign = 'C';
const DAYS_NUM = 7;

function setQuery(e) {
    // Enter button
    if(e.keyCode === 13) {
        getResult(searchbox.value)
    }
}

function getResult(query) { 
    sign = 'C';
    fetch(`${api.baseurl}forecast?q=${query}&units=metric&appid=${api.key}`)
    .then(weather => weather.json())
    .then(displayResult)
}

function displayResult(weather) {
    dayCards.innerHTML = "";
    let i = 0;
    weather.list.filter(element => element.dt_txt.includes('12:00:00')).map(item => {
        let city = document.querySelector('.location .city');

        const day = new Date();
        city.innerText = `${weather.city.name}, ${weather.city.country}`; 
        
        const dayWeather = {
            day: null,
            date: item.dt_txt,
            des: item.weather[0].description,
            icon: item.weather[0].icon,
            temp: item.main.temp,
            weather: item.weather[0].main,
            min: item.main.temp_min,
            max: item.main.temp_max
        }
        const content = `<div class="card" id='i${i}'>
                            <div class="dayName">${(days[(0) % DAYS_NUM])}</div>
                            <div class="date">${dayWeather.date}</div>
                            <div class="icon"><img src="http://openweathermap.org/img/wn/${dayWeather.icon}@2x.png"/></div>
                            <div class="current">
                                <div class="temp">${Math.round(dayWeather.temp)}</div><span>&#176C</span>
                                <div class="weather">${dayWeather.weather}</div>
                                <div class="hi-low">
                                    <div class="min">${Math.round(dayWeather.min)}</div>
                                    <span>&#176C</span>/
                                    <div class="max">${Math.round(dayWeather.max)}</div>
                                    <span>&#176C</span>
                                </div>
                            </div>
                            <div class="celFer"></div>
                        </div>`;
        i++;    
        dayCards.innerHTML += content;
    });

    const celFerCon = document.querySelector('.celFerCon');
    celFerCon.innerHTML = `<button class="celFer">To &#176F</button>`;
    const celFer = document.querySelector('.celFerCon .celFer');
    celFer.addEventListener('click', function() {
            cast();
        }, false);
    }

function cast() {
    document.querySelectorAll('.card')
    .forEach((elem) => {
        const temp = elem.querySelector('.temp');
        const min = elem.querySelector('.min');
        const max = elem.querySelector('.max');

        let temper, mini, maxi;
        //press To F
        if(sign === 'C') {
            temper = (parseInt(temp.innerText) * 1.8) + 32;
            mini = (parseInt(min.innerText) * 1.8) + 32;
            maxi = (parseInt(max.innerText) * 1.8) + 32;
        }
        //press To C
        else {
            temper = (parseInt(temp.innerText) - 32) * 0.5556;
            mini = (parseInt(min.innerText) - 32) * 0.5556;
            maxi = (parseInt(max.innerText) - 32) * 0.5556;
        }

        temp.innerText = Math.round(temper);
        min.innerText = Math.round(mini);
        max.innerText = Math.round(maxi);
    });

    document.querySelector('.celFerCon .celFer').innerHTML = `To &#176${sign}`
    sign === 'C' ? sign = 'F' : sign = 'C';

    document.querySelectorAll('span')
    .forEach((elem) => {
        elem.innerHTML =  `&#176${sign}`
    });
}