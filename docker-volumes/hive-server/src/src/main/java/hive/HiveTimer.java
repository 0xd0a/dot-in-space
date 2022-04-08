package hive;

import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

public class HiveTimer extends TimerTask {
    int internalState=0;

    @Override
    public void run() {
        System.out.println("Timer task started at:"+new Date());
        completeTask();
        System.out.println("Timer task finished at:"+new Date());
    }

    private void completeTask() {
        try {
            //assuming it takes 1 sec to complete the task
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
	this.internalState++;
	HiveOne.SaveState(String.valueOf(this.internalState));
    }

}