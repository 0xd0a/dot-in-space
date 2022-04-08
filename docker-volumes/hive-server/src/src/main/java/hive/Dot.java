package hive;

import java.util.ArrayList;

class Dot {
  public ArrayList<Float> x;
  public int id=0;  // Refernce to Database ID
  public LatLng P1; // define arc with two points and hence direction is from
  public LatLng P2; // point1 to point2
  public Float speed=0f;
  public long started=0;
  public String dot_name="";
  public int status=0;
  public ArrayList<Integer> collidedWith=new ArrayList<Integer>();

  public Dot() {}
  public void addCollision(int dot_id) {
    if(!didCollideWith(dot_id))
      collidedWith.add(dot_id);
  }
  public boolean didCollideWith(int dot_id) {
    for(int i=0;i<collidedWith.size();i++) {
      Integer d=collidedWith.get(i);
      if(d==dot_id) return true;
    }
    return false;
  }
}
