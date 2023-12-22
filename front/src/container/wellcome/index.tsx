import React from "react";
import "./index.css";
import { Link, useNavigate} from "react-router-dom";

import Page from "../../page";

import Heading from "../../component/heading";
import Title from "../../component/title";
// import Grid from "../../component/grid";
import Description from "../../component/description";
import ButtonDark from "../../component/button-dark";
import ButtonLight from "../../component/button-light";
import Picture from "../../component/picture";


function Container() {
  const navigate = useNavigate();
   const handleMove = (to: string) => () => {
      navigate(to);
   };
  return (
    <Page>
      <div className="wellcome-page">
        <Heading>
          <Title>Hello!</Title>
          <Description>Welcome to bank app</Description>
        </Heading>
        <Picture src="../../../img/background_img_2.png" name="{name}" />
        <div className="box-button">
          <Link to="/signup">
            <ButtonDark onClick={handleMove("/signup")}>Sign Up</ButtonDark>
          </Link>
          <Link to="/signin">
            <ButtonLight onClick={handleMove("/signin")}>Sign In</ButtonLight>
          </Link>
        </div>
      </div>
    </Page>
  );
}

export default Container;
