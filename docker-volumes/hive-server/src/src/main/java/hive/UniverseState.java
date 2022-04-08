package hive;

import java.util.*;
import com.alibaba.fastjson.JSON;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.PreparedStatement;
import java.util.HashMap;
import com.alibaba.fastjson.TypeReference;

class UniverseState {
  public static ArrayList<UniverseObject> restoreState(){
    // json object from SQL backup
    // "select state from cached_state where id=0;"
    String query ="select state from cached_state where id=1";
    String state="";

    List<UniverseObject> result=new ArrayList<UniverseObject>();

    try(Connection con=DB.getConnection();
    Statement st = con.createStatement();
    ResultSet rs = st.executeQuery(query);
    ) {
      if (rs.next()) {
        state=rs.getString(1);
        System.out.println(); // print out the state
      }
    } catch (Exception e) {
      System.out.println("Exception in getDots() "+e);
    }

    // 1) get the dots from the DotWrapper
    // 2) initialize the UniverseObjects
    // 3) Restore corresponding dots from "state" if possible
    HashMap<Integer,Dot> dots=DotWrapper.getWrapper().getDots();

    try{
      result=JSON.parseArray(state, UniverseObject.class);
      System.out.println("JSON.parseObject result:");
      System.out.println(result);
    } catch(Exception e) {
      // Ooops, impossible to parse state
      System.out.println("JSON.parseObject: exception "+e);
    }

    ArrayList<UniverseObject> resultingList=new ArrayList<UniverseObject>();

    for(Integer key: dots.keySet()) {
      Dot d=dots.get(key);
      int k=d.id;
      f: {
        if(result!=null)
          for(UniverseObject o: result) {
            // if the dot exists AND there's history then add it to the list
            if(k==o.id) {
              resultingList.add(o);
              break f;
            }
          }
        // if the UniverseObject does not exist for the given dot
        // then initialize it
        System.out.println("UniverseState: Initializing new Dot "+d.id);
        UniverseObject uo=new UniverseObject();
        uo.P1=d.P1;
        uo.P2=d.P2;
        uo.speed=d.speed;
        uo.started=d.started;
        uo.id=d.id;
        resultingList.add(uo);
      }
    }

    return resultingList;
  }

  public static void backupState(ArrayList<UniverseObject> dots) {
    // convert arraylist of dots to json object
    // and save it cached_state
    // update/insert cached_state set state='' where id=0;

    String jsonString = JSON.toJSONString(dots);

    String query="INSERT INTO cached_state (id,state)"+
            "VALUES (1,?) "+
            "ON DUPLICATE KEY UPDATE "+
            "state = ?";
    try(Connection con=DB.getConnection();
    PreparedStatement pst = con.prepareStatement(query);
    ) {
        pst.setString(1,jsonString);
        pst.setString(2,jsonString);
        pst.executeUpdate();
        //System.out.println("UniverseState.backupState: "+jsonString);
    } catch (Exception e) {
      System.out.println("Exception in backupState() "+e);
    }

  }
}
