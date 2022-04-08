package hive;
import redis.clients.jedis.Jedis;
import org.joda.time.LocalTime;

public class HiveOne {
    public static void SaveState(String state) {
    	LocalTime currentTime = new LocalTime();

    	RedisJava.Instance().set("dot-in-space-snapshot-time", "Time is "+currentTime);
    	RedisJava.Instance().set("dot-in-space-snapshot", state);
    }

}
