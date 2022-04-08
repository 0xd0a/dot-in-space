package hive;

import net.sf.geographiclib.Geodesic;
import net.sf.geographiclib.GeodesicData;
import net.sf.geographiclib.GeodesicLine;
import net.sf.geographiclib.GeodesicMask;

import com.alibaba.fastjson.JSON;

import java.util.Timer;
import java.util.TimerTask;
import java.util.ArrayList;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.Map;
import java.util.Set;
import java.util.Iterator;
//import DB;
import java.util.Base64;

public class HiveBeginning {

  static int framerate=30;
  static int logSize=5; // seconds
  static int ATTRACTION_RADIUS=2000000;
  static int TOUCH_RADIUS=1000;
  // enumerate all the objects in the universe
  static ArrayList<UniverseObject> dots=new ArrayList<UniverseObject>();
  // create a list of flying dot-instances
  static ArrayList<InvaderPosition> inv=new ArrayList<InvaderPosition>();

  public static void updateDots () {
    System.out.println("checking on new dots");
    ArrayList<UniverseObject> dots_new=UniverseState.restoreState();
    // for each UniverseObject create a dot object and connect them
    for (UniverseObject uo_new : dots_new) {
      f: {
        for (UniverseObject uo_old: dots)
          if (uo_new.id== uo_old.id)
            break f;

        // if not found
        System.out.println("HiveBeginning: Adding previously unknown dot "+uo_new.id);
        dots.add(uo_new);
        inv.add(new InvaderPosition(uo_new));
      }// if found

    }

  }


