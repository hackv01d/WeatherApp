let temp = document.querySelector(".temp");
let date = document.querySelector(".date");
let day = document.querySelector(".day");
let fivedays = document.querySelector(".fivedays");
let nd = document.querySelector(".nameday");
let myc = document.querySelector(".mycity");
let hidbtn = document.querySelector(".hidbtn");
let form = document.querySelector(".search form");
form.hidden = true;

class Weather {
    constructor(city) {
        this.city = city;
    }

    getDataNow = async function() {
        try {
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=067c642c645db11bc5feba545fc2d4ae&lang=ru&units=metric`;
            let response = await fetch(url);
            let data = await response.json();
            return data;
        } catch(err) {
            return err;
        }
    }

    getDataNext = async function() {
        try{
            let url = `https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&appid=067c642c645db11bc5feba545fc2d4ae&lang=ru&units=metric`;
            let response = await fetch(url);
            let data = await response.json();
            return data;
        }catch(err) {
            return err;
        }
    }

    week = {
        0: ['Вс', 'Воскресенье'],
        1: ['Пн', 'Понедельник'],
        2: ['Вт', 'Вторник'],
        3: ['Ср', 'Среда'],
        4: ['Чт', 'Четверг'],
        5: ['Пт', 'Пятница'],
        6: ['Сб', 'Суббота']
    }

    showTempNow = function(n) {
        this.getDataNow()
            .then(data => {
                if (n==new Date().getDate()) {
                    let img = document.createElement("img")
                    img.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                    document.querySelector(".dateweather").prepend(img);
                    temp.innerHTML = Math.round(data.main.temp) + '°C';
                }
                let dat = new Date();
                dat.setDate(n);
                date.innerHTML =`${dat.getDate()}/${dat.getMonth()+1}/${dat.getFullYear()}`;
                nd.innerHTML = this.week[dat.getDay()][1];
            })
    }

    createDay = function(num) {
        this.getDataNext()
            .then(data => data.list.forEach(el => {
                myc.innerHTML = data['city']['name'];
                if (el['dt_txt'].slice(8, 10) == num && el['dt_txt'].slice(11, 13)>3) {
                    let divday = document.createElement("div");
                    let ptime = document.createElement("p");
                    let ptemp = document.createElement("p");
                    let img = document.createElement("img")
                    img.src = `http://openweathermap.org/img/wn/${el.weather[0].icon}@2x.png`;
                    ptime.innerHTML = el['dt_txt'].slice(11, 16);
                    ptemp.innerHTML = Math.round(el.main.temp) + '°C';
                    ptime.className = 'daytime';
                    ptemp.className = 'daytemp'
                    divday.append(ptime);
                    divday.append(ptemp);
                    divday.append(img);
                    day.append(divday);
                }
            }))
    }

    createFiveDays = function() {
        let d = new Date();
        this.getDataNext()
            .then(data => data.list.forEach(item => {
                if (item['dt_txt'].slice(11, 13) == 15) {
                    let divfive = document.createElement("div");
                    let pnum = document.createElement("p");
                    let pname = document.createElement("p");
                    let ptemp = document.createElement("p");
                    let img = document.createElement("img")
                    img.src = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
                    pnum.innerHTML = item['dt_txt'].slice(8, 10);
                    pnum.className = 'nummonth';
                    d.setDate(item['dt_txt'].slice(8, 10))
                    pname.innerHTML = this.week[d.getDay()][0];
                    pname.className = 'fivename';
                    ptemp.className = 'fivetemp'
                    ptemp.innerHTML = Math.round(item.main.temp) + '°C';
                    divfive.append(pnum);
                    divfive.append(pname);
                    divfive.append(ptemp);
                    divfive.append(img);
                    pnum.hidden = true;
                    divfive.className = "nextday"
                    fivedays.append(divfive);
                }
            }))
    }

}


let nameCity = document.querySelector("#city");
nameCity.value = "Москва";
document.addEventListener("DOMContentLoaded", showWeather)

function openSearch() {
    this.hidden = true;
    form.hidden = false;
    nameCity.focus();
}
hidbtn.addEventListener("click", openSearch)

function showWeather() {
    if (!nameCity.value) return;
    document.querySelector(".dateweather").hidden = false;
    form.hidden = true;
    hidbtn.hidden = false;
    day.innerHTML = '';
    fivedays.innerHTML = '';
    if (document.querySelector(".dateweather img")) document.querySelector(".dateweather img").remove();
    let myday = new Date().getDate();
    let weather = new Weather(nameCity.value);
    weather.showTempNow(myday);
    weather.createDay(myday);
    weather.createFiveDays();
}

let getbtn = document.querySelector(".getbtn");
getbtn.addEventListener("click", showWeather);


function clearInput() {
    this.value = "";
}
nameCity.addEventListener("focus", clearInput);

function blockEnter(event) {
    if (event.code == "Enter") event.preventDefault();
}
nameCity.addEventListener("keydown", blockEnter)


function showInfoDay(event) {
    if (!(event.target.className == "nextday" || event.target.closest("div").className == "nextday")) return;
    temp.innerHTML = '';
    day.innerHTML = '';
    if (document.querySelector(".dateweather img")) document.querySelector(".dateweather img").remove();
    let num;
    if (event.target.className == "nextday")  num = event.target.firstChild.innerHTML;
    else num = event.target.closest("div").firstChild.innerHTML;
    let w = new Weather(nameCity.value);
    w.createDay(num);
    if (num == new Date().getDate()) {
        w.showTempNow(num);
        document.querySelector(".dateweather").hidden = false;
    }
    else document.querySelector(".dateweather").hidden = true;

}

fivedays.addEventListener("click", showInfoDay)

