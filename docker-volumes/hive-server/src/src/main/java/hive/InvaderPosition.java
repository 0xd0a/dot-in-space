package hive;

import net.sf.geographiclib.Geodesic;
import net.sf.geographiclib.GeodesicData;
import net.sf.geographiclib.GeodesicLine;
import net.sf.geographiclib.GeodesicMask;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.Math;

/*
 *
 * Class to manipulate UniverseObject on the orbit supplied by
 * uo.P1 and uo.P2
 * Change of direction should be accompanied by a re-run of
 * SetupGreatCircle()
 *
 */

public class InvaderPosition  {

    boolean isMoving=false;
    long lastCalled;
    GeodesicLine line;
    double arclength=0;
    int counter=0;
    UniverseObject uo;

    public InvaderPosition(UniverseObject uo) {
      this.uo=uo;
      this.uo.speed=this.uo.speed==0?1000:this.uo.speed;
      System.out.println("Elapsed for dot "+uo.id+" is "+uo.elapsed);
      isMoving=true;
      lastCalled=System.currentTimeMillis();

      SetupGreatCircle();
    }

    public void SetupGreatCircle() {
      // Latitude and longitude can't be over 90 deg

        line = Geodesic.WGS84.InverseLine(this.uo.P1.latitude, this.uo.P1.longitude,
                                          this.uo.P2.latitude, this.uo.P2.longitude,
                GeodesicMask.DISTANCE_IN |
                        GeodesicMask.LATITUDE |
                        GeodesicMask.LONGITUDE);

        GeodesicData d=line.ArcPosition(180);
        arclength=d.s12;
    }

    public void Reset() {
        isMoving=false;
    }

    public void changeDirection() {
      // random for now

      this.uo.P1=getPosition();
      this.uo.P2=new LatLng(Math.random()*180-90,Math.random()*180-90);
      this.uo.elapsed=0;

      this.uo.started=System.currentTimeMillis();
      SetupGreatCircle();
    }

    public void changeDirectionTo(LatLng PP) {
      // random for now

      this.uo.P1=getPosition();
      this.uo.P2=PP;
      this.uo.elapsed=0;

      this.uo.started=System.currentTimeMillis();
      SetupGreatCircle();
    }


    public LatLng getPosition() {
        // process position according to the time from the start
        if(isMoving) {
          //System.out.println("getPosition: UniverseObject value "+uo+".");

          /*counter++;
          if(counter>1000) {
            counter=0;
            changeDirection();
          }*/
          long currentTime=System.currentTimeMillis();

          // what has been covered before the data was received by the app + how much
          // time passed since the app started
          long sincelastRun = currentTime-lastCalled; // timediff since last run
          //long elapsed=(currentTime-startedTime);//+timeCovered;
          uo.elapsed+=sincelastRun;

          // the total time*speed/1000 is the distance
          GeodesicData pos = line.Position(uo.speed*uo.elapsed/1000,
                  GeodesicMask.LATITUDE | GeodesicMask.LONGITUDE);
          uo.previousP=uo.currentP;
          uo.currentP=new LatLng(pos.lat2,pos.lon2);

          lastCalled=currentTime;
        }
        return uo.currentP;
    }

}
