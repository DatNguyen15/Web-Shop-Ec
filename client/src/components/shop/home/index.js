import React, { Fragment, createContext, useReducer } from "react";

import { useLocation } from "react-router-dom";

import qs from "qs";

import Layout from "../layout";
import Slider from "./Slider";
import ProductCategory from "./ProductCategory";
import { homeState, homeReducer } from "./HomeContext";
import SingleProduct from "./SingleProduct";
import ProductSuggestion from "./ProductSuggestion";

export const HomeContext = createContext();

const HomeComponent = () => {
  const { search } = useLocation();
  const jwt = qs.parse(search, {
    ignoreQueryPrefix: true,
    allowDots: true,
  });

  if (jwt.token && jwt.user) {
    localStorage.setItem("jwt", JSON.stringify(jwt));
    window.location.href = "/";
  }

  return (
    <Fragment>
      <Slider />
      <section className="m-4 md:mx-8 md:my-6 hover:text-yellow-700">
        <h1
          className="text-md md:text-lg font-medium"
          style={{
            border: "1px solid black",
            padding: "10px",
            background: "black",
            color: "whitesmoke",
          }}
        >
          Suggestion For You.
        </h1>
      </section>
      <section className="m-4 md:mx-8 md:my-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <ProductSuggestion />
      </section>
      {/* Category, Search & Filter Section */}
      <section className="m-4 md:mx-8 md:my-6">
        <ProductCategory />
      </section>
      {/* Product Section */}
      <section className="m-4 md:mx-8 md:my-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <SingleProduct />
      </section>
    </Fragment>
  );
};

const Home = (props) => {
  const [data, dispatch] = useReducer(homeReducer, homeState);
  return (
    <Fragment>
      <HomeContext.Provider value={{ data, dispatch }}>
        <Layout children={<HomeComponent />} />
      </HomeContext.Provider>
    </Fragment>
  );
};

export default Home;
