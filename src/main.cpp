#include <Arduino.h>

#include <DHT.h>
#include <RTClib.h>
#include <CTBot.h>
#include <FirebaseESP32.h>
#include <WiFi.h>
#include <WebServer.h>

WebServer server(80);
bool wifiConnected = false;

const char *ap_ssid = "ESP32-AP";
const char *ap_password = "";

String st_ssid = "";
String st_password = "";

#define DHTPIN 13     // Pin de datos del sensor DHT11
#define DHTTYPE DHT11 // Tipo de sensor DHT (DHT11 o DHT22)

#define FIREBASE_HOST "https://estancia-19eba-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "vlmEjbBKAhyyFzbL00L2oSHHjzfsx4ZPlkKIEN4x"

const int sensorPin = 34;                        // Puerto donde está conectado el sensor LM358
const unsigned long UPDATE_INTERVAL = 3000;      // 3 segundos
const unsigned long HALF_HOUR_INTERVAL = 180000; // 30 minutos
unsigned long lastUpdate = 0;
unsigned long lastHalfHourUpdate = 0;

DHT dht(DHTPIN, DHTTYPE); // Crear una instancia de DHT
RTC_DS1307 rtc;           // Crear una instancia de RTC_DS1307
CTBot myBot;
FirebaseData firebaseData;
String token = "6229383603:AAGrlXGnkVLNPAR_TA-0WLPFIW58sWKoQhc"; // REPLACE myToken WITH YOUR TELEGRAM BOT TOKEN
float temperatureThreshold = 30.0;                               // Umbral de temperatura por defecto

