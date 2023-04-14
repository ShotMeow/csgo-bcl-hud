import React from "react";
import TeamBox from "./../Players/TeamBox";
import MatchBar from "../MatchBar/MatchBar";
import SeriesBox from "../MatchBar/SeriesBox";
import Observed from "./../Players/Observed";
import { CSGO, Round, RoundInfo, Team } from "csgogsi-socket";
import {Match, Player} from "../../api/interfaces";
import RadarMaps from "./../Radar/RadarMaps";
import Trivia from "../Trivia/Trivia";
import SideBox from "../SideBoxes/SideBox";
import { GSI, actions } from "../../App";
import MoneyBox from "../SideBoxes/Money";
import UtilityLevel from "../SideBoxes/UtilityLevel";
import Killfeed from "../Killfeed/Killfeed";
import MapSeries from "../MapSeries/MapSeries";
import Overview from "../Overview/Overview";
import Tournament from "../Tournament/Tournament";
import Pause from "../PauseTimeout/Pause";
import Timeout from "../PauseTimeout/Timeout";
import TAvatar from "../../assets/bcl/t.png";
import CTAvatar from "../../assets/bcl/ct.png";

import { ReactComponent as DeathIcon } from "../../assets/bcl/death_icon.svg";
import { ReactComponent as DefuseIcon } from "../../assets/images/icon_defuse_default.svg";
import { ReactComponent as BombIcon } from "../../assets/weapons/c4.svg";
import player from "../Players/Player";
import * as I from 'csgogsi-socket';
import {LogoCT, LogoT} from "../../assets/Icons";

interface Props {
  game: CSGO;
  match: Match | null;
}

interface State {
  winner: Team | null;
  showWin: boolean;
  forceHide: boolean;
  mvpPlayer: I.Player | null;
  tabActive: boolean;
}

const getRound = (round: number | undefined) => {
  switch (round) {
    case 5:
      return round;
    case 10:
      return round;
    case 15:
      return round;
    case 20:
      return round;
    case 25:
      return round;
    case 30:
      return round;
    default:
      return;
  }
};

