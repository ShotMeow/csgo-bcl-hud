import React from "react";
import CameraContainer from "../Camera/Container";
import PlayerCamera from "./../Camera/Camera";
import * as I from "csgogsi-socket";

import { avatars } from "./../../api/avatars";

import TAvatar from "../../assets/bcl/t.png";
import CTAvatar from "../../assets/bcl/ct.png";

interface IProps {
  steamid: string;
  slot?: number;
  height?: number;
  width?: number;
  showSkull?: boolean;
  showCam?: boolean;
  player: I.Player;
  sidePlayer?: boolean;
}
export default class Avatar extends React.Component<IProps> {
  render() {
    const { showCam, steamid, player, width, height, showSkull, sidePlayer } =
      this.props;
    //const url = avatars.filter(avatar => avatar.steamid === this.props.steamid)[0];
    const avatarData = avatars[this.props.steamid];
    if (!avatarData || !avatarData.url) {
      return null;
    }

    return (
      <div className={`avatar`}>
        {showCam ? (
          sidePlayer ? (
            <div className="videofeed">
              <PlayerCamera steamid={steamid} visible={true} />
            </div>
          ) : (
            <CameraContainer observedSteamid={steamid} />
          )
        ) : null}
        {player.avatar ? (
          <img
            src={avatarData.url}
            height={height}
            width={width}
            alt={"Avatar"}
          />
        ) : player.team.side === "CT" ? (
          <img
            className="no-avatar"
            src={CTAvatar}
            height={height}
            width={width}
            alt={"Avatar"}
          />
        ) : (
          <img
            className="no-avatar"
            src={TAvatar}
            height={height}
            width={width}
            alt={"Avatar"}
          />
        )}
      </div>
    );
  }
}
