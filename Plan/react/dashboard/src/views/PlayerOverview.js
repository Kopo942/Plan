import React from "react";
import {Card, Col, Row} from "react-bootstrap-v5";
import {FontAwesomeIcon as Fa} from "@fortawesome/react-fontawesome";
import {faAddressBook, faCalendar, faCalendarCheck, faClock} from "@fortawesome/free-regular-svg-icons";
import {
    faBookOpen,
    faBraille,
    faCircle,
    faCrosshairs,
    faGavel,
    faGlobe,
    faServer,
    faSignal,
    faSignature,
    faSkull,
    faUser,
    faUserPlus,
    faWifi
} from "@fortawesome/free-solid-svg-icons";
import {faSuperpowers} from "@fortawesome/free-brands-svg-icons";
import Scrollable from "../components/Scrollable";
import PunchCard from "../components/graphs/PunchCard";
import Datapoint from "../components/Datapoint";

const Header = ({player}) => (
    <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
            {player.info.name} &middot; Player Overview
        </h1>
    </div>
);

const PlayerOverviewCard = ({player}) => (
    <Card>
        <Card.Header>
            <h6 className="col-black">
                <Fa icon={faAddressBook}/> {player.info.name}
            </h6>
        </Card.Header>
        <Card.Body>
            <Row>
                <Col lg={4}>
                    <p>
                        <Fa icon={faCircle} className={player.info.online ? "col-green" : "col-red"}/>
                        {player.info.online ? ' Online' : ' Offline'}
                    </p>
                    {player.info.operator ? <p><Fa icon={faSuperpowers} className="col-blue"/> Operator</p> : ''}
                    <p><Fa icon={faGavel} className="col-brown"/> Times Kicked: {player.info.kick_count}</p>
                </Col>
                <Col lg={4}>
                    <img className="rounded mx-auto d-block"
                         alt="player head image"
                         src={`https://cravatar.eu/helmavatar/${player.info.name}/120.png`}/>
                </Col>
                <Col lg={4}>
                    <p><Fa icon={faCrosshairs} className="col-red"/> Player Kills: {player.info.player_kill_count}</p>
                    <p><Fa icon={faCrosshairs} className="col-green"/> Mob Kills: {player.info.mob_kill_count}</p>
                    <p><Fa icon={faSkull}/> Deaths: {player.info.death_count}</p>
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col lg={6}>
                    <Datapoint
                        icon={faClock} color="green"
                        name="Total Playtime" value={player.info.playtime}
                    />
                    <Datapoint
                        icon={faClock} color="green"
                        name="Total Active" value={player.info.active_playtime}
                    />
                    <Datapoint
                        icon={faClock} color="grey"
                        name="Total AFK" value={player.info.afk_time}
                    />
                    <hr/>
                    <Datapoint
                        icon={faCalendarCheck} color="teal"
                        name="Sessions" value={player.info.session_count} bold
                    />
                    <Datapoint
                        icon={faClock} color="teal"
                        name="Longest Session" value={player.info.longest_session_length}
                    />
                    <Datapoint
                        icon={faClock} color="teal"
                        name="Session Median" value={player.info.session_median}
                    />
                    <hr/>
                    <Datapoint
                        icon={faUserPlus} color="light-green"
                        name="Registered" value={player.info.registered} boldTitle
                    />
                </Col>
                <Col lg={6}>
                    <Datapoint
                        icon={faUser} color="amber"
                        name="Activity Index"
                        value={player.info.activity_index} bold
                        valueLabel={player.info.activity_index_group}
                    />
                    <Datapoint
                        icon={faServer} color="light-green"
                        name="Favorite server" value={player.info.favorite_server}
                    />
                    <p>&nbsp;</p>
                    <hr/>
                    <Datapoint
                        icon={faSignal} color="amber"
                        name="Average Ping" value={player.info.average_ping}
                    />
                    <Datapoint
                        icon={faSignal} color="amber"
                        name="Best Ping" value={player.info.best_ping}
                    />
                    <Datapoint
                        icon={faSignal} color="amber"
                        name="Worst Ping" value={player.info.worst_ping}
                    />
                    <hr/>
                    <Datapoint
                        icon={faCalendar} color="teal"
                        name="Registered" value={player.info.last_seen} boldTitle
                    />
                </Col>
            </Row>
        </Card.Body>
    </Card>
)

