#include <WiFi.h>
#include <ESPmDNS.h>
#include <WebServer.h>

// Replace with your network credentials
const char* ssid = "Kishore";
const char* password = "123456789";

WebServer server(80);
String webSite = "";
String contact = "";
String website = "";
String budget = "";

int led1 = 15;
int led2 = 2;
int led3 = 4;
int led4 = 5;
float count1 = 0.000000;
float count2 = 0.000000;
float count3 = 0.000000;
float count4 = 0.000000;

void setup(void) {
  webSite += "<meta charset='utf-12'><meta name='viewport' http-equiv='refresh' content='5'><title>IOT ENERGY TARIFF</title><!-- CSS property to place div side by side -->";
  webSite += " <style> body{ text-align:center; font-family:Comic Sans MS, Comic Sans, cursive ;font-size:18px; Color: #FFFFFF;background-image: url('https://img.freepik.com/premium-photo/electric-transmission-tower-with-glowing-wires-against-starry-sky-background_141856-1592.jpg');background-repeat: no-repeat;background-attachment: fixed;background-size: cover; } #led1 { float:left;background:black;width:25%;height:1000px;}#led2{ float:left; background:black;width:25%;height:1000px;} #led3{ float:left; background:black;width:25%;height:1000px;}#led4{float:left;background:black;width:25%;height:1000px;} h1{color:WHITE;text-align:center;}h2{ color:white;text-align: center;} section{width: 100%;height: 500px;display: flex;justify-content: center;align-items: center;flex-direction: column;}.btn_container{margin-top: 50px;}.bulb_btn{font-family: 'Baloo Bhai 2', cursive;width: 150px;height: 50px; border: none;outline: none;cursor: pointer;background: #34dab4;font-size: 30px; }</style>";
  webSite += "<div class='topnav'> <a href='/'>Home</a><a href='/calculator'>Usage details</a><a href='/budget'>Monthly Budget Calculator</a><a href='/contact' class='split'>Contact</a></div>";
  webSite += "<style>.topnav { background-color: #333;overflow: hidden;}/* Style the links inside the navigation bar /.topnav a {float: left;color: #f2f2f2;text-align: center;padding: 14px 16px;text-decoration: none; font-size: 17px;}/ Change the color of links on hover /.topnav a:hover {background-color: #ddd;color: black;}/ Create a right-aligned (split) link inside the navigation bar */.topnav a.split {float: right;background-color: #04AA6D;color: white;}</style>";
  webSite += "<div id = 'boxes'><h1>IOT ENERGY TARIFF</h1><div id = 'led1'><h2>LED 1</h2><section><img src='https://i.postimg.cc/KjK1wL3c/bulb-off.png' id='bulb1' width='200'><div class='btn_container'><a href='socket1On'><button id='on' class='bulb_btn' >on</button></a><a href='socket1Off'><button id='off' class='bulb_btn' >off</button></div></a></section><h2>Specification : 50 W </h2><h2>Amount : <input type='text' id='demo1'></h2></div>";
  webSite += " <div id = 'led2'> <h2>LED 2</h2><section><img src='https://i.postimg.cc/KjK1wL3c/bulb-off.png' id='bulb2' width='200'><div class='btn_container'><a href='socket2On'><button id='on' class='bulb_btn'>on</button></a><a href='socket2Off'><button id='off' class='bulb_btn'>off</button></div></a></section><h2>Specification : 100 W </h2><h2>Amount : <input type='text\' id='demo2'></h2>  </div><div id = 'led3'><h2>LED 3</h2><section> <img src='https://i.postimg.cc/KjK1wL3c/bulb-off.png' id='bulb3' width='200'><div class='btn_container'><a href='socket3On'><button id='on' class='bulb_btn' >on</button></a> <a href='socket3Off'><button id='off' class='bulb_btn' >off</button></div></a></section><h2>Specification : 200 W </h2><h2>Amount : <input type='text\' id='demo3'></h2> </div>";
  webSite += "<div id = 'led4'><h2>LED 4</h2><section><img src='https://i.postimg.cc/KjK1wL3c/bulb-off.png' id='bulb4' width='200'><div class='btn_container'><a href='socket4On'><button id='on' class='bulb_btn'>on</button></a><a href='socket4Off'><button id='off' class='bulb_btn'>off</button></div></a> </section><h2>Specification : 250 W </h2><h2>Amount : <input type='text\' id='demo4'></h2></div>  </div>";
  webSite += "<script>var count1=0.000000;var count2=0.000000;var count3=0.000000;var count4=0.000000;</script>";



  website += "<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>IOT ENERGY TARIFF</title><style type='text/css'> body{ text-align:center; font-family:Comic Sans MS, Comic Sans, cursive ;font-size:18px; Color: #FFFFFF;background-image: url('https://img.freepik.com/premium-photo/electric-transmission-tower-with-glowing-wires-against-starry-sky-background_141856-1592.jpg');background-repeat: no-repeat;background-attachment: fixed;background-size: cover; }</style></head>";
  website += "<body><h2>MONEY BUDGET CALCULATOR</h2><p>Enter Monthly Budget Amount : <input type='text' id='demo5'><button onclick='calculate()'>Calculate</button></p><div id='usage' style='display:none;'><h3>USAGE DETAILS :</h3><p><label for='file'>LED 1 :</label><progress id='file' value='6' max='100'> 32% </progress><div id='led1'></div></p><p><label for='file'>LED 2 :</label><progress id='file' value='4' max='100'> 32% </progress></p><p><label for='file'>LED 3 :</label><progress id='file' value='0' max='100'> 32% </progress></p><p><label for='file'>LED 4 :</label><progress id='file' value='4' max='100'> 32% </progress></p></div></body></html>";


  contact = "<!DOCTYPE html><html><head><meta charset='utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1'><title>ESP8266</title><style type='text/css'> body{ text-align:center; font-family:Comic Sans MS, Comic Sans, cursive ;font-size:18px; Color: #FFFFFF;background-color: black;}#leftbox { float:left;background:black;width:33%;height:280px}#middlebox{  float:left;background:black;width:33%;height:280px;}#rightbox{ float:right;background:black; width:33%;height:280px; }h1{color:white;text-align:center;} </style></head>";
  contact += "<body><div id = 'boxes'><h1>DEVELOPERS</h1><div id = 'leftbox'><h2>BALAJI MD</h2> An aspiring marketing analyst,currently pursuing Bachelers of Electronics and Communication Engineering degree at Chennai Institute of Technology</div><div id = 'middlebox'><h2>ENIIYAVAN TG</h2>   An aspiring electronics enthusiast ,currently pursuing Bachelers of Electronics and Communication Engineering degree at Chennai Institute of Technology</div><div id = 'rightbox'><h2>DHINAKAR L</h2>An leading kali linux  hacker,  currently pursuing Bachelers of Electronics and Communication Engineering degree at Chennai Institute of Technology</div></div><div><h2>Contact for IOT related projects</h2><p>eniiyavan.tg@gmail.com</p><p>balajimdraja@gmail.com</p><p>dhinakar02092003@gmail.com</p></div</body></html>";



  // preparing GPIOs
  pinMode(led1, OUTPUT);
  digitalWrite(led1, LOW);
  pinMode(led2, OUTPUT);
  digitalWrite(led2, LOW);
  pinMode(led3, OUTPUT);
  digitalWrite(led3, LOW);
  pinMode(led4, OUTPUT);
  digitalWrite(led4, LOW);

  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.println("");
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp32")) {
    Serial.println("MDNS responder started");
  }
  server.on("/", HTTP_GET, []() {
    server.send(200, "text/html", webSite);
  });

  server.on("/socket1Off", []() {
    webSite += "<script>document.getElementById('bulb1').src='https://i.postimg.cc/6QyTynzr/bulb-on.png';</script>";
    server.send(200, "text/html", webSite);
    digitalWrite(led1, 1);
  });
  server.on("/socket1On", []() {
    webSite += "<script>document.getElementById('bulb1').src='https://i.postimg.cc/KjK1wL3c/bulb-off.png';</script>";
    server.send(200, "text/html", webSite);
    digitalWrite(led1, 0);
  });
  server.on("/socket2Off", []() {
    webSite += "<script>document.getElementById('bulb2').src='https://i.postimg.cc/6QyTynzr/bulb-on.png';</script>";
    server.send(200, "text/html", webSite);
    digitalWrite(led2, 1);
  });
  server.on("/socket2On", []() {
    webSite += "<script>document.getElementById('bulb2').src='https://i.postimg.cc/KjK1wL3c/bulb-off.png';</script>";
    server.send(200, "text/html", webSite);
    digitalWrite(led2, 0);
  });
  server.on("/socket3Off", []() {
    webSite += "<script>document.getElementById('bulb3').src='https://i.postimg.cc/6QyTynzr/bulb-on.png';</script>";
    server.send(200, "text/html", webSite);
    digitalWrite(led3, 1);
  });
  server.on("/socket3On", []() {
    webSite += "<script>document.getElementById('bulb3').src='https://i.postimg.cc/KjK1wL3c/bulb-off.png';</script>";
    server.send(200, "text/html", webSite);
    digitalWrite(led3, 0);
  });
  server.on("/socket4Off", []() {
    webSite += "<script>document.getElementById('bulb4').src='https://i.postimg.cc/6QyTynzr/bulb-on.png';</script>";

    server.send(200, "text/html", webSite);
    digitalWrite(led4, 1);
  });
  server.on("/socket4On", []() {
    webSite += "<script>document.getElementById('bulb4').src='https://i.postimg.cc/KjK1wL3c/bulb-off.png';</script>";
    server.send(200, "text/html", webSite);
    digitalWrite(led4, 0);
  });
  server.on("/calculator", []() {
    server.send(200, "text/html", website);
  });
  server.on("/contact", []() {
    server.send(200, "text/html", contact);
  });
  server.on("/budget", []() {
    server.send(200, "text/html", budget);
  });

  server.begin();
  Serial.println("HTTP server started");
}

