package hive;

import java.util.HashMap;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.PreparedStatement;

import java.util.List;
import java.util.ArrayList;
import com.alibaba.fastjson.JSON;


class DotWrapper {
  private HashMap<Integer,Dot> dots;
  private Boolean syncFlag=true;

  private static DotWrapper dw;
  private DotWrapper() {}

  public static DotWrapper getWrapper()
  {
    if(dw==null)
      dw=new DotWrapper();
    return dw;
  }

  public boolean checkSync() {
    String sync=RedisJava.Instance().get("sync-dots");

    return (sync!=null) && sync.equals("1");
  }

  public HashMap<Integer,Dot> getDots() {
    HashMap<Integer,Dot> result=new HashMap<Integer,Dot>();

    if (checkSync())
      syncFlag=true;

    if(syncFlag) {
      syncFlag=false;
      RedisJava.Instance().set("sync-dots","0");

      // from RedisJedis "syncDots"
      // get dots from the database

      String query = "select * from dot where status>0";

      try(Connection con=DB.getConnection();
        Statement st = con.createStatement();
        ResultSet rs = st.executeQuery(query);
      ) {
        // conver a list of dots to HashMap id => Dot
        while (rs.next()) {

          Dot dt=new Dot();
          dt.id=rs.getInt("id");
          dt.P1=new LatLng(rs.getFloat("lat1"),rs.getFloat("lon1"));
          dt.P2=new LatLng(rs.getFloat("lat2"),rs.getFloat("lon2"));
          dt.speed=rs.getFloat("speed");
          dt.started=rs.getLong("started_at"); // to be filled later by UniverseObject
          dt.dot_name=rs.getString("dot_name");
          dt.status=rs.getInt("status");
          result.put(dt.id,dt);
          //System.out.println("UniverseObject value "+uo+".");
          System.out.println("DotWrapper: Got a new dot from the DB "+rs.getInt("id"));
          System.out.println("DotWrapper: Coords "+rs.getFloat("lat1"));

          String queryCollision = "select * from dot_collisions where dot_id="+dt.id;

          try(Connection con2=DB.getConnection();
            Statement st2 = con2.createStatement();
            ResultSet rs2 = st2.executeQuery(queryCollision);
          ) {
            String lastOne="";
            while(rs2.next()) {
              int collided_with=rs2.getInt("collided_with");
              dt.addCollision(collided_with);
              lastOne=rs2.getString("state");
              System.out.println("Tried one state "+lastOne);
            }
            dt.x=parseState(lastOne); // we only need the most recent one
          }
        }
      } catch (Exception e) {
        System.out.println("Exception in getDots() "+e);
        e.printStackTrace();
      }
      dots=result;
      syncFlag=false;
      HiveBeginning.updateDots(); // will call getDots aagin, but should not be an
                                  // issue since it's not gonna go into this same branch
    } else {
      result=dots;
    }
    return result;
  }

  public Dot get(int i) {
    HashMap<Integer,Dot> dt=getDots();
    Dot r=null;
    try{
      r=dt.get(i);
    }catch(Exception e) {
      e.printStackTrace();
      System.out.println("The size of dots array is: "+dt.size());
    }
    return r;
  }

  public ArrayList<Float> parseState(String state) {
    ArrayList<Float> result=new ArrayList<Float>();
    try {
      result=(ArrayList<Float>)JSON.parseArray(state,Float.class);
    } catch (Exception e) {
      System.out.println("Can't parseState of "+state);
      for(int i=0;i<10;i++) // zero fill
        result.add(0f);
    }
    return result;
  }

  public String serializeState(ArrayList<Float> f) {
    return JSON.toJSONString(f);
  }

  public Long addCollision(int id1, int id2, String params) {
    Long id=null;

    get(id1).addCollision(id2); // add a collision to the ARRAY, not the DB yet
    // now add the collision to the DB
    String query = "insert into dot_collisions (collided_with, state, snapshot,dot_id,collision_time) values "+
    " (?,?,'',?,NOW())";
    try(Connection con=DB.getConnection();
      PreparedStatement st = con.prepareStatement(query,  Statement.RETURN_GENERATED_KEYS);
      ){
          st.setInt(1,id2);
          st.setString(2,params);
          st.setInt(3,id1);
          st.execute();
          ResultSet rs = st.getGeneratedKeys();
          if (rs.next()) {
            id = rs.getLong(1);
    //System.out.println("Inserted ID -" + id); // display inserted record
          }
          con.close();

      } catch (Exception e){
        System.out.println("Something went terribly wrong with Collision");
        System.out.println("DotWrapper::addCollision: ");
        e.printStackTrace();
      }
      return id;
  }
}