const NicknamesCard = ({player}) => (
    <Card>
        <Card.Header>
            <h6 className="col-black">
                <Fa icon={faSignature}/> Seen Nicknames
            </h6>
        </Card.Header>
        <Scrollable>
            <table className="table table-striped mb-0">
                <thead className="bg-purple">
                <tr>
                    <th><Fa icon={faSignature}/> Nickname</th>
                    <th><Fa icon={faServer}/> Server</th>
                    <th><Fa icon={faClock}/> Last Seen</th>
                </tr>
                </thead>
                <tbody>
                {player.nicknames.map((nickname, i) => (<tr key={'nick-' + i}>
                    <td>{nickname.nickname}</td>
                    <td>{nickname.server}</td>
                    <td>{nickname.date}</td>
                </tr>))}
                </tbody>
            </table>
        </Scrollable>
    </Card>
)

const ConnectionsCard = ({player}) => (
    <Card>
        <Card.Header>
            <h6 className="col-black">
                <Fa icon={faWifi}/> Connection Information
            </h6>
        </Card.Header>
        <Scrollable>
            <table className="table table-striped mb-0">
                <thead className="bg-green">
                <tr>
                    <th><Fa icon={faGlobe}/> Country</th>
                    <th><Fa icon={faClock}/> Last Connected</th>
                </tr>
                </thead>
                <tbody>
                {player.connections.map((connection, i) => (<tr key={'connection-' + i}>
                    <td>{connection.geolocation}</td>
                    <td>{connection.date}</td>
                </tr>))}
                </tbody>
            </table>
        </Scrollable>
    </Card>
)

const PunchCardCard = ({player}) => (
    <Card>
        <Card.Header>
            <h6 className="col-black">
                <Fa icon={faBraille}/> Punchcard
            </h6>
        </Card.Header>
        <PunchCard series={player.punchcard_series}/>
    </Card>
)

const OnlineActivityCard = ({player}) => (
    <Card>
        <Card.Header>
            <h6 className="col-black">
                <Fa icon={faBookOpen}/> Online Activity
            </h6>
        </Card.Header>
        <table className="table" id="data_online_activity">
            <thead>
            <th/>
            <th>Last 30 days</th>
            <th>Last 7 days</th>
            </thead>
            <tbody>
            <tr>
                <td><Fa icon={faClock} className="col-green"/> Playtime</td>
                <td>{player.online_activity.playtime_30d}</td>
                <td>{player.online_activity.playtime_7d}</td>
            </tr>
            <tr>
                <td><Fa icon={faClock} className="col-green"/> Active Playtime</td>
                <td>{player.online_activity.active_playtime_30d}</td>
                <td>{player.online_activity.active_playtime_7d}</td>
            </tr>
            <tr>
                <td><Fa icon={faClock} className="col-grey"/> AFK Time</td>
                <td>{player.online_activity.afk_time_30d}</td>
                <td>{player.online_activity.afk_time_7d}</td>
            </tr>
            <tr>

                <td><Fa icon={faClock} className="col-teal"/> Median Session Length</td>
                <td>{player.online_activity.median_session_length_30d}</td>
                <td>{player.online_activity.median_session_length_7d}</td>
            </tr>
            <tr>
                <td><Fa icon={faCalendarCheck} className="col-teal"/> Sessions</td>
                <td>{player.online_activity.session_count_30d}</td>
                <td>{player.online_activity.session_count_7d}</td>
            </tr>
            <tr>
                <td><Fa icon={faCrosshairs} className="col-red"/> Player Kills</td>
                <td>{player.online_activity.player_kill_count_30d}</td>
                <td>{player.online_activity.player_kill_count_7d}</td>
            </tr>
            <tr>
                <td><Fa icon={faCrosshairs} className="col-green"/> Mob Kills</td>
                <td>{player.online_activity.mob_kill_count_30d}</td>
                <td>{player.online_activity.mob_kill_count_7d}</td>
            </tr>
            <tr>
                <td><Fa icon={faSkull} className="col-black"/> Deaths</td>
                <td>{player.online_activity.death_count_30d}</td>
                <td>{player.online_activity.death_count_7d}</td>
            </tr>
            </tbody>
        </table>
    </Card>
)

const PlayerOverview = ({player}) => {
    return (
        <section className="player_overview">
            <Header player={player}/>
            <Row>
                <Col lg={6}>
                    <PlayerOverviewCard player={player}/>
                    <NicknamesCard player={player}/>
                    <ConnectionsCard player={player}/>
                </Col>
                <Col lg={6}>
                    <PunchCardCard player={player}/>
                    <OnlineActivityCard player={player}/>
                </Col>
            </Row>
        </section>
    )
}

export default PlayerOverview;