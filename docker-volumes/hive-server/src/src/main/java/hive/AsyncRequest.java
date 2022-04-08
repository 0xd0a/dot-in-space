package hive;

import okhttp3.*;

import java.io.IOException;

class AsyncRequestThread {
  static void Fire(String urlString) {
    //AsyncHttpClient asyncHttpClient = asyncHttpClient();
    System.out.println("Executing async request");
    new Thread(() -> {
      try {
        System.out.println("Inside async request");
        // URL url = new URL(urlString);
        // HttpURLConnection con = (HttpURLConnection) url.openConnection();
        // con.setRequestMethod("GET");

        // HttpResponse<String> response = client.send(
        //     HttpRequest
        //         .newBuilder(new URI(urlString))
        //         //.headers("Foo", "foovalue", "Bar", "barvalue")
        //         .GET()
        //         .build(),
        //     BodyHandler.asString()
        // );

        OkHttpClient httpClient = new OkHttpClient();
        Request request = new Request.Builder()
        .url(urlString)
        .addHeader("User-Agent", "okh")
        .build();

        try (Response response = httpClient.newCall(request).execute()) {

            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

            // Get response body
            System.out.println(response.body().string());
        }

        System.out.println("Ended async request");
      }catch(Exception e){
        System.out.println("AsyncRequestThread: something wrong with "+urlString);
      }

    }).start();
  }

}
