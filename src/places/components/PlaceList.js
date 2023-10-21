import React, { useContext } from "react";

import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceList.css";

const PlaceList = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  const countInsta = props.items.filter(
    (item) => item.uploadCategory === "InstagramtoInstagram"
  ).length;
  const countYt = props.items.filter(
    (item) => item.uploadCategory === "InstagramtoYoutube"
  ).length;
  const creatorValue = props.items[0].creator;

  const startAllWorkHandler = async (work) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/startAll${work}Work/${auth.userId}`,
        "POST",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {
      console.log("start work catch error");
    }
    console.log("done work");
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <div className="top_place-list_InstagramtoInstagram">
        <section>
          <div className="count">Count : {countInsta}</div>
          <div className="title">Instagram Section</div>
          {auth.userId === creatorValue && (
            <button onClick={() => startAllWorkHandler("Insta")}>
              Start All
            </button>
          )}
          {auth.userId !== creatorValue && <p>&emsp;&emsp;&emsp;</p>}
        </section> 
        <ul className="place-list_InstagramtoInstagram">
          {!isLoading &&
            props.items.map(
              (place) =>
                place.uploadCategory === "InstagramtoInstagram" && (
                  <PlaceItem
                    key={place.id}
                    id={place.id}
                    title={place.title}
                    description={place.description}
                    btnStatus={place.btnStatus}
                    creatorId={place.creator}
                    onDelete={props.onDeletePlace}
                    auth={auth}
                  />
                )
            )}
        </ul>
      </div>
      <div className="top_place-list_InstagramtoYoutube">
        <section>
          <div className="count">Count : {countYt}</div>
          <div className="title">Youtube Section</div>
          {auth.userId === creatorValue && (
            <button onClick={() => startAllWorkHandler("Yt")}>Start All</button>
          )}
          {auth.userId !== creatorValue && <p>&emsp;&emsp;&emsp;</p>}
        </section>
        <ul className="place-list_InstagramtoYoutube">
          {!isLoading &&
            props.items.map(
              (place) =>
                place.uploadCategory === "InstagramtoYoutube" && (
                  <PlaceItem
                    key={place.id}
                    id={place.id}
                    title={place.title}
                    description={place.description}
                    btnStatus={place.btnStatus}
                    creatorId={place.creator}
                    onDelete={props.onDeletePlace}
                    auth={auth}
                  />
                )
            )}
        </ul>
      </div>
    </>
  );
};

export default PlaceList;