void handleRoot()
{
  int n = WiFi.scanNetworks();
  String html = R"=====(
<html>
    <head>
      <style>
        body { background-color: #000000; color: #fff; font-family: Arial, sans-serif; }
        form { margin: 0 auto; width: 200px; padding: 20px; border-radius: 10px; background-color: #252525; }
        select, input[type="text"], input[type="submit"] { width: 100%; padding: 10px; margin-bottom: 10px; }
        input[type="submit"] { background-color: #4CAF50; border: none; color: white; }
      </style>
    </head>
    <body>
      <form action="/configure" method="POST">
        <h1 style="text-align: center;margin-bottom: 20px; color: #0CFFFF;">FdezDev</h1>
        SSID:
        <select style="border-radius: 10px; background-color: #ffffff;" name="ssid">
  )=====";
  for (int i = 0; i < n; ++i)
  {
    html += "<option>" + WiFi.SSID(i) + "</option>";
  }
  html += R"=====(
        </select><br>
        PASSWORD:
        <input style="border-radius: 10px; background-color: #ffffff;" type="text" name="password"><br>
        <input style="display: block; margin: 0 auto; text-align: center; border-radius: 10px; width: 50%; background-color: #4389e5;" type="submit" value="Conectar">
      </form>
    </body>
    </html>
  )=====";
  server.send(200, "text/html", html);
}

void handleConfigure()
{
  if (server.hasArg("ssid") && server.hasArg("password"))
  {
    st_ssid = server.arg("ssid");
    st_password = server.arg("password");

    WiFi.mode(WIFI_STA);
    WiFi.begin(st_ssid.c_str(), st_password.c_str());

    while (WiFi.status() != WL_CONNECTED)
    {
      delay(500);
      Serial.print("......");
    }

    Serial.println("");
    Serial.println("WiFi conectado");
    Serial.println("Dirección IP: ");
    Serial.println(WiFi.localIP());

    wifiConnected = true; // Establece wifiConnected en true cuando se conecta exitosamente a la red WiFi
  }
}

void setup()
{
  Serial.begin(9600);

  // Configure ESP32 as an AP
  WiFi.mode(WIFI_AP);
  WiFi.softAP(ap_ssid, ap_password);

  server.on("/", handleRoot);
  server.on("/configure", HTTP_POST, handleConfigure);

  server.begin();

  // Iniciar el sensor DHT11
  dht.begin();

  // Inicializar el reloj RTC
  if (!rtc.begin())
  {
    Serial.println("No se pudo encontrar el módulo RTC!");
    while (1)
      ;
  }

  // Verificar si el RTC está activo y sincronizado
  if (!rtc.isrunning())
  {
    Serial.println("El módulo RTC no está sincronizado, se establecerá la fecha y hora por defecto!");
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }

  // set the firebase host and authentication token
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

  // connect the ESP32 to the desired access point
  myBot.wifiConnect(st_ssid, st_password);

  // set the telegram bot token
  myBot.setTelegramToken(token);

  while (!wifiConnected)
  {
    server.handleClient(); // Manejar las solicitudes del servidor web hasta que se establezca la conexión WiFi
  }

  // check if all things are ok
  if (myBot.testConnection())
    Serial.println("\ntestConnection OK");
  else
    Serial.println("\ntestConnection NOK");
}

void loop()
{
  server.handleClient();

  TBMessage msg;
  unsigned long timeSinceUpdate = millis() - lastUpdate;
  unsigned long halfHourSinceUpdate = millis() - lastHalfHourUpdate;

  if (timeSinceUpdate >= UPDATE_INTERVAL)
  {
    lastUpdate = millis();
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int sensorValue = analogRead(sensorPin);
    float voltage = (sensorValue / 4095.0) * 220;

    Firebase.setString(firebaseData, "sensortime/temperature", String(temperature));
    Firebase.setString(firebaseData, "sensortime/humidity", String(humidity));
    Firebase.setString(firebaseData, "sensortime/voltage", String(voltage));
    Firebase.setString(firebaseData, "sensortime/time", String(rtc.now().timestamp(DateTime::TIMESTAMP_TIME)));

    Serial.print("Temperatura: ");
    Serial.print(temperature);
    Serial.print(" °C, Humedad: ");
    Serial.print(humidity);
    Serial.print("%, Voltaje: ");
    Serial.print(voltage);
    Serial.print(" V, Hora actual: ");
    Serial.println(rtc.now().timestamp(DateTime::TIMESTAMP_FULL));
  }

  if (halfHourSinceUpdate >= HALF_HOUR_INTERVAL)
  {
    lastHalfHourUpdate = millis();
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int sensorValue = analogRead(sensorPin);
    float voltage = (sensorValue / 4095.0) * 220;

    DateTime now = rtc.now();

    String date = String(now.timestamp(DateTime::TIMESTAMP_DATE));
    String time = String(now.timestamp(DateTime::TIMESTAMP_TIME));
    String nodeId = "sensorfecha/" + date + "/" + time;

    Firebase.setString(firebaseData, nodeId + "/temperature", String(temperature));
    Firebase.setString(firebaseData, nodeId + "/humidity", String(humidity));
    Firebase.setString(firebaseData, nodeId + "/voltage", String(voltage));
    Firebase.setString(firebaseData, nodeId + "/time", String(now.timestamp(DateTime::TIMESTAMP_FULL)));
  }

  if (myBot.getNewMessage(msg))
  {
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int sensorValue = analogRead(sensorPin);
    float voltage = (sensorValue / 4095.0) * 220;
    if (msg.text.indexOf("Modify") == 0)
    {
      String tempString = msg.text.substring(8);
      float newThreshold = tempString.toFloat();

      if (newThreshold > 0 && newThreshold < 100)
      {
        temperatureThreshold = newThreshold;
        myBot.sendMessage(msg.sender.id, "Umbral de temperatura actualizado a " + tempString + " °C");
      }
      else
      {
        myBot.sendMessage(msg.sender.id, "El valor proporcionado no es válido. Por favor, proporciona un número mayor que 0 y menor que 100.");
      }
    }
    else if (msg.text == "status")
    {
      String message = "Temperatura: " + String(temperature) + " °C\nHumedad: " + String(humidity) + " %\nVoltaje: " + String(voltage) + " V\nHora actual: " + rtc.now().timestamp(DateTime::TIMESTAMP_FULL);
      myBot.sendMessage(msg.sender.id, message);
    }
    else
    {
      myBot.sendMessage(msg.sender.id, "Comando no reconocido.");
    }
  }

  delay(500);
}
