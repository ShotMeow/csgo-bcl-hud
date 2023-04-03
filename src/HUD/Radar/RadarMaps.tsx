import React from "react";
import "./radar.scss";
import { Match, Veto } from "../../api/interfaces";
import { Map, CSGO, Team } from "csgogsi-socket";
import { actions } from "./../../App";
import Radar from "./Radar";
import TeamLogo from "../MatchBar/TeamLogo";

interface Props {
  match: Match | null;
  map: Map;
  game: CSGO;
  veto: Veto | null;
}
interface State {
  showRadar: boolean;
  radarSize: number;
  showBig: boolean;
}

export default class RadarMaps extends React.Component<Props, State> {
  state = {
    showRadar: true,
    radarSize: 350,
    showBig: false,
  };
  componentDidMount() {
    actions.on("radarBigger", () => this.radarChangeSize(20));
    actions.on("radarSmaller", () => this.radarChangeSize(-20));
    actions.on("toggleRadar", () => {
      this.setState((state) => ({ showRadar: !state.showRadar }));
    });

    actions.on("toggleRadarView", () => {
      this.setState({ showBig: !this.state.showBig });
    });
  }
  radarChangeSize = (delta: number) => {
    const newSize = this.state.radarSize + delta;
    this.setState({ radarSize: newSize > 0 ? newSize : this.state.radarSize });
  };
  render() {
    const { match } = this.props;
    const { radarSize, showBig, showRadar } = this.state;
    const size = showBig ? 600 : radarSize;
    return (
      <div
        id={`radar_maps_container`}
        className={`${!showRadar ? "hide" : ""} ${showBig ? "preview" : ""}`}
      >
        <div className="radar-component-container">
          <Radar radarSize={size} game={this.props.game} />
        </div>
        {match ? (
          <MapsBar
            match={this.props.match}
            map={this.props.map}
            game={this.props.game}
            veto={this.props.veto}
          />
        ) : null}
      </div>
    );
  }
}

class MapsBar extends React.PureComponent<Props> {
  render() {
    const { match, map, veto } = this.props;
    if (!match || !match.vetos.length) return "";
    const picks = match.vetos.filter(
      (veto) => veto.type !== "ban" && veto.mapName
    );
    return (
      <div id="maps_container">
        <MapEntry
          veto={veto}
          map={this.props.map}
          team={map.team_ct.id === veto?.teamId ? map.team_ct : map.team_t}
        />
      </div>
    );
  }
}

const getCurrentMap = (map: string) => {
  switch (map) {
    case "de_train":
      return "Train";
    case "de_mirage":
      return "Mirage";
    case "de_vertigo":
      return "Vertigo";
    case "de_cache":
      return "Cache";
    case "de_nuke":
      return "Nuke";
    case "de_inferno":
      return "Inferno";
    case "de_overpass":
      return "Overpass";
    case "de_dust2":
      return "Dust 2";
  }
};

class MapEntry extends React.PureComponent<{
  veto: Veto | null;
  map: Map;
  team: Team | null;
}> {
  render() {
    const { veto, map, team } = this.props;
    return (
      <div className="veto_entry">
        <div
          className={`map_name ${map.name.includes(map.name) ? "active" : ""}`}
        >
          Playing on {getCurrentMap(map.name)} | Picked by {team?.name}
        </div>
      </div>
    );
  }
}
