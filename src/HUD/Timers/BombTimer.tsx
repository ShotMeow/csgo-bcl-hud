import React from "react";

import * as I from "csgogsi-socket";

import { GSI } from "./../../App";
import BombTimer from "./Countdown";
import { ReactComponent as BombIcon } from "../../assets/weapons/c4.svg";

export default class Bomb extends React.Component<
  { isPlanted: boolean | null; bomb: I.Bomb | null },
  { width: number; show: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      width: 0,
      show: false,
    };
  }

  hide = () => {
    this.setState({ show: false, width: 100 });
  };
  componentDidMount() {
    const bomb = new BombTimer((time) => {
      let width = time > 40 ? 4000 : time * 100;
      this.setState({ width: width / 40 });
    });
    bomb.onReset(this.hide);
    GSI.on("data", (data) => {
      if (data.bomb && data.bomb.countdown) {
        if (data.bomb.state === "planted") {
          this.setState({ show: true });
          return bomb.go(data.bomb.countdown);
        }
        if (data.bomb.state !== "defusing") {
          this.hide();
        }
      } else {
        this.hide();
      }
    });
  }

  render() {
    const { isPlanted, bomb } = this.props;
    return (
      <div className={`plant-bar ${!isPlanted ? "hide" : ""}`}>
        <BombIcon />
        <div className="indicator">
          <div
            className="stripe"
            style={{ width: `${100 - this.state.width}%` }}
          />
        </div>
      </div>
    );
  }
}