  public static void main (String[] args) {
//    final Boolean isStarting=true;
    System.out.println("Starting the hive...");
    HiveOne.SaveState("initializing");
/*    DB db=DB.getDB();
    db.TestDB();
    try{
      db.closeConnection();
    }catch(Exception e) {System.out.println("Can't close connection");}
*/

    TimerTask getTask = new TimerTask() {
    @Override
    public void run() {
      try {

        // check sync every N(?) calls to add new dots
        if(dots.size()==0 || DotWrapper.getWrapper().checkSync()){
          updateDots();
        }
        UniverseState.backupState(dots); // backup the state

        long startTime=System.currentTimeMillis();
        long lastTime=startTime-1,currentTime=0;
        long duration=0;
        String accumulatedState="";
        String accumulatedState1="";
        String accumulatedState2="";
        ArrayList<String> accStateArray=new ArrayList<String>();
        ArrayList<String> accStateArray2=new ArrayList<String>();
        //ArrayList<ArrayList<String>> resultingAccState=new ArrayList<ArrayList<String>>();
        SortedMap<Integer, ArrayList<String>> resultingAccState=new TreeMap<Integer,ArrayList<String>>();
        int cycle=0;
        InvaderPosition i1=null,i2=null;

        for (int i=0;i<logSize*framerate;i++) {
          currentTime=System.currentTimeMillis();
          accStateArray=new ArrayList<String>();
          duration=currentTime-lastTime;
          for (int j = 0; j < inv.size(); j++)  {
            int id=inv.get(j).uo.id;
            LatLng currentPosition=inv.get(j).getPosition();
            //inv.setP2(currentPosition);
            String currentFrame=formatFrame(duration,currentPosition);
            //if(j>=resultingAccState.size()) resultingAccState.add(new ArrayList<String>());
            if(!resultingAccState.containsKey(id))
              resultingAccState.put(id,new ArrayList<String>());
            resultingAccState.get(id).add(currentFrame);
          }

          if (cycle>1) { // once every so many cycles % 500
            for (int j=0;j<inv.size();j++) {
              i1=inv.get(j);
              if(i1!=null){// && i1.uo.busyWith == null) {
                for (int k=0;k<inv.size();k++) {
                  i2=inv.get(k);
                  if(i2.uo.id==i1.uo.id) continue;
                  //if(i2.uo.busyWith==null) {
                    GeodesicData inverse=Geodesic.WGS84.Inverse(i1.uo.currentP.latitude,
                                            i1.uo.currentP.longitude,
                                            i2.uo.currentP.latitude,
                                            i2.uo.currentP.longitude);
                    double distance=inverse.s12;
                    //System.out.println(" Can dots attract? "+distance);

                    if(distance < ATTRACTION_RADIUS){
                      // can initiate collision

                      if(distance <= TOUCH_RADIUS) {
                        //System.out.println(" Dots "+i1.uo.id+ " is busy with "+i1.uo.busyWith);
                        GeodesicData inverseP=Geodesic.WGS84.Inverse(i1.uo.previousP.latitude,
                                                i1.uo.previousP.longitude,
                                                i2.uo.previousP.latitude,
                                                i2.uo.previousP.longitude);
                        double distanceP=inverseP.s12;
                        if (distanceP>TOUCH_RADIUS) {
                          // collision
                          System.out.println("Collision started " + i1.uo.id +" "+i2.uo.id);
                          // 1 mix parameters
                          ArrayList<Float> xx=new ArrayList<Float>();
                          ArrayList<Float> x1=DotWrapper.getWrapper().get(i1.uo.id).x;
                          ArrayList<Float> x2=DotWrapper.getWrapper().get(i2.uo.id).x;
                          try{
                            for(int m=0;m<10;m++) {
                              xx.add(x1.get(m)+x2.get(m));
                            }
                          } catch(Exception e){
                              System.out.println("Dots have problem with the collision vector");
                              xx=new ArrayList<Float>();
                              for(int kk=0;kk<10;kk++)
                                xx.add(0f);
                            }

                          // 2 add to collision array (sql)
                          // +
                          // 3 add to Dot.collidedWith
                          Long c_id1=DotWrapper.getWrapper().addCollision(i1.uo.id,i2.uo.id,JSON.toJSONString(xx));
                          Long c_id2=DotWrapper.getWrapper().addCollision(i2.uo.id,i1.uo.id,JSON.toJSONString(xx));
                          // handle null values

                          // 4 toggle snapshot url (both dots)
                          String params=Base64.getEncoder().encodeToString(("x="+JSON.toJSONString(xx)).getBytes());
                          AsyncRequestThread.Fire("http://api-server:5000/api/snapshot/save/"+i2.uo.id+"/"+params+"/"+c_id2);
                          AsyncRequestThread.Fire("http://api-server:5000/api/snapshot/save/"+i1.uo.id+"/"+params+"/"+c_id1);

                          // 5 change directions

                          i1.changeDirectionTo(new LatLng(Math.random()*180-90,Math.random()*180-90));
                          i2.changeDirectionTo(new LatLng(Math.random()*180-90,Math.random()*180-90));
                          if(i1.uo.busyWith==i2.uo.id) i1.uo.busyWith=null;
                          if(i2.uo.busyWith==i1.uo.id) i2.uo.busyWith=null;

                          //
                          // TODO make sure you also clean the dot where i1/i2.uo.busyWith points at
                          // othewise some dots will continue chasing the dots that already lost interest in them
                        }
                      } else if(i1.uo.busyWith==null && i2.uo.busyWith==null) {
                       // attraction
                        // check if they already collided
                        //System.out.println("Are they gonna attract: "+i1.uo.id+" "+i2.uo.id);
                        if(DotWrapper.getWrapper().get(i1.uo.id).didCollideWith(i2.uo.id)) {
                          //System.out.println("No.");
                          // already collided with each other, not interesting
                        } else {
                          // new
                          System.out.println("Yes, MAKING ATTRACTION: Points "+i1.uo.id+" and point "+i2.uo.id+" can collide. The distance between them is "+distance);
                          i1.changeDirectionTo(new LatLng(i2.uo.currentP));
                          i1.uo.busyWith=i2.uo.id;
                          i2.changeDirectionTo(new LatLng(i1.uo.currentP));
                          i2.uo.busyWith=i1.uo.id;
                        }
                    //  }
                  }
                //} // if busyWith
               } // for
              } // if i1!=null

              { //run this anyway
                }
              }

            } // for
          }// if cycle%500==0
          lastTime=currentTime;
          cycle++;

          Thread.sleep(Math.max(0,1000/framerate-(System.currentTimeMillis()-currentTime)) );
        }

        ArrayList<String> res=new ArrayList<String>();
        Set s = resultingAccState.entrySet();

        Iterator i = s.iterator();
        while (i.hasNext()) {
          Map.Entry m = (Map.Entry)i.next();

          int key = (Integer)m.getKey();
          ArrayList<String> value = (ArrayList<String>)m.getValue();
          String acc1=String.join(",",value);
          res.add("{\"object_id\":"+key+",\"latlng\":["+acc1+"]}");
        }
        // for (int i=0; i<resultingAccState.size();i++){
        //   String acc1=String.join(",",resultingAccState.get(i));
        //   res.add("{\"object_id\":"+i+",\"latlng\":["+acc1+"]}");
        // }
        accumulatedState=String.join(",",res);
        accumulatedState="{\"meta\":{\"nextCall\":"+1000*logSize+"},\"data\":["+accumulatedState+"]}";
        HiveOne.SaveState(accumulatedState);
      } catch (Throwable e) {
        System.out.println("format InterruptedException: ");
        e.printStackTrace();
      }
    }
  };
  Timer getTimer=new Timer(true);
  getTimer.scheduleAtFixedRate(getTask,0,logSize*1000);

  while(true){}
}

private static String formatFrame(float frameTime, LatLng currentPosition) {
  return String.format("{\"lat\":%.10f,\"lon\":%.10f,\"dur\":%.2f}",currentPosition.latitude,currentPosition.longitude,frameTime); //time:%d, => frameTime
}

static void Start() {
  //	HiveOne.Go();
}
}