export default class Layout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      winner: null,
      showWin: false,
      forceHide: false,
      mvpPlayer: null,
      tabActive: false
    };
  }

  componentDidMount() {
    GSI.on("roundEnd", (score) => {
      this.setState({ winner: score.winner, showWin: true }, () => {
        setTimeout(() => {
          this.setState({ showWin: false });
        }, 4000);
      });
    });
    actions.on("boxesState", (state: string) => {
      if (state === "show") {
        this.setState({ forceHide: false });
      } else if (state === "hide") {
        this.setState({ forceHide: true });
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === "Tab") {
        this.setState({tabActive: true})
      }
    })

    document.addEventListener('keyup', (event) => {
      if (this.state.tabActive) {
        this.setState({tabActive: false})
      }
    })
  }

  getVeto = () => {
    const { game, match } = this.props;
    const { map } = game;
    if (!match) return null;
    const mapName = map.name.substring(map.name.lastIndexOf("/") + 1);
    const veto = match.vetos.find((veto) => veto.mapName === mapName);
    if (!veto) return null;
    return veto;
  };

  render() {
    const { game, match } = this.props;
    const left =
      game.map.team_ct.orientation === "left"
        ? game.map.team_ct
        : game.map.team_t;
    const right =
      game.map.team_ct.orientation === "left"
        ? game.map.team_t
        : game.map.team_ct;

    const leftPlayers = game.players.filter(
      (player) => player.team.side === left.side
    );
    const rightPlayers = game.players.filter(
      (player) => player.team.side === right.side
    );
    const isFreezetime =
      (game.round && game.round.phase === "freezetime") ||
      game.phase_countdowns.phase === "freezetime";
    const { forceHide } = this.state;

    const roundsArr: Partial<RoundInfo>[] = [];
    game.map.rounds.forEach((round) => roundsArr.push(round));

    for (let i = roundsArr.length + 1; i < 31; i++) {
      roundsArr.push({
        round: i,
      });
    }

    if (!this.state.mvpPlayer) {
      const mvpPlayer = game.players.find((player) => player.state.round_kills >= 3);

      if (mvpPlayer) {
        this.setState({mvpPlayer: mvpPlayer});
      }
    }

    return (
      <div className={`layout ${isFreezetime ? "freeze" : ""}`}>
        <div className={`players_alive`}>
          <div className="title_container">Живых игроков</div>
          <div className="counter_container">
            <div className={`team_counter ${left.side}`}>
              {leftPlayers.filter((player) => player.state.health > 0).length}
            </div>
            <div className={`vs_counter`}>VS</div>
            <div className={`team_counter ${right.side}`}>
              {rightPlayers.filter((player) => player.state.health > 0).length}
            </div>
          </div>
        </div>
        {this.state.tabActive && <div>gsgd</div>}
          <div className={`mvp-player ${this.state.mvpPlayer?.team.side === "CT" ? "CT" : 'T'} ${isFreezetime && this.state.mvpPlayer ? 'show' : 'hidden'}`}>
            <img className="mvp-team" src={this.state.mvpPlayer?.team.logo || ''} alt="Team Logo" />
            <img className="mvp-avatar" src={this.state.mvpPlayer?.avatar ? this.state.mvpPlayer.avatar : this.state.mvpPlayer?.team.side === "CT" ? CTAvatar : TAvatar} alt="Avatar" />
            <div className="mvp-name">{this.state.mvpPlayer?.name}</div>
            <div className="mvp-info">
              <div className="mvp-stats-title">Статистика в {game.map.round} раунде</div>
              <div className="mvp-stats">
                <div>
                  <div>Damage</div>
                  <span>{this.state.mvpPlayer?.state.round_totaldmg}</span>
                </div>
                <div>
                  <div>Kills</div>
                  <span>{this.state.mvpPlayer?.state.round_kills}</span>
                </div>
                <div>
                  <div>ADR</div>
                  <span>{this.state.mvpPlayer?.state.adr}</span>
                </div>
                <div>
                  <div>%HS</div>
                  <span>{this.state.mvpPlayer?.state.round_killhs}</span>
                </div>
              </div>
            </div>
          </div>
        <Killfeed />
        {/* <Overview match={match} map={game.map} players={game.players || []} /> */}
        <RadarMaps
          veto={this.getVeto()}
          match={match}
          map={game.map}
          game={game}
        />
        <MatchBar
            isMvpPlayer={Boolean(this.state.mvpPlayer)}
          isFreezeTime={isFreezetime}
          map={game.map}
          phase={game.phase_countdowns}
          bomb={game.bomb}
          match={match}
        />
        <div className={`rounds-result ${!isFreezetime || this.state.mvpPlayer ? "hide" : ""}`}>
          {roundsArr.map((round) => (
            <div key={round.round} className="round">
              {round.outcome && (
                <div className="icon">
                  {round.outcome === "ct_win_elimination" ||
                  round.outcome === "t_win_elimination" ? (
                    <DeathIcon />
                  ) : round.outcome === "ct_win_defuse" ? (
                    <DefuseIcon />
                  ) : (
                    <BombIcon />
                  )}
                </div>
              )}
              <div
                className={`block ${
                  round.side === "CT" ? "CT" : round.side === "T" ? "T" : ""
                }`}
              >
                <div className="block-top" />
                <span>{getRound(round.round)}</span>
              </div>
            </div>
          ))}
        </div>
        {/* <Pause phase={game.phase_countdowns} /> */}
        {/* <Timeout map={game.map} phase={game.phase_countdowns} /> */}
        {/* <SeriesBox map={game.map} phase={game.phase_countdowns} match={match} /> */}

        <Tournament />

        <Observed
          player={game.player}
          veto={this.getVeto()}
          round={game.map.round + 1}
        />

        <TeamBox
          team={left}
          players={leftPlayers}
          side="left"
          current={game.player}
        />
        <TeamBox
          team={right}
          players={rightPlayers}
          side="right"
          current={game.player}
        />

        <Trivia />

        <MapSeries
          teams={[left, right]}
          match={match}
          isFreezetime={isFreezetime}
          map={game.map}
        />
        <div className={"boxes left"}>
          <UtilityLevel
            side={left.side}
            players={game.players}
            show={isFreezetime && !forceHide}
          />
          <SideBox side="left" hide={forceHide} />
          <MoneyBox
            team={left.side}
            side="left"
            loss={Math.min(left.consecutive_round_losses * 500 + 1400, 3400)}
            equipment={leftPlayers
              .map((player) => player.state.equip_value)
              .reduce((pre, now) => pre + now, 0)}
            money={leftPlayers
              .map((player) => player.state.money)
              .reduce((pre, now) => pre + now, 0)}
            show={isFreezetime && !forceHide}
          />
        </div>
        <div className={"boxes right"}>
          <UtilityLevel
            side={right.side}
            players={game.players}
            show={isFreezetime && !forceHide}
          />
          <SideBox side="right" hide={forceHide} />
          <MoneyBox
            team={right.side}
            side="right"
            loss={Math.min(right.consecutive_round_losses * 500 + 1400, 3400)}
            equipment={rightPlayers
              .map((player) => player.state.equip_value)
              .reduce((pre, now) => pre + now, 0)}
            money={rightPlayers
              .map((player) => player.state.money)
              .reduce((pre, now) => pre + now, 0)}
            show={isFreezetime && !forceHide}
          />
        </div>
      </div>
    );
  }
}
