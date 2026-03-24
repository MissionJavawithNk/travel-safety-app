import 'package:flutter/material.dart';

void main() {
  runApp(SafeTravelApp());
}

class SafeTravelApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'SafeTravel AI',
      theme: ThemeData.dark(),
      home: HomeScreen(),
    );
  }
}

// ================= HOME SCREEN =================

class HomeScreen extends StatelessWidget {

  int getSafetyScore() {
    int score = 50;
    DateTime now = DateTime.now();

    if (now.hour > 20) {
      score += 20; // night risk
    }

    return score;
  }

  String getRiskLevel(int score) {
    if (score < 60) return "Safe";
    if (score < 80) return "Moderate";
    return "High Risk";
  }

  @override
  Widget build(BuildContext context) {
    int safetyScore = getSafetyScore();

    return Scaffold(
      appBar: AppBar(
        title: Text("SafeTravel AI"),
        centerTitle: true,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [

            // Safety Card
            Card(
              elevation: 6,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15)),
              child: Padding(
                padding: EdgeInsets.all(25),
                child: Column(
                  children: [
                    Text(
                      "Safety Score",
                      style: TextStyle(fontSize: 18),
                    ),
                    SizedBox(height: 10),
                    Text(
                      "$safetyScore",
                      style: TextStyle(
                          fontSize: 40,
                          fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 10),
                    Text(
                      "Risk: ${getRiskLevel(safetyScore)}",
                      style: TextStyle(fontSize: 18),
                    ),
                  ],
                ),
              ),
            ),

            SizedBox(height: 30),

            // SOS Button
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                padding:
                    EdgeInsets.symmetric(horizontal: 50, vertical: 18),
                backgroundColor: Colors.red,
              ),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("🚨 SOS Alert Sent!")),
                );
              },
              child: Text(
                "SOS",
                style: TextStyle(fontSize: 18),
              ),
            ),

            SizedBox(height: 20),

            // Navigate Button
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => MapScreen()),
                );
              },
              child: Text("View Map"),
            ),
          ],
        ),
      ),
    );
  }
}

// ================= MAP SCREEN =================

class MapScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Map View"),
      ),
      body: Center(
        child: Text(
          "📍 Map Integration Coming Soon",
          style: TextStyle(fontSize: 18),
        ),
      ),
    );
  }
}
