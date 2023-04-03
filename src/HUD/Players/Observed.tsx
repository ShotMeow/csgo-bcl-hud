import React from "react";
import { Player } from "csgogsi-socket";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import TeamLogo from "./../MatchBar/TeamLogo";
import "./observed.scss";

import armorSrc from "../../assets/armor.png";
import healthSrc from "../../assets/health.png";

import { getCountry } from "./../countries";
import {
  ArmorHelmet,
  ArmorFull,
  HealthFull,
  Bullets,
  ArmorHalf,
} from "./../../assets/Icons";
import { Veto } from "../../api/interfaces";
import { actions } from "../../App";
import Defuse from "../Indicators/Defuse";
import Bomb from "../Indicators/Bomb";
import Armor from "../Indicators/Armor";

class Statistic extends React.PureComponent<{
  label: string;
  value: string | number;
}> {
  render() {
    return (
      <div className="stat">
        <div className="label">{this.props.label}</div>
        <div className="value">{this.props.value}</div>
      </div>
    );
  }
}

export default class Observed extends React.Component<
  { player: Player | null; veto: Veto | null; round: number },
  { showCam: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      showCam: true,
    };
  }
  componentDidMount() {
    actions.on("toggleCams", () => {
      console.log(this.state.showCam);
      this.setState({ showCam: !this.state.showCam });
    });
  }
  getAdr = () => {
    const { veto, player } = this.props;
    if (!player || !veto || !veto.rounds) return null;
    const damageInRounds = veto.rounds
      .map((round) => round.players[player.steamid])
      .filter((data) => !!data)
      .map((roundData) => roundData.damage);
    return damageInRounds.reduce((a, b) => a + b, 0) / (this.props.round - 1);
  };
  render() {
    if (!this.props.player) return "";
    const { player } = this.props;
    const country = player.country || player.team.country;
    const weapons = Object.values(player.weapons).map((weapon) => ({
      ...weapon,
      name: weapon.name.replace("weapon_", ""),
    }));
    const currentWeapon = weapons.filter(
      (weapon) => weapon.state === "active"
    )[0];
    const grenades = weapons.filter((weapon) => weapon.type === "Grenade");
    const { stats } = player;
    const ratio = stats.deaths === 0 ? stats.kills : stats.kills / stats.deaths;
    const countryName = country ? getCountry(country) : null;
    return (
      <div className={`observed ${player.team.side}`}>
        <div className="avatar-container">
          <Avatar
            player={player}
            steamid={player.steamid}
            height={140}
            width={140}
            showCam={this.state.showCam}
            slot={player.observer_slot}
          />
          <div className="gradient" />
        </div>
        <div className="info">
          <div className="top">
            <div className="name">
              <TeamLogo team={player.team} height={35} width={35} />
              <div>{player?.name}</div>
            </div>
            <div className="utilities">
              <div className="main">
                <Bomb player={player} />
                <Defuse player={player} />
              </div>
              <div className="grenades">
                {grenades.map((grenade) => (
                  <React.Fragment
                    key={`${player.steamid}_${grenade.name}_${
                      grenade.ammo_reserve || 1
                    }`}
                  >
                    <Weapon
                      weapon={grenade.name}
                      active={grenade.state === "active"}
                      isGrenade
                    />
                    {grenade.ammo_reserve === 2 ? (
                      <Weapon
                        weapon={grenade.name}
                        active={grenade.state === "active"}
                        isGrenade
                      />
                    ) : null}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className="stats">
              <div className="health">
                <HealthFull />
                <span>{player?.state.health}</span>
              </div>
              <div className="armor">
                {player?.state.helmet ? <ArmorHelmet /> : <ArmorHalf />}
                <span>{player?.state.armor}</span>
              </div>
            </div>
            <div className="statistics">
              <Statistic label={"K"} value={stats.kills} />
              <Statistic label={"A"} value={stats.assists} />
              <Statistic label={"D"} value={stats.deaths} />
            </div>
            <div className="ammo">
              <div className="counter">
                <div className="ammo_clip">
                  {(currentWeapon && currentWeapon.ammo_clip) || "-"}
                </div>
                <div className="ammo_reserve">
                  / {(currentWeapon && currentWeapon.ammo_reserve) || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
