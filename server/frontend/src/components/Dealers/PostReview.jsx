import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState(null);
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carModels, setCarModels] = useState([]);
  const navigate = useNavigate();

  let currUrl = window.location.href;
  let rootUrl = currUrl.substring(0, currUrl.indexOf("postreview"));
  let { id } = useParams();
  let dealerUrl = `${rootUrl}djangoapp/dealer/${id}`;
  let reviewUrl = `${rootUrl}djangoapp/add_review`;
  let carModelsUrl = `${rootUrl}djangoapp/get_cars`;

  const currentDate = new Date().toISOString().split('T')[0];

  const postReview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    if (!model || review === "" || date === "" || year === "" || model === "") {
      alert("All fields are mandatory.");
      return;
    }

    let [makeChosen, modelChosen] = model.split(" ");

    let jsonInput = JSON.stringify({
      "name": name,
      "dealership": id,
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": makeChosen,
      "car_model": modelChosen,
      "car_year": year,
    });

    console.log("Request Payload:", jsonInput);

    try {
      const res = await fetch(reviewUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonInput,
      });
      const json = await res.json();
      console.log("API Response:", json);

      if (json.status === 200) {
        navigate(`/dealer/${id}`);
      } else {
        alert(`Error posting review: ${json.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error posting review:", error);
      alert("Error posting review. Please try again.");
    }
  };

  const getDealer = async () => {
    try {
      const res = await fetch(dealerUrl, { method: "GET" });
      const retObj = await res.json();

      if (res.ok && retObj.dealer) {
        setDealer(retObj.dealer);
      } else {
        console.error("Dealer not found.");
      }
    } catch (error) {
      console.error("Error fetching dealer:", error);
    }
  };

  const getCars = async () => {
    try {
      const res = await fetch(carModelsUrl, { method: "GET" });
      const retObj = await res.json();
      setCarModels(retObj.CarModels);
    } catch (error) {
      console.error("Error fetching car models:", error);
    }
  };

  useEffect(() => {
    getDealer();
    getCars();
  }, []);

  if (!dealer) {
    return <div>Loading dealer information...</div>;
  }

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>
        <textarea
          id="review"
          cols="50"
          rows="7"
          onChange={(e) => setReview(e.target.value)}
        />
        <div className="input_field">
          Purchase Date
          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            max={currentDate}
          />
        </div>
        <div className="input_field">
          Car Make and Model
          <select
            name="cars"
            id="cars"
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="" selected disabled hidden>
              Choose Car Make and Model
            </option>
            {carModels.map((carModel, index) => (
              <option key={index} value={`${carModel.CarMake} ${carModel.CarModel}`}>
                {carModel.CarMake} {carModel.CarModel}
              </option>
            ))}
          </select>
        </div>
        <div className="input_field">
          Car Year
          <input
            type="number"
            onChange={(e) => setYear(e.target.value)}
            max={new Date().getFullYear()}
            min={2015}
          />
        </div>
        <div>
          <button className="postreview" onClick={postReview}>Post Review</button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
