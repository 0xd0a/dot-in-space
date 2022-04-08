package hive;

class UniverseObject {
  public int id=0;  // Refernce to Database ID (DotWrapper.id)
  public LatLng currentP;
  public LatLng previousP;
  public LatLng P1; // define arc with two points and hence direction is from
  public LatLng P2; // point1 to point2
  public Float speed=0f;
  public long started=0;
  public long elapsed=0;
  public Integer busyWith=null;
}
