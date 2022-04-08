package hive;

public class LatLng {

  private static final long serialVersionUID = 1L;

  /** The latitude of this location. */
  public double latitude;

  /** The longitude of this location. */
  public double longitude;

  /**
   * Constructs a location with a latitudeitude/longitude pair.
   *
   * @param latitude The latitudeitude of this location.
   * @param longitude The longitude of this location.
   */
  public LatLng(double latitude, double longitude) {
    this.latitude = latitude % 90; // TODO ? 90
    this.longitude = longitude % 90;
  }
  public LatLng(LatLng other) {
    this.latitude=other.latitude;
    this.longitude=other.longitude;
  }

  /** Serialisation constructor. */
  public LatLng() {}

  @Override
  public String toString() {
    return toUrlValue();
  }

  public String toUrlValue() {
    // Enforce Locale to English for double to string conversion
    return String.format("%.8f,%.8f", latitude, longitude);
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    LatLng latitudelongitude = (LatLng) o;
    return Double.compare(latitudelongitude.latitude, latitude) == 0 && Double.compare(latitudelongitude.longitude, longitude) == 0;
  }

}
