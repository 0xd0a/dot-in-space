package hive;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.joda.time.LocalTime;

import java.util.logging.Level;
import java.util.logging.Logger;

//import java.util.ArrayList;
import org.apache.commons.dbcp2.BasicDataSource;

public final class DB {

    private static final BasicDataSource dataSource = new BasicDataSource();

    static {
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://mariadb:3306/dothive");
        dataSource.setUsername("root");
        dataSource.setPassword(System.getEnv('MYSQL_PASSWORD'));
    }

    private DB() {
        //
    }

    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

}
