import React, { useContext, useRef } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceForm.css";

const NewPlace = () => {
  const instagramCaption = useRef();
  const reelsDownloadedDelete = useRef();
  const uploadCategory = useRef();
  const channelCategory = useRef();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
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
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("userProfileUrl", formState.inputs.userProfileUrl.value);
      formData.append(
        "instagramUsername",
        formState.inputs.instagramUsername.value
      );
      formData.append(
        "instagramPassword",
        formState.inputs.instagramPassword.value
      );
      formData.append("uploadCategory", uploadCategory.current.value);
      formData.append("channelCategory", channelCategory.current.value);
      formData.append("instagramCaption", instagramCaption.current.value);
      formData.append(
        "reelsDownloadedDelete",
        reelsDownloadedDelete.current.value
      );
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places`, "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });
      history.push("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="instagramUsername"
          element="input"
          type="text"
          label="Instagram Username"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="instagramPassword"
          element="input"
          type="text"
          label="Instagram Password"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="userProfileUrl"
          element="text"
          label="User Profile Url"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a user Profile Url."
          onInput={inputHandler}
        />
        <div className={"form-control"}>
          <label>Select Upload Category</label>
          <select ref={uploadCategory}>
            <option value="InstagramtoInstagram">Instagram to Instagram</option>
            <option value="InstagramtoYoutube">Instagram to Youtube</option>
            <option value="YoutubetoInstagram">Youtube to Instagram</option>
            <option value="YoutubetoYoutube">Youtube to Youtube</option>
          </select>

          <label>Select Channel Category</label>
          <select ref={channelCategory}>
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
            <option value="autosandvehicles">Autos & Vehicles</option>
            <option value="travelandevents">Travel & Events</option>
            <option value="petsandanimals">Pets & Animals</option>
          </select>


          <label htmlFor="instagramCaption">
            Instagram Caption (Default Set Automatically)
          </label>
          <input type="text" id="instagramCaption" ref={instagramCaption} />
          <label htmlFor="reelsDownloadedDelete">
            Reels Downloaded Delete (Default Yes)
          </label>
          <input
            type="text"
            id="reelsDownloadedDelete"
            ref={reelsDownloadedDelete}
          />
        </div>

        <Button type="submit" disabled={!formState.isValid}>
          ADD WORk
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
