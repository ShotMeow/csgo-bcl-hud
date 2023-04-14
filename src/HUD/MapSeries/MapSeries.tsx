import React from "react";
import * as I from "csgogsi-socket";
import { Match, Veto } from '../../api/interfaces';
import TeamLogo from "../MatchBar/TeamLogo";
import "./mapseries.scss";
import trainIcon from "../../assets/maps/train_icon.png";
import mirageIcon from "../../assets/maps/mirage_icon.png";
import vertigoIcon from "../../assets/maps/vertigo_icon.png";
import cacheIcon from "../../assets/maps/cache_icon.png";
import nukeIcon from "../../assets/maps/nuke_icon.png";
import infernoIcon from "../../assets/maps/inferno_icon.png";
import overpassIcon from "../../assets/maps/overpass_icon.png";
import dustIcon from "../../assets/maps/dust_icon.png";

import trainImage from "../../assets/maps/train.jpg";
import mirageImage from "../../assets/maps/mirage.jpg";
import vertigoImage from "../../assets/maps/vertigo.jpg";
import cacheImage from "../../assets/maps/cache.jpg";
import nukeImage from "../../assets/maps/nuke.jpg";
import infernoImage from "../../assets/maps/inferno.jpg";
import overpassImage from "../../assets/maps/overpass.jpg";
import dustImage from "../../assets/maps/dust.jpg";

interface IProps {
    match: Match | null;
    teams: I.Team[];
    isFreezetime: boolean;
    map: I.Map
}

interface IVetoProps {
    veto: Veto;
    teams: I.Team[];
    active: boolean;
}

const getMapImage = (map: string) => {
    switch (map) {
        case "de_train":
            return trainImage;
        case "de_mirage":
            return mirageImage;
        case "de_vertigo":
            return vertigoImage;
        case "de_cache":
            return cacheImage;
        case "de_nuke":
            return nukeImage;
        case "de_inferno":
            return infernoImage;
        case "de_overpass":
            return overpassImage;
        case "de_dust2":
            return dustImage;
    }
}

const getMapIcon = (map: string) => {
    switch (map) {
        case "de_train":
            return trainIcon;
        case "de_mirage":
            return mirageIcon;
        case "de_vertigo":
            return vertigoIcon;
        case "de_cache":
            return cacheIcon;
        case "de_nuke":
            return nukeIcon;
        case "de_inferno":
            return infernoIcon;
        case "de_overpass":
            return overpassIcon;
        case "de_dust2":
            return dustIcon;
    }
}

class VetoEntry extends React.Component<IVetoProps> {
    render(){
        const { veto, teams, active } = this.props;
        return <div className={`veto_container ${active ? 'active' : ''}`}>
            <div className="veto_map_name">
                <img src={getMapIcon(veto.mapName)} alt="Map" />
            </div>
            <div className="veto_picker">
                <TeamLogo team={teams.filter(team => team.id === veto.teamId)[0]} />
            </div>
            <div className="veto_score">
                <img className="map-image" src={getMapImage(veto.mapName)} alt="Map Image" />
                <div className="score">
                    <TeamLogo team={teams[0]} />
                    {Object.values((veto.score || ['-','-'])).sort().join(":")}
                    <TeamLogo team={teams[1]} />
                </div>
                <div className='active_container'>
                    <div className='active'>Playing</div>
                </div>
            </div>
        </div>
    }
}

export default class MapSeries extends React.Component<IProps> {

    render() {
        const { match, teams, isFreezetime, map } = this.props;
        if (!match || !match.vetos.length) return null;
        return (
            <div className={`map_series_container ${isFreezetime && map.round % 10 === 0 ? 'show': 'hide'}`}>
                <div className="title_bar">
                    <div className="map">Map</div>
                    <div className="picked">Pick</div>
                    <div className="score">Score</div>
                </div>
                {match.vetos.filter(veto => veto.type !== "ban").map(veto => {
                    if(!veto.mapName) return null;
                    return <VetoEntry key={`${match.id}${veto.mapName}${veto.teamId}${veto.side}`} veto={veto} teams={teams} active={map.name.includes(veto.mapName)}/>
                })}
            </div>
        );
    }
}
