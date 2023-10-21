import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceForm.css";

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const history = useHistory();
  const instagramCaptions = useRef();
  const reelsDownloadedDeletes = useRef();
  const uploadCategory = useRef();
  const channelCategory = useRef();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      userProfileUrl: {
        value: "",
        isValid: false,
      },
      instagramUsername: {
        value: "",
        isValid: false,
      },
      instagramPassword: {
        value: "",
        isValid: false,
      },
      uploadCategory: {
        value: "",
        isValid: false,
      },
      channelCategory: {
        value: "",
        isValid: false,
      },
      instagramCaption: {
        value: "",
        isValid: false,
      },
      reelsDownloadedDelete: {
        value: "",
        isValid: false,
      },

    },
    false
  );




  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            userProfileUrl: {
              value: responseData.place.userProfileUrl,
              isValid: true,
            },
            instagramUsername: {
              value: responseData.place.instagramUsername,
              isValid: true,
            },
            instagramPassword: {
              value: responseData.place.instagramPassword,
              isValid: true,
            },
            instagramCaption: {
              value: responseData.place.instagramCaption,
              isValid: true,
            },
            reelsDownloadedDelete: {
              value: responseData.place.reelsDownloadedDelete,
              isValid: true,
            },
            uploadCategory: {
              value: uploadCategory.current.value,
              isValid: true,
            },
            channelCategory: {
              value: channelCategory.current.value,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          userProfileUrl: formState.inputs.userProfileUrl.value,
          instagramUsername: formState.inputs.instagramUsername.value,
          instagramPassword : formState.inputs.instagramPassword.value,
          instagramCaption : instagramCaptions.current.value,
          uploadCategory : uploadCategory.current.value,
          channelCategory : channelCategory.current.value,
          reelsDownloadedDelete : reelsDownloadedDeletes.current.value
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/" + auth.userId + "/places");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          
          <Input
            id="instagramUsername"
            element="input"
            type="text"
            label="Instagram Username"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.instagramUsername}
            initialValid={true}
          />
          <Input
            id="instagramPassword"
            element="input"
            type="text"
            label="Instagram Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.instagramPassword}
            initialValid={true}
          />
          <Input
            id="userProfileUrl"
            element="text"
            label="User Profile Url"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a user Profile Url."
            onInput={inputHandler}
            initialValue={loadedPlace.userProfileUrl}
            initialValid={true}
          />
          <div className={"form-control"}>
          <label>Select Upload Category</label>
          <select ref={uploadCategory} defaultValue={loadedPlace.uploadCategory}>
            <option value="InstagramtoInstagram">Instagram to Instagram</option>
            <option value="InstagramtoYoutube">Instagram to Youtube</option>
            <option value="YoutubetoInstagram">Youtube to Instagram</option>
            <option value="YoutubetoYoutube">Youtube to Youtube</option>
          </select>

          <label>Select Channel Category</label>
          <select ref={channelCategory} defaultValue={loadedPlace.channelCategory}>
            <option value="all">All</option>
            <option value="music">Music</option>
            <option value="gaming">Gaming</option>
            <option value="movies">Movies</option>
            <option value="news">News</option>
            <option value="sports">Sports</option>
            <option value="comedy">Comedy</option>
            <option value="howtostyle">Howto & Style</option>
            <option value="scienceandtechnology">Science & Technology</option>
            <option value="educationa">Education</option>
            <option value="entertainment">Entertainment</option>
            <option value="autosandvehicles">Autos & Vehicles</option>
            <option value="travelandevents">Travel & Events</option>
            <option value="petsandanimals">Pets & Animals</option>
          </select>

            <label htmlFor="instagramCaption">Instagram Caption (Default Set Automatically)</label>
            <input
              type="text"
              id="instagramCaption"
              ref={instagramCaptions}
              defaultValue={loadedPlace.instagramCaption}
            />
            <label htmlFor="reelsDownloadedDelete">
              Reels Downloaded Delete (Default Yes)
            </label>
            <input
              type="text"
              id="reelsDownloadedDelete"
              ref={reelsDownloadedDeletes}
              defaultValue={loadedPlace.reelsDownloadedDelete}
            />
          </div>

          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
