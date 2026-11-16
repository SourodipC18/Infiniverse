import { BEACONS, CAUSEWAY, DOCK, CELL_HALF, distance, isLit, nearbyBeacon, wrapCoordinate, type Point, type Survey } from './island'

function mapPosition(point: Point) {
  const percent = (coordinate: number) => ((coordinate + CELL_HALF) / (2 * CELL_HALF)) * 100 + '%'
  return { left: percent(point.x), top: percent(point.z) }
}

export function SurveyHud({ survey, position, heading, activate }: {
  survey: Survey
  position: Point
  heading: number
  activate: () => void
}) {
  const count = BEACONS.filter((_, i) => isLit(survey, i)).length
  const nearby = nearbyBeacon(survey, position)
  const next = nearby >= 0 ? nearby : BEACONS.findIndex((_, i) => !isLit(survey, i))
  const target = next < 0 ? DOCK : BEACONS[next]
  const angle = Math.atan2(wrapCoordinate(target.x - position.x), wrapCoordinate(position.z - target.z)) - heading

  return <aside className="survey" aria-label="Island survey">
    <div className="survey-data">
      <div className="survey-progress" role="status">
        {survey.complete ? 'Survey complete' : `Beacons ${count} / ${BEACONS.length}`}
      </div>
      {!survey.complete && <div className="survey-target">
        <span aria-hidden="true" className="bearing" style={{ transform: `rotate(${angle}rad)` }}>↑</span>
        <span>{target.name}<small>{Math.round(distance(target, position))} m</small></span>
      </div>}
      {nearby >= 0 && <button className="activate" onClick={activate}>Activate beacon <kbd>E</kbd></button>}
      {!survey.complete && count === BEACONS.length && <small>Return to the dock</small>}
    </div>
    <div className="survey-map" aria-hidden="true">
      <span className="north">N</span>
      <i className="map-land" />
      <i className="map-causeway" style={mapPosition(CAUSEWAY)} />
      <i className="map-dock" style={mapPosition(DOCK)} />
      {BEACONS.map((beacon, index) => <i key={beacon.id} className="map-beacon"
        style={{ ...mapPosition(beacon), background: isLit(survey, index) ? '#77ffcb' : beacon.color }} />)}
      <i className="map-player" style={{ ...mapPosition(position), rotate: `${heading}rad` }} />
    </div>
  </aside>
}
