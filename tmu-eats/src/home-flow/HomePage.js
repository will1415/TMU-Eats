import "../App.css";
import Cart from "../item-flow/Cart";
import mcd from "./assets/mcd.png";
import timhorton from "./assets/TimHorton.png";
import subway from "./assets/subway.png";
import saladking from "./assets/saladking2.png";
import blaze from "./assets/blazepizza.jpg";
import burritoboyz from "./assets/burritoboyz.png";
import springsushi from "./assets/springsushi.png";
import villamadina from "./assets/villamadina.JPG";
import "./assets/Carousel.css";
import "./assets/Quiz.css";
import React, { useState, useEffect } from "react";
import { db, logout, auth } from "../api/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { UserOutlined, ReloadOutlined } from "@ant-design/icons";
import { Avatar, Popover, Modal, Button } from "antd";
import OrderHistory from "./components/OrderHistory";
import { createSearchParams, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [restaurantModalName, setModalRestaurantName] = useState("");
  const [modalMenuItems, setModalMenuItems] = useState([]);
  const [menuPrices, setMenuPrices] = useState([]);
  const [modalFilterRestaurants, setModalFilterRestaurants] = useState([]);
  const [modalCartItems, setModalCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshDataState, setRefreshDataState] = useState(false);
  const menuitems = [];
  const menuprices = [];
  const filterRestaurants = [];
  const restaurants = [];
  let cartitems = [];
  let itemsprices = [];
  const navigate = useNavigate();
  //Dictionary Mapping DB Restaurant Names to Image Names
  const dbDict = {};
  dbDict["Subway"] = subway;
  dbDict["McDonald's"] = mcd;
  dbDict["Salad King"] = saladking;
  dbDict[" Blaze Pizza"] = blaze; //Extra Space in front is necessary cause it looks like this in the DB for some reason
  dbDict["Burrito Boyz"] = burritoboyz;
  dbDict["Spring Sushi"] = springsushi;
  dbDict["Villa Madina"] = villamadina;
  dbDict["Tim Hortons"] = timhorton;

  async function handleClick(name) {
    //Clears checkmarked values if a user clicks out (bug-fix)
    modalMenuItems.forEach((item, index) => {
      let itemCheckbox = document.getElementById("menuItem" + index);
        itemCheckbox.checked = false;
    });


    setModalRestaurantName(name);

    const querySnapshot = await getDocs(collection(db, "restaurants"));
    querySnapshot.forEach((doc) => {
      if (doc.id == name) {
        let json = doc.data();
        let menuarray = Object.keys(json);

        console.log("Menu Array: " + menuarray);
        for (let k in menuarray) {
          if (menuarray[k] != "Cuisine" && menuarray[k] != "Delivery Time") {
            menuitems.push(menuarray[k]);
            menuprices.push(doc.get(menuarray[k]));
          }
        }
      }
    });

    setModalMenuItems(menuitems);
    setMenuPrices(menuprices);

    // Get the modal
    var modal = document.getElementById("menuModal");

    // Get the button that opens the modal
    //var restID = document.getElementById("1");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the img, open the modal
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }

  /**
   * Retrieves restaurants matching the cuisine and retrieves the modal
   * @param {*} cuisine
   */
  async function handleFilterOnClick(cuisine) {
    const querySnapshot = await getDocs(collection(db, "restaurants"));
    querySnapshot.forEach((doc) => {
      if (doc.data().Cuisine == cuisine) {
        filterRestaurants.push(doc.id);
      }
    });

    setModalFilterRestaurants(filterRestaurants);

    // Get the modal
    var modal = document.getElementById("filterModal");

    // Get the button that opens the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the img, open the modal
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }

  /**
   * Closes the filter modal and opens the corresponding restaurant modal
   * @param {*} restaurant
   */
  async function modalRestaurantClick(restaurant) {
    handleClick(restaurant);
    var modal = document.getElementById("filterModal");
    modal.style.display = "none";
    //<li onClick={() => modalRestaurantClick("Tim Hortons")}>{item}</li> Used for testing
  }
  
  /**
   * Randommly chooses a restaurant for the user
   */
  async function randomizer(){
    const querySnapshot = await getDocs(collection(db, "restaurants"));
    querySnapshot.forEach((doc) => {
      if (doc.id != null) {
        console.log(doc.id);
        restaurants.push(doc.id);
      }
    });
    console.log('object: %O', restaurants);

    const randomRest = Math.floor(Math.random() * restaurants.length);
    handleClick(restaurants[randomRest]);

    //Iterates through list of items and selects "random" items up to 2
    var totalchecked = 0
    modalMenuItems.forEach((item, index) => {
      let itemCheckbox = document.getElementById("menuItem" + index);
      if (getRandomNumberBetween(1,100) > 60 && totalchecked < 2){
        itemCheckbox.checked = true;
        totalchecked++;
      }
    });

  }

  function getRandomNumberBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

  function addToCart() {
    //clear cartItems
    cartitems = [];
    itemsprices = [];
    modalMenuItems.forEach((item, index) => {
      let itemCheckbox = document.getElementById("menuItem" + index);
      if (itemCheckbox.checked) {
        cartitems.push(item);
        itemsprices.push(menuPrices[index]);
      }
    });

    console.log(`Items added: ${cartitems}`);
    setModalCartItems(cartitems);
    var collection = document.getElementsByClassName("cartCheckbox");
    for (let i = 0; i < collection.length; i++) {
      if (collection[i].checked) collection[i].checked = false;
    }
    navigate({
      pathname: "/cart",
      search: createSearchParams({
        items: cartitems,
        prices: itemsprices,
        restaurant: restaurantModalName,
      }).toString(),
    });
  }

  const openProfile = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const logoutUser = async () => {
    await logout();
    navigate("/");
  };

  const refreshData = () => {
    setRefreshDataState(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="banner">
          <img src="../TMU-logo.png" alt="TMU Logo" width="250" height="100" />
          <Popover>
            <div className="profile-logo" onClick={openProfile}>
              <a>
                <Avatar size={50} icon={<UserOutlined />} />
              </a>
            </div>
          </Popover>
        </div>
        <Modal
          title=""
          open={isModalOpen}
          destroyOnClose={true}
          onOk={handleOk}
          footer={[
            <Button type="primary" onClick={logoutUser}>
              Signout
            </Button>,
          ]}
          maskClosable={true}
          onCancel={closeModal}
          width={"100vh"}
          bodyStyle={{ height: "70vh" }}
        >
          {auth.currentUser ? (
            <h1>{auth.currentUser.displayName}</h1>
          ) : (
            <h1></h1>
          )}
          <div>
            <h2 style={{ display: "inline" }}>Order History</h2>
            <Popover style={{ marginLeft: "1vh" }}>
              <div style={{ display: "inline" }} onClick={refreshData}>
                <a>
                  <ReloadOutlined style={{ marginLeft: "1vh" }} />
                </a>
              </div>
            </Popover>
          </div>

          <OrderHistory
            refreshData={refreshDataState}
            setRefreshDataState={setRefreshDataState}
          />
        </Modal>

        <div className="navbar">

          <div class="dropdown">
            <button class="dropdown-btn">Filters</button>
          </div>
          <button1>
            <a href="#"
              onClick={() => randomizer()}
            ></a>
          </button1>


          <div class="categories">
            <a
              href="#"
              class="nav1"
              onClick={() => handleFilterOnClick("Italian")}
            >
              Italian
            </a>
            <a
              href="#"
              class="nav2"
              onClick={() => handleFilterOnClick("Fast Food")}
            >
              Fast Food
            </a>
            <a
              href="#"
              class="nav3"
              onClick={() => handleFilterOnClick("Japanese")}
            >
              Japanese
            </a>
            <a
              href="#"
              class="nav4"
              onClick={() => handleFilterOnClick("Mexican")}
            >
              Mexican
            </a>
            <a
              href="#"
              class="nav5"
              onClick={() => handleFilterOnClick("Middle Eastern")}
            >
              Middle Eastern
            </a>
          </div>
        </div>
        <section class="carousel" aria-label="Gallery">
          <ol class="carousel__viewport">
            <li id="carousel__slide1" c tabindex="0" class="carousel__slide">
              <div class="carousel__snapper">
                <img
                  onClick={() => handleClick("Subway")}
                  src={subway}
                  alt="Subway Logo"
                  width="350"
                  height="200"
                />
                <div class="time_container">
                  <h3>Estimated Time: 10 min</h3>
                </div>
              </div>
              <a href="#carousel__slide8" class="carousel__prev">
                Go to last slide
              </a>
              <a href="#carousel__slide2" class="carousel__next">
                Go to next slide
              </a>
            </li>

            <li id="carousel__slide2" tabindex="0" class="carousel__slide">
              <div class="carousel__snapper">
                <img
                  onClick={() => handleClick("McDonald's")}
                  src={mcd}
                  alt="McDonald Logo"
                  width="350"
                  height="200"
                />
                <div class="time_container">
                  <h3>Estimated Time: 15 min</h3>
                </div>
              </div>
              <a href="#carousel__slide1" class="carousel__prev">
                Go to previous slide
              </a>
              <a href="#carousel__slide3" class="carousel__next">
                Go to next slide
              </a>
            </li>

            <li id="carousel__slide3" tabindex="0" class="carousel__slide">
              <div class="carousel__snapper">
                <img
                  onClick={() => handleClick("Tim Hortons")}
                  src={timhorton}
                  alt="Tim Hortons Logo"
                  width="350"
                  height="200"
                />
                <div class="time_container">
                  <h3>Estimated Time: 5 min</h3>
                </div>
              </div>
              <a href="#carousel__slide2" class="carousel__prev">
                Go to previous slide
              </a>
              <a href="#carousel__slide4" class="carousel__next">
                Go to next slide
              </a>
            </li>

            <li id="carousel__slide4" tabindex="0" class="carousel__slide">
              <div class="carousel__snapper">
                <img
                  onClick={() => handleClick("Salad King")}
                  src={saladking}
                  alt="Salad King Logo"
                  width="300"
                  height="200"
                />
                <div class="time_container">
                  <h3>Estimated Time: 20 min</h3>
                </div>
              </div>
              <a href="#carousel__slide3" class="carousel__prev">
                Go to previous slide
              </a>
              <a href="#carousel__slide5" class="carousel__next">
                Go to first slide
              </a>
            </li>

            <li id="carousel__slide5" tabindex="0" class="carousel__slide">
              <div class="carousel__snapper">
                <img
                  onClick={() => handleClick(" Blaze Pizza")}
                  src={blaze}
                  alt="Blaze Pizza Logo"
                  width="300"
                  height="200"
                />
                <div class="time_container">
                  <h3>Estimated Time: 20 min</h3>
                </div>
              </div>
              <a href="#carousel__slide4" class="carousel__prev">
                Go to previous slide
              </a>
              <a href="#carousel__slide6" class="carousel__next">
                Go to first slide
              </a>
            </li>

            <li id="carousel__slide6" tabindex="0" class="carousel__slide">
              <div class="carousel__snapper">
                <img
                  onClick={() => handleClick("Burrito Boyz")}
                  src={burritoboyz}
                  alt="Burrito Boyz Logo"
                  width="300"
                  height="200"
                />
                <div class="time_container">
                  <h3>Estimated Time: 5 min</h3>
                </div>
              </div>
              <a href="#carousel__slide5" class="carousel__prev">
                Go to previous slide
              </a>
              <a href="#carousel__slide7" class="carousel__next">
                Go to first slide
              </a>
            </li>

            <li id="carousel__slide7" tabindex="0" class="carousel__slide">
              <div class="carousel__snapper">
                <img
                  onClick={() => handleClick("Spring Sushi")}
                  src={springsushi}
                  alt="Spring Sushi Logo"
                  width="300"
                  height="200"
                />
                <div class="time_container">
                  <h3>Estimated Time: 20 min</h3>
                </div>
              </div>
              <a href="#carousel__slide6" class="carousel__prev">
                Go to previous slide
              </a>
              <a href="#carousel__slide8" class="carousel__next">
                Go to first slide
              </a>
            </li>

            <li id="carousel__slide8" tabindex="0" class="carousel__slide">
              <div class="carousel__snapper">
                <img
                  onClick={() => handleClick("Villa Madina")}
                  src={villamadina}
                  alt="Villa Madina Logo"
                  width="300"
                  height="200"
                />
                <div class="time_container">
                  <h3>Estimated Time: 10 min</h3>
                </div>
              </div>
              <a href="#carousel__slide7" class="carousel__prev">
                Go to previous slide
              </a>
              <a href="#carousel__slide1" class="carousel__next">
                Go to first slide
              </a>
            </li>
          </ol>
          <aside class="carousel__navigation">
            <ol class="carousel__navigation-list">
              <li class="carousel__navigation-item">
                <a href="#carousel__slide1" class="carousel__navigation-button">
                  Go to slide 1
                </a>
              </li>
              <li class="carousel__navigation-item">
                <a href="#carousel__slide2" class="carousel__navigation-button">
                  Go to slide 2
                </a>
              </li>
              <li class="carousel__navigation-item">
                <a href="#carousel__slide3" class="carousel__navigation-button">
                  Go to slide 3
                </a>
              </li>
              <li class="carousel__navigation-item">
                <a href="#carousel__slide4" class="carousel__navigation-button">
                  Go to slide 4
                </a>
              </li>
              <li class="carousel__navigation-item">
                <a href="#carousel__slide5" class="carousel__navigation-button">
                  Go to slide 5
                </a>
              </li>
              <li class="carousel__navigation-item">
                <a href="#carousel__slide6" class="carousel__navigation-button">
                  Go to slide 6
                </a>
              </li>
              <li class="carousel__navigation-item">
                <a href="#carousel__slide7" class="carousel__navigation-button">
                  Go to slide 7
                </a>
              </li>
              <li class="carousel__navigation-item">
                <a href="#carousel__slide8" class="carousel__navigation-button">
                  Go to slide 8
                </a>
              </li>
            </ol>
          </aside>
        </section>

        <div id="filterModal" class="modal">
          <div class="filter-content">
            <span class="close">&times;</span>
            <h1 id="filter"></h1>
            Applicable Restaurants
            <div class="filter-items">
              {modalFilterRestaurants.map((item, index) => (
                <div class="filter-img">
                  <img
                    onClick={() => modalRestaurantClick(item)}
                    src={dbDict[item]}
                    alt="Logo"
                    width="150"
                    height="80"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="menuModal" class="modal">
          <div class="menu-content">
            <span class="close">&times;</span>
            <h1 id="rest-name">{restaurantModalName}</h1>
            <div class="menu-items">
              {modalMenuItems.map((item, index) => (
                <div class="individual-items">
                  <li class="item-price">{"$".concat(menuPrices[index])}</li>
                  <li>{item}</li>
                  <input
                    id={"menuItem" + index}
                    type="checkbox"
                    class="cartCheckbox"
                  />
                </div>
              ))}
            </div>
            <button class="add-cart-btn" onClick={() => addToCart()}>
              Add to Cart
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default HomePage;
