package hive;

import redis.clients.jedis.Jedis;

public class RedisJava {
   public Jedis jedis;
   static RedisJava instance;

   public static RedisJava Instance() {
  	if (instance == null)
  	    instance=new RedisJava();
  	return instance;
   }

   private RedisJava() {
     Connect();
   }

   private void Connect() {
     //Connecting to Redis server on localhost/redis
       while (true) {
         try {
           this.jedis = new Jedis("redis");
           System.out.println("Connection to server sucessfully");
           //check whether server is running or not
           System.out.println("Server is running: "+jedis.ping());
           break;
         } catch (Exception e) {
           System.out.println("Can't connect to redis server, will retry...");
         }
       }
   }

   public void set(String name, String value) {
	   try{
       this.jedis.set(name, value);
     } catch(redis.clients.jedis.exceptions.JedisConnectionException e) {
       System.out.println("Something wrong with the server, reconnection in progress");
       Connect();
     }
   }

   public String get(String name) {
	    try{
        return this.jedis.get(name);
      } catch(redis.clients.jedis.exceptions.JedisConnectionException e) {
         System.out.println("Something wrong with the server, reconnection in progress");
         Connect();
         return this.jedis.get(name);
       }
   }
}
