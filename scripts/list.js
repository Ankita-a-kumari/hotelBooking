let urlParams = new URLSearchParams(window.location.search);
const API_URL = "https://travel-advisor.p.rapidapi.com";
const tripAdvisorHost = "travel-advisor.p.rapidapi.com";
const tripAdvisorKey = "9491a4773amshc7a7d06627eeadcp19898bjsn95d462e4eef1";

//this function is used to initialize the google map and place the markers at the position obtained by the latitude and longitude of the hotel from the API
// let initMap = locations => {
//     let center = {lat: parseFloat(locations[0][1]), lng: parseFloat(locations[0][2])};
//     let map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 10,
//         center: center
//     });
//     let infoWindow =  new google.maps.InfoWindow({});
//     let marker, count;
//     for (count = 0; count < locations.length; count++) {
//         marker = new google.maps.Marker({
//             position: new google.maps.LatLng(locations[count][1], locations[count][2]),
//             map: map,
//             title: locations[count][0]
//         });
//         google.maps.event.addListener(marker, 'click', ((marker, count) => {
//             return function() {
//                 infoWindow.setContent(locations[count][0]);
//                 infoWindow.open(map, marker);
//             }
//         })(marker, count));
//     }
// }

let initList = hotelList => {
    let hotelListElement = document.getElementById('hotel-list');
    hotelList.forEach(hotel => {
        let hotelLinkElement = document.createElement("a");
        hotelLinkElement.setAttribute("href", `detail.html?id=` + hotel.singleCardContent.cardLink.route.typedParams.contentId);
        hotelListElement.appendChild(hotelLinkElement);
        let hotelContainer = document.createElement("div");
        hotelContainer.setAttribute("class", "hotel");
        hotelLinkElement.appendChild(hotelContainer);
        let hotelImage = "<img src=" + hotel.singleCardContent.cardLink.route.url + " alt='" + hotel.singleCardContent.cardTitle.string + "' class='hotel-image-small'/>";
        hotelContainer.innerHTML = hotelImage;
        let hotelDetailsContainer = document.createElement("div");
        hotelDetailsContainer.setAttribute("class", "hotel-name-rating");
        hotelContainer.appendChild(hotelDetailsContainer);
        let hotelName = hotel.singleCardContent.cardTitle.string;
        if(hotelName.split(' ').length > 3)
        {
            hotelDetailsContainer.innerHTML = "<h4>"+ hotel.singleCardContent.cardTitle.string +"</h4>";
            hotelDetailsContainer.innerHTML += "<div id='rating'>"+ hotel.singleCardContent.bubbleRating.rating +" <span class='fa fa-star checked'></span></div>";
           // hotelDetailsContainer.innerHTML += "<p style='font-size: small'>"+ hotel.result_object.address +"</p>";
        }
        else {
            hotelDetailsContainer.innerHTML = "<h3>"+ hotel.singleCardContent.cardTitle.string +"</h3>";
            hotelDetailsContainer.innerHTML += "<div id='rating'>"+ hotel.singleCardContent.bubbleRating.rating +" <span class='fa fa-star checked'></span></div>";
            //hotelDetailsContainer.innerHTML += "<p>"+ hotel.result_object.address +"</p>";
        } 
    });
}

//This function is used to display the list of hotels in a particular city fetched from the API 
let fetchHotelListAPI = () => {
    let xhr = new XMLHttpRequest(); 

    const data = JSON.stringify({
        "query":  urlParams.get('city'),
        "updateToken": ""
    });

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            let result = JSON.parse(this.responseText).data;
            let locations = [];
            hotelList = result.AppPresentation_queryAppSearch.sections.filter(item => {
                if(item.singleCardContent)
                {
                    if(item.singleCardContent.bubbleRating) return item.singleCardContent;
                }
            });
            // var trackingKey= JSON.parse(hotelList.trackingKey);
            // hotelList.forEach(item => {
            //     locations.push([item.singleCardContent.cardTitle.string + "<br><a href=\"detail.html?id=" + trackingKey.lid + "\">Book Hotel</a>", 0, 0]);
            // });
            initList(hotelList);
            //initMap(locations);
            disableLoader();
        }
    });

    xhr.open("POST", API_URL + "/locations/v2/search?currency=USD&units=km&lang=en_US" );
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("x-rapidapi-key", "9491a4773amshc7a7d06627eeadcp19898bjsn95d462e4eef1");
    xhr.setRequestHeader("x-rapidapi-host", "travel-advisor.p.rapidapi.com");

    xhr.send(data);
}

fetchHotelListAPI();