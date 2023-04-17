document.addEventListener("click", handleClickListner);//event listener on full doc

const moviename = document.getElementById("search");
  
  const favmovie = document.getElementById("fav-movies-container");
  const emptyText = document.getElementById("empty-search-text");
  const showFavourites = document.getElementById("favorites-section");
  const cardcontainer = document.getElementById("card-container");
  const emptyFavText = document.getElementById("empty-fav-text");

  addToFavDOM();
  showEmptyText();
  let suggestionList = [];
  let favMovieArray = [];

  moviename.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
    }
  });

  function showEmptyText() {
    if (favmovie.innerHTML == "") {
      emptyFavText.style.display = "block";
    } else {
      emptyFavText.style.display = "none";
    }
  }

  // Event listner on search
  moviename.addEventListener("keyup", function () {
    let search = moviename.value;
    if (search === "") {
      emptyText.style.display = "block";
      cardcontainer.innerHTML = "";
      // creates empty list
      suggestionList = [];
    } else {
      emptyText.style.display = "none";
      (async () => {
        let data = await fetchMovies(search);
        addToDom(data);
      })();

      cardcontainer.style.display = "grid";
    }
  });

  // Fetches data from api and calls function to add it in
  async function fetchMovies(search) {
    const url = `https://www.omdbapi.com/?t=${search}&apikey=16a473cf`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  // Shows in DOM
  function addToDom(data) {
    document.getElementById("empty-fav-text").style.display = "none";
    let isPresent = false;

    // to check if the movie is already present in the suggestionList array
    suggestionList.forEach((movie) => {
      if (movie.Title == data.Title) {
        isPresent = true;
      }
    });

    if (!isPresent && data.Title != undefined) {
      if (data.Poster == "N/A") {
        data.Poster = "./images/not-found.png";
      }
      suggestionList.push(data);
      const movieCard = document.createElement("div");
      movieCard.setAttribute("class", "text-decoration");

      movieCard.innerHTML = `
        <div class="card my-2" data-id = " ${data.Title} ">
        <a href="movie.html" >
          <img style="height:260px"
            src="${data.Poster} "
            class="card-img-top"
            alt="..."
            data-id = "${data.Title} "
          />
          <div class="card-body text-start" style="height:102px">
            <h5 class="card-title" >
              <a href="movie.html" data-id = "${data.Title} "> ${data.Title}  </a>
            </h5>

            <p class="card-text">
              <i class="fa-solid fa-star" style="color:yellow">
                <span id="rating">&nbsp;${data.imdbRating}</span>
              </i>

              <button class="fav-btn">
                <i class="fa-solid fa-heart add-fav" data-id="${data.Title}"></i>
              </button>
            </p>
          </div>
        </a>
      </div>
    `;
      cardcontainer.prepend(movieCard);
    }
  }

  //ADD MOVIE TO LOCAL STORAGE
  async function handleFavBtn(e) {
    const target = e.target;

    let data = await fetchMovies(target.dataset.id);

    let favMoviesLocal = localStorage.getItem("favMoviesList");

    if (favMoviesLocal) {
      favMovieArray = Array.from(JSON.parse(favMoviesLocal));
    } else {
      localStorage.setItem("favMoviesList", JSON.stringify(data));
    }

    // IF THE MOVIE IS ALREDY PRESENT IN THE FAV SECTION THEN ALERT THE USER
    let isPresent = false;
    favMovieArray.forEach((movie) => {
      if (data.Title == movie.Title) {
        notify("present in favourites ");
        isPresent = true;
      }
    });

    if (!isPresent) {
      favMovieArray.push(data);
    }

    localStorage.setItem("favMoviesList", JSON.stringify(favMovieArray));
    isPresent = !isPresent;
    addToFavDOM();
  }

  // Add to favourite list DOM
  function addToFavDOM() {
    favmovie.innerHTML = "";

    let favList = JSON.parse(localStorage.getItem("favMoviesList"));
    if (favList) {
      favList.forEach((movie) => {
        const div = document.createElement("div");
        div.classList.add(
          "fav-movie-card",
          "d-flex",
          "justify-content-between",
          "align-content-center",
          "my-2"
        );
        div.innerHTML = `
   
    <img
      src="${movie.Poster}"
      alt=""
      class="fav-movie-poster"
    />
    <div class="movie-card-details">
      <p class="movie-name mt-3 mb-0">
       <a href = "movie.html" class="fav-movie-name" data-id="${movie.Title}">${movie.Title}<a> 
      </p>
      <small class="text-muted">${movie.Year}</small>
    </div>

    <div class="delete-btn my-4 mx-2">
        <i class="fa-solid fa-xmark" data-id="${movie.Title}"></i>
        
    </div>
    `;

        favmovie.prepend(div);
      });
    }
  }

  // To notify
  function notify(text) {
    window.alert(text);
  }



// Delete from favourite list
function deleteMovie(name) {
  let favList = JSON.parse(localStorage.getItem("favMoviesList"));
  let updatedList = Array.from(favList).filter((movie) => {
    return movie.Title != name;
  });

  localStorage.setItem("favMoviesList", JSON.stringify(updatedList));

  addToFavDOM();
  showEmptyText();
}

// Handles click events
async function handleClickListner(e) {
  const target = e.target;

  if (target.classList.contains("add-fav")) {
    e.preventDefault();
    handleFavBtn(e);
  } else if (target.classList.contains("fa-xmark")) {
    deleteMovie(target.dataset.id);
  } else if (target.classList.contains("fa-bars")) {//toggle button
    if (showFavourites.style.display == "flex") {
      document.getElementById("show-favourites").style.color = "#FA9884";
      showFavourites.style.display = "none";
    } else {
      showFavourites.classList.add("animate__backInRight");
      document.getElementById("show-favourites").style.color =
        "var(--logo-color)";
      showFavourites.style.display = "flex";
    }
  }

  localStorage.setItem("movieName", target.dataset.id);
}
