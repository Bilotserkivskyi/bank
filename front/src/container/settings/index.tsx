import "./index.css";
import { AuthContext } from "../../App";
import React, { useContext } from "react";

import Page from "../../page";
import Heading from "../../component/heading";
import Title from "../../component/title";
import ButtonBack from "../../component/button-back";

import ChangeEmail from "../change-email";
import ChangePassword from "../change-password";
import ButtonLogout from "../../component/button-logout";

export default function SettingsPage() {
   const context = useContext(AuthContext);
   // const user: InitialState = context.userState;

   const handleLogout = () => {
      context.authDisp("LOGOUT");
   };

   return (
      <Page>
         <div className="settings-heading">
        <ButtonBack
          to="/balance"
          src="../../../svg/button-back.svg"
          alt="Return back"
        />
        <Heading>
          <Title>Settings</Title>
        </Heading>
      </div>
         <ChangeEmail />
         <ChangePassword />
         <div className="logout-button">
            <ButtonLogout onClick={handleLogout}>
               Log out
            </ButtonLogout>
         </div>
      </Page>
      
   );
}
