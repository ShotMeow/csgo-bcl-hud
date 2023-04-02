import React from "react";

class LossBox extends React.PureComponent<{
  active: boolean;
  side: "CT" | "T";
}> {
  render() {
    return (
      <div
        className={`loss-box ${this.props.side} ${
          this.props.active ? "active" : ""
        }`}
      ></div>
    );
  }
}

interface Props {
  side: "left" | "right";
  team: "CT" | "T";
  loss: number;
  equipment: number;
  money: number;
  show: boolean;
}

const getCurrentMoney = (money: number) => {
  const moneyArr = String(money).split("");
  if (String(money).length === 4) {
    moneyArr.splice(1, 0, " ");
  }

  if (String(money).length === 5) {
    moneyArr.splice(2, 0, " ").join("");
  }

  return moneyArr.join("");
};

export default class Money extends React.PureComponent<Props> {
  render() {
    return (
      <div
        className={`moneybox ${this.props.side} ${this.props.team} ${
          this.props.show ? "show" : "hide"
        }`}
      >
        <div className="money_container">
          <div className="title">Loss Bonus</div>
          <div className="value">{getCurrentMoney(this.props.loss)}$</div>
        </div>
        <div className="money_container">
          <div className="title">Team Money</div>
          <div className="value">{getCurrentMoney(this.props.money)}$</div>
        </div>
        <div className="money_container">
          <div className="title">Equipment</div>
          <div className="value">{getCurrentMoney(this.props.equipment)}$</div>
        </div>
      </div>
    );
  }
}