void loop(void) {
  server.handleClient();
  String sentences = "<p>Flame is detected!!!</p>";
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("");
    Serial.print("Wifi is disconnected!");
    Serial.println("");
    Serial.print("Reconnecting");
    Serial.println("");
    //WiFi.begin(ssid,password);

    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
  }
  delay(500);
  if (digitalRead(led1) == HIGH) {
    webSite += "<script>    count1+=0.005833;</script>";


    count1 += 0.005833;
    delay(500);
  }

  if (digitalRead(led2) == HIGH) {
    webSite += "<script>    count2+=0.011667;</script>";

    count2 += 0.011667;
    delay(500);
  }


  if (digitalRead(led3) == HIGH) {
    webSite += "<script>    count3+=0.023334;</script>";

    count3 += 0.023334;
    delay(500);
  }

  if (digitalRead(led4) == HIGH) {
    webSite += "<script>    count4+=0.029167;</script>";

    count4 += 0.029167;
    delay(500);
  }


  webSite += "<script>document.getElementById(\"demo1\").value= count1</script>";
  webSite += "<script>document.getElementById(\"demo2\").value = count2</script>";
  webSite += "<script>document.getElementById(\"demo3\").value = count3</script>";
  webSite += "<script>document.getElementById(\"demo4\").value = count4</script>";

  /*website+="<script>var l1=amount(12/100);</script>";
        website+="<script>document.getElementById(\"led1\").value = l1</script>";*/
  website += "<script type='text/javascript'>function calculate() { document.getElementById('usage').style.display = 'block';var amount=document.getElementById(\"demo5\").value;var l1=amount*(12/100);document.getElementById(\"led1\").value = l1;}</script>";
  /*   website+="<script>var l1=amount*(12/100);</script>";
        website+="<script>document.getElementById(\"led1\").value = l1</script>";*/
}