import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(null);

  const { id } = useParams();
  const base_url = window.location.href.split("dealer")[0];
  const dealer_url = `${base_url}djangoapp/dealer/${id}`;
  const reviews_url = `${base_url}djangoapp/reviews/dealer/${id}`;
  const post_review_url = `${base_url}postreview/${id}`;

  useEffect(() => {
    const fetchDealer = async () => {
      try {
        const response = await fetch(dealer_url);
        const data = await response.json();
        if (response.ok && data.dealer) {
          setDealer(data.dealer);
        } else {
          console.error("Dealer data not found.");
        }
      } catch (error) {
        console.error("Error fetching dealer data:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(reviews_url);
        const data = await response.json();
        if (response.ok && data.reviews) {
          setReviews(data.reviews);
          if (data.reviews.length === 0) setUnreviewed(true);
        } else {
          console.error("Error fetching reviews:", data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchDealer();
    fetchReviews();

    if (sessionStorage.getItem("username")) {
      setPostReview(
        <a href={post_review_url}>
          <img
            src={review_icon}
            style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }}
            alt='Post Review'
          />
        </a>
      );
    }
  }, [dealer_url, reviews_url, post_review_url]);

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return positive_icon;
      case 'negative': return negative_icon;
      default: return neutral_icon;
    }
  };

  if (!dealer) {
    return <div>Loading dealer information...</div>;
  }

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer.full_name} {postReview}
        </h1>
        <h4 style={{ color: "grey" }}>
          {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
        </h4>
      </div>
      <div className="reviews_panel">
        {reviews.length === 0 && !unreviewed ? (
          <div>Loading Reviews...</div>
        ) : unreviewed ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review) => (
            <div className="review_panel" key={review.id}>
              <img
                src={getSentimentIcon(review.sentiment)}
                className="emotion_icon"
                alt="Sentiment"
              />
              <div className="review">{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
